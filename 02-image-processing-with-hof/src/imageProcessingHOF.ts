import type { Image, Color } from "../include/image.js";

export function imageMapCoord(img: Image, func: (img: Image, x: number, y: number) => Color): Image {
  // TODO
  const newImg = img.copy();
  for (let x = 0; x < newImg.width; x++) {
    for (let y = 0; y < newImg.height; y++) {
      newImg.setPixel(x, y, func(img, x, y));
    }
  }
  return newImg;
}

export function imageMapIf(
  img: Image,
  cond: (img: Image, x: number, y: number) => boolean,
  func: (p: Color) => Color
): Image {
  // TODO
  return imageMapCoord(img, (img, x, y) => {
    const c = img.getPixel(x, y);
    if (cond(img, x, y)) {
      return func(c);
    }
    return c;
  });
}

export function mapWindow(
  img: Image,
  xInterval: number[], // Assumed to be a two element array containing [x_min, x_max]
  yInterval: number[], // Assumed to be a two element array containing [y_min, y_max]
  func: (p: Color) => Color
): Image {
  // TODO
  return imageMapIf(
    img,
    (img, x, y) => xInterval[0] <= x && xInterval[1] >= x && yInterval[0] <= y && yInterval[1] >= y,
    func
  );
}

export function isGrayish(p: Color): boolean {
  // TODO
  return Math.max(p[0], p[1], p[2]) - Math.min(p[0], p[1], p[2]) <= 85;
}

export function makeGrayish(img: Image): Image {
  // TODO
  return imageMapCoord(img, (img, x, y) => {
    const p = img.getPixel(x, y);
    if (!isGrayish(p)) {
      const avg = Math.floor((p[0] + p[1] + p[2]) / 3);
      return [avg, avg, avg];
    } else return p;
  });
}

export function pixelBlur(img: Image, x: number, y: number): Color {
  // TODO
  const blur = [0, 0, 0];
  let xcord = 0;
  let ycord = 0;
  let curColor = [0, 0, 0];
  let count = 0;
  for (let xp = -1; xp < 2; xp++) {
    for (let yp = -1; yp < 2; yp++) {
      xcord = x + xp;
      ycord = y + yp;
      if (0 <= xcord && xcord < img.width && 0 <= ycord && ycord < img.height) {
        curColor = img.getPixel(xcord, ycord);
        blur[0] += curColor[0];
        blur[1] += curColor[1];
        blur[2] += curColor[2];
        count++;
      }
    }
  }
  return [Math.floor(blur[0] / count), Math.floor(blur[1] / count), Math.floor(blur[2] / count)];
}

export function imageBlur(img: Image): Image {
  // TODO
  return imageMapCoord(img, (img, x, y) => {
    return pixelBlur(img, x, y);
  });
}
