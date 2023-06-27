<template>
  <vueCustomScrollbar :settings="scrollbarSettings" style="height: 100%;padding: 15px;">
    <div class="w-full h-full flex justify-center flex-row flex-wrap">
      <div class="w-full flex flex-col  top-card mr-4" style=" max-width: 572px;">
        <div class="w-full  pt-4 pb-4 grade-card  rounded-lg  mb-4" style="background: var(--primary-bg);">
          <GradePanel @openGradeTip="openGradeTip"></GradePanel>
        </div>
        <div class="rounded-lg flex-1 w-full  tip-card px-5 text-white" style="background: var(--primary-bg);">
          <div class="flex items-center -ml-4 mt-3">
            <Icon icon="-dengpao" style="width: 24px;height: 24px;" class="mx-2 text-white"></Icon>Tips
          </div>
          <div class="h-2/3 w-full rounded-lg flex flex-col justify-evenly px-4 mt-2 xt-bg-2"
            style="color:var(--primary-text)">
            <div>1. 保持在线状态即可升级</div>
            <div>2. 目前有「{{leveList.length}}」个不同的等级权益，高等级还能优先体验新功能</div>
            <div>3. 通过加入「小队」最高可获得20%升级加速</div>
          </div>
        </div>
      </div>
      <div class="grade-card p-6 rounded-lg  mr-4" style=" background:var(--primary-bg)">
        <div class="text-white" style="color:var(--primary-text);">等级权益</div>
        <div class="flex flex-row">
          <div class="mt-6 mr-4" style="width: 160px">
            <a-steps direction="vertical" :current="abilityGrade" ref="step" :progressDot="true">
              <a-step :title="'Lv ' + item" description="null" @click="clickStep(index)" class="left-box"
                v-for="(item, index) in leveList" style="color:var(--primary-text);"/>
            </a-steps>
          </div>
          <div class="flex flex-wrap justify-between  bottom-card w-full">
            <!-- <div v-for="item in powerList" class="rounded-lg h-1/6  mt-2 flex flex-row items-center p-2 relative"
              style="width: calc(50% - 8px);"
              :style="item.detail[[leveList[clickGrade]]] ? 'background: rgba(42, 42, 42, 1)' : 'background: rgba(42, 42, 42, 1);opacity: 0.6;'"> -->
              <div v-for="item in powerList" class="rounded-lg h-1/6  mt-2 flex flex-row items-center p-2 relative"
              style="width: calc(50% - 8px);"
              :style="item.detail[[leveList[clickGrade]]] ? 'background: var(--secondary-bg)' : 'background: var(--secondary-bg);opacity: 0.6;'">
              <Icon :icon="item.icon" style="width: 24px;height: 24px;color: var(--primary-text);" class="mr-4 ml-2 text-white"></Icon>
              <div style="width: calc(100% - 50px)">
                <div class="text-white text-more w-full xt-text"  >{{ item.alias }}</div>
                <div v-if="item.detail[[leveList[clickGrade]]]" class=" text-more w-full xt-text-2">
                  {{ item.detail[[leveList[clickGrade]]] }}</div>
              </div>
              <div class="grade-tip" style="color: rgba(255, 255, 255, 0.85);" v-if="item.noOnline">即将上线</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </vueCustomScrollbar>
  <div class="home-blur fixed inset-0 float-tip" style="z-index: 999" v-if="tipFlag" @click.stop="closeTip">
    <div class="rounded-lg  w-96  h-60  px-5 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      style="background: rgba(33, 33, 33, 1);">
      <div class="flex items-center -ml-4 mt-3">
        <Icon icon="-dengpao" style="width: 24px;height: 24px;" class="mx-2 text-white"></Icon>Tips
      </div>
      <div class="h-2/3 w-full rounded-lg flex flex-col justify-evenly px-4 mt-2"
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
export default {
  name: "Grade",
  components: { GradePanel },
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
    }
  },
  mounted() {

    this.grade = this.userInfo.onlineGradeExtra
    this.clickStep(this.abilityGrade)
  },
  methods: {
    openGradeTip() {
      this.tipFlag = true
    },
    closeTip() {
      this.tipFlag = false
    },
    clickStep(e) {
      for (let i = 0; i < this.$refs.step.$el.children.length; i++) {
        this.$refs.step.$el.children[i].children[0].children[2].children[0].style.background = ''
      }
      this.$refs.step.$el.children[e].children[0].children[2].children[0].style.background = 'var(--active-bg)'
      this.clickGrade = e
    }
  }
}
</script>

<style lang="scss" scoped>
.left-box {
  :deep(.ant-steps-item-title) {
    color: var(--primary-text) !important;
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
