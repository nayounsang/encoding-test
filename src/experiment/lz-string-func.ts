import { compress } from "lz-string";

export const lzStringFunc = (arr: unknown[][]) => {
  return arr.map((e) => compress(JSON.stringify(e)));
};
