import { encode } from "cbor-x";
export const cborXFunc = (arr: unknown[][]) => {
  return arr.map((e) => encode(e[1]));
};
