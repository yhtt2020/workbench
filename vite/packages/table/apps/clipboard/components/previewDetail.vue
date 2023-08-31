<script lang="ts">
import {defineComponent} from 'vue'
import {formatFileSize, getDateTime} from "../../../util";

export default defineComponent({
  name: "previewDetail",
  props: [
    'previewContent'
  ], computed: {
    timeText() {
      const time = getDateTime(new Date(this.previewContent.createTime))
      return `${time.hours}:${time.minutes}:${time.seconds}` + '&nbsp;&nbsp;&nbsp;' + `${time.month}月${time.day}日`
    },
    itemType() {
      const type = this.previewContent.type
      switch (type) {
        case 'text':
          return {
            icon: 'text-align-left',
            title: '文本'
          }
        case 'image':
          return {
            icon: 'image',
            title: '图片'
          }
        case 'file':
          return {
            icon: 'file',
            title: '文件'
          }
        case 'video':
          return {
            icon: 'video',
            title: '视频'
          }
        case 'audio':
          return {
            title: '音频',
            icon: 'erji1'
          }
      }
    },
    ext() {
      return require('path').extname(this.previewContent.path||this.previewContent.filepath)
    },
    isSingleFile() {
      return this.previewContent.type === 'image' || this.previewContent.type === 'video' || this.previewContent.type === 'audio'
    },
    capacity() {
      switch (this.previewContent.type) {
        case 'text':
          return this.previewContent.content.length + '个字符'
        case 'file':
          return this.previewContent.files?.length + '个文件'
        case 'image':
        case 'audio':
        case 'video':
          return formatFileSize(this.previewContent.size)
      }
    },
  }
})
</script>

<template>
  <div class="flex justify-between mb-6">
    <span class="type-text">类型</span>
    <span class="type-right"> {{ itemType.title }}</span>
  </div>
  <div v-if="isSingleFile" class="flex justify-between mb-6">
    <span class="type-text">格式</span>
    <span class="type-right" >{{ ext }}</span>
  </div>
  <div class="flex justify-between mb-6">
    <span class="type-text">时间</span>
    <span class="type-right" v-html="timeText"></span>
  </div>
  <div class="flex justify-between mb-6">
    <span class="type-text">大小</span>
    <span class="type-right">{{ capacity }}</span>
  </div>
  <div v-if="isSingleFile" class="flex justify-between flex-col mb-6">
    <span class="type-text">路径</span>
    <span class="type-right" v-if="previewContent.type === 'image'">
                      {{ previewContent.path }}
                    </span>
  </div>
</template>

<style scoped lang="scss">

</style>
