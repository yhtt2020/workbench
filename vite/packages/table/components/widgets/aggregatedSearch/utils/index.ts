export const highLightKeywords = (keywords, text) => {
  if (typeof keywords !== "string" || keywords === "") {
    keywords = text;
  }
  const wordArr = [...text];
  if (!Array.isArray(wordArr) || wordArr.length === 0) {
    return keywords;
  }
  // 将关键字数组转换为正则表达式数组
  const regexArray = wordArr.map((keyword) => new RegExp(`(${keyword})`, "gi"));

  // 使用reduce方法结合replace来替换所有关键字
  return regexArray.reduce(function (result, regex) {
    return result.replace(regex, function (match) {
      return `<span class="tt-theme">${match}</span>`;
    });
  }, keywords);
};
