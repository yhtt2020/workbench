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
    let value = await storageModel.getItem(key, getSign())
    if (!value) {
      try{
        value= localStorage.getItem(key)
      }catch (e) {
        console.warn('本地也没存储')
      }
    }
    return value
  }
}


export default dbStorage
