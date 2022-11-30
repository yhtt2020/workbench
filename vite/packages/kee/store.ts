import {defineStore} from "pinia";
// import _ from 'lodash-es';
// const {appModel, devAppModel} = window.$models
const initSetting={ //存储用户的设置
  name:'',
  theme_color:'',
  theme_colors:{},
  url:'',
  summary:'',
  optimize:{},
  auth:{
    base:{},
    api:{},
    ability:{}
  },
}

export const appStore = defineStore('kee',{
    state:()=>({
      app: {
        name: '',
        url: '',
        theme_color: '',
        user_theme_color: ''
      },
      user:{
        user_info:{}
      },
      //将点击之后的值进行缓存
      passwordItem: {
        id:0,
        index: 0,
        title: "禅道账号",
        description: "Francisio_Phillps",
        password:'123456',
        url: "../../../public/img/key_black.svg",
        site:'zt.xaingtian.ren'
      },
    }),
    actions:{},
    getters:{}
})