export const navigationPosition = [
    {
        title:'底部导航',
        description:'在工作台底部显示导航栏',
    },
    {
        title:'左侧导航',
        description:'在工作台左侧显示导航栏',
    },
    {
        title:'右侧导航',
        description:'在工作台右侧显示导航栏',
    },

]

export const navigationFunction=[
    {
        title:'用户中心',
        description:'在工作台底部显示用户中心',
    },
    {
        title:'社区助手',
        description:'在工作台底部显示社区助手',
    },
    {
        title:'任务中心',
        description:'在工作台底部显示任务中心',
    }
]

export const extraRightMenu =  [
    {
        title:'添加导航图标',
        icon:'fluent:add-16-regular',
        component:'EditNavigation',

    },
    {
        title:'编辑导航',
        icon:"fluent:compose-16-regular",
        component:'EditNavigation',
    },
    {
        title:'导航栏设置',
        icon:'fluent:settings-16-regular',
        component:'navigationSetting',
    }
]

export const moreMenus = [
    {
        title:'显示用户中心',
        icon:"fluent:person-16-regular",
        visible:true
    },
    {
        title:'显示社区助手',
        icon:"fluent:people-community-16-regular",
        visible:true

    },
    {
        title:'显示任务中心',
        icon:"fluent:task-list-square-16-regular",
        visible:true
    }
] 
