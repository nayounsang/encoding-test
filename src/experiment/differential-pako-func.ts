import { deflate } from "pako";
import { differentialFunc } from "./differential-func";

export const differentialPakoFunc = (arr: unknown[][]) => {
  return differentialFunc(arr).map((e) => {
    return deflate(JSON.stringify(e));
  });
};
