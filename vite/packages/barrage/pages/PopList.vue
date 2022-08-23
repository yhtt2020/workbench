<script lang="ts">
import { createVNode } from 'vue';
import {
  PlusOutlined,
  AppstoreAddOutlined,
  FolderOpenOutlined,
  ChromeOutlined,
  EyeOutlined,
  EllipsisOutlined,
  EyeInvisibleOutlined,
  GoogleOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons-vue '
import { Modal } from 'ant-design-vue';

export default {
  components: {
    PlusOutlined,
    AppstoreAddOutlined,
    FolderOpenOutlined,
    ChromeOutlined,
    GoogleOutlined,
    EyeOutlined,
    EllipsisOutlined,
    EyeInvisibleOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined
  },
  data() {
    return {
      userDataPath: '',
      ipc: null,
    }
  },
  async mounted() {
    // this.ipc = tsbApi.ipc
    // this.ipc.on('show', () => {
    //   this.getList()
    // })
    // this.ipc.on('reload', () => {
    //   this.getList()
    // })
  },
  methods: {
    close(){
      tsbApi.window.close()
    },
    async getList() {

    },
    getId() {

    },
    openShop(name = 'chrome') {
      ipc.send('openExtShop', {
        name
      })
    }
  }
}
</script>

<template>
  <div style="background: rgba(0,0,0,0.55);border-radius: 8px;height: calc(100vh - 30px)">
    此处为弹幕框

  </div>
  <div style="text-align: center">
    <a-button type="ghost" @click="close">关闭</a-button>
  </div>
</template>
<style>
html, body {
  overflow: hidden !important;
  background-color: #00000000 !important;
}
</style>
<style scoped lang="scss">

.scroller-wrapper {
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #ffffff;
    border-radius: 2px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgb(176, 176, 176);
    border-radius: 20px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #747474;
  }

  &::-webkit-scrollbar-corner {
    background: #f6f6f6;
  }
}


</style>
