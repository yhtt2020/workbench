// 获取网站图标
import axios from "axios";
import * as cheerio from 'cheerio';
import $ from "jquery";

/**
 * 从指定的URL获取网站的favicon URL和标题。
 * @param {string} url - 要获取favicon和标题的网站URL。
 * @returns {Object|null} - 返回包含favicon URL和标题的对象，如果未找到则返回null。
 */
export const getFavicon = async (url) => {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    // 获取favicon
    const linkElements = $("link[rel*='icon'], link[rel*='shortcut']");
    const validIcons = linkElements.filter((index, link) => {
      const href = $(link).attr("href");
      return href && href.toLowerCase().includes("favicon");
    });

    let faviconURL = null;
    if (validIcons.length > 0) {
      faviconURL = new URL(validIcons[0].attribs.href, url).href;
      console.log("Favicon URL:", faviconURL);
    } else {
      console.log("Favicon not found!");
    }

    // 获取标题
    let pageTitle = null
    pageTitle = $("title").text().trim();
    console.log("Page Title:", pageTitle);

    // 返回结果对象
    return {
      faviconURL,
      pageTitle
    };
  } catch (error) {
    console.error("Error:", error);
    const obj = {
      faviconURL: null,
      pageTitle: null
    }
    return obj;
  }
};


export const useGetUrlName = (url) => {
  const match = url.match(/^https?:\/\/([^/]+)/);
  return match ? match[1] : null;
};
