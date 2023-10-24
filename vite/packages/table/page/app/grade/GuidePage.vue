<template>
  <div class="flex flex-col h-full items-center justify-between p-5" v-if="showModal === false">
    <!-- 返回按钮 -->
    <div class="guide-button" v-if="isShow === false ">
    <div class="flex guide-page-bg button-active pointer w-12 h-12 rounded-lg items-center justify-center "
     @click="backSplash"
    >
     <Icon icon="xiangzuo" style="font-size: 1.75em;"></Icon>
    </div>
    </div>


    <!-- 引导内容提示 -->
    <div class="h-full flex items-center justify-center min-content mb-4" v-if="isShow === false">
    <!-- 合适工作台模式 -->
    <template v-if="step === 0">
      <div class="flex flex-col items-center">
        <div class="flex flex-col items-center mb-8">
          <span class="primary-title mb-3">选择适合您的使用场景</span>
          <span class="secondary-title">完成选择后，会内置对应模式的功能方案，你仍然可以在后续自定义修改各个功能和布局。</span>
        </div>
        <div class="flex relative">
          <div class="guide-divider"></div>
          <div v-for="(item,index) in guideData" :class="{'mode-active-bg': isActive(item)}"
           class="flex flex-col pointer mode-width max-width mode-width clear-mr guide-page-bg rounded-lg items-center justify-center px-5 py-2 mr-8"
           @click="selectWorkMode(item,index)"
          >
          <!--  -->
            <div style="width: 100px;height: 100px;">
              <img :src="guideImg(item.url)" class="w-full h-full" alt="">
            </div>
            <span class="my-4 primary-title">{{ item.title }}</span>
            <div class="container flex items-center justify-center">
              <p class="text-clamp w-full">
                {{ item.explain }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- 合适主题模式 -->
    <template v-if="step === 1">
      <div class="flex flex-col items-center justify-center mb-5">
          <div class="flex flex-col items-center mb-8">
            <span class="primary-title mb-3">选择你的主题模式</span>
            <span class="secondary-title">完成选择后，你仍然可以在后续自定义修改。</span>
          </div>
          <div class="flex items-center">
             <div v-for="(item) in workTheme"
              :class="{'mode-active-bg': stylesIndex === item.id}"
              class="flex py-8 pointer rounded-lg px-25 mr-8 clear-mr flex-col items-center justify-center guide-page-bg"
              @click="selectThemeMode(item.id)"
             >
               <div style="width: 100px;height: 100px;">
                <img :src="guideImg(item.url) " class="w-full h-full" alt="">
               </div>
               <span class="mt-4 primary-title">{{ item.title }}</span>
             </div>
          </div>
      </div>
    </template>

    <!-- 合适模式 -->
    <template v-if="step === 2">
      <div class="w-full flex flex-col items-center justify-center">
        <div class="flex flex-col items-center justify-center mb-8 min-mb">
          <span class="primary-title mb-3">选择你需要的模式</span>
          <span class="secondary-title">同步元社区互动功能，完成选择后，你仍然可以在后续自定义修改。</span>
        </div>
        <div class="flex">
          <div class="mode-image mr-9 flex items-center justify-center">
            <img :src="modeImg.initUrl" class="w-full h-full " alt="" v-if="defaultMode.name === 'intMode'">
            <img :src="modeImg.simpleUrl" v-else class="w-full h-full object-cover" alt="">
          </div>
          <div class="flex flex-col">
            <HorizontalPanel :navList="modeData" v-model:selectType="defaultMode" class="mb-5"></HorizontalPanel>
            <div v-for="item in teamData"  @click="openTeamPersonal(item)"
             class="guide-page-bg mb-4 p-4 button-active flex items-center justify-between pointer rounded-lg"
            >
            <div class="flex items-center">
              <div style="width:40px;height:40px;">
                <img :src="guideImg(item.img)" class="w-full h-full" alt="">
              </div>
              <span class="ml-4 guide-title primary-title xt-text">{{item.title}}</span>
             </div>
             <span :style="{background: !simple? 'green':'red'}" class="p-2 rounded-lg px-3">
              <icon style="font-size: 18px;color: white;vertical-align: middle" v-if="!simple" icon="yixuan"></icon>
               <icon style="font-size: 18px;color: white;vertical-align: middle" v-else icon="guanbi"></icon>
             </span>
            </div>
          </div>
        </div>
      </div>
    </template>
    </div>


   <!-- 上下一步点击按钮 -->
   <div class="flex">
    <xt-button  class="mr-10 w-40 h-12 rounded-lg" style="color: var(--active-text);" v-if="step !== 0" @click="prevButton">
      上一步
    </xt-button>
    <xt-button type="theme" :disabled="!isNext" class="w-40 h-12 rounded-lg" style="color: var(--active-text);" @click="nextButton">
      {{ step === 2 ? 'GO':'下一步' }}
    </xt-button>
   </div>
   <!--
    新用户须知后期需要的话再考虑使用,现在暂时不使用
    <GradeNotice v-else></GradeNotice>
  -->
  </div>
  <transition name="fade">
    <div class="guide-page-bg h-full flex items-center justify-center"  v-if="showModal === true">
      <div class="rounded-lg flex flex-col p-4" style="width:480px;background: var(--modal-bg);">
        <div class="flex items-center justify-end">
          <div class="w-12 h-12 rounded-lg pointer mouse-click flex items-center justify-center"  style="background: var(--main-bg);" @click="showModal = false">
            <Icon icon="guanbi" style="font-size: 1.75em;"></Icon>
          </div>
        </div>
        <div class="flex items-center flex-col justify-center">
          <div style="width: 64px;height: 64px;" class="mb-6">
            <img :src="guideImg(defaultTeamData.img)" class="w-full h-full" alt="">
          </div>
          <span class="mb-6 primary-text">{{ defaultTeamData.title}}</span>
          <span class="secondary-title mb-14" style="max-width: 380px;">{{defaultTeamData.content}}</span>
        </div>
      </div>
    </div>
  </transition>
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
import {setThemeSwitch} from '../../../components/card/hooks/themeSwitch/index';
import HorizontalPanel from '../../../components/HorizontalPanel.vue'
import _ from 'lodash-es'

export default {
  components:{
    // GradeNotice,
    HorizontalPanel
  },
  data(){
    return{
      step:0,
      isShow:false,
      guideData,teamData,deskTemplate,
      modeData,workTheme,modeImg,
      defaultMode:{title:'完整模式',name:'intMode'},
      showModal:false,
      defaultTeamData:{},
      selectItem:[],
      statusIndex:0, // 默认引导步骤一的默认选项
      loadShow:false, // 第一次加载
    }
  },
  computed:{
    ...mapWritableState(appStore,['styles','simple','stylesIndex','userInfo']),
    ...mapWritableState(cardStore,['currentDeskId','currentDeskIndex']),
    //是否禁用下一步
    isNext(){
      return this.statusIndex === 2 || this.selectItem.length > 0
    }
  },
  mounted(){
    this.selectItem = ['gr']
  },
  methods:{
    ...mapActions(appStore,['updateMode','updateSimple','setAgreeTest','setInfoVisible','setSecondaryVisible']),
    ...mapActions(cardStore,['addDesk','switchToDesk']),
    ...mapActions(navStore,['updateLeftNavData','updateBottomNavData']),
    ...mapActions(taskStore, ['startfirstTask']),

    // 点击返回按钮的回调事件
    backSplash(){
      this.$router.replace({name:'splash'})
    },
    // 上一步按钮
    prevButton(){
      this.step --
    },
    // 选择合适的主题模式回调事件
    selectThemeMode(index){
      cache.set('index',index)
      if(index === 0){
        this.updateMode(false)
      }else{
        this.updateMode(true)
      }
    },
    // 打开个人和小队引导信息提示回调事件
    openTeamPersonal(item){
      this.defaultTeamData = item
      this.showModal = true
    },
    // 选择合适的工作台模式
    selectWorkMode(item,index){
      const find = this.selectItem.indexOf(item.id)
      if(find > -1){
        this.selectItem.splice(find,1)
      }else{
        this.selectItem.push(item.id); // 添加选中
      }
      this.statusIndex = index
      if(index === 2){
        this.selectItem = []
      }
    },
    // 选中状态
    isActive(item){
      if(item.id === 'dy'){  // 第三个元素选中
        return this.statusIndex === 2
      }
      return this.selectItem.includes(item.id)
    },
    // 下一步按钮
    nextButton(){
      this.step ++
      if(this.step > 2) this.isShow = true
      if(this.step > 2 ){  // 最后一步生成桌面
        if(this.selectItem.length !==0 && this.selectItem.length > 1){ // 多选情况下
          for(let i=0;i<this.selectItem.length;i++){
           this.addSwitchDesk(this.guideData[i])
          }
        }else if(this.selectItem[0] && this.selectItem[0] !== undefined){ // 单选不极简情况下
          this.addSwitchDesk({id:this.selectItem[0]})
        }else if(this.statusIndex === 2){ // 单选极简情况下
          this.addSwitchDesk(this.guideData[this.statusIndex])
        }

        // 当所有步骤执行完以后
        this.setAgreeTest()
        this.$router.push({ name: 'home'})
        this.startfirstTask()
        let postTimer = setTimeout(()=>{
         const avatar = this.userInfo.avatar
         const regex = new RegExp(avatar.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
         const isUrlExists = _.some(defaultAvatar,function(o){ return regex.test(o.default_url) })
         if(isUrlExists){
          this.setInfoVisible(true)
          clearTimeout(postTimer)
          this.setSecondaryVisible(false)
         }
        },60000)


        // console.log('多选:>>>',);
        // console.log('单选::>>> 不极简',this.selectItem[0]);
        // console.log('单选::>>> 极简',this.statusIndex === 2);
        // if(this.selectItem.length !==0 && this.selectItem.length > 1){  // 判断是不是多选

        // }else{
        //   // 单选情况下 分为极简和不极简,
        //   if(this.selectItem[0]){
        //     this.addSwitchDesk({id:this.selectItem[0]})
        //   }else{
        //     this.addSwitchDesk(this.guideData[this.statusIndex])
        //   }
        // }
      }else{
        return
      }
    },

    addSwitchDesk(obj){   // 添加桌面和导航
      switch (obj.id) {
        case 'gr': // 游戏娱乐
          this.addDesk(this.deskTemplate.gameName,this.deskTemplate.game)
          if(this.selectItem.length === 1){
            this.updateLeftNavData(gamePanel.left)
            this.updateBottomNavData(gamePanel.bottom)
          }
          break;
        case 'wf': // 效率辅助
          this.addDesk(this.deskTemplate.workName,this.deskTemplate.work)
          if(this.selectItem.length === 1){
            this.updateLeftNavData(workPanel.left)
            this.updateBottomNavData(workPanel.bottom)
          }
          break;
        case 'dy': // 极简diy
          this.addDesk(this.deskTemplate.emptyName,this.deskTemplate.empty)
          if(this.statusIndex === 2){
            this.updateLeftNavData(diyPanel.left)
            this.updateBottomNavData(diyPanel.bottom)
          }
          break;
      }

     this.switchToDesk(0)

      if(this.selectItem.length === 2){
        this.updateLeftNavData(mergePanel.left)
        this.updateBottomNavData(mergePanel.bottom)
      }
    },

    // 图片转换
    guideImg(url){
      return '/img/state/' + url + '.png';
    }
  },
  watch:{
    // 根据浅色模式监听
    'styles':{
      handler(newVal,oldVal){

        let model = newVal || this.stylesIndex === 1 ? true : false


        setThemeSwitch(model)
      },
      immediate:true,
    },
    // 切换极简和完整模式监听
    'defaultMode':{
      handler(newVal){
        this.defaultMode = newVal
        this.updateSimple(newVal.name !== 'intMode')
      },
      immediate:true,
    }
  }
}
</script>

<style lang="scss" scoped>
.guide-page-bg{
  background: var(--secondary-bg);
}
.button-active{
  &:active{
    filter: brightness(0.8);
    opacity: 0.8;
  }
  &:hover{
    opacity: 0.8;
  }
}
.primary-title{
  font-size: 18px;
  color: var(--primary-text);
  font-weight: 500;
}

.primary-text{
  font-size: 16px;
  color: var(--primary-text);
  font-weight: 500;
}

.secondary-title{
  font-size: 16px;
  color:var(--secondary-text);
  font-weight: 400;
}
.container {
  max-width: 240px;
}
.text-clamp {
  -webkit-box-orient: vertical;
  -webkit-line-clamp:4;
  white-space: break-spaces;
  margin: 0 !important;
  font-size: 14px;
  color:var(--secondary-text);
  font-weight: 400;
}
.max-width{
  &:last-of-type{
    margin-left: 32px !important;
    padding:34px 64px !important;
    .container{
      max-width: 272px;
    }
  }
}
.guide-divider{
  position: absolute;
  top: 0;
  right:41%;
  width: 1px;
  height: 100%;
  background: var(--divider);
}
.px-25{
  padding-left: 6.875rem;
  padding-right: 6.875rem;
  max-width: 320px;
}

.mode-active-bg{
  background: var(--active-secondary-bg);
  border: 1px solid var(--active-bg);
  color:var(--active-text);
}
.clear-mr{
  &:last-of-type{
    margin-right: 0 !important;
  }
}
.guide-button{
  position: fixed;
  top: 12px;
  left:12px;
}
.mode-image{
  max-width:720px;
  max-height: 405px;
}

// 最小高度响应
@media screen and(max-height:600px) {
  .mode-image{
    max-width:540px !important;
    max-height: 540px !important;
  }
  // 最小高度的底部间距
  .min-mb{
    margin-bottom: 16px !important;
  }
}

// 最小宽度响应
@media screen and(max-width:840px) {
  .guide-divider{
    position: absolute;
    top: 0;
    right:34.25% !important;
    width: 1px;
    height: 100%;
    background: var(--divider);
  }
  .container{
    width: calc(100% / 1.25);
  }
  .mode-width{
    padding:10px 5px !important;
    &:last-of-type{
      padding: 0 !important;
      margin: 0 !important;
    }
  }
}

</style>
