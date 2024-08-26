import { BSON } from "bson";

export const bsonFunc = (arr: unknown[][]) => {
  return arr.map((e) => (BSON.serialize(e[1] as Document)));
};
