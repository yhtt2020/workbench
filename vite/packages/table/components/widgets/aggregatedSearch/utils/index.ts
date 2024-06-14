export const highLightKeywords = (keywords, text) => {
  if (typeof keywords !== "string" || keywords === "") {
    keywords = text;
  }
  const wordArr = text.split(" "); // 使用空格拆分文本内容为单词数组
  if (!Array.isArray(wordArr) || wordArr.length === 0) {
    return keywords;
  }

  console.log("keywords, text :>> ", keywords, text);
  // 将关键字数组转换为正则表达式数组
  const regexArray = wordArr.map(
    (keyword) => new RegExp(`\\b(${keyword})\\b`, "gi")
  ); // 使用\b匹配单词边界
  console.log("regexArray :>> ", regexArray);
  // 使用reduce方法结合replace来替换所有关键字
  let res = regexArray.reduce(function (result, regex) {
    return result.replace(regex, function (match) {
      return `<span class="tt-theme">${match}</span>`;
    });
  }, keywords);
  console.log("res :>> ", res);
  return res;
};
