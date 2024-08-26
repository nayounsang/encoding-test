import { TIME_REPEAT } from "../const/const";

export const getTime = (fn: () => void) => {
  const start = performance.now();
  fn();
  const end = performance.now();
  return end - start;
};

export const getRepeatTime = (fn: () => void) => {
  const stack = [];
  for (let i = 0; i < TIME_REPEAT; i++) {
    stack.push(
      getTime(() => {
        fn();
      })
    );
  }
  return stack;
};
