import { Compressed, isCompressed } from "./../experiment/compress-json-func";
import { Buffer } from "buffer";

const getUint8ArraySize = (arr: Uint8Array[]) => {
  return arr.map((e) => e.length);
};

const getBufferSize = (arr: Buffer[]) => {
  return arr.map((e) => e.length);
};

const getUTF8Size = (str: string) => {
  const encoder = new TextEncoder();
  const encoded = encoder.encode(str);
  return encoded.length;
};

const getJSONSize = (arr: object[]) => {
  return arr.map((e) => {
    const jsonString = JSON.stringify(e);
    return getUTF8Size(jsonString);
  });
};

const getCompressedSize = (arr: Compressed[]) => {
  return arr.map((e) => {
    const jsonString = JSON.stringify(e);
    return getUTF8Size(jsonString);
  });
};

const getStringSize = (arr: string[]) => {
  return arr.map((e) => getUTF8Size(e));
};

export const getByteSize = (fn: () => unknown[]) => {
  const arr = fn();
  if (arr.length === 0) throw new Error(`Array's element doesn't exist.`);
  if (arr[0] instanceof Uint8Array)
    return getUint8ArraySize(arr as Uint8Array[]);
  if (arr[0] instanceof Buffer) return getBufferSize(arr as Buffer[]);
  if (isCompressed(arr[0])) return getCompressedSize(arr as Compressed[]);
  if (typeof arr[0] === "object" && arr[0] !== null && !Array.isArray(arr[0]))
    return getJSONSize(arr as object[]);
  if (typeof arr[0] === "string") return getStringSize(arr as string[]);
  throw new Error(`Unsupported data type:${arr}`);
};
