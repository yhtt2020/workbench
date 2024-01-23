export const NavListTmp = [
    { type: 'systemApp', icon: '/logo/home.svg', name: '桌面主页', addNav: true, bg: '', isBg: '', ext: '', summary: '', mode: 'app', value: 'home', isCheck: true, id: '1705024806' },
    { type: 'systemApp', icon: '/logo/app.svg', name: '应用中心', addNav: true, bg: '', isBg: '', ext: '', summary: '', mode: 'app', value: 'apps', isCheck: true, id: '1705024807' },
    {
        type: 'folder', icon: '/logo/efficiency.svg', name: '效率助手', bg: '', isBg: '', mode: 'app', value: 'folder', isCheck: true, id: '1705024808', children: [
            { type: 'systemApp', icon: '/logo/efficiency.svg', name: '效率助手', addNav: true, bg: '', isBg: '', ext: '', summary: '', mode: 'app', value: 'work' },
            { type: 'systemApp', icon: '/logo/directive.svg', name: '快捷指令', addNav: true, bg: '', isBg: '', ext: '', summary: '', mode: 'app', value: 'deck' },
            { type: 'systemApp', icon: '/logo/shortCut.svg', name: '快捷键', addNav: true, bg: '', isBg: '', ext: '', summary: '', mode: 'app', value: 'shortcutIndex' },
            { type: 'systemApp', icon: '/logo/ai.svg', name: 'AI助手', addNav: true, bg: '', isBg: '', ext: '', summary: '', mode: 'app', value: 'ai' },
            { type: 'systemApp', icon: '/logo/clipboard.svg', name: '剪切板', addNav: true, bg: '', isBg: '', ext: '', summary: '', mode: 'app', value: 'clipboard' },
            { type: 'systemApp', icon: '/logo/memorandum.svg', name: '备忘录', addNav: true, bg: '', isBg: '', ext: '', summary: '', mode: 'app', value: 'note' },
        ]
    },
    { type: 'systemApp', icon: '/logo/game.svg', name: '游戏助手', addNav: true, bg: '', isBg: '', ext: '', summary: '', mode: 'app', value: 'gameIndex', isCheck: true, id: '1705024809' },
    { type: 'systemApp', icon: '/logo/task.svg', name: '任务中心', addNav: true, bg: '', isBg: '', ext: '', summary: '', mode: 'app', value: 'task', isCheck: true, id: '1705024810' },
    { type: 'systemApp', icon: '/logo/commun.svg', name: '社区中心', addNav: true, bg: '', isBg: '', ext: '', summary: '', mode: 'app', value: 'commun', isCheck: true, id: '1705024811' },
    { type: 'systemApp', icon: '/logo/fullscreen.svg', name: '全屏', addNav: true, bg: '', isBg: '', ext: '', summary: '', mode: 'app', value: 'fullscreen', isCheck: true, id: '1705024812' },
    { type: 'systemApp', icon: '/logo/settings.svg', name: '设置中心', addNav: true, bg: '', isBg: '', ext: '', summary: '', mode: 'app', value: 'setting', isCheck: true, id: '1705024813' },
]


export const GameDesk = {
    alias: "效率桌面",
    appNanoid: '',
    categoryId: '1',
    circle: '',
    cover: "",
    createTime: "2023-08-21 09:10:44",
    dataNanoid: "deskId",
    direction: 'h',
    goodSubType: '',
    goodType: "desk",
    id: 100,
    introduceText: '',
    isOnShelves: 1,
    isRemoved: 0,
    layoutSize: '{"width":1870,"height":892}',
    name: null,
    nanoid: "deskId",
    order: 1,
    salesType: 0,
    shareCode: null,
    sort: 1,
    summary: '111',
    support: 2,
    tags: "效率桌面",
    // template: "{'cards':[{'name':'clocks','id':1692330825905,'customData':{},'data':{}},{'name':'voice','id':1692330805293,'customData':{},'data':{}},{'name':'music','id':1692331037689,'customData':{},'data':{}},{'name':'SmallCPUCard','id':1692330848234,'customData':{},'data':{}},{'name':'weather','id':1692330818852,'customData':{},'data':{}},{'name':'HotSearch','id':1692331048852,'customData':{},'data':{}},{'name':'middleWallpaper','id':1692330289500,'customData':{},'data':{}},{'name':'customTimer','id':1692330856521,'customData':{},'data':{}},{'name':'eatToday','id':1692331021642,'customData':{},'data':{}},{'name':'Todo','id':1692331029233,'customData':{},'data':{}},{'name':'ManyFilm','id':1692331059038,'customData':{},'data':{}},{'name':'AggregateSearch','id':1692330988993,'customData':{},'data':{}},{'name':'Remote','id':1692331084843,'customData':{},'data':{}},{'name':'Remote','id':1692331225834,'customData':{},'data':{}}],'settings':{'cardZoom':115.92632719393283,'marginTop':0,'cardMargin':6.7194566683373855}}",
    template: '{"cards":[{"name":"TimerClock","id":1705971205206,"customData":{"isFull":false,"isState":true,"customSize":"2x2"},"data":{}},{"name":"AggregateSearch","id":1705971216198,"customData":{"sortType":"work","customSize":"2x2"},"data":{}},{"name":"notes","id":1705971265991,"customData":{"title":"桌面便签","background":"#57BF60","cardSize":"card","colors":"#ffffff","height":2,"width":1,"text":"","dragCardSize":"card","content":"","customSize":"2x4"},"_id":"note:1705971265991","updateTime":1705971265991,"createTime":1705971265991,"content":"","notes":"notes","isDelete":false,"deskName":"空白桌面","deskId":"pLar","data":{}},{"name":"AIaides","id":1705971276167,"customData":{"customSize":"2x2"},"data":{}},{"name":"countdownDay","id":1705971290975,"customData":{"customSize":"2x2","notRetain":true},"data":{}},{"name":"Todo","id":1705971303222,"customData":{"currentTodo":{"title":"个人","nanoid":"T00111"},"width":1,"height":2},"data":{}},{"name":"folder","id":1705971311447,"customData":{"name":"其他文件","icon":"https://a.apps.vip/icons/iconSelect/icon/folder.svg?color=#ffffff","list":[],"customSize":"2x2","lock":true,"layout":"rows","sort":"free","model":"custom","rules":[]},"data":{}},{"name":"folder","id":1705971312239,"customData":{"name":"图片","icon":"https://a.apps.vip/icons/iconSelect/icon/folder.svg?color=#ffffff","list":[],"customSize":"2x2","lock":true,"layout":"rows","sort":"free","model":"custom","rules":[]},"data":{}},{"name":"folder","id":1705971312963,"customData":{"name":"文件夹","icon":"https://a.apps.vip/icons/iconSelect/icon/folder.svg?color=#ffffff","list":[],"customSize":"2x2","lock":true,"layout":"rows","sort":"free","model":"custom","rules":[]},"data":{}},{"name":"folder","id":1705971319015,"customData":{"name":"音视频","icon":"https://a.apps.vip/icons/iconSelect/icon/folder.svg?color=#ffffff","list":[],"customSize":"2x2","lock":true,"layout":"rows","sort":"free","model":"custom","rules":[]},"data":{}}],"settings":{"cardZoom":115,"marginTop":0,"cardMargin":6}}',
    title: '效率桌面',
    uid: 998,
    updateTime: "2023-08-21 09:10:44",
    userInfo: {},



}

