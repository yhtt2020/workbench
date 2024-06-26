export const highLightKeywords = (keywords, text) => {
  if (!text) return;
  if (typeof keywords !== "string" || keywords === "") {
    keywords = text;
  }
  const wordArr = [...new Set(keywords.split(""))];

  if (!Array.isArray(wordArr) || wordArr.length === 0) {
    return keywords;
  }
  let res = "";
  [...text].forEach((k) => {
    if (wordArr.includes(k)) {
      res += `<span class="tt-theme">${k}</span>`;
    } else {
      res += k;
    }
  });
  return res;
};
