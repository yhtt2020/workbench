import {getResPath, getResPathJoin} from "../common/exec";

const _ = require('lodash')
const dbPath = getResPathJoin('nav.db')
const SqlDb = tsbApi.SqlDb
const db = new SqlDb(dbPath)
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
  searchNavByWords(words){
    return db.knex('navSite').where('title','like', `%${words}%`).orWhere('url','like', `%${words}%`)
      .orWhere('summary','like', `%${words}%`).orderBy('order','desc')
  },
  getNavsByTopId(topId){
    return db.knex('navSite').where({'topId':topId}).orderBy('order','desc')
  },
  getNavsBySecondId(secondId){
    return db.knex('navSite').where({'typeId':secondId}).orWhere({'secondId':secondId}).orderBy('order','desc')
  },
  getNavsByThirdId(thirdId){
    return db.knex('navSite').where({'typeId':thirdId}).orderBy('order','desc')
  }
}
export default navDb
