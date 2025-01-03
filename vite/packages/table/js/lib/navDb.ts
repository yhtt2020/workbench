import {getResPath, getResPathJoin} from "../common/exec";
const dbPath = getResPathJoin('nav.db')
const SqlDb = tsbApi.SqlDb
const db = new SqlDb(dbPath)

import {siteNavStore} from '../../apps/siteNav/siteNavStore'
const navDb = {
  async getNavTypes() {
    return db.knex('navType').orderBy('order','desc')
  },
  arrToTree(arr, parentId?) {
    return arr.filter(item => parentId === undefined ? item.pid === 0 : item.pid === parentId).map(item => {
      item.children = navDb.arrToTree(arr, item.id)
      return item
    })
  },
  async getNavTypesTree() {
    const navTypes = await navDb.getNavTypes()
    return navDb.arrToTree(navTypes)
  },
  getNavsByType(typeId?:number,topId?:number,subTypeId?:number) {
    const map: any = {}
    if (typeId) {
      map.typeId = typeId
    }
    if(Number(typeId)===0){
      map.topId=topId
    }
    if(subTypeId){
      map.secondId=subTypeId
    }

    return db.knex('navSite').where(map).orderBy('order','desc')

  },
  checkIsMy(site){
    return siteNavStore().mySites.findIndex(item => {
      return item.id === site.id
    })>-1
  },
  async searchNavByWords(words, isMy = false) {
    let rs = await db.knex('navSite').where('title', 'like', `%${words}%`).orWhere('url', 'like', `%${words}%`)
      .orWhere('summary', 'like', `%${words}%`).orderBy('order', 'desc')
    return navDb.filterData(rs,isMy)
  },
  async getNavsByTopId(topId,isMy=false){
    let rs =await db.knex('navSite').where({'topId':topId}).orderBy('order','desc')
    return navDb.filterData(rs,isMy)
  },
  filterData(data,isMy){
    data.forEach(item => {
      item.active=navDb.checkIsMy(item)
    })
    return data.filter(item=>{
      if(!isMy){
        item.active=navDb.checkIsMy(item)
        return true
      }
      return navDb.checkIsMy(item)
    })
  },
  async getNavsBySecondId(secondId,isMy=false){
    let rs=await db.knex('navSite').where({'typeId':secondId}).orWhere({'secondId':secondId}).orderBy('order','desc')
    return navDb.filterData(rs,isMy)
  },
  async getNavsByThirdId(thirdId,isMy=false){
    let rs=await db.knex('navSite').where({'typeId':thirdId}).orderBy('order','desc')
    return navDb.filterData(rs,isMy)
  }
}
export default navDb
