<template>
  <!-- 预览 -->
  <teleport to="body">
    <Modal :zIndex="999"  v-if="showModal" v-model:visible="modalVisible"  :blur-flag="true" :mask-no-close="false">
      <div class="no-drag flex flex-col relative" style="width:90vw;height:90vh">
        <div class="head-icon flex">
          <div class="icon" @click="close">
            <Icon icon="guanbi" style="width: 24px;height: 24px;"></Icon>
          </div>
          <div class="icon" @click="openDrawer = true">
            <Icon icon="tishi-xianxing" style="width: 24px;height: 24px;"></Icon>
          </div>
        </div>
        <div class="flex-1 h-0 ">
          <ShortcutKeyList :noClick="true" :keyList="keyScheme.keyList" ></ShortcutKeyList>
        </div>
        <div class="foot flex item-content py-4">
          <div class="mr-5 xt-text font-16 pb-2 " style="width: 120px">{{ keyScheme.number }} 个快捷键</div>

          <xt-button @click="importScheme" type="theme" :w="140">下载方案</xt-button>
          <xt-button class="ml-4" @click="this.modalVisible=false">关闭</xt-button>
        </div>
      </div>

    </Modal>
    <!-- 预览添加抽屉 -->
    <a-drawer v-model:visible="openDrawer" style="z-index:9999;" width="320" placement="right">
      <template #closeIcon>
        <Icon icon="xiangyou"></Icon>
      </template>
      <template #extra v-if="!keyScheme.isMyCreate">
        <a-space>
          <div class="add-scheme" @click="addPlan(keyScheme)">立即添加</div>
        </a-space>
      </template>
      <div class="drawer-center">
      <span class="h-14 w-14 flex justify-center items-center">
        <a-avatar shape="square" :src="keyScheme.icon" :size="48"></a-avatar>
      </span>
        <span class="mt-4" style="font-size: 18px;color: var(--primary-text);font-weight: 500;">{{ keyScheme.name }}</span>
        <span class="mt-1 whitespace-pre-wrap break-all" style="font-size: 16px;color: var(--secondary-text);">{{ keyScheme.commonUse }}</span>
        <!--      <span class="flex items-center my-4">-->
        <!--        <div>-->
        <!--          <a-avatar size="24">-->
        <!--              <template #icon><UserOutlined /></template>-->
        <!--          </a-avatar>-->
        <!--        </div>-->
        <!--        <span class="ml-3" style="color: var(&#45;&#45;secondary-text);">{{ keyScheme.nickName }}</span>-->
        <!--      </span>-->
        <!--      <span style="color: var(&#45;&#45;secondary-text);">-->
        <!--        <span>-->
        <!--          <Icon icon="dianzan" class="mr-2"></Icon>-->
        <!--          <span>{{ keyScheme.sumLikes }}</span>-->
        <!--        </span>-->
        <!--        <span class="ml-3">-->
        <!--          <Icon icon="xiazai" class="mr-2"></Icon>-->
        <!--          <span>{{ keyScheme.download }}</span>-->
        <!--        </span>-->
        <!--      </span>-->
      </div>
    </a-drawer>
  </teleport>


</template>

<script>
import ShortcutKeyList from '../shortcutKey/ShortcutKeyList.vue';
import { message } from 'ant-design-vue';
import { mapActions, mapWritableState } from "pinia";
import { keyStore } from '../store'
import Modal from '../../../components/Modal.vue'
export default {
  name: "Preview",
  components: {
    Modal,
    ShortcutKeyList
  },
  data() {
    return {
      modalVisible:false,
      // 快捷方案
      // keyScheme: {},
      // 预览
      // showModal: false,
      // 添加
      openDrawer: false
    }
  },
  props: {
    // 快捷方案
    keyScheme: {
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
  },
  watch: {
    showModal:{
      handler(newVal){
        this.modalVisible=newVal
      }
    },
    modalVisible:{
      handler(newVal){
        this.$emit("update:showModal",newVal)
      }
    }
  },
  methods: {
    ...mapActions(keyStore,['setShortcutKeyList','import']),
    addPlan(keyScheme){
      this.setShortcutKeyList(keyScheme)
      message.success('添加成功');
      this.openDrawer = false
      this.$emit('closePreview',false)
    },
    close(){
      this.$emit('closePreview',false)
    },
    async importScheme () {
      if (await this.import([this.keyScheme])) {
        message.success('下载方案成功。')
        this.close()
      } else {
        message.error('下载方案失败。')
      }
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
      z-index: 99;

    }
  .head-icon{
    width: 100%;
    display: flex;
    flex-direction: row-reverse;
    justify-content: flex-start;
    gap:10px;
    padding-right: 10px;
    padding-top: 10px;
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
    }
    .drawer-center{
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 30%;
    }
</style>
