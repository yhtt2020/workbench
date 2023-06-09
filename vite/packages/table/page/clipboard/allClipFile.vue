<template>
  <div class="flex">
    <div v-for="(item,index) in items.reverse()" :key="index" :class="{'active-clip':selectedIndex === index}"
         class="mr-3 flex flex-col s-bg rounded-md">
      <ClipItem :clip="item" @openPreview="getClipShow" style="width:332px;height: 412px;"></ClipItem>
    </div>
  </div>
  <ClipTextPreview :textShow="allClipShow" :textPreview="previewObj" @closeText="allClipShow = false"></ClipTextPreview>
</template>

<script>
import ClipItem from '../../components/ClipItem.vue'
import ClipTextPreview from '../../components/clipPreview/ClipTextPreview.vue'
import {allList} from '../../js/data/clipboardData'
import {mapWritableState} from "pinia";
import {clipboardStore} from "../../store/clipboard";

export default {
  components: {
    ClipItem,
    ClipTextPreview
  },
  data() {
    return {
      allList,
      allClipShow: false,
      previewObj: null,
      selectedIndex: 0,
    }
  },
  computed: {
    ...mapWritableState(clipboardStore, ['items'])
  },

  mounted() {
    window.addEventListener('keydown', this.listKeyDown)
  },

  methods: {
    getClipShow(v) {
      this.allClipShow = v.preview
      this.previewObj = v.content
    },
    // 键盘切换状态
    listKeyDown(e) {
      const keyCode = e.keyCode
      if (keyCode === 37 && this.selectedIndex > 0) {
        this.selectedIndex--
      } else if (keyCode === 39 && this.selectedIndex < this.allList.length - 1) {
        this.selectedIndex++
      }
    },

  },

  beforeDestroy() {
    window.removeEventListener('keydown')
  },
}
</script>

<style lang="scss" scoped>
.active-clip {
  border: 6px solid rgba(80, 139, 254, 1);

  &:deep(.clip-top) {
    margin-bottom: 0 !important;
  }

  &:deep(.clip-text-center) {
    padding-bottom: 28px !important;
  }
}

.s-bg {
  box-shadow: none !important;
}
</style>
