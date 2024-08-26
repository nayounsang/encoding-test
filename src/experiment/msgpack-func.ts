import { encode } from "@msgpack/msgpack";

export const msgpackFunc = (arr: unknown[][]) => {
  return arr.map((e) => encode(e[1]));
};
