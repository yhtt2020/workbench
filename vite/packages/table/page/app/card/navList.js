export const navList = [
    {
        cname: "推荐",
        children: null,
    },
    {
        cname: "工具",
        children: [
            {
                name: "supervisory",
                cname: "系统性能监控",
                detail: "同步AIDA64数据，监控你的CPU、GPU、内存、网络等数据。",
                sizes: ["2*2", "2x4"],
                // option: [
                images: [
                    // {
                    //     name: "",
                    //     img: "",
                    //     size: [2, 2]
                    // },
                    "CPULineChart",
                    "CPUFourCard",
                    "SmallCPUCard",
                    "SmallGPUCard",
                ],
            },
            {
                name: "wallpaper",
                cname: "壁纸",
                detail: "发现新壁纸，浏览我收藏的图片壁纸。",
                sizes: ["2x2", "2x4"],
                images: ["middleWallpaper", "smallWallpaper"],
            },

            {
                name: 'notes',
                cname: "桌面便签",
                detail: "一个可自由修改内容，调整大小的桌面便签。",
                sizes: ["自定义大小"],
                images: ['notes'],
            },
            {
                cname: "单图标组件",
                detail: "单图标模式小组件，支持自由拖放和分组。",
                sizes: ["1x1"],
                images: []
                // 未完成
            },
            {
                name: "weather",
                cname: "天气",
                detail: "查看某地当前的天气状况和未来的天气预报。",
                sizes: ["2x2"],
                images: ["weather"]

            },
            {
                cname: "股票",
                detail: "查看关注的股票报价并跟踪其表现。",
                sizes: ["2x2", "4x4"],
                images: []
                // 未完成
            },
            {
                name: 'Audio',
                cname: "音频",
                detail: "快速调整音量大小，音频设备选择，一键开启静音模式。",
                sizes: ["2x4"],
                images: ['audio', 'voice']
            },
            {
                name: 'capture',
                cname: '捕获',
                detail: "一键截屏、开启屏幕录制，录屏状态下控制麦克风的收录状态。",
                sizes: ["2x2", "4x4"],
                images: ['capture', 'CaptureNewCard']
            },

        ],
    },
    {
        cname: "效率",
        children: [
            {
                name: 'clocks',
                cname: "时钟",
                detail: "桌面时钟，支持多种时钟样式选择，一键进入全屏桌搭模式。",
                sizes: ["自定义大小"],
                images: ['clocks'],
            },
            {
                name: "timer",
                cname: "番茄钟",
                detail: "快速开启番茄钟时刻，记录每天专注成果。",
                sizes: ["2x2"],
                images: ["timer"],
            },
            {
                cname: "待办",
                detail: "同步你的待办助手数据，展现在工作台桌面。",
                sizes: ["2x2", "2x4"],
                images: []
            },
            {
                name: "countdownDay",
                cname: "倒数日",
                detail: "记录关于你的纪念日、考试日等重要的日子。",
                sizes: ["2x2", "2x4"],
                images: ["countdownDay"],
            },

            {
                name: "customTimer",
                cname: "日历",
                detail: "追踪当月日期，查看临近节日和假期。",
                sizes: ["2x4"],
                images: ["customTimer"],
            },
            {
                name: "clock",
                icon: "naozhong",
                cname: "闹钟",
                detail: "快速设置闹钟，计时器；在工作台锁屏上同步显示闹钟信息。",
                sizes: ["2x2"],
                images: ["clock"],
                size: ["1x1"],
            },
        ],
    },
    { cname: "系统", children: null },
    {
        cname: "游戏",
        children: [
            {
                name: "games",
                cname: "Steam特惠",
                detail: "今日特惠游戏，快快加入你的购物车和愿望单。",
                sizes: ["2x4"],
                images: ["GamesDiscount"],
            },
            {
                name: "gameAssis",
                cname: "我的游戏",
                detail: "Steam游戏、本地其他游戏库展示，一键快速启动游戏。",
                sizes: ["2x2", "2x4"],
                images: ["MyGameSmall"]
            },
            {
                name: "games",
                cname: "Epic喜加一",
                detail: "查看本周Epic免费游戏，下周神秘游戏预告。",
                sizes: ["2x4"],
                images: ["GameEpic"]

            },
            {
                name: "gameAssis",
                cname: "Steam好友",
                detail: "同步展示你的Steam好友在线状态。",
                sizes: ["2x2"],
                images: ["SteamFriends"]
            },
        ],
    },
    {
        cname: "娱乐",
        children: [
            {
                name: "music",
                cname: "网易云音乐",
                detail: "基于网易云音乐网页版功能，支持基础播放控制功能。",
                sizes: ["2x2"],
                images: ["music"],
            },
            {
                name: "fish",
                cname: "木鱼",
                detail: "休闲减压神器，每天敲一敲，积攒功德。",
                sizes: ["2x2"],
                images: ["fish"],
            },
            {
                name: 'singleDoubanFilm',
                cname: "正在热映",
                detail: "电影荒了？来看看近期正在上映的热门电影。",
                sizes: ["2x2", "2x4"],
                images: ['singleDoubanFilm', 'largeSingleDoubanFilm'],
            },
        ],
    },
    {
        cname: "社区",
        children: [
            {
                name: 'signIn',
                cname: "签到",
                detail: "每日签到赢取积分，冲榜大赛即将上线。",
                sizes: ["2x4"],
                images: ['signIn'],

            },
        ],
    },
    {
        cname: "创意",
        children: [
            {
                name: "customAssembly",
                cname: "自定义图片组件",
                detail: "使用喜爱的图片作为小组件，支持自由设置点击图片的快捷方式。",
                sizes: ["自定义大小"],
                images: ["customAssembly"]
            },
            {
                name: 'remote',
                cname: "外部小组件",
                detail: "添加一个链接到外部网页的小组件，可以实现各种自定义功能",
                sizes: ["自定义大小"],
                images: ['Remote']
            },
        ],
    },
    { cname: "施工中", children: null },
];
