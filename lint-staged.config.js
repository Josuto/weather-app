module.exports = {
  "*.{ts,tsx}": [
    () => "echo HERE!",
    "tsc --noEmit --skipLibCheck --jsx react --allowSyntheticDefaultImports",
    "prettier --write",
    "eslint --fix",
    "git add .",
  ],
  // "*.{json,css}": [() => "prettier --write", "git add ."],
};
