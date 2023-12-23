import {defineStore} from 'pinia'

export const useNavigationStore=defineStore('useNavigationStore',{
    state:()=>{
        return {
            editToggle:false,
            // 用户中心，社区助手，任务中心
            bottomToggle:[ true,true,true ],
            iconSetting:{
                iconName:true,
                iconRounded:true,
                iconBackground:false
            },
            // 等级显示
            levelVisible:false,
            selectNav:'',
            currentList:{},
            // 第一次进入，显示推荐
            introduceVisible:true,
            // 导航栏数据结构
            navList:{
                // 导航名称
                name:'',
                // 导航标签
                tag:'',
                // 导航类型
                type:"",
                // 导航图标列表
                iconList:[]
            },
            // 导航栏数据
            navObj:{},
            // 存储改变前的数据
            oldToggle:[],
            // 弹窗次数
            popVisible:true,
            // 编辑图标颜色自定义
            colorSwitch:true,
            // 导航栏颜色自定义
            navColorSwitch:true,
            // 图标编辑元素
            editItem:'',
            navAttribute:{
                // 导航栏尺寸
                navSize:100,
                // 导航栏圆角
                navRadius:18,
                // 导航栏背景颜色
                navBgColor:'var(--primary-bg)',
            },
            // 图标圆角
            iconRadius:12,
            // 选择可见
            isDesk:false,
            // 目标桌面
            targetDesk:'',
        }
    },
    actions:{
        toggleEdit(){
            this.editToggle=!this.editToggle
        },
    },
    persist: {
        enabled: true,
        strategies: [
          {
            paths: ['editToggle','iconSetting','selectNav','introduceVisible','popVisible','navAttribute','iconRadius'],
            // storage: dbStorage,
            storage: localStorage,
          },
        ],
      },
})