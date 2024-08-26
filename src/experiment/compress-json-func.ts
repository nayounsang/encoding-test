import { compress } from "compress-json";

export type Compressed = [(string | null)[], string];

export const isCompressed= (value: unknown): value is Compressed => {
    // 배열인지 확인
    if (!Array.isArray(value)) return false;

    // 길이가 2인지 확인
    if (value.length !== 2) return false;

    // 첫 번째 요소가 (string | null)[]인지 확인
    if (!Array.isArray(value[0])) return false;
    if (!value[0].every(item => typeof item === 'string' || item === null)) return false;

    // 두 번째 요소가 string인지 확인
    if (typeof value[1] !== 'string') return false;

    // 모든 조건을 만족하면 true
    return true;
}

export const compressJSONFunc = (arr: unknown[][]) => {
  return arr.map((e) => compress(e));
};
