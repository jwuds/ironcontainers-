function createLimiter(concurrency) {
  let active = 0;
  const queue = [];

  const runNext = () => {
    if (active >= concurrency || queue.length === 0) return;
    active++;
    const { fn, resolve, reject } = queue.shift();
    Promise.resolve()
      .then(fn)
      .then(
        (val) => {
          active--;
          resolve(val);
          runNext();
        },
        (err) => {
          active--;
          reject(err);
          runNext();
        }
      );
  };

  return function limit(fn) {
    return new Promise((resolve, reject) => {
      queue.push({ fn, resolve, reject });
      runNext();
    });
  };
}

module.exports = { createLimiter };
