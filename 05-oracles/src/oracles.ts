import assert from "assert";

import type { StableMatcher, StableMatcherWithTrace } from "../include/stableMatching.js";

function shuffle(arr: number[]): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randomInt(0, i + 1);
    const fillerArr = arr[i];
    arr[i] = arr[j];
    arr[j] = fillerArr;
  }
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min)) + min;
}

export function generateInput(n: number): number[][] {
  // TODO
  const newArray: number[][] = [];
  for (let i = 0; i < n; i++) {
    const arr: number[] = [];
    for (let j = 0; j < n; j++) {
      arr.push(j);
    }
    shuffle(arr);
    newArray.push(arr);
  }
  return newArray;
}

const NUM_TESTS = 20; // Change this to some reasonably large value
const N = 6; // Change this to some reasonable size

/**
 * Tests whether or not the supplied function is a solution to the stable matching problem.
 * @param makeStableMatching A possible solution to the stable matching problem
 * @throws An `AssertionError` if `makeStableMatching` in not a solution to the stable matching problem
 */
export function stableMatchingOracle(makeStableMatching: StableMatcher): void {
  for (let i = 0; i < NUM_TESTS; ++i) {
    const companies = generateInput(N);
    const candidates = generateInput(N);
    const hires = makeStableMatching(companies, candidates);

    assert(companies.length === hires.length, "Hires length is correct.");

    // TODO: More assertions go here.

    const hiredCompanies = hires.map(hire => hire.company);
    assert(hiredCompanies.length === new Set<number>(hiredCompanies).size, "No company duplicates");
    const hiredCandidates = hires.map(hire => hire.candidate);
    assert(hiredCandidates.length === new Set<number>(hiredCandidates).size, "No duplicate candidates hired");

    const compsMatch = [];
    const candsMatch = [];

    for (let j = 0; j < N; j++) {
      compsMatch.push(-1);
      candsMatch.push(-1);
    }

    for (let j = 0; j < N; j++) {
      const compIndex = hires[j].company;
      const candIndex = hires[j].candidate;
      assert(compIndex >= 0, "CompNums index below zero");
      assert(candIndex >= 0, "candNums index below zero");
      assert(compIndex < N, "CompNums index above N");
      assert(candIndex < N, "candNums index above N");
      assert(candsMatch[candIndex] === -1, "checks if candidate matched");
      assert(compsMatch[compIndex] === -1, "checks if company matched");

      compsMatch[compIndex] = candIndex;
      candsMatch[candIndex] = compIndex;
    }

    for (let comp = 0; comp < N; comp++) {
      for (let cand = 0; cand < N; cand++) {
        const compRank = candidates[cand].indexOf(candsMatch[cand]);
        const candRank = companies[comp].indexOf(compsMatch[comp]);
        const otherCompRank = candidates[cand].indexOf(comp);
        const otherCandRank = companies[comp].indexOf(cand);

        if (compRank > otherCompRank && candRank > otherCandRank) {
          assert(false, "unstable pair found");
        }
      }
    }
  }
}

// Part B

/**
 * Tests whether or not the supplied function follows the supplied algorithm.
 * @param makeStableMatchingTrace A possible solution to the stable matching problem and its possible steps
 * @throws An `AssertionError` if `makeStableMatchingTrace` does not follow the specified algorithm, or its steps (trace)
 * do not match with the result (out).
 */
export function stableMatchingRunOracle(makeStableMatchingTrace: StableMatcherWithTrace): void {
  for (let i = 0; i < NUM_TESTS; ++i) {
    const companies = generateInput(N);
    const candidates = generateInput(N);
    const { trace, out } = makeStableMatchingTrace(companies, candidates);

    // TODO: Assertions go here
    const compMatch: number[] = [];
    const candMatch: number[] = [];

    for (let j = 0; j < N; j++) {
      compMatch.push(-1); //makes compMatch all -1
      candMatch.push(-1); //makes candMatch all -1
    }
    const compProposal = [];
    const candProposal = [];

    for (let j = 0; j < N; j++) {
      compProposal.push(new Array(N).fill(false)); //sets company proposals to false
      candProposal.push(new Array(N).fill(false)); //sets candidate proposals to false
    }

    for (const Offer of trace) {
      const from = Offer.from;
      const to = Offer.to;
      const fromCo = Offer.fromCo;

      assert(from >= 0 && from < N, "offer from is out of bounds");
      assert(to >= 0 && to < N, "offer to is out of bounds");

      if (fromCo) {
        //if company makes a offer
        assert(!compProposal[from][to], "company already proposed a candidate");
        compProposal[from][to] = true;

        const companyPref = companies[from];
        for (let k = 0; k < N; k++) {
          if (companyPref.indexOf(k) < companyPref.indexOf(to) && !compProposal[from][k]) {
            assert(false, "company skipped the most perfered candidate");
          }
        }
        if (candMatch[to] === -1) {
          //candidate unmatched
          candMatch[to] = from;
          compMatch[from] = to;
        } else {
          //candidate matched
          const currCompany: number = candMatch[to];
          const candPref = candidates[to].indexOf(from);
          const currPref = candidates[to].indexOf(currCompany);
          if (candPref < currPref) {
            //if candidate likes new company better than old company
            compMatch[currCompany] = -1;
            candMatch[to] = from;
            compMatch[from] = to;
          }
          //if current preference is more nothing changes
        }
      } else {
        //if candidate makes a offer
        assert(!candProposal[from][to], "candidate already proposed to company");
        candProposal[from][to] = true;

        const candidatePref = candidates[from];
        for (let k = 0; k < N; k++) {
          if (candidatePref.indexOf(k) < candidatePref.indexOf(to) && !candProposal[from][k]) {
            assert(false, "candidate skipped perfered company");
          }

          if (compMatch[to] === -1) {
            //if company unmatched
            compMatch[to] = from;
            candMatch[from] = to;
          } else {
            //if company matched
            const currCandidate: number = compMatch[to];
            const compPref = companies[to].indexOf(from);
            const currPref = companies[to].indexOf(currCandidate);
            if (compPref < currPref) {
              //if company likes new candidate over previous
              candMatch[currCandidate] = -1;
              compMatch[to] = from;
              candMatch[from] = to;
            }
            //else nothing happens
          }
        }
      }
    }
    const numMatchedComps = compMatch.filter(x => x !== -1);
    const numMatchedCands = candMatch.filter(x => x !== -1);
    assert(out.length === numMatchedCands.length, "output length doesnt match with companies");
    assert(out.length === numMatchedComps.length, "output length doesnt match with candidates");

    for (const hire of out) {
      const candidate = hire.candidate;
      const company = hire.company;
      assert(candMatch[candidate] === company, "output companies candidate does not match");
      assert(compMatch[company] === candidate, "output candidates company does not match");
    }
  }
}
