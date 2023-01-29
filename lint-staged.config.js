module.exports = {
  "*.{ts,tsx}": [
    () => "tsc --noEmit --skipLibCheck --jsx react --allowSyntheticDefaultImports",
    "prettier --write",
    "eslint --fix",
    "git add .",
  ],
  // "*.{json,css}": [() => "prettier --write", "git add ."],
};
