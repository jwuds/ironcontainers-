async function withRetry(fn, opts = {}) {
  const { retries = 3, baseDelayMs = 1000, label = '' } = opts;
  let lastErr;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (attempt < retries) {
        const delay = baseDelayMs * 2 ** (attempt - 1) + Math.floor(Math.random() * 300);
        console.warn(`  retry ${attempt}/${retries} for ${label}: ${err.message} (waiting ${delay}ms)`);
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  }
  throw lastErr;
}

module.exports = { withRetry };
