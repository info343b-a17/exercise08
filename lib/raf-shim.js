//workaround for reported requestAnimationFrame warning
global.requestAnimationFrame = (callback) => {
  setTimeout(callback, 0);
};