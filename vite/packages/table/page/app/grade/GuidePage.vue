<template>
  <div class="flex  flex-col p-3 w-full h-full" v-if="isGradeNotice === false" style="background:var(--modal-bg);">
    <div class="flex back-bg items-center justify-center button-active w-12 h-12 rounded-lg pointer"
      @click="backSplash"
    >
      <Icon icon="xiangzuo" style="font-size: 1.75em;"></Icon>
    </div>
    <template v-if="step === 1">
      <div class="flex items-center flex-col  justify-center">
        <div class="guide-title mb-3">选择适合你的工作台模式</div>
        <div class="guide-text flex flex-col items-center justify-center mb-12">
          <div>
            完成选择后，会内置对应模式的工作功能方案，你仍然可以在后续自定
          </div>
          <div>
            义修改各个功能和布局。
          </div>
        </div>
        <div class="flex mb-16">
          <div v-for="(item,index) in guideData"
            :class="guideIndex === index ? 'active-guide-bg' : ''"
            class="flex flex-col items-center pointer rounded-lg justify-center guide-item mr-8"
            @click="guideItem(item,index)" 
          >
            <div class="guide-img flex items-center justify-center mb-4">
              <img :src="`../../../../../public/img/state/${item.url}`" alt="" class="w-full h-full">
            </div>
            <div class="guide-title mb-4">{{ item.title }}</div>
            <div style="max-width: 240px;color: var(--secondary-text);">
              {{ item.explain }}
            </div>
          </div> 
        </div>
        <div class="py-3 px-14 btn-bg rounded-lg pointer" @click="nextButton">下一步</div>
      </div> 
    </template>
    <template v-else-if="step === 2">
      <div class="flex items-center flex-col  justify-center">
        <div class="guide-title mb-3">选择你的主题模式</div>
        <div class="guide-text flex flex-col items-center justify-center mb-12">
          <div>完成选择后，你仍然可以在后续自定义修改。</div>
        </div>
        <div class="flex mb-16">
          <div v-for="(item,index) in workTheme" :class="{'active-guide-bg': guideIndex === index}" @click="guideItem(item,index)"
           class="flex flex-col items-center pointer rounded-lg justify-center guide-item mr-8">
            <div class="guide-img flex items-center justify-center mb-4">
              <img :src="`../../../../../public/img/state/${item.url}`" alt="" class="w-full h-full">
            </div>
            <div class="guide-title mb-4">{{ item.title }}</div>
          </div> 
        </div>
        <div class="flex">
          <div class="py-3 px-14 rounded-lg prev-bg pointer mr-3" @click="prevButton">上一步</div>
          <div class="py-3 px-14 btn-bg rounded-lg pointer" @click="nextButton">下一步</div>
        </div>
      </div>
    </template>
    <template v-else-if="step === 3">
      <div class="flex flex-col items-center justify-center">
        <div class="guide-title mb-3 flex items-center justify-center ">选择你需要的模式</div>
        <div class="guide-text flex flex-col items-center justify-center mb-8">
          <div>同步元社区互动功能，完成选择后，你仍然可以在后续自定义修改。</div>
        </div>
        <div class="flex items-center px-14 mb-8">
         <div style="width: 720px;height:405px;" class="mr-8">
           <img src="../../../../../public/img/state/dark-backup.png" class="w-full h-full " alt="">
         </div>
         <div class="flex flex-col">
          <HorizontalPanel :navList="modeData" v-model:selectType="defaultMode"></HorizontalPanel>
          <div class="flex  items-center justify-between my-8 p-4 rounded-lg" style="background: var(--secondary-bg);">
            <div class="flex items-center">
              <div style="width:40px;height:40px;">
                <img src="../../../../../public/img/state/init.png" class="w-full h-full" alt="">
              </div>
              <span class="ml-4 guide-title">小队</span>
            </div>
            <span>{{ isOpen ? '打开':'关闭' }}</span>
          </div>
          <div class="flex  items-center justify-between p-4 rounded-lg" style="background: var(--secondary-bg);">
            <div class="flex items-center">
              <div style="width:40px;height:40px;">
                <img src="../../../../../public/img/state/placard_3d.png" class="w-full h-full" alt="">
              </div>
              <span class="ml-4 guide-title">底部个人信息栏</span>
            </div>
            <span>{{ isOpen ? '打开':'关闭' }}</span>
          </div>
         </div>
        </div>
        <div class="flex">
          <div class="py-3 px-14 rounded-lg prev-bg pointer mr-3" @click="prevButton">上一步</div>
          <div class="py-3 px-14 btn-bg rounded-lg pointer" @click="goButton">GO</div>
        </div>
      </div>
    </template>
  </div>
  <GradeNotice v-else></GradeNotice>
</template>

<script>
import HorizontalPanel from '../../../components/HorizontalPanel.vue'
import GradeNotice from './GradeNotice.vue'
export default {
  components:{
    HorizontalPanel,
    GradeNotice
  },
  data(){
    return{
      // 步骤一选择工作台模式数据
      guideData:[
        {
          title:'游戏娱乐',url:'joystick_3d.png',
          explain:'支持同步Steam游戏库，支持一键启动游戏，支持自定义导入其他平台游戏；支持系统CPU、GPU、内存、游戏帧数检测。'
        },
        {
         title:'效率辅助',url:'keyboard_3d.png',
         explain:'内置快捷指令方案，自定义编辑指令功能；内置剪切板和快捷键应用，更有待办事项、日历、倒数日等多个内置小组件。'
        },
        {
         title:'极简DIY',url:'magic_wand_3d.png',
         explain:'无内置推荐数据，仅保留基础和性功能模块，从0开始DIY你的专属工作台。'
        }
      ],
      guideIndex:0,
      // 步骤二选择工作台主题模式数据
      workTheme:[
        {title:'暗色模式',url:'new_moon_3d.png'},
        {title:'亮色模式',url:'sun_3d.png'}
      ],
      // 步骤三模式切换
      modeData:[
        {title:'完整模式',name:'intMode',},
        {title:'极简模式',name:'simpMode'}
      ],
      defaultMode:{title:'完整模式',name:'intMode'},
      step:1, 
      isOpen:true,
      isGradeNotice:false,
    }
  },
  watch:{
    defaultMode:{
      handler(){
        this.defaultMode = this.defaultMode
        this.isOpen = !this.isOpen
      }
    }
  },
  methods:{
    backSplash(){
      this.$router.replace({name:'splash'})
    },
    // 点击下一步
    nextButton(){
      this.step ++ 
    },
    // 点击上一步
    prevButton(){
      this.step -- 
    },
    guideItem(item,index){
      this.guideIndex = index
    },
    // 点击进入其他
    goButton(){
      this.isGradeNotice = true
    }
  }
}
</script>

<style lang="scss" scoped>
.back-bg{
  background:var(--secondary-bg);
}

.btn-bg{
  background: var(--active-bg);
  color: var( --active-text);
}

.active-guide-bg{
  background: var(--active-secondary-bg) !important;
  border: 1px solid var(--active-bg);
}
.prev-bg{
  background: var(--secondary-bg);
}
.guide-img{
  width: 100px;
  height: 100px;
}

.guide-item{
  width: 320px;
  height: 320px;
  background: var(--secondary-bg);
  &:last-of-type{
    margin-right: 0 !important;
  }
}
.button-active{
  &:active {
    filter: brightness(0.8);
    opacity: 0.8;
  }

  &:hover {
    opacity: 0.8;
  }
}

.guide-title{
  font-family: PingFangSC-Medium;
  font-size: 18px;
  color: var(--primary-text);
  font-weight: 500;
}

.guide-text{
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: var(--secondary-text);
  font-weight: 400;
}
</style>