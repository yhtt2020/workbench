<template>
  <!-- 代码块高亮 -->
  <div ref="myClip"></div>
</template>

<script>
import { mapWritableState,mapActions } from 'pinia'
import { clipboardStore } from '../../store/clipboard';
import CodeMirror from 'codemirror'


export default {
  props:{
    editorContent:{
      type:String,
    }
  },
  computed:{
    ...mapWritableState(clipboardStore,['clipMode']),
  },
  mounted(){
    this.myClipRefs = CodeMirror(this.$refs.myClip,{
      value:this.editorContent,
      smartIndent:true,
      tabSize:1,
      indentWithTabs:true,
      direction: "ltr",
      lineWrapping: true,
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
</style>