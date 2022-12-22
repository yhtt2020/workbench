<template>
  <a-page-header
    style="border: 1px solid rgb(235, 237, 240);padding:0 10px !important;"

    sub-title="密码备注"
    @back="this.goBack"
  >
    <template #title>
      {{password.title}}
    </template>
    <template #extra>
      <a-button v-if="!editing" @click="editing=true" size="" key="1" type="primary">编辑</a-button>
      <a-button v-else @click="editing=false" type="primary">保存</a-button>
    </template>
  </a-page-header>
  <div style="padding: 10px" v-if="!editing">
  <div v-html="valueHtml"></div>
  </div>
  <div  v-else>
    <Toolbar
      style="border-bottom: 1px solid #ccc"
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      :mode="mode"
    />

    <Editor
      style="height: 500px; overflow-y: hidden;"
      v-model="valueHtml"
      :defaultConfig="editorConfig"
      :mode="mode"
      @onCreated="handleCreated"
    />
  </div>
</template>

<script lang="ts">
import '@wangeditor/editor/dist/css/style.css' // 引入 css

import { onBeforeUnmount, ref, shallowRef, onMounted } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import {mapActions} from "pinia";
import {appStore} from "../store";
export default {
  name:'RemarkEditor',
  components: { Editor, Toolbar },
  data(){
    return{
      editing:false,
      password:{
        originData:{
          uuid:{}
        }
      }
    }
  },
  mounted() {
    console.log(this.$route.params.uuid)
    this.password=this.getPasswordByUuid(this.$route.params.uuid)
    console.log(this.password)
    if(this.password){
      this.valueHtml=this.password.originData.fields.get('Notes')
    }else{
      console.log(  this.$router.history,'找出历史')

      this.$router.go(-1)
    }

  },
  methods:{
    goBack(){
      this.$router.go(-1)
    },
    ...mapActions(appStore,['getPasswordByUuid'])
  },
  setup() {
    // 编辑器实例，必须用 shallowRef
    const editorRef = shallowRef()

    // 内容 HTML
    const valueHtml = ref('')

    // 模拟 ajax 异步获取内容
    onMounted(() => {
      // setTimeout(() => {
      //   valueHtml.value = '<p>模拟 Ajax 异步设置内容</p>'
      // }, 1500)
    })

    const toolbarConfig = {}
    const editorConfig = { placeholder: '请输入内容...' }

    // 组件销毁时，也及时销毁编辑器
    onBeforeUnmount(() => {
      const editor = editorRef.value
      if (editor == null) return
      editor.destroy()
    })

    const handleCreated = (editor) => {
      editorRef.value = editor // 记录 editor 实例，重要！
    }

    return {
      editorRef,
      valueHtml,
      mode: 'default', // 或 'simple'
      toolbarConfig,
      editorConfig,
      handleCreated
    };
  }
}
</script>

<style scoped>

</style>
