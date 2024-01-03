  <template>
    <div class="fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 modal-center xt-modal" style="">
      <!-- 顶部按钮 -->
      <div v-if="step!==0" @click="prevStep" class="top-icon no-drag absolute ml-4">
          <MyIcon icon="fluent:chevron-left-16-filled"  width="20" height="20"/>
      </div>
      <div @click="themeSwitch" class="top-icon no-drag absolute mr-4" style="right:0;">
          <MyIcon icon="fluent:weather-moon-16-regular"  width="20" height="20"/>
      </div>

      <!-- 选择偏好 -->
      <div v-if="step==0" class="h-full w-full ">
        <div v-if="!loading">
        <!-- <div v-if="false"> -->
          <div class="text-center font-16 xt-text " style="margin-top:80px;">定制你的桌面</div>
          <div class="text-center xt-text-2 font-16 mt-3">选择你的使用偏好，我们将为你添加推荐的数据，支持选择多个偏好。</div>
          <a-row :gutter="20" class="flex justify-center mt-6">
            <a-col v-for="item in deskType">
              <div :class="{'active':deskTypeObj[item.key] == true}" 
                class="setting-panel pointer px-4 pt-5"
                @click="deskTypeObj[item.key] = !deskTypeObj[item.key]"
                >
                <div class="title">
                  <MyIcon :icon="item.icon" width="56" height="56" />
                  <div class="mt-2">{{ item.title }}</div>
                </div>
                <div class="content mt-2">{{ item.content }}</div>
              </div>
            </a-col>
          </a-row>
        </div>
        <!-- 加载过程 -->
        <div class="flex justify-center items-center h-full w-full" v-else>
          <div class="">
            <div class="font-16 text-center xt-text">智能推荐进行中，稍一会儿，马上就好~</div>
            <div class="mt-6" style="width:360px">
              <a-progress :percent="time" :show-info="false" />
            </div>
          </div>
        </div>
      </div>

      <!-- 导入桌面图标 -->
      <div v-else-if="step == 1">
        <div class="font-16 xt-text text-center mt-6">导入你的桌面图标</div>
        <div class="font-16 text-center xt-text-2" style="width:704px;margin: 16px auto 0;">我们帮你整理了桌面图标，你可以选择添加到桌面，或者后续将需要快速访问的程序或文件拖放到工作台桌面和导航栏。</div>
        <div class="xt-scrollbar overflow-hidden overflow-y-auto flex flex-wrap px-4 justify-between " style="height: 400px;" >
          <div v-for="(item, index) in appList" :key="index" class="span-list xt-bg-2 px-3 pt-3 " >
            <!-- 标题 -->
            <div class="xt-text-2 font-14 h-8 leading-8">{{ item.name }} ( {{ item.list.length }} )
              <div class="float-right flex items-center">
                <MyIcon class="pointer" @click="item.type = 'rows'" v-if="item.type == 'columns'" icon="fluent:apps-list-detail-24-regular" width="20" height="20" />
                <MyIcon class="pointer" @click="item.type = 'columns'" v-else icon="fluent:grid-20-regular" width="20" height="20" />
                <div class="ml-2 w-8 h-8 rounded-lg xt-bg flex justify-center items-center">
                  <a-checkbox v-model:checked="item.isCheck"></a-checkbox>
                </div>
              </div>
            </div>
            <!-- 内容列表 -->
            <!-- {{ item.list }} -->
            <div v-if="item.type == 'columns'" class="xt-scrollbar overflow-hidden overflow-y-auto mt-1" style="height:180px;">
              <div v-for="app in item.list" class="flex items-center list-rows px-2 xt-text" >
                <a-avatar shape="square" :size="32" :src="app.icon" class="flex-none"></a-avatar>
                <div class="text-hidden ml-3">{{ app.name }}</div>
              </div>
            </div>
            <div v-else class="xt-scrollbar overflow-hidden overflow-y-auto mt-1 flex flex-wrap justify-space" style="height:180px;">
              <div v-for="app in item.list" class="flex list-columns xt-text flex-col text-center items-center" >
                <a-avatar shape="square" :size="40" :src="app.icon" class="flex-none "></a-avatar>
                <div style="width:60px;" class="text-hidden mt-1">{{ app.name }}</div>
              </div>
            </div>

          </div>
        </div>

        

      </div>


        
      <!-- 按钮 -->
      <div class="flex" style="width:100%;justify-content: flex-end;position: absolute;right: 12px;bottom: 12px;">
            
            <div class="flex" v-if="step==0">
                <xt-button   class="button-bottom ml-3" @click="analysis"   size="large" type="theme">开始分析</xt-button>
            </div>
            <div class="flex" v-else>
                <xt-button   class="button-bottom ml-3" @click="nextStep"   size="large" type="theme">下一步</xt-button>
            </div>
      </div>
    </div>
  </template>
  
  <script>
  import { mapWritableState,mapActions } from 'pinia';
  import {appStore} from '../../../store'
  import { navStore } from '../../../store/nav';
  import { cardStore } from '../../../store/card';
  import {defaultAvatar} from '../../../js/common/teamAvatar'
  import {taskStore} from '../../../apps/task/store'
  // import GradeNotice from './GradeNotice.vue'
  import {
    guideData,workTheme,teamData,modeData,
    deskTemplate,diyPanel,gamePanel,workPanel,mergePanel,modeImg
  } from '../../../js/data/guideData'
  import cache from '../../../components/card/hooks/cache';
  import HorizontalPanel from '../../../components/HorizontalPanel.vue'
  import _ from 'lodash-es'
  import { Icon as MyIcon, listIcons } from '@iconify/vue';
  import { homeStore } from '../../../store/home'
  // 修改浅色模式
  import { setThemeSwitch } from "../../../components/card/hooks/themeSwitch";
  // ai分析
  import { getStreamData } from "../../AIAssistant/chat/main/api";
  import { message } from "ant-design-vue";
  
  export default {
    components:{
      MyIcon,
    },
    data(){
      return{
        deskType: [
            {
                title: '效率辅助',
                content: '为你推荐和效率辅助相关的数据。',
                key: 'assist',
                icon: 'fluent-emoji:rocket',
            },
            {
                title: '游戏娱乐', 
                content: '为你推荐和游戏娱乐相关的数据。',
                key: 'game',
                icon: 'fluent-emoji:joystick',
            },
            {
                title: '其他',
                content: '不指定场景，为你添加更加。',
                key: 'other',
                icon: 'fluent-emoji:dotted-six-pointed-star',
            },
        ],
        deskTypeObj: {
            assist: false,
            game: false,
            other: false,
        },
        step: 0,
        content:'',
        // 图片格式
        pictureFormat: ['png', 'jpeg', 'jpg', 'gif', 'psd', 'bmp', 'fpx', 'tiff', 'dxf', 'eps', 'svg', 'cdr', 'pcx', 'emf', 'wmf', 'swf', 'exif', 'pdf', 'cgm', 'raw', 'lic', 'dng', 'raf'],
        // 音视频格式
        audioFormat: ['cda', 'wav', 'mp3', 'aif', 'aiff', 'mid', 'wma', 'ra', 'vqf', 'ape', 'wmv', 'asf', 'asx', 'rm', 'rmvb', 'mpg', 'mpeg', 'mpe', '3gp', 'avi', 'mov', 'ram', 'swf', 'flv', 'mp4', 'ram', 'vob'],
        loading: false,
        timer: null,
        time: 0,
        // 转换好的数据
        appList: [
          {
            name: '游戏',
            type: 'rows',
            list: [],
            isCheck: true,
          },
          {
            name: '常用程序',
            type: 'rows',
            list: [],
            isCheck: true,
          },
          {
            name: '文件夹',
            type: 'columns',
            list: [],
            isCheck: true,
          },
          {
            name: '图片',
            type: 'rows',
            list: [],
            isCheck: true,
          },
          {
            name: '音视频',
            type: 'columns',
            list: [],
            isCheck: true,
          },
          {
            name: '其他文件',
            type: 'columns',
            list: [],
            isCheck: true,
          },
        ],
      }
    },
    computed:{

    },
    mounted(){

    },
    methods:{
      themeSwitch(){
        this.styles = !this.styles
        setThemeSwitch(this.styles);
      },
      prevStep () {
        if (this.mod === 'bootstrap' && this.step == 3) {
          this.step = this.step - 3
        } else if(this.step == 3){
          this.step-=2
        }  else {
          this.step--
        }
      },
      nextStep () {
        if (this.mod === 'bootstrap' && this.step == 0) {
          this.step = this.step + 3
        } else if(this.step == 1){
          this.step+=2
        } else {
          this.step++
        }
      },

      finish () {
        this.deskInit = true
        this.finishWizard()
        this.$router.replace({ name: 'home' })
        //
      },

      async analysis(){
        // 请求开始
        // 开始加载过程
        this.loading = true
        this.timer = setInterval(()=>{
          this.time+=1
          if (this.time==99) {
            this.clear()
          }
        },100)


        this.getAiAnswer()
      },

      clear(){
        this.time = 0
        clearInterval(this.timer)
        this.timer = null
      },
      
      // 直接分类可能会失效 需要先将 文件夹 exe文件区分开来 
      async getAiAnswer(){
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
              // console.log('结果tmp', tmp);

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

              this.appList[0].list = tmp.game
              this.appList[1].list = tmp.programs
              this.appList[2].list = tmp.file
              this.appList[3].list = tmp.picture
              this.appList[4].list = tmp.audio
              this.appList[5].list = tmp.other

              // 请求结束 进入下一步
              this.loading = false
              this.step = 1
              this.clear()
              // console.log('结果tmp', tmp);
          })
        },

        async processGPTResults(arr) {
            // 获取聊天机器人的回复
            for await (const result of getStreamData(arr)) {
                if (result.value) {
                    message.error(result.value.error.message);
                    return;
                }
                this.content = this.content +  result.content
            }
            return this.content
        },
      
    },
  }
  </script>
  
  <style lang="scss" scoped>

    .border-1{
        border: 1px solid red;
    }
    .modal-center{
        width:800px;
        height:600px;background: #212121;
        border: 1px solid var(--divider);
        box-shadow: 0px 0px 3px 0px rgba(0,0,0,0.03);
        box-shadow: 0px 0px 20px 0px rgba(0,0,0,0.1);
        box-shadow: 0px 0px 40px 0px rgba(0,0,0,0.2);
        border-radius: 12px 12px 12px 12px;
        z-index: 999;
    }
    .panel {
        border: 2px solid transparent;
        border-radius: 0.5em;
        background: var(--secondary-bg);
        height:240px;
        width:240px;
    }
    .setting-panel {
        border: 2px solid transparent;
        border-radius: 0.5em;
        background: var(--secondary-bg);
        height:200px;
        width:200px;
    }

    .active {
        border: 2px solid #0a84ff;
        background: rgba(80,139,254,0.20);
    }

    .title {
        font-size: 18px;
        text-align: center;
        color: var(--primary-text);
    }

    .content{
        font-size: 16px;
        color: var(--secondary-text);
        text-align: center;
    }

    .top-icon{
        width: 32px;
        height: 32px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: var(--secondary-bg);
        border-radius: 8px;
        color: var(--secondary-text);
        cursor: pointer;
        margin-top: 16px;
    }
    .button-bottom{
      width: 95px !important;
      height: 40px !important;
      border-radius: 10px !important;
    }

    .span-list{
      width: 245px;
      height: 240px;
      border-radius: 10px;

    }


    // 滚动条配置
    ::-webkit-scrollbar-thumb {
        background-color: #ccc; /* 滚动条颜色 */
        border-radius: 6px; /* 滚动条圆角 */
    }
    
    ::-webkit-scrollbar-thumb:hover {
        background-color: #999; /* 悬停时滚动条颜色 */
    }

    ::-webkit-scrollbar-track {
        border-radius: 6px; /* 轨道圆角 */
    }

    .text-hidden{
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .list-rows{
      height: 44px;
    }
    .list-rows:not(:nth-last-of-type()){
      margin-bottom: 4px;
    }
    
    .list-columns{
      height: 72px;
      width: 72px;
    }
    .list-rows:not(:nth-last-of-type()){
      margin-bottom: 2px;
    }
    
    
  </style>
  