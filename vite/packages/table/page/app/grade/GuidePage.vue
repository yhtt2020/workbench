<template>
  <div class="w-full h-full p-3 flex flex-col" style="background:var(--modal-bg);" v-if="isGradeNotice === false">
    <!-- 返回按钮 -->
    <div class="back-button mouse-click w-12 h-12 flex-none" @click="backSplash">
      <Icon icon="xiangzuo" style="font-size: 1.75em;"></Icon>
    </div>

    <!-- 引导步骤1 -->
    <template v-if="step === 1">
      <div class="flex items-center grow h-full mb-5 flex-col justify-center">
        <div class="main-head mb-1 flex items-center justify-center">
          <span>选择适合你的工作台模式</span>
        </div>
        <div class="subhead flex flex-col items-center min-height justify-start mb-12">
          <span>完成选择后，会内置对应模式的工作功能方案，你仍然可以在后续自定</span>
          <span>义修改各个功能和布局。</span>
        </div>
        <div class="flex items-center justify-center">
           <div v-for="(item,index) in guideData" :class="guideIndex === index ? 'active-guide-bg' : ''"
              @click="guideItem(item,index)"  
              class="mr-8 px-4 py-1 flex-col p-1 prev-bg pointer rounded-lg default-mode flex items-center justify-center"
            > 
              <div style="width: 100px ; height: 100px;" class="mb-0.5">
                <img style="width: 100%;height: 100%; object-fit: contain;" :src="'../../../../../public/img/state/'+ item.url " alt="" >
              </div>
              <div class="main-head mb-2">{{ item.title }}</div>
              <div class="subhead max-explain">
                {{ item.explain }}
              </div>
            </div>
        </div>
      </div>
    </template>

    <!-- 引导步骤2 -->
    <template v-else-if="step === 2">
      <div class="flex items-center h-full flex-col  justify-center">
        <div class="main-head mb-3">选择你的主题模式</div>
        <div class="subhead flex flex-col items-center  justify-center mb-12">
          <div>完成选择后，你仍然可以在后续自定义修改。</div>
        </div>
        <div class="flex items-center justify-center">
          <div v-for="(item,index) in workTheme"  @click="guideModeChange(index)"
          :class="{'active-guide-bg': guideModeIndex === index}"
          class="flex flex-col items-center px-28 py-8 default-mode pointer rounded-lg justify-center prev-bg mr-8">
            <div style="width: 100px;height: 100px;" class="mb-4">
              <img class="w-full h-full " :src="'../../../../../public/img/state/'+ item.url " alt="" >
            </div>
            <div class="main-head">{{ item.title }}</div>
          </div>
        </div>
      </div>
    </template>

    <!-- 引导步骤3 -->
    <template v-else-if="step === 3">
      <div class="flex flex-col mt-6 h-full items-center justify-center image-height mb-5">
        <span class="main-head min-height mb-3 flex items-center justify-center ">选择你需要的模式</span>
        <span class="subhead flex min-height  flex-col items-center justify-center mb-8">
          同步元社区互动功能，完成选择后，你仍然可以在后续自定义修改。
        </span>
        <div class="flex  w-full items-start pt-4 justify-center">
          <div class="modal-img mr-8" v-if="defaultMode.name === 'simpMode'">
            <img src="../../../../../public/img/state/dark-backup.png" class="w-full h-full " alt="">
          </div>
          <div class="modal-img mr-8" v-if="defaultMode.name === 'intMode'">
            <img src="../../../../../public/img/state/homedark2.png" class="w-full h-full " alt="">
          </div>
          <div class="flex flex-col my-auto">
            <HorizontalPanel :navList="modeData" v-model:selectType="defaultMode"></HorizontalPanel>
            <div v-for="item in teamData" @click="openTeamPersonal(item)"
              class="flex  items-center prev-bg team-item justify-between pointer my-4 p-4 rounded-lg" 
            >
             <div class="flex">
              <div style="width:40px;height:40px;">
                <img :src="'../../../../../public/img/state/'+ item.img" class="w-full h-full" alt="">
              </div>
              <span class="ml-4 guide-title">{{item.title}}</span>
             </div>
             <span>{{ enable ? '打开':'关闭' }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>

    <div class="flex items-center h-14 justify-center mb-3">
      <div @click="prevButton" v-if="showPrevButton">
        <span class="py-3 px-14 rounded-lg mb-5 prev-bg mouse-click pointer mr-3">上一步</span>
      </div>
      <div @click="nextButton">
        <span class="py-3 px-14 rounded-lg mb-5  button-bg mouse-click pointer">
          {{ showNextButton ? 'GO':'下一步' }}
        </span>
      </div>
    </div>
  </div>
  <GradeNotice v-else></GradeNotice>


  <transition name="fade">
    <div class="home-blur modal-container flex items-center justify-center"  v-if="showModal === true">
      <div class="rounded-lg flex flex-col p-4" style="width:480px;background: var(--modal-bg);">
        <div class="flex items-center justify-end">
          <div class="w-12 h-12 rounded-lg pointer mouse-click flex items-center justify-center"  style="background: var(--main-bg);" @click="showModal = false">
            <Icon icon="guanbi" style="font-size: 1.75em;"></Icon>
          </div>
        </div>
        <div class="flex items-center flex-col justify-center">
          <div style="width: 64px;height: 64px;" class="mb-6">
            <img :src="'../../../../../public/img/state/'+defaultTeamData.img" class="w-full h-full" alt="">
          </div>
          <span class="mb-6 main-head">{{ defaultTeamData.title}}</span>
          <span class="subhead mb-14" style="max-width: 380px;">{{defaultTeamData.content}}</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import HorizontalPanel from '../../../components/HorizontalPanel.vue'
import GradeNotice from './GradeNotice.vue'
import { guideData,workTheme } from '../../../js/data/guideData'
import {appStore} from '../../../store'
import { mapWritableState,mapActions } from 'pinia'

const deskTemplate = {
  game: [
    {
      name: "GamesDiscount",
      id: 1683361279519,
      data: {
        id: "cn",
      },
      _$muuri_id: "afe08db5-591c-4c03-8535-302485228da7",
    },
    {
      name: "GameEpic",
      id: 1683361479503,
      data: {},
      _$muuri_id: "d9775365-ac7a-44eb-9643-f5afd2ce1927",
    },
    {
      name: "CPULineChart",
      id: 1683361318879,
      data: {},
      _$muuri_id: "cddb3c87-1dd9-429c-8db5-b626a41b520e",
    },
    {
      name: "capture",
      id: 1683361487658,
      data: {},
      _$muuri_id: "4f68f51f-12c3-4dfd-a56f-a317eefb2a8d",
    },
    {
      name: "MyGameSmall",
      id: 1683361327075,
      data: {},
      _$muuri_id: "27f6b805-9460-4b4f-b48a-0fe9f861d4fb",
    },
  ],
  work: [
    {
      name: "customTimer",
      id: 1683361408159,
      data: {},
      _$muuri_id: "b9da8e82-b907-45b8-b4f7-404409a53625",
    },
    {
      name: "clock",
      id: 1683361412293,
      data: {},
      _$muuri_id: "43c55d51-7ffb-4fbd-994c-64a4b8a503d0",
    },
    {
      name: "weather",
      id: 1683361418237,
      data: {},
      _$muuri_id: "d6e03889-a8ea-4328-97b4-599350aa4002",
    },
    {
      name: "timer",
      id: 1683361422401,
      data: {},
      _$muuri_id: "75ed0b65-5b37-4f79-82e5-3b1c46b9df53",
    },
    {
      name: "smallCountdownDay",
      id: 1683361434496,
      data: {},
      _$muuri_id: "698a7d80-23c9-42cf-9e7b-3a580acc7be8",
    },
    {
      name: "smallWallpaper",
      id: 1683361445577,
      data: {
        Code: {
          id: 1683361445577,
          value: {
            value: "贪食鬼",
            path: "https://api.nguaduot.cn/glutton/journal",
            name: "PickingPaper",
          },
        },
      },
      _$muuri_id: "d6f9dfae-8098-4da3-8f15-3913cb506bf7",
    },
  ],
  empty: [],
}

export default {
  components:{
    HorizontalPanel,
    GradeNotice,
  },
  data(){
    return{
      step:1, // 步骤状态 默认第一步
      guideData, // 步骤一选择工作台模式数据
      guideIndex:0,  // 步骤一选择工作台模式类型下标
      workTheme,// 步骤二选择工作台主题模式数据
      // 步骤三模式切换
      modeData:[
        {title:'完整模式',name:'intMode',},
        {title:'极简模式',name:'simpMode'}
      ],
      defaultMode:{title:'完整模式',name:'intMode'},
      teamData:[
        {
         img:'init.png',title:'小队',
         content:'与全网的工作台小伙伴自由组成小队，一同体验“等级加速”、“道具互动”、“桌宠乱斗”等等那些旧时的回忆和乐趣，为你带来一种不一样的陪伴感。'
        },
        {
          img:'placard_3d.png',title:'底部个人信息栏',
          content:'内置即时通讯应用，同步元社区圈子，创建你的圈子或团队群聊。'
        }
      ],
      step:1, 
      enable:true, // 显示开启或者关闭
      isGradeNotice:false, // 切换
      showModal:false, // 控制步骤三模式的小队和底部个人信息的弹窗
      defaultTeamData:{}, // 接收步骤三模式的小队和底部个人数据
    }
  },

  computed:{
    ...mapWritableState(appStore,['styles','simple','stylesIndex']),
    showPrevButton(){  // 上一步按钮到1时隐藏
      if(this.step === 1 || this.step === 4){
        return false
      }else{
        return true
      }
    },
    showNextButton(){  // 下一步按钮到3时切换按钮叙述
      if(this.step === 3){
        return true
      }else{
        return false
      }
    },
    guideModeIndex(){  // 切换用户喜欢的主题模式
      const value = JSON.parse(window.localStorage.getItem("style"));
      let name = null;
      document.documentElement.classList.remove(value);
      if(this.styles && this.stylesIndex === 1){
        name =  "light-model";  // 亮色模式
        document.documentElement.classList.add(name);
        window.localStorage.setItem("style", JSON.stringify(name));
        return 1
      }else{
        name =  "dark-model"; // 暗色模式
        document.documentElement.classList.add(name);
        window.localStorage.setItem("style", JSON.stringify(name));
        return 0
      }
    },

  },

  watch:{
    'defaultMode':{
      handler(newVal){
        this.defaultMode = this.defaultMode
        this.enable = !this.enable
        if(newVal.name === 'intMode'){
          this.updateSimple(false)
        }else{
          this.updateSimple(true)
        }
      }
    },
  },
  methods:{
    ...mapActions(appStore,['updateMode','updateSimple']),
    // 点击下一步
    nextButton(e){
      this.step ++ 
      if(this.step > 3){
        e.stopPropagation()
        this.isGradeNotice = true
      }
    },
    // 点击上一步
    prevButton(){
      this.step -- 
    },
    guideItem(item,index){
      this.guideIndex = index
      switch(index){
        case 0:
          console.log('游戏娱乐',deskTemplate.game);
          break;
        case 1:
          console.log('效率辅助',deskTemplate.work);
          break;
        case 2:
           console.log('极简diy',deskTemplate.empty);
          break;
      }
    },
    // 点击进入其他
    goButton(){
      this.isGradeNotice = true
    },
    backSplash(){
      this.$router.replace({name:'splash'})
    },

    // 工作台背景色模式切换
    guideModeChange(index){
      if(index === 1){
        this.updateMode(true,index)
      }else{
        this.updateMode(false,index)
      }
    },
    // 打开小队和底部个人信息描述
    openTeamPersonal(item){
      this.showModal = true
      this.defaultTeamData = item
    },
    // 关闭小队和底部个人信息描述
    closeModal(){
      this.showModal = false
    }
  }  
}
</script>

<style lang="scss" scoped>
.back-button{
  background:var(--secondary-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}
// 主要标题
.main-head{ 
  font-family: PingFangSC-Medium;
  font-size: 18px;
  color: var(--primary-text);
  font-weight: 500;
}
// 次要标题
.subhead{
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: var(--secondary-text);
  font-weight: 400;
}
// 按钮样式
.button-bg{
  background: var(--active-bg);
  color: var( --active-text);
}
.prev-bg{
  background: var(--secondary-bg);
}
// 鼠标点击状态
.mouse-click{
  &:active {
    filter: brightness(0.8);
    opacity: 0.8;
  }
  &:hover {
    opacity: 0.8;
  }
  cursor: pointer;
}
// 选中状态颜色
.active-guide-bg{
  background: var(--active-secondary-bg) !important;
  border: 1px solid var(--active-bg);
}

// 默认的主题模式宽度
.default-mode{
  max-width: 320px;
  height: 320px;
  max-height: 320px;
  &:last-of-type{
    margin-right: 0 !important;
  }
}

.max-explain{
  width: 288px;
}

.modal-container{
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0; 
  z-index: 999;
  background: var(--mask-bg);
}
.modal-img{
  max-width: 700px;
  max-height: 405px;
}


@media screen and (max-width: 840px) {
  .default-mode{
    width: calc(100% / 2) ;
  }
  .max-explain{
    width: calc(100% / 1);
  }

  .modal-img{
    width: calc(100% / 2);
  }
}

@media screen and (min-width: 841px) and (max-width: 1100px){
  .default-mode{
    width: calc(100% / 2) ;
  }
  .modal-img{
    width: calc(100% / 2);
  }
}

@media screen and (min-width: 1101px){
  .default-mode{
    width: calc(100% / 2) ;
  }

  .modal-img{
    width: calc(100% / 1);
  }
}

@media screen and (min-width: 1201px){
  .default-mode{
    width: calc(100% / 2) ;
  }
  .modal-img{
    width: calc(100% / 1);
  }
}

@media screen and (max-height:500px) and (min-width:1200px){
  .min-height{
    margin-bottom: 8px !important;
  }
  .default-mode{
    height: calc(100% / 1);
  }
  .modal-img{
    height:calc(100% / 1.25);
  }
  .image-height{
    height: 75%;
  }
  .my-auto{
    margin: 40px !important;
  }
}
@media screen and (max-height:500px) and (max-width:840px){
  .min-height{
    margin-bottom: 8px !important;
  }
  .default-mode{
    height: calc(100% / 1);
  }
  .modal-img{
    height:calc(100% / 1);
  }
  .image-height{
    height: 75%;
  }

  .team-item{
    &:last-of-type{
      margin-bottom: 0 !important;
    }
  }
}
</style>