export const repeatArray = (
  originalArray: unknown[][],
  repeatCount: number
): unknown[][] => {
  let repeatedArray: unknown[] = [];
  for (let i = 0; i < repeatCount; i++) {
    repeatedArray = repeatedArray.concat(
      JSON.parse(JSON.stringify(originalArray))
    );
  }
  return repeatedArray as unknown[][];
};
