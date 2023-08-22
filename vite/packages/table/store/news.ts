import {defineStore} from "pinia";
import axios from "axios";
import dbStorage from "./dbStorage";


export const newsStore = defineStore('news', {
    state: () => ({
        data:{
            titleList:[],

        }
    }),
    actions: {
        async getCategory(){
            const res=await axios.get('http://v.juhe.cn/toutiao/index')
            if(res.reason==='success'){
                this.data.titleList=res.result.data.category
            }
        }
        
    },
    getters: {
        
    }
})