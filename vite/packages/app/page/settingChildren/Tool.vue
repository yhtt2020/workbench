<template>
  <h3>开发者工具
    <span style="font-size: 13px;float:right;font-weight: normal">
      当前开发者：<a-avatar >
      <template #icon><UserOutlined /></template>
    </a-avatar> 未登录
    </span>
  </h3>

  <div>

    <p>请先申请为开发者，灰色工具需要成为开发者方可使用。</p>
  </div>
  <a-card>
    <a-card-grid  style="width: 25%; text-align: center"><upload-outlined  class="icon" /> 配置导出</a-card-grid>
    <a-card-grid class="disabled" style="width: 25%; text-align: center" ><cloud-upload-outlined class="icon" /> 快速上架</a-card-grid>
    <a-card-grid class="disabled" style="width: 25%; text-align: center"><shopping-outlined class="icon" /> 开发者后台</a-card-grid>
  </a-card>
</template>

<script>
import { mapWritableState, mapActions } from 'pinia'
import { appStore } from '../../store'
import { CodeTwoTone,UploadOutlined,ShoppingOutlined,CloudUploadOutlined,UserOutlined} from '@ant-design/icons-vue'

export default {
  name: 'develop',
  components: {
    CodeTwoTone,UploadOutlined,ShoppingOutlined,CloudUploadOutlined,UserOutlined
  },
  computed: {
    ...mapWritableState(appStore, ['app', 'debugMod'])
  },
  methods: {
    ...mapActions(appStore, ['toggleDebug'])
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
