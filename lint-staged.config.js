module.exports = {
  "*.{ts,tsx}": [() => "tsc", "prettier --write", "eslint --fix"],
  // "*.{json,css}": [() => "prettier --write"],
};
