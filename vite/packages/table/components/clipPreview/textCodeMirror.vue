<template>
  <!-- 代码块不高亮 纯文本 -->
  <div ref="myClip"></div>
</template>

<script>
import CodeMirror from 'codemirror'


export default {
  props:{
    editorContent:{
      type:String,
    }
  },
  mounted(){
    this.myClipRefs = CodeMirror(this.$refs.myClip,{
      value:this.editorContent,
      smartIndent:true,
      tabSize:6,
      smartIndent:true,
      indentWithTabs:true,
      direction: "ltr",
      lineWrapping: true,
      lineNumbers: true,
      mode:null
    })
  }
}
</script>

<style lang="scss" scoped>
:deep(.CodeMirror-vscrollbar){
  display: none !important;
}
:deep(.CodeMirror-hscrollbar){
  display: none !important;
}
:deep(.CodeMirror-scrollbar-filler){
  display: none !important;
}


</style>

<style>
.CodeMirror{
  width: 300px !important;
  background:none !important;
  color: rgba(255,255, 255, 0.85);
}
/*
.CodeMirror-line{
  width: 300px !important;
  white-space: pre-wrap !important;
} 
*/
.CodeMirror-gutters{
  border: none !important;
}
</style>