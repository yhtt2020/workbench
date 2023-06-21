<template>
  <div class="w-full h-full p-3 flex flex-col  " style="background:var(--modal-bg);" v-if="isGradeNotice === false">
    <!-- 返回按钮 -->
    <div class="back-button mouse-click w-12 h-12 flex-none">
      <Icon icon="xiangzuo" style="font-size: 1.75em;"></Icon>
    </div>

    <!-- 引导步骤1 -->
    <template v-if="step === 1">
      <div class="flex items-center h-full mb-5 flex-col justify-center">
        <div class="main-head mb-1 flex items-center justify-center">
          <span>选择适合你的工作台模式</span>
        </div>
        <div class="subhead flex flex-col items-center min-height justify-start mb-12">
          <span>完成选择后，会内置对应模式的工作功能方案，你仍然可以在后续自定</span>
          <span>义修改各个功能和布局。</span>
        </div>
        <div class="flex items-center justify-center">
           <div 
              v-for="(item,index) in guideData"
              :class="guideIndex === index ? 'active-guide-bg' : ''"
              @click="guideItem(item,index)"  
              class="mr-8 px-4 py-1 flex-col p-1 prev-bg pointer rounded-lg default-mode flex items-center justify-center"
            > 
              <div style="width: 100px ; height: 100px;" class="mb-0.5">
                <img style="width: 100%;height: 100%; object-fit: contain;" :src="'../../../../../public/img/state/'+ item.url " alt="" >
              </div>
              <div class="main-head mb-2">{{ item.title }}</div>
              <div class="subhead">
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
          <div v-for="(item,index) in workTheme" :class="{'active-guide-bg': guideModeIndex=== index}" @click="guideModeChange(item,index)"
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
      <div class="flex flex-col h-full items-center mb-4 justify-center">
        <div class="main-head mb-3 flex items-center justify-center ">选择你需要的模式</div>
        <div class="subhead flex flex-col items-center justify-center mb-8">
          <div>同步元社区互动功能，完成选择后，你仍然可以在后续自定义修改。</div>
        </div>
        <div class="flex items-center justify-center next-btn">
          <div class="mr-8 mode-image" v-if="defaultMode.name === 'simpMode'">
            <img src="../../../../../public/img/state/dark-backup.png" class="w-full h-full " alt="">
          </div>
          <div class="mr-8 mode-image" v-if="defaultMode.name === 'intMode'">
            <img src="../../../../../public/img/state/homedark2.png" class="w-full h-full " alt="">
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
      </div>
    </template>

    <div class="flex items-center h-14 justify-center">
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
      guideModeIndex:0, // 工作台背景色模式切换
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

  computed:{
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
    },
    // 点击进入其他
    goButton(){
      this.isGradeNotice = true
    },
    backSplash(){
      this.$router.replace({name:'splash'})
    },

    // 工作台背景色模式切换
    guideModeChange(item,index){
      this.guideModeIndex = index
      const value = JSON.parse(window.localStorage.getItem("style"));
      let name = null;
      document.documentElement.classList.remove(value);
      if(index === 1){
        name =  "light-model";  // 亮色模式
        document.documentElement.classList.add(name);
        window.localStorage.setItem("style", JSON.stringify(name));
      }else{
        name =  "dark-model"; // 暗色模式
        document.documentElement.classList.add(name);
        window.localStorage.setItem("style", JSON.stringify(name));
      }
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

.mode-image{
  max-width: 720px;
  max-height: 405px;
}


@media screen and (max-width: 840px) {
  .default-mode{
    width: calc(100% / 2) ;
  }
  .mode-image{
    width: calc(100% / 2);
  }
}

@media screen and (max-height:500px) {
  .min-height{
    margin-bottom: 8px !important;
  }
  .default-mode{
    height: calc(100% / 1);
  }
}
</style>