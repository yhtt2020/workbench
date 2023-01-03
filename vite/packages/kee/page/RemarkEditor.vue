<template>
  <a-page-header class="page-header"
    style="border: 1px solid rgb(235, 237, 240);padding:0 10px !important;"
    sub-title="密码备注"
    @back="this.goBack"
  >
    <template #title>
      <div style="-webkit-app-region:drag">
        <span style="-webkit-app-region:none">{{password.title}}</span>
      </div>

    </template>
    <template #extra>
      <div>
        <a-button v-if="!editing" @click="startEdit" key="1" type="primary">编辑</a-button>
        <a-button v-else-if="editing && oldHtml!==valueHtml" @click="save"  style="margin-right: 10px" type="primary">保存</a-button>
        <a-button v-if="editing" @click="stopEdit">取消</a-button>
      </div>

    </template>
  </a-page-header>
  <div class="remark-content" style="padding: 10px" v-if="!editing">
    <vue-custom-scrollbar :settings="settings" style="position:relative;height:calc(100vh - 40px)"
    >
  <div v-html="valueHtml"></div>
    </vue-custom-scrollbar>
  </div>
  <div  v-else>
    <Toolbar
      style="border-bottom: 1px solid #ccc"
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      :mode="mode"
    />

    <Editor
      style="height: calc(100vh - 40px); overflow-y: hidden;"
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
import api from '../../../src/model/api.js'


import vueCustomScrollbar from "../../../src/components/vue-scrollbar.vue";
import {mapActions} from "pinia";
import {appStore} from "../store";
import {message} from 'ant-design-vue'
export default {
  name:'RemarkEditor',
  components: { Editor, Toolbar ,  vueCustomScrollbar,},
  data(){
    return{
      settings: {
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: false,
      },
      editing:false,
      oldHtml:'',
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
    startEdit(){
      this.editing=true
      this.oldHtml=this.valueHtml
    },
    save(){
      try{
        this.changeEntry(this.password.uuid,{
          notes:this.valueHtml
        },(entry=>{
          this.editing=false
          this.password.originData.fields.set('Notes',this.valueHtml)
          this.saveDb((result)=>{
            if(result)
            {
              message.success('保存成功。')
              this.editing=false
            }
          })
        }))
      }catch (e) {
        message.error('保存失败'+e)
      }


    },
    stopEdit(){
      this.valueHtml=this.oldHtml
      this.editing=false
    },
    goBack(){
      this.$router.go(-1)
    },
    ...mapActions(appStore,['getPasswordByUuid','changeEntry','saveDb'])
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
    const editorConfig = { placeholder: '请输入内容...' ,MENU_CONF:{},}

    // 组件销毁时，也及时销毁编辑器
    onBeforeUnmount(() => {
      const editor = editorRef.value
      if (editor == null) return
      editor.destroy()
    })

    const handleCreated = (editor) => {
      editorRef.value = editor // 记录 editor 实例，重要！
    }
    editorConfig.MENU_CONF['uploadImage'] = {

      maxFileSize: 10 * 1024 * 1024,

      // 最多可上传几个文件，默认为 10
      maxNumberOfFiles: 10,

      metaWithUrl: false,


      // 跨域是否传递 cookie ，默认为 false
      withCredentials: true,

      // 超时时间，默认为 10 秒
      timeout: 5 * 1000, // 5 秒

      async customUpload(file, insertFn) {                   // JS 语法
        // file 即选中的文件
        // 自己实现上传，并得到图片 url alt href
        // 最后插入图片
        let url
        var formData = new FormData();
        formData.append("file",file)

        await api.getCosUpload(formData, (err, data) => {
          if (!err) {
            message.error('图片上传失败')
          } else {
            url = 'http://' + data.data.data
            insertFn(url)
          }
        })
        // api.getCosUpload(formData).then((data) => {
        //   if (data.data.code === 1000) {
        //     url = 'http://' + data.data.data
        //     insertFn(url)
        //   } else {
        //     message.error('图片上传失败')
        //   }
        // })

      },
    }
    editorConfig.MENU_CONF['uploadImage'] = {

      maxFileSize: 10 * 1024 * 1024,

      // 最多可上传几个文件，默认为 10
      maxNumberOfFiles: 10,

      metaWithUrl: false,


      // 跨域是否传递 cookie ，默认为 false
      withCredentials: true,

      // 超时时间，默认为 10 秒
      timeout: 5 * 1000, // 5 秒

      async customUpload(file, insertFn) {                   // JS 语法
        // file 即选中的文件
        // 自己实现上传，并得到图片 url alt href
        // 最后插入图片
        let url
        var formData = new FormData();
        formData.append("file",file)

        await api.getCosUpload(formData, (err, data) => {
          if (!err) {
            message.error('图片上传失败')
          } else {
            url = 'http://' + data.data.data
            insertFn(url)
          }
        })

      },
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

<style lang="scss">
.remark-content{
  img{
    max-width: 90% !important;
    border-radius: 4px;
    box-shadow: 0 0 6px rgba(63, 62, 62, 0.56);
  }
}



</style>
<style lang="scss">
.page-header{
  .ant-page-header-back{
    -webkit-app-region:none
  }
  .ant-page-header-heading-extra{
    -webkit-app-region:none
  }
  -webkit-app-region:drag
}

</style>
