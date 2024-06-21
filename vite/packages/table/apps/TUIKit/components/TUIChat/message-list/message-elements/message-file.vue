<template>
  <div class="message-file">
    <!-- 新增3D模型显示组件 -->
    <div v-if="is3dFile(currentData.data?.name) && !currentData.data?.progress">
      <div v-if="judgeSize(currentData.data?.size)" class="model-preview">
        <ModelFile :data="currentData.data"/>
      </div>
  
      <div class="text-center" v-else>
        <xt-button
          @click="currentData.showModel = true"
          type="theme"
          style="width: 200px; margin-bottom: 10px"
          :h="200"
        >
          <span class="xt-text font-14 xt-font">点击预览</span>
          <br />
          <span
            class="text-center xt-active-text"
            style="opacity: 0.5; zoom: 0.8"
          >
            模型超过100MB
          </span>
        </xt-button>
      </div>
    </div>
    <progress v-if="currentData.data?.progress" :value="currentData.data?.progress" max="1" />
  
    <!-- 这里IM老版本的UI代码 -->
    <div
      class="file-message-montainer"
      :title="TUITranslateService.t('TUIChat.单击下载')"
      @click="download"
    >
      <Icon :file="files" class="file-icon" />
      <div>
        <div>{{ props.content.name }}</div>
        <div>{{ props.content.size }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { withDefaults,watchEffect,ref } from "../../../../adapter-vue";
import {
  TUITranslateService,
  IMessageModel,
} from "@tencentcloud/chat-uikit-engine";
import Icon from "../../../common/Icon.vue";
import files from "../../../../assets/icon/files.png";
import type { IFileMessageContent } from "../../../../interface";
/**与3D模型有关**/
import { fileSuffix } from "../../../../../chat/hooks/groupType";
import _ from "lodash-es";
import ModelFile from "../../../../../chat/components/model/ModelFile.vue";

const props = withDefaults(
  defineProps<{
    content: IFileMessageContent;
    messageItem: IMessageModel;
  }>(),
  {
    content: () => ({} as IFileMessageContent),
    messageItem: () => ({} as IMessageModel),
  }
);

const currentData = ref({
  data:{},
  //强制显示模型
  showModel:false,
})

watchEffect(()=>{
  console.log('查看',props.content,props.messageItem);
  currentData.value.data = {
    ...props.messageItem,
    ...props.content,
  };
})

// todo: 区分 web 和 uniapp
const download = () => {
  if (props.messageItem.hasRiskContent) {
    return;
  }
  const option = {
    mode: "cors",
    headers: new Headers({
      "Content-Type": "application/x-www-form-urlencoded",
    }),
  } as RequestInit;
  // 浏览器支持fetch则用blob下载，避免浏览器点击a标签，跳转到新页面预览的行为
  // If the browser supports fetch, use blob to download, so as to avoid the browser clicking the a tag and jumping to the preview of the new page
  if ((window as any)?.fetch) {
    fetch(props.content.url, option)
      .then((res) => res.blob())
      .then((blob) => {
        const a = document.createElement("a");
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = props.content.name;
        a.click();
      });
  } else {
    const a = document.createElement("a");
    a.href = props.content.url;
    a.target = "_blank";
    a.download = props.content.name;
    a.click();
  }
};

/**最新修改 与3D模型有关**/
const is3dFile = (fileName: any) => {
  // const ext = require("path").extname(fileName);
  // const is3D = _.some(fileSuffix, (item: any) => {
  //   return String(ext) === String(item);
  // });
  return false;
};
const judgeSize = (size: any) => {
  if (currentData.value.data?.showModel) {
    return true;
  }
  if (size.includes("Mb")) {
    return Number(size.replace("Mb", "")) <= 10;
  } else {
    return true;
  }
};
</script>
<style lang="scss" scoped>
@import "../../../../assets/styles/common";

.file-message-montainer {
  display: flex;
  flex-direction: row;
  cursor: pointer;

  .file-icon {
    margin: auto 8px;
  }
}
</style>
