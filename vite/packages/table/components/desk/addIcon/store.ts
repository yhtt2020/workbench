import { defineStore } from 'pinia';

export const useIconStore = defineStore('useIconStore',{
    state: () => {
        return {
            multipleList:[], // 多选列表
            isMultiple:false, // 是否多选
        }
    },
    actions: {
        // 添加图标到多选列表
        addList(item){
            this.multipleList.push(item)
        },

        // 从多选列表删除图标
        removeList(item){
            this.multipleList = this.multipleList.filter(i => i.name !== item.name)
        }
    }
})