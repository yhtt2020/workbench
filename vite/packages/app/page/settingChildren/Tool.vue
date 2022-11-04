<template>
  <h3>开发者工具
  </h3>

  <div>

    <p>请先申请为开发者，灰色工具需要成为开发者方可使用。</p>
  </div>
  <a-card>
    <router-link :to="{path:'export'}"><a-card-grid  style="width: 25%; text-align: center"><upload-outlined  class="icon" /> 配置导出</a-card-grid></router-link>
    <a-card-grid class="disabled" style="width: 25%; text-align: center" ><cloud-upload-outlined class="icon" /> 快速上架</a-card-grid>
    <a-card-grid class="disabled" style="width: 25%; text-align: center"><shopping-outlined class="icon" /> 开发者后台</a-card-grid>
    <a @click="openDoc" target="_blank"><a-card-grid style="width: 25%; text-align: center"><book-outlined class="icon"/> 在线文档</a-card-grid></a>
  </a-card>
</template>

<script>
import { mapWritableState, mapActions } from 'pinia'
import { appStore } from '../../store'
import { CodeTwoTone,UploadOutlined,ShoppingOutlined,CloudUploadOutlined,UserOutlined,BookOutlined} from '@ant-design/icons-vue'

export default {
  name: 'develop',
  components: {
    CodeTwoTone,UploadOutlined,ShoppingOutlined,CloudUploadOutlined,UserOutlined,BookOutlined
  },
  computed: {
    ...mapWritableState(appStore, ['app', 'debugMod'])
  },
  methods: {
    ...mapActions(appStore, ['toggleDebug']),
    openDoc(){
      window.ipc.send('addTab',{url:'https://a.apps.vip/docs'})
    }
  }
}
</script>

<style scoped>
.icon{
  font-size: 24px;vertical-align: middle;
  display: block;
  margin-bottom: 8px;
}
.disabled{
  color: grey;
}
</style>
