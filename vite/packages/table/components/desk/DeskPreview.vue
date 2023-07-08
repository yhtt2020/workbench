<template>
  <!-- 预览 -->
  <div class="prompt-modal xt-mask" v-show="showModal">
    <div class="head-icon">
      <div class="icon" @click="close">
        <Icon icon="guanbi" style="width: 24px;height: 24px;"></Icon>
      </div>
      <div class="icon" @click="openDrawer = true">
        <Icon icon="tishi-xianxing" style="width: 24px;height: 24px;"></Icon>
      </div>
    </div>
    <div class="flex justify-center items-center" style="width:60%;height:80%">
      <a-image width="100%" :preview="false" src="../../../../../public/img/test/deckImg.jpg" />
      <!-- <img style="width:100%;height:100%;object-fit: cover;" :src="scheme.deskImg" /> -->
    </div>
    <div class="foot">
      <div class="flex items-center">
        桌面尺寸 {{ scheme.size }}
        <Icon icon="tishi-xianxing" class="ml-3" style="width: 24px;height: 24px;"></Icon>
      </div>
    </div>
  </div>
  <!-- 预览添加抽屉 -->
  <a-drawer v-model:visible="openDrawer" style="z-index:9999;" width="320" placement="right">
    <template #closeIcon>
      <Icon icon="xiangyou"></Icon>
    </template>
     <template #extra v-if="!scheme.isMyCreate">
      <a-space>
        <div class="flex">
          <div class="pointer mr-3 xt-bg-2 xt-text h-12 w-12 flex items-center rounded-lg justify-center" @click="openSet = true">
            <Icon icon="dianzan" style="font-size: 1.5em;"></Icon>
          </div>
          <div class="add-scheme" @click="addPlan(scheme)">立即添加</div>
        </div>
      </a-space>
    </template>
    <div class="drawer-center">
      <span class="drawer-title">{{ scheme.title }}</span>
      <span class="drawer-text">{{ scheme.blurb }}</span>
      <div class="flex">
        <div class="label" v-for="x in scheme.labelList" :key="x">{{ x }}</div>
      </div>
      <div class="flex justify-between items-center">
        <span class="flex items-center my-4">
          <div>
            <a-avatar size="24">
                <template #icon><UserOutlined /></template>
            </a-avatar>
          </div>
          <span class="ml-3" style="color: var(--secondary-text);">{{ scheme.nickName }}</span>
        </span>
        <span style="color: var(--secondary-text);">
          <span>
            <Icon icon="dianzan" class="mr-2"></Icon>
            <span>{{ scheme.sumLikes }}</span>
          </span>
          <span class="ml-3">
            <Icon icon="xiazai" class="mr-2"></Icon>
            <span>{{ scheme.download }}</span>
          </span>
        </span>
      </div>
      <span class="drawer-title">包含以下小组件（{{scheme.cardList.length}}）</span>
      <div v-for="item in scheme.cardList" :key="item" class="drawer-item">
        <Icon :icon="item.icon" class="mr-2"></Icon>
        <span>{{ item.name }}</span>
      </div>
    </div>
  </a-drawer>
</template>

<script>
import ShortcutKeyList from '../../components/shortcutKey/ShortcutKeyList.vue';
import { message } from 'ant-design-vue';
import { mapActions, mapWritableState } from "pinia";
import { appStore } from '../../store';
export default {
  name: "DeskPreview",
  components: {
    ShortcutKeyList
  },
  data() {
    return {
      // 添加
      openDrawer: false
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
    }
  },
  computed: {
    ...mapWritableState(appStore, ['fullScreen']),
  },
  watch: {
    showModal(newVal){
      if(newVal)this.fullScreen = true
    }
  },
  methods: {
    addPlan(scheme){
      message.success('添加成功');
      this.openDrawer = false
      this.$emit('closePreview',false)
      this.fullScreen = false
    },
    close(){
      this.$emit('closePreview',false)
      this.fullScreen = false
    }
  }
}
</script>

<style lang="scss" scoped>
    .prompt-modal{
      position: absolute;
      top:0;
      bottom:0;
      right:0;
      left:0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 12px;
      z-index: 9999;
      .head-icon{
        width: 100%;
        display: flex;
        justify-content: space-between;
        height: 10%;
        .icon{
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
      .foot{
        display: flex;
        justify-items: center;
        align-items: end;
        height: 10%;
        >div{
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
    .add-scheme{
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
    .drawer-center{
      height: 100%;
      display: flex;
      flex-direction: column;
      .drawer-title{
        font-size: 16px;
        color: var(--primary-text);
        font-weight: 600;
      }
      .label{
        background: rgba(255, 255, 255, 0.4);
        border-radius: 4px;
        font-size: 14px;
        padding: 0 8px;
        color: var(--secondary-text);
        margin-right: 12px;
      }
      .drawer-text{
        font-size: 14px;
        color: var(--secondary-text);
        font-weight: 400;
        margin: 8px 0 16px;
      }
      .drawer-item{
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
</style>
