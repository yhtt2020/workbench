<script lang="ts">
import { Image, ImagePreviewGroup } from "ant-design-vue";

export default {
  name: "NoticeBody",

  props: {
    noticeContent: {
      type: Object,
      default: () => {},
    },
  },
  components: { Image, ImagePreviewGroup },
  data() {
    return {};
  },
  computed: {
    covers() {
      console.log('this.noticeContent-1',this.noticeContent);

      if (this.noticeContent?.content?.covers) {
        return JSON.parse(this.noticeContent?.content?.covers);
      } else {
        return [];
      }
    },

    // 消息调整内容
    noticeContent() {
      console.log('this.noticeContent-2',this.noticeContent);
      
      if (this.noticeContent?.content?.content) {
        return (
          `${this.noticeContent?.content?.body}` +
          `<br/>` +
          ` ${this.noticeContent?.content?.content}`
        );
      } else {
        return this.noticeContent?.content?.body;
      }
    },
  },

  mounted() {},

  methods: {
    stop() {
      this.$emit("pause");
    },
  },
};
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex gap-2 previewer" style="display: flex">
      <ImagePreviewGroup>
        <Image
          style="aspect-ratio: 16/9; object-fit: cover"
          @click="stop"
          v-for="cover in covers"
          :src="cover.cover"
        ></Image>
      </ImagePreviewGroup>
    </div>
    <div v-html="noticeContent"></div>
  </div>
</template>

<style scoped lang="scss">
.previewer :deep(.ant-image) {
  flex: 1;
  border-radius: 10px;
  overflow: hidden;
}

:deep(.ant-image-preview-wrap) {
  z-index: 1000001 !important;
}
</style>
