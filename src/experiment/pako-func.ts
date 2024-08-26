import { deflate } from "pako";

export const pakoFunc = (arr: unknown[][]) => {
  return arr.map((e) => deflate(JSON.stringify(e[1])));
};
