<template>
  <vueCustomScrollbar :settings="scrollbarSettings" style="height: 100%;padding: 15px;">
    <div class="flex flex-row flex-wrap justify-center w-full h-full">
      <!-- 游客模式隐藏 用户信息 -->
      <div v-if="useGuest" class="flex flex-col w-full mr-4 top-card" style=" max-width: 572px;">
        <div class="w-full pt-4 pb-4 mb-4 rounded-lg grade-card" style="background: var(--primary-bg);">
          <GradePanel @openGradeTip="openGradeTip"></GradePanel>
        </div>
        <div class="flex-1 w-full px-5 text-white rounded-lg tip-card" style="background: var(--primary-bg);">
          <div class="flex items-center mt-3 -ml-4">
            <Icon icon="-dengpao" style="width: 24px;height: 24px;" class="mx-2 text-white"></Icon>Tips
          </div>
          <div class="flex flex-col w-full px-4 mt-2 rounded-lg h-2/3 justify-evenly xt-bg-2"
            style="color:var(--primary-text)">
            <div>1. 保持在线状态即可升级</div>
            <div>2. 目前有「{{leveList.length}}」个不同的等级权益，高等级还能优先体验新功能</div>
            <div>3. 通过加入「小队」最高可获得20%升级加速</div>
          </div>
        </div>
      </div>
      <!-- <div class="p-6 mr-4 rounded-lg grade-card" style=" background:var(--primary-bg)">
        <div class="text-white" style="color:var(--primary-text);">等级权益</div>
        <div class="flex flex-row">
          <div class="mt-6 mr-4" style="width: 160px">
            <a-steps direction="vertical" :current="abilityGrade" ref="step" :progressDot="true">
              <a-step :title="'Lv ' + item" description=" " @click="clickStep(index)" class="left-box"
                v-for="(item, index) in leveList" style="color:var(--primary-text);"/>
            </a-steps>
          </div>
          <div class="flex flex-wrap justify-between w-full bottom-card">
              <div v-for="item in powerList" class="relative flex flex-row items-center p-2 mt-2 rounded-lg h-1/6 "
              style="width: calc(50% - 8px);"
              :style="item.detail[[leveList[clickGrade]]] ? 'background: var(--secondary-bg)' : 'background: var(--secondary-bg);opacity: 0.6;'">
              <Icon :icon="item.icon" style="width: 24px;height: 24px;color: var(--primary-text);" class="ml-2 mr-4 text-white"></Icon>
              <div style="width: calc(100% - 50px)">
                <div class="w-full text-white text-more xt-text"  >{{ item.alias }}</div>
                <div v-if="item.detail[[leveList[clickGrade]]]" class="w-full text-more xt-text-2">
                  {{ item.detail[[leveList[clickGrade]]] }}</div>

              </div>
              <div class="grade-tip" style="color: rgba(255, 255, 255, 0.85);" v-if="item.noOnline">即将上线</div>
            </div>
          </div>
        </div>
      </div> -->
      <!-- 等级权益组件 -->
      <Level :abilityGrade="abilityGrade" v-if="useGuest" :isLogin="useGuest"></Level>
    </div>
  </vueCustomScrollbar>
  <div class="fixed inset-0 home-blur float-tip" style="z-index: 999" v-if="tipFlag" @click.stop="closeTip">
    <div class="absolute px-5 text-white -translate-x-1/2 -translate-y-1/2 rounded-lg w-96 h-60 top-1/2 left-1/2"
      style="background: rgba(33, 33, 33, 1);">
      <div class="flex items-center mt-3 -ml-4">
        <Icon icon="-dengpao" style="width: 24px;height: 24px;" class="mx-2 text-white"></Icon>Tips
      </div>
      <div class="flex flex-col w-full px-4 mt-2 rounded-lg h-2/3 justify-evenly"
        style="background: rgba(42, 42, 42, 1);">
        <div>1. 保持在线状态即可升级</div>
        <div>2. 目前有「{{leveList.length}}」个不同的等级权益，高等级还能优先体验新功能</div>
        <div>3. 通过加入「小队」最高可获得20%升级加速</div>
      </div>
    </div>
  </div>
</template>

<script>
import GradePanel from '../../components/comp/GradePanel.vue'
import { leveList, powerList } from '../../js/data/abilityData'
import { mapState } from "pinia";
import { appStore } from "../../store";
import Level from './Level.vue';
export default {
  name: "Grade",
  components: { GradePanel,Level },
  data() {
    return {
      leveList,
      powerList,
      clickGrade: 0,
      scrollbarSettings: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
      grade: {},
      tipFlag: false
    }
  },
  computed: {
    ...mapState(appStore, ['userInfo']),
    abilityList() {
      return this.powerList[this.leveList[this.clickGrade]]
    },
    abilityGrade() {
      return leveList.findIndex((n) => n > lv) !== -1 ? leveList.findIndex((n) => n > lv) - 1 : leveList.length - 1
    },
    useGuest(){
      return !window.$useEnv('guest')
    },
  },
  mounted() {

    this.grade = this.userInfo.onlineGradeExtra
      // this.clickStep(this.abilityGrade)
  },
  methods: {
    openGradeTip() {
      this.tipFlag = true
    },
    closeTip() {
      this.tipFlag = false
    },
    // clickStep(e) {
    //   for (let i = 0; i < this.$refs.step.$el.children.length; i++) {
    //     this.$refs.step.$el.children[i].children[0].children[2].children[0].style.background = ''
    //   }
    //   this.$refs.step.$el.children[e].children[0].children[2].children[0].style.background = 'var(--active-bg)'
    //   this.clickGrade = e
    // }
  }
}
</script>

<style lang="scss" scoped>
.left-box {
  :deep(.ant-steps-item-title) {
    color: var(--primary-text) !important;
  }
  :deep(.ant-steps-item-content){
    min-height: 65px;
  }
}
@media screen and (min-width: 1492.9px) {
  .top-card {
    min-height: 572px;
  }

  .tip-card {
    display: block;
  }

  .float-tip {
    display: none;
  }
}

@media screen and (max-width: 1493px) {
  .tip-card {
    display: none;
  }
}

.grade-card {
  max-width: 572px;
  background: rgba(33, 33, 33, 1);

  .bottom-card {
    aspect-ratio: 572/596;
  }
}

:deep(.ant-steps-item-finish > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-description) {
  color: transparent;
}

:deep(.ant-steps-item-process > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-description) {
  color: transparent;
}

:deep(.ant-steps-item-wait > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-description) {
  color: transparent;
}

:deep(.ant-steps-item:not(.ant-steps-item-active) > .ant-steps-item-container[role='button']:hover .ant-steps-item-description) {
  color: transparent;
}

:deep(.ant-steps-item-title) {
  width: 70px;
  padding-left: 10px;
  height: 35px;
  width: 70px;
  border-radius: 8px;
}
</style>
