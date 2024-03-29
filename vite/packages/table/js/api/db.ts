//此模块暂时不用
import {isWeb} from "../../ui/hooks/env";

import * as PouchDB from 'pouchdb'
import * as PouchDBFind from 'pouchdb-find'
const initDb=function (){
  if(isWeb){
    PouchDB.plugin(PouchDBFind)
    let pdb=  PouchDB()
    const db = {
      instance: pdb,
      put (doc) {
        return pdb.put(doc)
      },
      get (id) {
        return pdb.get(id)
      },
      remove (doc) {
        return pdb.remove(doc)
      },
      bulkDocs (docs) {
        return pdb.bulkDocs(docs)
      },
      find(options){
        return pdb.find(options)
      },
      createIndex(options){
        return pdb.createIndex(options)
      },
      allDocs (key) {
        if(!key){
          return pdb.allDocs()
        }
        if(typeof key ==='string')
        {
          return pdb.allDocs({
            include_docs:true,
            start_key:key,
            end_key:key+'\ufff0'
          })
        }else{
          return pdb.allDocs({
            keys:key
          })
        }
      },
      allDocsQuery(options){
        return pdb.allDocs(options)
      },
    }
    window.tsbApi={
      db:db
    }
    console.log('导入完成，初始化完成',db)
  }

}




export  {initDb}
