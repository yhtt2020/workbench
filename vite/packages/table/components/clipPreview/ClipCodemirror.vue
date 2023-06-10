<template>
  <div ref="editor"></div>
</template>

<script>
import { EditorState } from '@codemirror/state'
import { EditorView, keymap } from '@codemirror/view'
import { defaultKeymap } from '@codemirror/commands'
import { python } from '@codemirror/lang-python'
import { oneDark } from '@codemirror/theme-one-dark'
export default {
  props:{
    editorContent:{
      type:String,
    }
  },
  mounted(){
    this.editorInit = new EditorView({
      state:EditorState.create({
        doc: this.editorContent,
        extensions: [keymap.of(defaultKeymap), python(),oneDark]
      }),
      parent: this.$refs.editor
    })
  },
  beforeUnmount(){
    this.editorInit.destroy()
  },
}
</script>

<style lang="scss" scoped>
:deep(.ͼ1 .cm-scroller){
  overflow-x: hidden !important;
}
</style>