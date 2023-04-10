import {rejects} from "assert";

const {storageModel}=window.$models
const dbStorage:Storage={
  sign:'table',
  setPersist(sign:string=''){
    dbStorage.sign=sign
  },
  async setItem(key: string, value: string) {
    console.log('尝试写入item')
      await storageModel.setItem(key,value,dbStorage.sign)
  },
  async  getItem(key: string): string | null | Promise<string>{

    let value=await storageModel.getItem(key,dbStorage.sign)
    console.log('尝试获取item',value)
    return   value
  }
 }


export default dbStorage
