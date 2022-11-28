<template>
<h3>作者信息</h3>
  <p>此处的作者信息是离线信息，在用户安装的时候写入到应用当中，可以根据实际情况填写。</p>
  <a-form :model="formState" style="padding: 20px" :label-col="{span:5}" :wrdevApper-col="{span:19}">
    <a-form-item
      label="作者名称"
      :rules="{ required: true, message: '应用名称，长度大于1，小于16' ,min:1,max:16 }"
    >
      <a-input v-model:value="devApp.author"
               placeholder="输入作者名称"
      />
    </a-form-item>
    <a-form-item
      label="作者官网"
      :rules="{ required: true, message: '应用名称，长度大于1，小于16' ,min:1,max:16 }"
    >
      <a-input v-model:value="devApp.site"
               placeholder="输入官网地址"
      />
    </a-form-item>
    <a-form-item
                  label="是否开源：">
      <template #extra>
        <DebugTip tip="os_summary" />
      </template>
      <a-switch  v-model:checked="devApp.open_source"/>
    </a-form-item>
    <a-form-item  v-if="devApp.open_source"
      label="开源代码地址：">
      <template #extra>
      <DebugTip tip="open_source" />
      </template>
        <a-input  v-model:value="devApp.csv_url"/>
    </a-form-item>
    <a-form-item
      label="开源说明"
      :rules="{  message: '' }"
    >
      <a-textarea v-model:value="devApp.os_summary"
        placeholder="开源说明"
      />
      <template #extra>
        <DebugTip tip="os_summary" />
      </template>
    </a-form-item>
  </a-form>
</template>

<script>
import { message, Upload } from 'ant-design-vue';
const formItemLayout = {
  labelCol: { span: 6 },
  wrdevApperCol: { span: 16 },
}
const formTailLayout = {
  labelCol: { span: 4 },
  wrdevApperCol: { span: 8, offset: 4 },
}
import { appStore } from '../../store'
import { mapWritableState } from 'pinia'
import DebugTip from '../../components/DebugTip.vue'
const path=require('path')
const fs=require('fs')
export default {
  name: 'Author',
  computed: {
    ...mapWritableState(appStore, ['devApp','debugMod'])
  },
  components:{
    DebugTip
  },
  methods:{
  },
  mounted () {
    this.formState.name = this.devApp
  },
  data () {
    return {
      formItemLayout,
      formTailLayout,
      formState: {
        name: '',
        summary: '',
        theme_color: '',
        optimize: '',
        user_theme_colors: {
          hex:'#ffffff'
        }
      },
    }
  }
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
