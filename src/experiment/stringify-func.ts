export const stringifyFunc = (arr: unknown[][]) => {
  return arr.map((e) => {
    // const a = e[0];
    const b = e[1];
    return JSON.stringify(b);
  });
};
