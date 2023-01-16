<template>
<h3>应用信息</h3>
  <a-form :model="userSetting" style="padding: 20px" :label-col="{span:5}" :wrapper-col="{span:19}">
    <a-form-item
      label="应用名"
      :rules="{ required: true, message: '应用名称，长度大于1，小于16' ,min:1,max:16 }"
    >
      <a-input v-model:value="userSetting.name"
               placeholder="输入应用名称"
      />
    </a-form-item>
    <a-form-item
      label="应用起始地址：" >
                    <span v-if="!debugMod" class="ant-form-text" style="text-overflow: ellipsis;
  white-space: nowrap;display: inline-block;word-break: break-all; overflow: hidden;">
        {{ this.userSetting.url }}
      </span>
      <a-input v-else v-model:value="userSetting.url"/>
    </a-form-item>
    <a-form-item
      label="应用说明"
      :rules="{ required: true, message: '请输入应用说明' }"
    >
      <a-textarea v-model:value="userSetting.summary"
        placeholder="输入应用说明" :maxlength="50"
      />
    </a-form-item>
    <a-form-item label="自定义主题色">
      <div>
        <a-popover style="background: transparent;border: none" title="选择颜色">
          <template #content>
            <SketchPicker v-model="this.userSetting.theme_colors"></SketchPicker>
          </template>
          <span class="theme-color" :style="{'background-color':this.userSetting.theme_colors.hex} "></span>
        </a-popover>
      </div>
    </a-form-item>
  </a-form>
</template>

<script>
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
}
const formTailLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8, offset: 4 },
}
import { appStore } from '../../store'
import { mapWritableState } from 'pinia'
import {Sketch} from '@lk77/vue3-color'
import DebugTip from '../../components/DebugTip.vue'
export default {
  name: 'BaseInfo',
  computed: {
    ...mapWritableState(appStore, ['app','debugMod','userSetting'])
  },
  data () {
    return {
      formItemLayout,
      formTailLayout,
    }
  },
  components:{
    DebugTip,'SketchPicker':Sketch
  },
  methods:{
  },
  mounted () {

  },

}
</script>

<style scoped>
.theme-color {
  width: 42px;
  height: 42px;
  display: inline-block;
  border-radius: 100%;
}
</style>
