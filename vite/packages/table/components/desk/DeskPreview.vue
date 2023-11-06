<template>
  <!-- 预览 -->
  <div class="prompt-modal xt-mask" v-if="showModal">
    <div class="head-icon">
      <div class="icon" @click="close">
        <Icon icon="guanbi" style="width: 24px;height: 24px;"></Icon>
      </div>
      <div class="flex">
        <div class="icon" @click="openDrawer = true">
          <Icon icon="tishi-xianxing" style="width: 24px;height: 24px;"></Icon>
        </div>
      </div>

    </div>
    <!-- 预览 -->
    <!-- <div class="flex justify-center items-center preview" :style="{'--previewH': previewH}" id="cards" readonly> -->
    <div class="flex justify-center items-center preview" id="previewContent">
      <!-- 市场分享 桌面布局定位 -->
      <Desk  :freeLayout="false" :currentDesk="displayScheme" :settings="displayScheme.settings" :notTrigger="true" :editing="false"></Desk>
    </div>
    <div class="foot flex ">
      <div class="flex items-center mr-2">
        <strong class="mr-2">{{ scheme.alias }}</strong> 共{{ template.cards.length }}个组件，尺寸
        {{ layoutSize.width + '*' + layoutSize.height }}
        <Icon icon="tishi-xianxing" class="ml-3" style="width: 24px;height: 24px;"></Icon>
      </div>
      <div class="flex" style="padding: 0">
   <xt-task @cb="addPlan" :modelValue="m03026">
    <div class="market-button mr-2 active" @click="addPlan"><icon icon="xiazai1"></icon> 立即添加</div>
   </xt-task>
        <div class="market-button mr-0" @click="doIncSupport"><icon icon="dianzan"></icon> 点赞 {{displayScheme.support}}</div>
      </div>
    </div>
  </div>
  <!-- 预览添加抽屉 -->
  <a-drawer v-model:visible="openDrawer" style="z-index:9999999999;" width="320" placement="right">
    <template #closeIcon>
      <Icon icon="xiangyou"></Icon>
    </template>
    <template #extra v-if="!displayScheme.uid===userInfo.uid">
      <a-space>
        <div class="flex">
          <div class="pointer mr-3 xt-bg-2 xt-text h-12 w-12 flex items-center rounded-lg justify-center"
               @click="openSet = true">
            <Icon icon="dianzan" style="font-size: 1.5em;"></Icon>
          </div>
          <div class="add-scheme" @click="addPlan"><icon icon="xiazai1"></icon>立即添加</div>
        </div>
      </a-space>
    </template>
    <div class="drawer-center no-drag">
      <span class="drawer-title">{{ scheme.alias }} <span class="xt-text-2 " style="user-select: text">{{scheme.nanoid}}</span></span>
      <span class="drawer-text">{{ scheme.summary }}</span>
      <div class="flex" v-if="tagList.length>0">
        <div class="label" v-for="tag in tagList">{{ tag }}</div>
      </div>
      <div class="flex justify-between items-center">
        <span class="flex items-center my-4">
          <div>
            <a-avatar size="24" :src="displayScheme.userInfo?.avatar">
            </a-avatar>
          </div>
          <span class="ml-3" style="color: var(--secondary-text);">{{ scheme.userInfo?.nickname }}</span>
        </span>
        <span style="color: var(--secondary-text);">
          <span>
            <Icon icon="dianzan" class="mr-2"></Icon>
            <span>{{ scheme.support }}</span>
          </span>
          <span class="ml-3">
            <Icon icon="xiazai" class="mr-2"></Icon>
            <span>{{ scheme.count }}</span>
          </span>
        </span>
      </div>
      <span class="drawer-title">包含以下小组件（{{ template.cards.length }}）</span>
      <div v-for="item in template.cards" :key="item" class="drawer-item">
        <Icon :icon="item.icon" class="mr-2"></Icon>
        <span>{{ item.name }}</span>
      </div>
    </div>
  </a-drawer>
</template>

<script>
import { message } from 'ant-design-vue'
import { mapActions, mapWritableState } from 'pinia'
import { appStore } from '../../store'
import Desk from './Desk.vue'
import { cardStore } from '../../store/card'
import {nanoid} from 'nanoid'
import { marketStore } from '../../store/market'
import { taskStore } from '../../apps/task/store'
export default {
  name: 'DeskPreview',
  components: {
    Desk
  },
  data () {
    return {
      // 添加
      openDrawer: false,
      previewH: '100%',
      displayScheme: {
        title: '',
        nanoid: '',
        cards: [],
        settings: {}
      },
      deskWidth: 0,
      deskHeight: 0,
      cardHeight: 0,
      zoom: 0,
      cardZoom: 0,
      windowWidth: document.body.clientWidth,
      windowHeight: document.body.clientHeight,
      previewWidth: 0,
      previewHeight: 0,
    }
  },
  props: {
    // 方案
    scheme: {
      type: Object,
      default: {},
    },
    //显示与隐藏
    showModal: {
      type: Boolean,
      default: () => false
    },
    deskList: {
      type: Array
    }
  },
  computed: {
    ...mapWritableState(appStore, ['fullScreen','userInfo']),
    ...mapWritableState(taskStore, ["taskID", "step"]),
    m03026() {
      return this.taskID == "M0302" && this.step == 6
    },
    tagList () {
      if (this.scheme.tags) {
        return this.scheme.tags.split(',')
      } else {
        return []
      }
    },
    layoutSize () {
      return JSON.parse(this.scheme.layoutSize)
    },
    template () {
      return JSON.parse(this.scheme.template)
    }
  },
  watch: {
    showModal (newVal) {
      if (newVal) this.fullScreen = true
      if (this.fullScreen) {
        this.cardZoom = this.template.settings.cardZoom
        this.cardMargin=this.template.settings.cardMargin
        this.zoom = this.cardZoom / 100
        this.getPreviewHeight()
        this.displayScheme = {
          ...this.scheme,
          settings: {
            ...this.template.settings
          },
          cards:[
            ... this.template.cards
          ],
        }
        this.deskWidth = this.layoutSize.width
        this.deskHeight = this.layoutSize.height
        this.cardHeight = this.layoutSize.height
        var that = this
        window.addEventListener('resize', () => {
          that.getPreviewHeight()
        })
      }
    },
    // windowHeight(val){
    //   // let zoom = (val / this.deskHeight * 100).toFixed(2)
    //   // this.cards.settings.cardZoom = zoom
    //   let cardContent2 = window.getComputedStyle(document.getElementById("cardContent"));
    //   let cardContent = document.getElementById("cardContent");
    //   this.previewHeight = cardContent.offsetHeight
    //   let previewHeight2 = cardContent.clientHeight
    //   let cardZoom = (((this.zoom * this.previewHeight) / this.cardsHeight) * 100).toFixed()
    //   this.cards.settings.cardZoom = cardZoom
    // }
  },
  methods: {
    ...mapActions(cardStore, ['addShareDesk', 'setDeskSize']),
    ...mapActions(marketStore,['incSupport']),
    async doIncSupport(){
      const rs=await this.incSupport(this.displayScheme.dataNanoid)
      if(rs && rs.msg.includes('取消')){
        this.displayScheme.support=rs.supportCount
        message.success('已取消点赞')
      }else{
        console.log(rs)
        this.displayScheme.support=rs.supportCount
        message.success('感谢您的支持，您的支持是对作者最大的鼓励。')
      }
    },
    addPlan () {
      this.close()
      this.addShareDesk({
        ...this.displayScheme,
        title:this.displayScheme.alias,
        cards:this.template.cards,
        settings:this.template.settings
      },this.layoutSize, this.deskList)
      message.success('添加成功')
      this.$emit('afterAdded')
      this.openDrawer = false
      // setTimeout(() => {
      //   let cardsHeight = document.getElementById('cardContent')?.offsetHeight
      //   let deskHeight = document.documentElement.clientHeight // 高
      //   let deskWidth = document.documentElement.clientWidth // 宽
      //   let size = {
      //     deskWidth,
      //     deskHeight,
      //     cardsHeight,
      //   }
      //   this.setDeskSize(size)
      //   this.cardsHeight = cardsHeight
      // }, 300)
    },
    close () {
      // this.cards.settings.cardZoom = this.cardZoom
      this.$emit('closePreview', false)
      this.fullScreen = false
    },
    getPreviewHeight () {
      this.$nextTick(() => {
        if (this.fullScreen) {
          //计算得出修正后的缩放率
          this.previewHeight = document.getElementById('previewContent')?.offsetHeight
          let cardZoom = (this.cardZoom * this.previewHeight / this.cardHeight).toFixed()
          let cardMargin=(this.cardMargin * this.previewHeight / this.cardHeight).toFixed()
          this.displayScheme.settings.cardZoom = cardZoom
          this.displayScheme.settings.cardMargin=cardMargin
          this.displayScheme.settings.enableZoom=true
        }
      })
    }

  },
  mounted () {
  },
}
</script>

<style lang="scss" scoped>

.prompt-modal {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  // justify-content: space-between;
  padding: 12px;
  z-index: 9999999999;

  .head-icon {
    width: 100%;
    display: flex;
    justify-content: space-between;
    height: 10%;

    .icon {
      background: var(--secondary-bg);
      color: var(--primary-text);
      border-radius: 12px;
      width: 48px;
      height: 48px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }
  }

  .foot {
    display: flex;
    justify-items: center;
    align-items: end;
    height: 10%;
    // position: absolute;
    // bottom: 15px;
    > div {
      background: var(--mask-bg);
      border-radius: 12px;
      height: 48px;
      line-height: 48px;
      padding: 0 16px;
      font-size: 16px;
      color: var(--secondary-text);
    }
  }
}

.add-scheme {
  background: var(--active-bg);
  font-size: 16px;
  color: var(--primary-text);
  border-radius: 12px;
  width: 128px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.drawer-center {
  height: 100%;
  display: flex;
  flex-direction: column;

  .drawer-title {
    font-size: 16px;
    color: var(--primary-text);
    font-weight: 600;
  }

  .label {
    background: rgba(255, 255, 255, 0.4);
    border-radius: 4px;
    font-size: 14px;
    padding: 0 8px;
    color: var(--secondary-text);
    margin-right: 12px;
  }

  .drawer-text {
    font-size: 14px;
    color: var(--secondary-text);
    font-weight: 400;
    margin: 8px 0 16px;
  }

  .drawer-item {
    height: 48px;
    background: var(--secondary-bg);
    border-radius: 12px;
    display: flex;
    align-items: center;
    margin: 16px 0 0;
    padding: 0 14px;
    font-size: 16px;
    color: var(--primary-text);
    font-weight: 400;
  }
}

.test-style {
  height: 100%;
  width: 100%;
  position: relative;
}

.desk-style {
  position: relative;
}

.desk-style::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 9;
}

.preview {
  width: 95%;
  height: 75%;
  // height:var(--previewH);
}
.market-button {
  border-radius: 8px;
  width: 100px;
  height: 42px;
  display: flex;
  justify-content: center;
  align-items: center;
 color:var(--primary-text);
  padding: 10px;
  cursor: pointer;
  &.active,&:hover{
    background: var(--active-bg);
    color: var(--active-text);
  }
  &:hover{
    opacity: 0.9;
  }
}
//  .preview2{
//   width:95%;
//   height: 90%;
//  }
</style>
