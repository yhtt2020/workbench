import {defineStore} from "pinia";
import dbStorage from "./dbStorage";
import axios from "axios";
import cheerio from 'cheerio';
import { fixHttp } from '../util'

//@ts-ignore
export const gameStrategyStore = defineStore('gameStrategy',{
 state:()=>({
  biliVideoList: [], // 接收B站视频数据
  graphicList: [], // 接收图文攻略数据
 }),

 actions:{
  // 获取B站视频数据
  getBiliData(word:any){
    const words = this.encodeBiliWords(word)
    const now = (Date.now() + '').substr(-8)
    const url = `https://search.bilibili.com/all?vt=${now}&keyword=${words}&search_source=1`
    this.videoRequest(url)
  },

  // 获取图文攻略数据
  getGraphicData(word:any){
    const urlWord = encodeURIComponent(word)
    const url = `https://so.gamersky.com/all/handbook?s=${urlWord}`
    this.imageTextRequest(url)
  },

  imageTextRequest(url:any,clear:boolean = false){
    if(clear){
      this.graphicList = []
    }

    axios.get(url).then(res=>{
      const html = res.data
      const dom = cheerio.load(html)
      dom('.t2').children().each((i, el) => {
        const href = dom(el).eq(0).attr('href')
        const title = dom(el).eq(0).text()
        this.graphicList.push({ href, title })
      })
    })
  },

  videoRequest(url:any,clear:boolean = false){
    if(clear){
      this.biliVideoList = []
    }
    console.log(url);
    
    axios.get(url).then(res=>{
      try {
        const htmlText = res.data
        // 使用正则表达式匹配 <script> 标签中的 JavaScript 代码
        const regex = /<script.*?>((.|\n)*?)<\/script>/gi
        const matches = htmlText.match(regex)
        const startIndex = matches[13].indexOf('(')
        if (startIndex === -1) {
          this.biliVideoList = []
          return
        }
        
        const endIndex = matches[13].lastIndexOf(')')
        const jsonString = matches[13].substring(startIndex, endIndex + 1)

        const jsonData = window.eval(jsonString).searchResponse.searchAllResponse
        if (Object.keys(jsonData).length === 0) {
          this.biliVideoList = []
          return
        } 

        const data = jsonData.result[11].data

        data.forEach((el:any) => {
          if (el.title !== '') {
            this.biliVideoList.push(el)
          }
        })

      } catch (error) {
        this.biliVideoList = []
        console.error('搜索意外返回', error)
      }
    })
  },

  /**
  * 对Bilibili的搜索词进行特殊处理
  * @param words
  * @returns {string}
  */
  encodeBiliWords(words:any): string {
    return encodeURIComponent(words).replace(/%20/g, '+').replace(/'/g, '%27')
  }, 

  getVideoCover(url:any) {
    return fixHttp(url + '@320w_200h')
  },

  // 搜索
  searchVideoData(searchWord:any){
    let handledUrl = this.encodeBiliWords(searchWord)
    console.log('查看结果',handledUrl);
    
    const url = `https://search.bilibili.com/all?keyword=${handledUrl}`
    this.videoRequest(url)
  },
  searchGraphicData(searchWord:any){
    const urlWord = this.encodeBiliWords(searchWord)
    const url = `https://so.gamersky.com/all/handbook?s=${urlWord}`
    this.imageTextRequest(url)
  },



 },

 persist:{
  enabled: true,
  strategies: [{
    // 自定义存储的 key，默认是 store.$id
    // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
    storage: dbStorage,
    paths: ['biliVideoList','graphicList']
    // state 中的字段名，按组打包储存
  }]
 }
})