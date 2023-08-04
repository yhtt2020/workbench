<template>
  <div class="image" id="image" style="padding-left: 18px;">
    <a-tooltip title="图片" class="pointer" @click="openImageInput">
      <Icon icon="image" style="width: 24px ;height: 24px;color: var(--secondary-text) !important;"></Icon>
    </a-tooltip>
  </div>
  <span class="upload-btn icon icon-image" hidden="">
      <input title="图片" ref="imageRef" v-if="!isMute" type="file" data-type="image" accept="image/*" @change="sendUploadMessage" />
      <slot />
  </span>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, watchEffect } from 'vue';
import { handleErrorPrompts } from '../../../utils';

const Image = defineComponent({
  props: {
    show: {
      type: Boolean,
      default: () => false,
    },
    isMute: {
      type: Boolean,
      default: () => false,
    },
    isH5: {
      type: Boolean,
      default: () => false,
    },
  },
  methods:{
    openImageInput(){
      this.$refs.imageRef.click()
    }
  },
  setup(props:any, ctx:any) {
    const data = reactive({
      isMute: false,
    });

    watchEffect(() => {
      data.isMute = props.isMute;
    });
    // 发送需要上传的消息：图片
    const sendUploadMessage = async (e:any) => {
      if (e.target.files.length > 0) {
        try {
          await Image.TUIServer.sendImageMessage(e.target);
        } catch (error) {
          handleErrorPrompts(error, props);
        }
      }
      e.target.value = '';
    };

    return {
      ...toRefs(data),
      sendUploadMessage,
    };
  },
});
export default Image;
</script>

<style lang="scss" scoped>
@import url('../../../../styles/common.scss');
@import url('../../../../styles/icon.scss');
.upload-btn {
  position: relative;
  input {
    position: absolute;
    cursor: pointer;
    left: 0;
    top: 0;
    opacity: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
