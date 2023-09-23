export const throttle = (func, delay) => {
  let throttleRunning = false;
  let callImmedeiately = true;

  return function (...args) {
    if (throttleRunning) return;
    throttleRunning = true;

    setTimeout(() => {
      func(...args);
      throttleRunning = false;
    }, (callImmedeiately && 1) || delay);

    callImmedeiately = false;

    setTimeout(() => {
      callImmedeiately = true;
    }, delay);
  };
};
