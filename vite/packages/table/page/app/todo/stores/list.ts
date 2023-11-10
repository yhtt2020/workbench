import {defineStore} from "pinia";
import {IListInfo, IListInfo as ListInfo, ITaskInfo as TaskInfo} from "../interfaces";
import {taskStore} from './task'
import {nanoid} from "nanoid";
import dbStorage from '../../../../store/dbStorage'
// @ts-ignore
import _ from "lodash-es";

export const  listStore=defineStore('list',{
    state: ()=>{
        return {
            lists:[] as ListInfo[],
            activeList:<ListInfo>{}
        }
    },
    getters:{
      displayLists(){
          return this.lists.map(list=>{

              list.count= taskStore().tasks.filter(task=> {
                  if(typeof task.listNanoid =='string'){
                      task.listNanoid=[task.listNanoid]
                  }else if(typeof task.listNanoid === 'undefined' || task.listNanoid===null){
                      task.listNanoid=[]
                  }
                  return task.listNanoid.indexOf(list.nanoid) > -1
              }).length
              return list
          })
      }
    },
    actions:{
        add(item: ListInfo) {
            if(item.title.trim()===''){
                return false
            }
            let newTask = _.cloneDeep(Object.assign(item, {
                nanoid: nanoid(6),
                createTime: Date.now()
            }))
            this.lists.push(newTask)
        },
        remove(nanoid:string){
            if (this.activeList.nanoid === nanoid) {
                this.activeList={}
            }
            taskStore().tasks.map(task=>{
                let found=task.listNanoid.indexOf(nanoid)
                if(found>-1){
                    task.listNanoid.splice(found,1)
                }
            })
            this.lists.splice(this.lists.findIndex(list => list.nanoid === nanoid), 1)
        },
        setActiveList(list:IListInfo){
            this.activeList=list
        }
    },
    persist: {
        enabled: true,
        strategies: [
          {
            // 自定义存储的 key，默认是 store.$id
            // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
            storage: dbStorage,
            paths: ['lists','activeList']
            // state 中的字段名，按组打包储存
          },
        ],
    }
})

export default listStore
