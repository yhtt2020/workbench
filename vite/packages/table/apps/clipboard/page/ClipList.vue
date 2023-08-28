<template>
  <div class="flex flex-wrap h-full"
       style="justify-items: center;align-content: start;flex-direction: column;
    justify-content: center;align-items: center;">
    <div v-if="loading">
      <div class="flex items-center justify-center">
        <!--          <a-empty class="animate-ping" image="/emoji/wait.png" description="加载中…"/>-->
      </div>
    </div>
    <template v-else>
      <div v-if="clipList.length>0" v-for="item in clipList" class="m-2 flex flex-col s-bg rounded-lg">
        <ClipItem :key="item.updateTime" :clipItem="item" @previewItem="getItem"></ClipItem>
      </div>
      <div v-else class="flex items-center justify-center w-full my-32">

        <div v-if="clipList.length === 0" class="flex items-center justify-center">
          <a-empty :image="simpleImage"/>
        </div>
      </div>

    </template>

  </div>
  <ClipTextPreview ref="previewerRef" :previewContent="previewData"></ClipTextPreview>
</template>

<script>
import ClipItem from '../components/ClipItem.vue'
import ClipTextPreview from '../components/clipPreview/Previewer.vue'
import { Empty } from 'ant-design-vue'
import { toRaw } from 'vue'
import { mapWritableState } from 'pinia'
import { clipboardStore } from '../store'

export default {
  components: {
    ClipItem,
    ClipTextPreview
  },
  props: {
    clipList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      simpleImage: '/public/img/test/not-data.png',
      previewData: null
    }
  },
  computed: {
    ...mapWritableState(clipboardStore, ['previewShow', 'loading'])
  },
  methods: {
    // 获取item
    getItem (args) {
      // this.previewData = v
      const item = args.item
      this.previewData = item
      switch (item.type) {
        case 'text':
          break
        case 'image':
          if (args.action === 'editImage') {
            this.$refs.previewerRef.doEditImage()
          }
          break
        case 'video':
          break
        case 'file':
          break
        case 'audio':
          break
      }
      this.previewShow = true
    }
  }
}
</script>

<style lang="scss" scoped>
.s-bg {
  box-shadow: none !important;
  background: var(--secondary-bg);
  color: var(--primary-text) !important;
}
</style>
