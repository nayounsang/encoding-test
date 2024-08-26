const differentialObject = (prev: unknown, next: unknown): unknown => {
  if (typeof prev !== "object" || prev === null) {
    return next;
  }

  if (Array.isArray(prev) && Array.isArray(next)) {
    return next.slice(prev.length); // next는 prev의 원소를 모두 앞에 포함
    // 즉 [1,2,3]이라면 [2,2,4]인 경우는 존재하지 않음
  }

  // 객체일 경우 객체의 차이를 반환
  if (typeof prev === "object" && typeof next === "object") {
    const difference: { [key in string | number]: unknown } = {};
    for (const key in next) {
      if (next.hasOwnProperty(key)) {
        if (!(key in prev)) {
          difference[key] = next[key as keyof typeof next]; // 새로운 key
        } else {
          const diff = differentialObject(
            prev[key as keyof typeof prev],
            next[key as keyof typeof next]
          );
          if (typeof diff !== "undefined") {
            difference[key] = diff; // 차이가 존재하는 경우 갱신
          }
        }
      }
    }
    // undefined는 차이 없음을 의미
    // key가 존재해야 차이가 존재
    return Object.keys(difference).length > 0 ? difference : undefined;
  }

  // undefined는 차이 없음을 의미
  return undefined;
};

export const differentialFunc = (arr: unknown[][]) => {
  return arr.map((e) => differentialObject(e[0], e[1]));
};
