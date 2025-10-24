import assert from "assert";
import { Color, COLORS, Image } from "../include/image.js";
import {
  imageMapCoord,
  imageMapIf,
  mapWindow,
  isGrayish,
  makeGrayish,
  pixelBlur,
  imageBlur,
} from "./imageProcessingHOF.js";

// Helper function to check if a color is equal to another one with an error of 1 (default)
function expectColorToBeCloseTo(actual: Color, expected: Color, error = 1) {
  [0, 1, 2].forEach(i => expect(Math.abs(actual[i] - expected[i])).toBeLessThanOrEqual(error));
}

describe("imageMapCoord", () => {
  function identity(img: Image, x: number, y: number) {
    return img.getPixel(x, y);
  }
  function turnWhite(_img: Image, _x: number, _y: number) {
    return [255, 255, 255];
  }
  function zeroGreen(img: Image, x: number, y: number) {
    const i = img.getPixel(x, y);
    return [i[0], 0, i[2]];
  }

  it("should return a different image", () => {
    const input = Image.create(10, 10, COLORS.WHITE);
    const output = imageMapCoord(input, identity);
    assert(input !== output);
  });

  // More tests for imageMapCoord go here.
  it("should make image White", () => {
    const input = Image.create(5, 5, COLORS.RED);
    const output = imageMapCoord(input, turnWhite);
    for (let x = 0; x < output.width; x++) {
      for (let y = 0; y < output.height; y++) {
        assert.deepEqual(output.getPixel(x, y), COLORS.WHITE, "expected [255, 255, 255]");
      }
    }
  });

  it("should zero Green channel", () => {
    const black = Image.create(2, 2, COLORS.BLACK);
    const input = Image.create(2, 2, COLORS.GREEN);
    const output = imageMapCoord(input, zeroGreen);
    for (let x = 0; x < output.width; x++) {
      for (let y = 0; y < output.height; y++) {
        assert.deepEqual(output, black, "img should have zero green channel");
      }
    }
  });
  it("imageMapCoord single pixel image test", () => {
    const input = Image.create(1, 1, [50, 50, 50]);
    const output = imageMapCoord(input, (_img, _x, _y) => [255, 255, 255]);
    assert.deepEqual(output.getPixel(0, 0), [255, 255, 255]);
  });

  it("throws error for empty image", () => {
    assert.throws(() => {
      const input = Image.create(0, 0, [50, 50, 50]);
      imageMapCoord(input, (_img, _x, _y) => [255, 255, 255]);
    });
  });
  it("fills one color", () => {
    const input = Image.create(5, 5, COLORS.RED);
    const output = imageMapCoord(input, () => [10, 10, 10]);
    for (let x = 0; x < output.width; x++) {
      for (let y = 0; y < output.height; y++) {
        assert.deepEqual(output.getPixel(x, y), [10, 10, 10]);
      }
    }
  });
  it("shouldn't effect original image", () => {
    const input = Image.create(5, 5, COLORS.RED);
    const output = imageMapCoord(input, (img: Image, x: number, y: number) => {
      const a = img.getPixel(x, y);
      return [255 - a[0], 255 - a[1], 255 - a[2]];
    });
    for (let x = 0; x < output.width; x++) {
      for (let y = 0; y < output.height; y++) {
        assert.deepEqual(output.getPixel(x, y), [0, 255, 255]);
      }
    }
  });
});

describe("imageMapIf", () => {
  // More tests for imageMapIf go here
  function zeroChannels(img: Image, x: number, y: number) {
    const i = img.getPixel(x, y);
    if (i[0] === 0 || i[1] === 0 || i[2] === 0) {
      return true;
    }
    return false;
  }

  it("if channels are zero should replace pixel with White", () => {
    const input = Image.create(2, 2, COLORS.BLACK);
    const output = imageMapIf(input, zeroChannels, () => COLORS.WHITE);
    for (let x = 0; x < output.width; x++) {
      for (let y = 0; y < output.height; y++) {
        assert.deepEqual(output.getPixel(x, y), COLORS.WHITE);
      }
    }
  });

  it("if function is false", () => {
    const input = Image.create(5, 5, COLORS.WHITE);
    const output = imageMapIf(
      input,
      () => false,
      () => COLORS.BLACK
    );
    for (let x = 0; x < output.width; x++) {
      for (let y = 0; y < output.height; y++) {
        assert.deepEqual(output.getPixel(x, y), COLORS.WHITE);
      }
    }
  });

  it("if function is true", () => {
    const input = Image.create(5, 5, COLORS.WHITE);
    const output = imageMapIf(
      input,
      () => true,
      () => COLORS.BLACK
    );
    for (let x = 0; x < output.width; x++) {
      for (let y = 0; y < output.height; y++) {
        assert.deepEqual(output.getPixel(x, y), COLORS.BLACK);
      }
    }
  });
  it("If x = 1 cords changes pixel color to white", () => {
    const input = Image.create(2, 2, COLORS.RED);
    const output = imageMapIf(
      input,
      (_img: Image, x: number, _y: number) => x === 1,
      () => COLORS.WHITE
    );
    for (let x = 0; x < output.width; x++) {
      for (let y = 0; y < output.height; y++) {
        if (x === 1) {
          assert.deepEqual(output.getPixel(x, y), COLORS.WHITE);
        } else {
          assert.deepEqual(output.getPixel(x, y), COLORS.RED);
        }
      }
    }
  });
});

describe("mapWindow", () => {
  // More tests for mapWindow go here
  it("Test mapWindow for whole Image", () => {
    const input = Image.create(2, 2, COLORS.WHITE);
    const output = mapWindow(input, [0, 1], [0, 1], () => COLORS.BLACK);
    for (let x = 0; x < output.width; x++) {
      for (let y = 0; y < output.height; y++) {
        assert.deepEqual(output.getPixel(x, y), COLORS.BLACK);
      }
    }
  });

  it("If x and y is either [0,1] changes color to red", () => {
    const input = Image.create(5, 5, COLORS.WHITE);
    const output = mapWindow(input, [0, 1], [0, 1], () => COLORS.RED);
    for (let x = 0; x < output.width; x++) {
      for (let y = 0; y < output.height; y++) {
        if ((x === 0 && y === 0) || (x === 1 && y === 1) || (x === 0 && y === 1) || (x === 1 && y === 0)) {
          assert.deepEqual(output.getPixel(x, y), COLORS.RED);
        } else {
          assert.deepEqual(output.getPixel(x, y), COLORS.WHITE);
        }
      }
    }
  });
  it("only the pixels in the bounds", () => {
    const input = Image.create(3, 3, COLORS.RED);
    const output = mapWindow(input, [0, 0], [0, 0], () => COLORS.WHITE);
    for (let x = 0; x < output.width; x++) {
      for (let y = 0; y < output.height; y++) {
        if (x === 0 && y === 0) {
          assert.deepEqual(output.getPixel(x, y), COLORS.WHITE);
        } else {
          assert.deepEqual(output.getPixel(x, y), COLORS.RED);
        }
      }
    }
  });
});

describe("isGrayish", () => {
  // More tests for isGrayish go here
  it("Returns false as green is not grayish", () => {
    const g = isGrayish(COLORS.GREEN);
    assert(!g);
  });

  it("Returns true as [25, 50, 75] is grayish", () => {
    const output = isGrayish([25, 50, 75]);
    assert(output);
  });
});

describe("makeGrayish", () => {
  // More tests for makeGrayish go here
  it("Checks for both makegrayish and not makegrayish", () => {
    const input = Image.create(5, 5, [10, 100, 237]);
    let output = mapWindow(input, [0, 1], [0, 1], () => [151, 160, 170]);
    output = makeGrayish(output);
    for (let x = 0; x < output.width; x++) {
      for (let y = 0; y < output.height; y++) {
        if ((x === 0 && y === 0) || (x === 1 && y === 1) || (x === 0 && y === 1) || (x === 1 && y === 0)) {
          assert.deepEqual(output.getPixel(x, y), [151, 160, 170]);
        } else {
          assert.deepEqual(output.getPixel(x, y), [115, 115, 115]);
        }
      }
    }
  });
});

describe("pixelBlur", () => {
  // Tests for pixelBlur go here
  it("should not change pixel color", () => {
    const input = Image.create(5, 5, COLORS.WHITE);
    const output = pixelBlur(input, 1, 1);
    expectColorToBeCloseTo(output, COLORS.WHITE);
  });

  it("test corners", () => {
    const input = Image.create(3, 3, COLORS.WHITE);
    input.setPixel(1, 1, COLORS.BLACK);
    const output = pixelBlur(input, 0, 0);
    expectColorToBeCloseTo(output, [191, 191, 191]);
  });

  it("test pixel with different colors around it", () => {
    const input = Image.create(5, 5, COLORS.WHITE);
    input.setPixel(2, 2, COLORS.BLACK);
    input.setPixel(3, 3, [10, 100, 50]);
    input.setPixel(4, 4, [50, 50, 50]);
    const output = pixelBlur(input, 3, 3);
    expectColorToBeCloseTo(output, [176, 186, 181]);
  });
  it("Blurs a 1x1 image pixel", () => {
    const input = Image.create(1, 1, [50, 75, 100]);
    const output = pixelBlur(input, 0, 0);
    expectColorToBeCloseTo(output, [50, 75, 100]);
  });
  it("Blurs a 1x3 image pixel", () => {
    const input = Image.create(1, 3, [50, 75, 100]);
    input.setPixel(0, 1, [10, 10, 10]);
    expectColorToBeCloseTo(pixelBlur(input, 0, 0), [30, 42, 55]);
    expectColorToBeCloseTo(pixelBlur(input, 0, 1), [36, 53, 70]);
  });
});

describe("imageBlur", () => {
  // Tests for imageBlur go here
  it("Test image Blur or fully white image", () => {
    const input = Image.create(5, 5, COLORS.WHITE);
    const output = imageBlur(input);
    for (let x = 0; x < input.width; x++) {
      for (let y = 0; y < input.height; y++) {
        expectColorToBeCloseTo(output.getPixel(x, y), COLORS.WHITE);
      }
    }
  });

  it("Checks image if blured", () => {
    const input = Image.create(3, 3, COLORS.WHITE);
    input.setPixel(1, 1, [0, 0, 0]);
    const output = imageBlur(input);
    for (let x = 0; x < input.width; x++) {
      for (let y = 0; y < input.height; y++) {
        if ((x === 0 && y === 0) || (x === 0 && y === 2) || (x === 2 && y === 0) || (x === 2 && y === 2)) {
          expectColorToBeCloseTo(output.getPixel(x, y), [191, 191, 191]);
        } else if ((x === 1 && y === 0) || (x === 2 && y === 1) || (x === 1 && y === 2) || (x === 0 && y === 1)) {
          expectColorToBeCloseTo(output.getPixel(x, y), [212, 212, 212]);
        } else {
          expectColorToBeCloseTo(output.getPixel(x, y), [226, 226, 226]);
        }
      }
    }
  });
  it("Blurs a single pixel image", () => {
    const input = Image.create(1, 1, [50, 75, 100]);
    const output = imageBlur(input);
    expectColorToBeCloseTo(output.getPixel(0, 0), [50, 75, 100]);
  });
});
