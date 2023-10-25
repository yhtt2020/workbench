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
  /**
    * @param word // 游戏攻略中的B站视频和图文的参数
  */
  getBiliData(word:any){  // B站视频请求
    this.biliVideoList = []
    if(word !== undefined){  // 参数进行容错处理
      const biliWord = this.encodeBiliWords(word)
      const  now = (Date.now() + '').slice(-8)
      const url = `https://search.bilibili.com/all?vt=${now}&keyword=${biliWord}&search_source=1`
      
      // console.log('查看预期路径::>>',url);
    
      axios.get(url).then((res:any)=>{
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
          }

          const data = jsonData.result[11].data

          // console.log('查看B站视频数据预期结果::>>',data);

          data.forEach((el:any) => {
            if (el.title !== '') {
              this.biliVideoList.push(el)
            }
          })
          
        } catch (error) {
          console.error('请求返回异常',error),
          this.biliVideoList = []
        }
        
      })

    }else{
      this.biliVideoList = []
    }
  },

  getGraphicData(word:any){
    this.graphicList = []
    if(word !== undefined){

      const graphicWord = encodeURIComponent(word)
      const url = `https://so.gamersky.com/all/handbook?s=${graphicWord}`

      axios.get(url).then((res:any)=>{
       try {

        const html = res.data
        const dom = cheerio.load(html)
        dom('.t2').children().each((i, el) => {
          const href = dom(el).eq(0).attr('href')
          const title = dom(el).eq(0).text()
          this.graphicList.push({ href, title })
        })

       } catch (error) {

        console.error('请求返回异常',error)
        this.graphicList = []

       }
      })
      
    }else{
      this.graphicList = [] 
    }
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