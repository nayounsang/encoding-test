export const defaultFunc = (arr: unknown[][]) => {
  return arr.map((e) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // const a = e[0];
    const b = e[1];
    return b;
  });
};
