<template>
    <div @click="test" class="h-full w-full">
        123456
    </div>
  </template>
  
  <script>
//   import { mapWritableState } from "pinia";
  import { mapWritableState, mapActions } from 'pinia'
//   import { aiStore } from "../../store/ai";
  import { getStreamData } from "../AIAssistant/chat/main/api";
  import { message } from "ant-design-vue";
  
//   import aiStore from "../../store/ai";
  export default {
    data() {
      return {
        list: [],
        selIndex: 0,
        n:'',
        // 图片格式
        pictureFormat: ['png', 'jpeg', 'jpg', 'gif', 'psd', 'bmp', 'fpx', 'tiff', 'dxf', 'eps', 'svg', 'cdr', 'pcx', 'emf', 'wmf', 'swf', 'exif', 'pdf', 'cgm', 'raw', 'lic', 'dng', 'raf'],
        // 音视频格式
        audioFormat: ['cda', 'wav', 'mp3', 'aif', 'aiff', 'mid', 'wma', 'ra', 'vqf', 'ape', 'wmv', 'asf', 'asx', 'rm', 'rmvb', 'mpg', 'mpeg', 'mpe', '3gp', 'avi', 'mov', 'ram', 'swf', 'flv', 'mp4', 'ram', 'vob'],
      };
    },
    computed: {
    },
    components: {
        //   Main,
    },
    methods: {
        // ...mapActions(aiStore, ["isFull"]),
        // 直接分类可能会失效 需要先将 文件夹 exe文件区分开来 
        async test(){
            const desktopApps = await ipc.sendSync('getDeskApps')


            // 文件夹
            let folderList = []
            // 图片
            let pictureList = []
            // 音视频
            let audioList = []
            // 其他文件
            let otherList = []

            // exe
            let exeList = []
            let exeStr = '['

            desktopApps.forEach((item, index) => {
                if(item.ext == ''){
                    // 分离文件夹
                    folderList.push(item)
                }else if(item.ext == '.exe'){
                    // 分离exe文件
                    if(index){
                        exeStr = exeStr + `{"name":"${item.name}","index":${index}},`
                    }
                }else{
                    // 判断图片
                    if(this.pictureFormat.includes(item.ext.slice(1))){
                        pictureList.push(item)
                    }
                    // 判断音视频
                    else if(this.audioFormat.includes(item.ext.slice(1))){
                        audioList.push(item)
                    }else{
                        otherList.push(item)
                    }
                }
            });
            exeStr += ']'
            // 游戏、常用程序
            await this.processGPTResults([{
                role: 'user',
                content:`这些是电脑桌面图标的名称，请从效率辅助角度下，将以下数据转换成数组对象之后， ${exeStr} 这些文件根据name属性分成游戏、常用程序两个分类数组，对象名使用"game"和"programs",然后以一个对象包裹着数组的形式将两个数组一起返回，不要带分析过程，不要有多余文字说明，直接返回结果`
            }]).then(res=>{
                let tmp = JSON.parse(res)
                // console.log('json22', tmp);

                tmp.file = folderList
                tmp.picture = pictureList
                tmp.audio = audioList
                tmp.other = otherList

                // 分析出来的结果 接下来需要将icon和 path 放进去
                console.log('结果tmp', tmp);

                // 处理常用程序 和 游戏 的数据 
                tmp.game?.forEach(i=>{
                    i.icon = desktopApps[i.index].icon
                    i.path = desktopApps[i.index].path
                    i.ext = desktopApps[i.index].ext
                })
                tmp.programs?.forEach(i=>{
                    i.icon = desktopApps[i.index].icon
                    i.path = desktopApps[i.index].path
                    i.ext = desktopApps[i.index].ext
                })
                
                console.log('结果tmp', tmp);
            })
        },

        async processGPTResults(arr) {
            // 获取聊天机器人的回复
            for await (const result of getStreamData(arr)) {
                if (result.value) {
                    message.error(result.value.error.message);
                    return;
                }
                this.n = this.n +  result.content
            }
            return this.n
        },
    },
  };
  </script>
  
  <style lang="scss" scoped>

  </style>
  