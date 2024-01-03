import axios from 'axios';
import cheerio from 'cheerio';

const getName = {
 // 获取b站视频标题
 async getUrlName(url:any){
  const res  = await axios.get(url);
  const html = res.data
  const dom = cheerio.load(html)
  // console.log('获取',dom('h1')[0]?.attribs.title);
  return {title:dom('h1')[0]?.attribs.title}
 }
}

export default getName;