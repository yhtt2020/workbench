import {rejects} from "assert";

const {storageModel} = window.$models
function getSign():string{
  let href=window.location.href
  console.log(href)
  if(href.startsWith('tsbapp://./')){
    return 'table.com'
  }else if(href.startsWith('http://localhost:1600')){
    return 'table.com'
  }else{
    let url=new URL(href)
    return url.hostname
  }
}


const dbStorage: Storage = {
  async setItem(key: string, value: string) {
    await storageModel.setItem(key, value, getSign())
  },
  async getItem(key: string): string | null | Promise<string> {
    console.log('尝试取',key)
    let value = await storageModel.getItem(key, getSign())
    if (!value) {
      try{
        value= localStorage.getItem(key)
      }catch (e) {
        console.warn('本地也没存储')
      }
    }
    if(!window.loadedStore){
      window.loadedStore={}
    }
    window.loadedStore[key]=true
    console.log('设置了',key)
    return value
  }
}


export default dbStorage
