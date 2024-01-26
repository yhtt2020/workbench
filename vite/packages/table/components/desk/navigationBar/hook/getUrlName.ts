// 获取网站图标
import axios from "axios";
import cheerio from "cheerio";
import $ from "jquery";

export const getFavicon = async (url) => {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const linkElements = $("link[rel*='icon'], link[rel*='shortcut']");
    const validIcons = linkElements.filter((index, link) => {
      const href = $(link).attr("href");
      return href && href.toLowerCase().includes("favicon");
    });

    if (validIcons.length > 0) {
      const faviconURL = new URL(validIcons[0].attribs.href, url).href;
      console.log("Favicon URL:", faviconURL);
      return faviconURL;
    }

    console.log("Favicon not found!");
    return null;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

export const useGetUrlName = (url) => {
  const match = url.match(/^https?:\/\/([^/]+)/);
  return match ? match[1] : null;
};
