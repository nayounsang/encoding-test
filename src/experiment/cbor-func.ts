import cbor from "cbor";

export const cborFunc = (arr: unknown[][]) => {
  arr.forEach((e) => 
    cbor.encode(e[1])
  );
};
