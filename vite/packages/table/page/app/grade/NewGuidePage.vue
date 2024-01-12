  <template>
    <div class="fixed overflow-hidden modal-center xt-modal tran"
      :class="popState?'pop':step==4?'theme':'Popup' "
      style="">
      <div v-if="!popState" class="h-full">
        <!-- 顶部按钮 -->
        <div v-if="step!==0" @click="prevStep" class="absolute ml-4 top-icon no-drag">
            <MyIcon icon="fluent:chevron-left-16-filled"  width="20" height="20"/>
        </div>
        <div @click="themeSwitch" class="absolute mr-4 top-icon no-drag" style="right:0;">
            <MyIcon icon="fluent:weather-moon-16-regular"  width="20" height="20"/>
        </div>

        <!-- 选择偏好 -->
        <div v-if="step==0" class="w-full h-full ">
          <div v-if="!loading" style="padding-top:80px">
          <!-- <div v-if="false"> -->
            <div class="text-center font-16 xt-text ">定制你的桌面</div>
            <div class="mt-3 text-center xt-text-2 font-16 text-hidden">选择你的使用偏好，我们将为你添加推荐的数据，支持选择多个偏好。</div>
            <a-row :gutter="20" class="flex justify-center mt-6">
              <a-col v-for="item in deskType">
                <div :class="{'active':deskTypeObj[item.key]}"
                class="px-4 pt-5 setting-panel pointer"
                @click="setDeskType(item.key)"
                >
                  <div class="title">
                    <MyIcon :icon="item.icon" width="56" height="56" />
                    <div class="mt-2">{{ item.title }}</div>
                  </div>
                  <div class="mt-2 content">{{ item.content }}</div>
                </div>
              </a-col>
            </a-row>
          </div>
          <!-- 加载过程 -->
          <div class="flex items-center justify-center w-full h-full" v-else>
            <div class="">
              <div class="text-center font-16 xt-text">智能推荐进行中，稍等一会儿，马上就好~</div>
              <div class="mt-6" style="width:360px">
                <a-progress :percent="time" :show-info="false" />
              </div>
            </div>
          </div>
        </div>

        <!-- 导入桌面图标 -->
        <div v-else-if="step == 1">
          <div class="pt-6 text-center font-16 xt-text">导入你的桌面图标</div>
          <div class="text-center font-16 xt-text-2" style="width:704px;margin:16px auto 0;">我们帮你整理了桌面图标，应用程序类图标我们会帮你整理到导航栏，文件类型图标会整理到桌面，后续你也可以随时将需要快速访问的程序或文件拖放到工作台桌面和导航栏。</div>
          <div class="flex flex-wrap mt-4 overflow-hidden overflow-y-auto xt-scrollbar" style="height: 400px;padding-left:19px;" >
            <div v-for="(item, index) in appList" :key="index" class="pt-2 span-list xt-bg-2 "
              :class="index>2?'mt-3':'',index%3!=0?'ml-3':''">
              <!-- 标题 -->
              <div class="h-8 px-3 leading-8 xt-text-2 font-14">{{ item.name }} ( {{ item.list?.length }} )
                <div class="flex items-center float-right">
                  <MyIcon class="pointer" @click="item.type = 'rows'" v-if="item.type == 'columns'" icon="fluent:apps-list-detail-24-regular" width="20" height="20" />
                  <MyIcon class="pointer" @click="item.type = 'columns'" v-else icon="fluent:grid-20-regular" width="20" height="20" />
                  <div class="flex items-center justify-center w-8 h-8 ml-2 rounded-lg xt-bg">
                    <a-checkbox v-model:checked="item.isCheck"></a-checkbox>
                  </div>
                </div>
              </div>
              <!-- 列展示 -->
              <div v-if="item.type == 'columns'" class="px-1 mt-1 overflow-hidden overflow-y-auto xt-scrollbar" style="height:180px;">
                <div v-for="app in item.list" class="flex items-center px-2 list-rows xt-text" >
                  <a-avatar shape="square" :size="32" :src="app.icon" class="flex-none"></a-avatar>
                  <div class="ml-3 text-hidden">{{ app.name }}</div>
                </div>
              </div>
              <!-- 行展示 -->
              <div v-else class="flex flex-wrap px-2 mt-1 overflow-hidden overflow-y-auto xt-scrollbar justify-space" style="height:194px;">
                <div v-for="(app, key) in item.list" class="flex flex-col items-center text-center list-columns xt-text"
                :class="key%3!=0?'ml-1':'', key>2?'mt-2':''"
                >
                  <a-avatar shape="square" :size="40" :src="app.icon" class="flex-none "></a-avatar>
                  <div style="width:60px;" class="mt-1 text-hidden">{{ app.name }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>


        <!-- 导入小组件 -->
        <div v-else-if="step == 2">
          <div class="pt-6 text-center font-16 xt-text" >添加推荐小组件</div>
          <div class="text-center font-16 xt-text-2" style="width:704px;margin:16px auto 0;">根据你选择偏好，我们为你推荐了以下小组件。你可以稍后添加更多其他的小组件。</div>
          <div class="flex flex-wrap mt-4 overflow-hidden overflow-y-auto xt-scrollbar" style="height: 400px;padding-left:16px;" >
            <div v-for="(item, index) in cardList" :key="index" class="flex rounded-lg card-list xt-bg-2"
            :class="index%2!=0?'ml-3':'', index>1?'mt-3':''"
            style="">
              <div class="relative flex items-center flex-shrink-0 h-full overflow-hidden rounded-l-lg xt-bg-m card-left" style="">

                <div class="flex tran" :style="{transform: `translateX(${-180*item.imgIndex}px)`}">
                  <div v-for="img in item.option" class="flex justify-center flex-shrink-0" style="width:180px;">
                    <img :style="{zoom:`${img.zoom}%`}" :src="`https://a.apps.vip/cards/${img.imgName}.png`" />
                  </div>
                </div>
                <!-- 图片圆点 -->
                <div class="absolute flex bottom-3 pointer left-1/2" v-if="item.option.length>1" :style="{transform: `translateX(${-6*item.option?.length}px)`}">
                  <div class="circle xt-enable-bg" v-for="(cir, cle) in item.option" @click="item.imgIndex = cle"
                   :class="cle==item.imgIndex?'circle-active':'', cle>0?'ml-2':''"
                  ></div>
                </div>
              </div>

              <div class="w-full px-3 pt-3 pointer" @click="item.isCheck = !item.isCheck">
                <div class="flex items-center justify-between w-full">
                  <div class="font-18 xt-text text-hidden">{{ item.cname }}</div>
                  <div class="flex items-center justify-center w-8 h-8 ml-2 rounded-lg xt-bg">
                    <a-checkbox v-model:checked="item.isCheck"></a-checkbox>
                  </div>
                </div>

                <div class="mt-2 font-16 xt-text-2 text-hidden-2">{{ item.detail }}</div>
                <div class="mt-2 ">
                  <span class="rounded-md font-14 xt-text-2 xt-enable-bg"
                  :class="n>0?'ml-1':''" style="padding:4px 8px;"
                  v-for="(key, n) in item.sizes.slice(0, 2)">{{ key }}</span>
                </div>
                <div class="flex items-center mt-4 xt-text-2">
                  <MyIcon icon="fluent:arrow-download-20-filled" width="16" height="16" />
                  <div class="ml-1">{{ item.download }}</div>
                </div>

              </div>
            </div>
          </div>
        </div>

        <!-- 导入导航栏 -->
        <div v-else-if="step == 3">
          <div class="pt-6 text-center font-16 xt-text" >添加导航图标</div>
          <div class="text-center font-16 xt-text-2" style="width:704px;margin:16px auto 0;">根据你选择偏好，我们为你推荐了以下图标。你可以稍后添加更多其他的图标。</div>
          <div class="flex flex-wrap content-start mt-4 overflow-hidden overflow-y-auto xt-scrollbar" style="height: 400px;padding-left:19px;" >
            <div  class="relative flex flex-col items-center pt-4 rounded-lg nav-list xt-bg-2 pointer" v-for="(item, index) in navList"
            :class="index%4!=0?'ml-4':'ml-10',index>3?'mt-4':'', index==0?'disabled':''" @click="changeNavList(item, index)">
              <div class="absolute top-1.5 right-1.5 w-8 h-8 rounded-lg xt-bg flex justify-center items-center">
                <a-checkbox :disabled="index==0" v-model:checked="item.isCheck"></a-checkbox>
              </div>
              <a-avatar class="flex-none" shape="square" :size="64" :src="item.icon"></a-avatar>
              <div class="w-full mt-3 text-center font-16 xt-text text-hidden">{{ item.name }}</div>
              <div class="mt-2 font-14 xt-text-2">{{ item.type=='systemApp'?'系统功能':item.type=='tableApp'?'应用程序':'文件夹' }}</div>
            </div>
          </div>
        </div>

        <!-- 导入导航栏 -->
        <div v-else-if="step == 4">
          <div class="pt-6 text-center font-16 xt-text" >最后一步啦，定制主题 ~</div>
          <div class="px-4">

            <div class="p-4 pb-1 mt-2 xt-bg-2 rounded-xl">
              <xt-option-info title="主题色" />
              <xt-option-color :isLinear="false"  v-model:color="themeColor" :colorNum="5"  />
            </div>
  
            <div class="p-4 pb-1 mt-3 xt-bg-2 rounded-xl "><xt-option-info
              title="桌面壁纸"
              info="选择喜欢的图片作为工作台桌面壁纸。"
            />

              <xt-button w="200" h="112" class="relative mb-3 xt-bg-m"  style="border-radius: 6px"  @click="openPaperModal" >
                <div class="absolute top-0 left-0 w-full h-full rounded-md">
                  <img :src="backgroundImage.path" class="object-cover w-full h-full rounded-md"/>
                </div>
              </xt-button>
              <!-- <hr /> -->
              <xt-option-info
                title="桌面壁纸模糊度"
                info="调节桌面壁纸的模糊程度。"
                icon="fluent:arrow-clockwise-16-regular"
                @onIconClick="backgroundSettings.backGroundImgBlur = 0"
              />
              <xt-option-slider v-model:slider="backgroundSettings.backGroundImgBlur" :min="0" :max="100" />
            </div>
          </div>
        </div>

        <!-- 按钮 -->
        <div class="flex justify-between w-full px-3" style="position: absolute;bottom: 12px;">
          <div class="float-left">
            <xt-button   class="float-left button-bottom" @click="preview"  style="width:113px !important;"  size="large">
                <div class="flex items-center ">
                  <MyIcon class="mr-1" icon="fluent:desktop-16-regular" width="20" height="20"/>
                  预览桌面
                </div>
              </xt-button>
          </div>
          <div class="flex" v-if="step==0 && !loading">
            <xt-button   class="ml-3 button-bottom" @click="nextStep"   size="large" >暂不分析</xt-button>
              <xt-button   class="ml-3 button-bottom" @click="analysis"   size="large" type="theme">开始分析</xt-button>
          </div>
          <div class="flex" v-if="step==1">
              <xt-button   class="ml-3 button-bottom" @click="nextStep"   size="large" >暂不添加</xt-button>
              <xt-button   class="ml-3 button-bottom" @click="addFolder"   size="large" type="theme">确定添加({{ folderNum }})</xt-button>
            </div>

            <div class="flex" v-if="step==2">
              <xt-button   class="ml-3 button-bottom" @click="nextStep"   size="large" >暂不添加</xt-button>
              <xt-button   class="ml-3 button-bottom" @click="addDeskCard"   size="large" type="theme">确定添加</xt-button>
            </div>
            <div class="flex" v-if="step==3">
              <xt-button   class="ml-3 button-bottom" @click="nextStep"   size="large" >暂不添加</xt-button>
              <xt-button   class="ml-3 button-bottom" @click="addNavList"   size="large" type="theme">确定添加</xt-button>
            </div>
            <div class="flex" v-if="step==4">
              <xt-button   class="ml-3 button-bottom" @click="close"   size="large" type="theme">Go ~</xt-button>
            </div>
        </div>
      </div>

      <div v-else>
        <div style="height:60px;width:200px" class="flex items-center justify-between px-4 xt-text font-16 pointer" @click="popState = flase">
          定制桌面
          <div class="flex items-center justify-center w-8 h-8 rounded-lg xt-bg-2">
            <MyIcon icon="fluent:full-screen-maximize-16-filled" width="20" height="20" />
          </div>
        </div>

      </div>

      <GalleryModal ref="paperModal" />

    </div>
  </template>

  <script>
    import { mapWritableState, mapActions } from 'pinia';
    import {appStore} from '../../../store';
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
    import { defaultData, defaultFolderData } from '../../../apps/folder/src/components/options';
    import { nanoid } from 'nanoid'
    import { NavList } from '../card/navList'
    import { navStore } from '../../../store/nav';
    import { message } from "ant-design-vue";
    import { setBgColor, setSecondaryBgColor } from "../../../components/card/hooks/styleSwitch/setStyle";
    import GalleryModal from "../../../components/paperModal/GalleryModal.vue";
    
    export default {
      components:{
        MyIcon,
        GalleryModal,
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
                  key: 'current',
                  icon: 'fluent-emoji:dotted-six-pointed-star',
              },
          ],
          deskTypeObj: {
              assist: false,
              game: false,
              current: false,
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
              isCheck: false,
            },
            {
              name: '图片',
              type: 'rows',
              list: [],
              isCheck: false,
            },
            {
              name: '音视频',
              type: 'columns',
              list: [],
              isCheck: false,
            },
            {
              name: '其他文件',
              type: 'columns',
              list: [],
              isCheck: false,
            },
          ],
          // 预览模式
          popState: false,
          // 定制主题
          themeState: true,
          baseNavList: [],
          // 三种不同的分类组件
          assist: ['AIaides', 'clocks', 'countdownDay', 'weather', 'notes', 'customTimer', 'clock', 'todo', 'historyInfo', 'tomatoTimer', 'search', 'Courier', 'wallpaper', 'fish', 'eatToday', 'OilPrices'],
          assistList: [],
          game: ['gameAssis', 'strategy', 'AIaides', 'wallpaper', 'capture', 'notes', 'music', 'historyInfo', 'tomatoTimer', 'todo', 'games', 'GameEpic', 'myFriends', 'Audio', 'fish'],
          gameList: [],
          current: ['AIaides', 'clocks', 'countdownDay', 'weather', 'notes', 'customTimer', 'clock', 'todo', 'historyInfo', 'tomatoTimer', 'Courier', 'wallpaper', 'fish', 'Audio', 'eatToday', 'OilPrices', 'games', 'GameEpic', 'myFriends', 'music'],
          currentList: [],
          // 导航
          navList: [
            { type: 'systemApp', icon: '/logo/home.svg', name: '桌面主页', addNav: true,bg: '',isBg: '', ext: '', summary: '', mode: 'app', value: 'home', isCheck: true},
            { type: 'systemApp', icon: '/logo/app.svg', name: '应用中心', addNav: true,bg: '',isBg: '', ext: '', summary: '', mode: 'app', value: 'apps', isCheck: true},
            { type: 'folder', icon: '/logo/directive.svg', name: '快捷指令', bg: '',isBg: '', mode: 'app', value: 'folder', isCheck: true, children:[
              { type: 'systemApp', icon: '/logo/efficiency.svg', name: '效率助手', addNav: true,bg: '',isBg: '', ext: '', summary: '', mode: 'app', value: 'work'},
              { type: 'systemApp', icon: '/logo/directive.svg', name: '快捷指令', addNav: true,bg: '',isBg: '', ext: '', summary: '', mode: 'app', value: 'deck'},
              { type: 'systemApp', icon: '/logo/shortCut.svg', name: '快捷键', addNav: true,bg: '',isBg: '', ext: '', summary: '', mode: 'app', value: 'shortcutIndex'},
              { type: 'systemApp', icon: '/logo/ai.svg', name: 'AI助手', addNav: true,bg: '',isBg: '', ext: '', summary: '', mode: 'app', value: 'ai'},
              { type: 'systemApp', icon: '/logo/clipboard.svg', name: '剪切板', addNav: true,bg: '',isBg: '', ext: '', summary: '', mode: 'app', value: 'clipboard'},
              { type: 'systemApp', icon: '/logo/memorandum.svg', name: '备忘录', addNav: true,bg: '',isBg: '', ext: '', summary: '', mode: 'app', value: 'note'},
            ]},
            { type: 'systemApp', icon: '/logo/game.svg', name: '游戏助手', addNav: true,bg: '',isBg: '', ext: '', summary: '', mode: 'app', value: 'gameIndex', isCheck: true},
            { type: 'systemApp', icon: '/logo/task.svg', name: '任务中心', addNav: true,bg: '',isBg: '', ext: '', summary: '', mode: 'app', value: 'task', isCheck: true},
            { type: 'systemApp', icon: '/logo/commun.svg', name: '社区中心', addNav: true,bg: '',isBg: '', ext: '', summary: '', mode: 'app', value: 'commun', isCheck: true},
            { type: 'systemApp', icon: '/logo/fullscreen.svg', name: '全屏', addNav: true,bg: '',isBg: '', ext: '', summary: '', mode: 'app', value: 'fullscreen', isCheck: true},
            { type: 'systemApp', icon: '/logo/settings.svg', name: '设置中心', addNav: true,bg: '',isBg: '', ext: '', summary: '', mode: 'app', value: 'setting', isCheck: true},
          ],
          // 主题色
          themeColor: "",
          // 壁纸模糊
          imgBlur: 0,
          // 添加到导航栏的游戏常用程序列表
          exeNavList: [],

        }
      },
      props:['deskId'],
      computed:{
        ...mapWritableState(cardStore,['desks', 'addCard']),
        ...mapWritableState(appStore, ['backgroundSettings', 'backgroundImage']),
        ...mapWritableState(navStore, ['footNavigationList']),
        cardList(){
          if(this.deskTypeObj.current){
            return this.currentList
          }else if(this.deskTypeObj.assist && this.deskTypeObj.game){
            return this.currentList
          }else if(this.deskTypeObj.assist){
            return this.assistList
          }else if(this.deskTypeObj.game){
            return this.gameList
          }else{
            return this.currentList
          }
        },
        folderNum(){
          let n = 0
          this.appList.forEach(item=>{
            if (item.isCheck) {
              n++
            }
          })
          return n
        }

      },
      mounted(){
        let items = []
        NavList.map(li => {
          return items.push(...li.children)
        })
        //取得全部不重复的数组元素
        items = _.uniqBy(items, (li) => { return li.name })
        this.baseNavList = items

        // 效率辅助
        this.assist.forEach(i=>{
          this.baseNavList.forEach(item=>{
            if(i == item.name){
              this.assistList.push({
                ...item,
                download: Math.floor(Math.random() * 10000) + 1,
                isCheck: true,
                imgIndex: 0,
              })
            }
          })
        })
        // 游戏娱乐
        this.game.forEach(i=>{
          this.baseNavList.forEach(item=>{
            if(i == item.name){
              this.gameList.push({
                ...item,
                download: Math.floor(Math.random() * 10000) + 1,
                isCheck: true,
                imgIndex: 0,
              })
            }
          })
        })
        // 通用
        this.current.forEach(i=>{
          this.baseNavList.forEach(item=>{
            if(i == item.name){
              this.currentList.push({
                ...item,
                download: Math.floor(Math.random() * 10000) + 1,
                isCheck: true,
                imgIndex: 0,
              })
            }
          })
        })
      },

      watch: {
        themeColor(newV) {
          if (!newV) return;
          setBgColor(newV);
          setSecondaryBgColor(newV);
        },
      },
      methods:{
        // 触发打开壁纸弹窗
        openPaperModal () {
          this.$refs.paperModal.openGalleryModal()
        },
        // 调整类型
        setDeskType(type){
          console.log('type', type,  this.deskTypeObj[type]);
          this.deskTypeObj[type] = !this.deskTypeObj[type]
          if(this.deskTypeObj[type]){
            if(type == 'current'){
              this.deskTypeObj['game'] = false
              this.deskTypeObj['assist'] = false
            }else{
              this.deskTypeObj['current'] = false
            }
          }
        },

        changeNavList(item, index){
          if(index>0){
            item.isCheck = !item.isCheck
          }else{
            message.info("导航栏中至少包含一个桌面主页");
          }

        },
        themeSwitch(){
          this.styles = !this.styles
          setThemeSwitch(this.styles);
        },
        prevStep () {
          this.step--
        },
        nextStep () {
          this.step++
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
          this.getAiAnswer()
          this.timer = setInterval(()=>{
            this.time+=1
            if (this.time==99) {
              this.clear()
            }
          },100)



        },

        clear(){
          this.time = 0
          clearInterval(this.timer)
          this.timer = null
        },

        // 添加文件夹
        addFolder(){
          let folders = []
          const n = this.searchDeskIndex(this.deskId)

          this.appList.forEach((item, index)=>{
            const now = new Date().getTime()
            if(item.isCheck){
              let tmp = [];
              item.list?.forEach(i=>{
                tmp.push(   {
                  ...defaultData,
                  name:i.name + i.ext,
                  icon: i.icon,
                  value: i.path,
                  id: nanoid(6),
                  type: 'tableApp',
                })
              })

              let obj = {
                data:{},
                id: now + index * 5,
                name: 'folder',
                customData: {
                  ...defaultFolderData,
                  name: item.name,
                  layout: item.type,
                  list: [...tmp]
                }
              }
              folders.push(obj)
            }
          })
          folders.forEach((item,index)=>{
            this.addCard(item, this.desks[n]);
          })
          this.nextStep();

        },

        // 添加小组件
        addDeskCard(){
          const n = this.searchDeskIndex(this.deskId)

          this.cardList.forEach((item, index)=>{
            if(item.isCheck){
              const now = new Date().getTime() + index * 5
              this.addCard({
                customData: {},
                id: now,
                name: item.option[0]?.name
              },this.desks[n])
            }
          })
          this.nextStep();

        },

        // 添加导航栏
        addNavList(){
          let tmp = []
          console.log(this.navList);
          this.navList.forEach(item=>{
            if (item.isCheck) {
              tmp.push(item)
            }
          })
          console.log(tmp);
          this.footNavigationList = tmp
          
          this.nextStep()

        },

        // 遍历取桌面序号
        searchDeskIndex(id){
          this.desks.forEach((item, index)=>{
            if(item.id == id){
              return index
            }
          })
          return 0
        },

        // 预览桌面
        preview(){
          this.popState = true
        },
        // 预览桌面
        close(){
          this.$emit('closeShowGuide')
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
                  this.navList.push({ type: 'tableApp', icon: item.icon, name: item.name, addNav: true,bg: '',isBg: '', ext: item.ext, summary: '', mode: 'app', value: item.path, isCheck: false})

                  // { type: 'systemApp', icon: '/logo/settings.svg', name: '设置中心', addNav: true,bg: '',isBg: '', ext: '', summary: '', mode: 'app', value: 'setting', isCheck: true},
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
                console.log('结果appList', this.appList);
                console.log('结果desks', this.desks);
            })
          },
          // "C:\Users\Administrator\AppData\Roaming\天天工作台-development\icons\2b0e338a45aa6536538939ed85a9caafaed1d24e.png"
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
        background: #212121;
        border: 1px solid var(--divider);
        box-shadow: 0px 0px 3px 0px rgba(0,0,0,0.03);
        box-shadow: 0px 0px 20px 0px rgba(0,0,0,0.1);
        box-shadow: 0px 0px 40px 0px rgba(0,0,0,0.2);
        border-radius: 12px 12px 12px 12px;
        z-index: 999;
    }

    // 桌面主体部分
    .Popup{
      width:800px;
      height:600px;
      top: 50%;
      left: 50%;
      transform: translateX(-400px) translateY(-300px);
    }


    // 右下角 预览桌面
    .pop{
      position: fixed;
      bottom: 80px ;
      right: 40px ;
      // display: none;
      width:200px;
      height:60px;
      // scale: 0.1;
    }

    // 右上角 定制主题
    .theme{
      width:400px;
      height:584px;
      position: fixed;
      top: 60px;
      right: 20px ;
    }




    .tran{
      transition: all 0.15s linear;
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
    .text-hidden-2{
      overflow: hidden;
      // white-space: nowrap;
      display:-webkit-box;
      -webkit-box-orient: vertical; /* 必须 */
      -webkit-line-clamp: 2; /* 限制显示的行数 */
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

    .card-list{
      width: 378px;
      height: 184px;
    }
    .card-list:hover{
      opacity: 0.8;
    }

    .card-left{
      width: 180px;
    }

    .circle{
      width: 8px;
      height: 8px;
      border-radius: 4px;
      opacity: 0.2;
    }

    .circle-active{
      opacity: 1;
    }

    .nav-list{
      width: 160px;
      height: 160px;
    }

    .nav-list:hover{
      opacity: 0.8;

    }

  </style>
