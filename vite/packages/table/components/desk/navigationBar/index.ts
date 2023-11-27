export const navigationPosition = [
    
    {
        title:'左侧导航',
        description:'在工作台左侧显示导航栏',
    },
    {
        title:'右侧导航',
        description:'在工作台右侧显示导航栏',
    },
    {
        title:'底部导航',
        description:'在工作台底部显示导航栏',
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
        visible:true,
        tag:'user'
    },
    {
        title:'显示社区助手',
        icon:"fluent:people-community-16-regular",
        visible:true,
        tag:'community'

    },
    {
        title:'显示任务中心',
        icon:"fluent:task-list-square-16-regular",
        visible:true,
        tag:'task'
    }
] 

export const rightMenus=[
    {
        id:1,
        newIcon:'fluent:add-16-regular',
        name:"添加导航图标",
        fn:()=>{  console.log("添加导航图标") },
    },
    {
        id:2,
        name:'编辑导航',
        newIcon:"fluent:compose-16-regular",
        fn:()=>{  console.log('编辑导航') },
    },
    {
        id:3,
        name:'导航栏设置',
        newIcon:'fluent:settings-16-regular',
        color: "#FF4D4F",
        fn:()=>{}
    },
    {
        id:4,
        name:'更多',
        newIcon:'fluent:more-horizontal-16-filled',
        children:[
            {
                id:1,
                name:'显示用户中心',
                newIcon:"fluent:person-16-regular",
                fn:()=>{}
            },
            {
                id:2,
                name:'显示社区助手',
                newIcon:"fluent:people-community-16-regular",
                fn:()=>{}
            },
            {
                id:3,
                name:'显示任务中心',
                newIcon:"fluent:task-list-square-16-regular",
                fn:()=>{}
            }
        ]

    },
    {
        divider: true,
        id: 5
    }

]

export const iconMenus = [
    {
        id:1,
        newIcon:'fluent:open-16-regular',
        name:"打开",
        fn:()=>{  console.log("添加导航图标") },
    },
    {
        id:2,
        name:'编辑',
        newIcon:"fluent:compose-16-regular",
        fn:()=>{  console.log('编辑导航') },
    },
    {
        id:3,
        name:'删除',
        newIcon:'fluent:delete-16-regular',
        color: "#FF4D4F",
        fn:()=>{}
    },
    {
        id:4,
        divider: true
    },
    {
        id:5,
        name:'编辑导航',
        newIcon:"fluent:compose-16-regular",
        fn:()=>{  console.log('编辑导航') },
    },
    {
        id:6,
        name:'导航栏设置',
        newIcon:'fluent:settings-16-regular',
        fn:()=>{}
    }
]

export const webMenus=[
    {
        name:'新闻资讯',
        tag:'information'
    },
    {
        name:'文档表单',
        tag:'docx'
    },
    {
        name:'常用邮箱',
        tag:'email'
    },
    {
        name:'程序开发',
        tag:'code'
    },
    {
        name:'效率工具',
        tag:'effect'
    },
    {
        name:'设计工具',
        tag:'design'
    },
    {
        name:'即时通讯',
        tag:'message'
    },
    {
        name:'休闲娱乐',
        tag:'game'
    },
]

export const iconSize=[
    {
        title:'1x1',
        value:'mini'
    },
    {
        title:'2x1',
        value:'mini1'
    },
    {
        title:'2x2',
        value:'small'
    },
    {
        title:'4x2',
        value:'long'
    },
    {
        title:'4x4',
        value:'big'
    },
]

export const iconShape=[
    {
        title:'正方形',
        value:'square'
    },
    {
        title:'长方形',
        value:'rectangle'
    }
]

export const iconStatus=[
    {
        title:'覆盖',
        value:'cover'
    },
    {
        title:'填充',
        value:'fill'
    },
    {
        title:'缩小',
        value:'small'
    },
    {
        title:"放大",
        value:'big'
    }
]

export const localFiles=[
    {
        name:'全部',
        tag:'all'
    },
    {
        name:'软件',
        tag:"software"
    },
    {
        name:'文档',
        tag:'docx'
    },
    {
        name:"其他",
        tag:'other'
    }
]

export const doc=[
    ".docx",
    ".pptx",
    '.txt',
    '.pdf',
    '.xlsx',
    '.doc',
    '.ppt',
    '.xls',
    '.md',
    '.xml',
    '.docm',
    '.odt',
    '.csv',
    '.pptm',
    '.ppsm',
]


export const addIconPosition=[
    {
        title:'左侧',
        value:'left'
    },
    {
        title:'右侧',
        value:'right'
    },
    {
        title:'底部',
        value:'foot'
    }
]
