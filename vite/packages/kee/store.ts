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
      currentTab:null,
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
        site_1:'zt.xaingtian.ren',
        site_2:'zt.xaingtian.ren'
      },

      currentDb:{
        filePath:'',
        name:'',
        kdbx:{}
      },

      tags:[],//全部标签

      dbList:[],//打开过的密码库
    }),
    actions:{
      setDb(dbInfo){
        this.currentDb=dbInfo
        this.tags=dbInfo.tags
        const manager=kdbxModel.getManager(dbInfo.filePath)
        passwordModel.setPasswordManager(manager)
        passwordModel.getAllPasswords()
        console.log('set dbinfo',dbInfo)
      },
      importPasswords(passwords,groupName,existAction){
        return passwordModel.importPasswords(passwords,groupName,existAction)
      },
      loadDbList(){
        let history = localStorage.getItem('bankList')
        if (history) {
          this.dbList = JSON.parse(history)
        }
      },
      saveDbList(){
        localStorage.setItem('bankList', JSON.stringify(this.dbList))
      },
      getTabData(){
        let timer=setTimeout(()=>{
          if(window.tabData){
            this.currentTab=window.tabData
            console.log('获得到tabdata',this.currentTab)
            clearInterval(timer)
          }
        },500)
      }
    },
    getters:{}
})

