module.exports = {
  "*.{ts,tsx}": [() => "tsc", "prettier --write", "eslint --fix", "git add ."],
  // "*.{json,css}": [() => "prettier --write", "git add ."],
};
