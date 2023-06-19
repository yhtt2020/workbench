<template>
  <div class="w-full h-full p-3 flex flex-col" style="background:var(--modal-bg);" v-if="isGradeNotice === false">
    <!-- 返回按钮 -->
    <div class="back-button mouse-click w-12 h-12">
      <Icon icon="xiangzuo" style="font-size: 1.75em;"></Icon>
    </div>

    <!-- 引导步骤1 -->
    <template v-if="step === 1">
       <div class="flex flex-col items-center justify-center">
        <div class="gp-title mb-3 flex items-center  justify-center">
          <span>选择适合你的工作台模式</span>
        </div>
        <div class="gs-title flex flex-col items-center justify-center mb-12">
          <div>
            完成选择后，会内置对应模式的工作功能方案，你仍然可以在后续自定
          </div>
          <div>
            义修改各个功能和布局。
          </div>
        </div>
        <div class="flex items-center  w-full justify-center next-btn">
          <div v-for="(item,index) in guideData" 
           class="g-max p-10 mr-8 flex-col pointer"
           :class="guideIndex === index ? 'active-guide-bg' : ''"
           @click="guideItem(item,index)" 
          >
            <div class="gp-image mb-4">
              <img class="w-full h-full " :src="'../../../../../public/img/state/'+ item.url " alt="" >
            </div>
            <div class="gp-title mb-4">{{ item.title }}</div>
            <div style="max-width: 240px;color: var(--secondary-text);">
              {{ item.explain }}
            </div>
          </div>
        </div>
        <div class=" flex items-center justify-center " >
          <div class="py-3 px-14 mouse-click btn-bg  rounded-lg pointer" @click="nextButton">
            <span>下一步</span>
          </div>
        </div>
       </div>
    </template>

    <!-- 引导步骤2 -->
    <template v-else-if="step === 2">
      <div class="flex items-center flex-col  justify-center">
        <div class="gp-title mb-3">选择你的主题模式</div>
        <div class="gs-title flex flex-col items-center justify-center mb-12">
          <div>完成选择后，你仍然可以在后续自定义修改。</div>
        </div>
        <div class="flex gp-step">
          <div v-for="(item,index) in workTheme" :class="{'active-guide-bg': guideIndex === index}" @click="guideItem(item,index)"
           class="flex flex-col items-center p-10 pointer rounded-lg justify-center guide-item mr-8">
            <div class="mb-4" style="width: 100px; height: 100px;">
            <img class="w-full h-full " :src="'../../../../../public/img/state/'+ item.url " alt="" >
           </div> 
           <div class="gp-title mb-4">{{ item.title }}</div>
          </div>
        </div>
        <div class="flex">
          <div class="py-3 px-14 rounded-lg prev-bg pointer mr-3" @click="prevButton">上一步</div>
          <div class="py-3 px-14 btn-bg rounded-lg pointer" @click="nextButton">下一步</div>
        </div>
      </div>
    </template>

    <!-- 引导步骤3 -->
    <template v-else-if="step === 3">
      <div class="flex flex-col">
        <div class="gp-title mb-3 flex items-center justify-center ">选择你需要的模式</div>
        <div class="gs-title flex flex-col items-center justify-center mb-8">
          <div>同步元社区互动功能，完成选择后，你仍然可以在后续自定义修改。</div>
        </div>
        <div class="flex items-center justify-center next-btn">
          <div class="gp-left mr-8">
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
        <div class="flex items-center justify-center">
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
      step:1, // 步骤状态 默认第一步
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
    },
    backSplash(){
      this.$router.replace({name:'splash'})
    },
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
// 主要文字样式
.gp-title{
  font-family: PingFangSC-Medium;
  font-size: 18px;
  color: var(--primary-text);
  font-weight: 500;
}
// 次要文字样式
.gs-title{
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: var(--secondary-text);
  font-weight: 400;
}
// 按钮样式
.btn-bg{
  background: var(--active-bg);
  color: var( --active-text);
}
.prev-bg{
  background: var(--secondary-bg);
}
.g-max{
  width: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--secondary-bg);
  border-radius: 12px;
  &:last-of-type{
    margin-right: 0 !important;
  }
  .gp-image{
    max-width: 100px;
    height: 100px;
  }
}
.active-guide-bg{
  background: var(--active-secondary-bg) !important;
  border: 1px solid var(--active-bg);
}
.gp-left{
  max-width: 720px;
}


@media screen and (max-width:840px){
   .g-max{
    width: calc(100% / 1);
    margin-right: 10px;
    .gp-image{
      width:calc(100% / 4);
      height:calc(100% / 4);
    }
   }
   .gp-left{
    width: calc(100% / 2);
   }
}

@media screen and (min-width: 841px) and (max-width: 1100px) {
  .g-max{
    width: calc(100% / 1);
    margin-right: 32px !important;
  }
}

@media screen and (min-width: 1101px){
  .g-max{
    width: calc(100% / 1);
    margin-right: 32px !important;
  }
  .next-btn{
    margin-bottom: 64px ;
  }
}

@media screen and (max-height:500px){
  .g-max{
    height: 250px;
    padding: 16px  !important;
  }
  .next-btn{
    margin-bottom: 8px ;
  }
  .gp-step{
    margin-bottom: 10px !important;
  }
}

@media screen and (min-height:501px) {
  .g-max{
    width: calc(100% / 1);
    height: 320px;
    margin-right: 10px;
    .gp-image{
      width:calc(100% / 2);
      height:calc(100% / 2);
    }
   }
   .next-btn{
    margin-bottom: 64px ;
   }

   .gp-step{
     margin-bottom: 40px !important;
   }
}
</style>