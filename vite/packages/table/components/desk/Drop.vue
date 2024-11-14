<template>
  <div
    class="w-full h-full"
    :class="classes"
    @drop="handleDrop"
    @dragover="handleDragover"
    @dragenter="handleDragenter"
    ref="target"
    v-element-size="debounceUpdateSize"
    @click="test"
  >
    <slot></slot>
  </div>
</template>
<script></script>
<script setup>
import { nanoid } from "nanoid";
import { ref, getCurrentInstance, watch } from "vue";
import { storeToRefs } from "pinia";
import { myIcons } from "../../store/myIcons";
import { useAddCard } from "../../ui/hooks/useAddCard";
import { useDeskStore } from "./store";
import { useFreeLayoutStore } from "./freeLayout/store";
import { vElementSize } from "../../hooks";
import { useMouseInElement, useDebounceFn } from "@vueuse/core";

import { useFolderStore } from "../../apps/folder/src/store";

import { getFavicon, useGetUrlName } from "./navigationBar/hook/getUrlName";
import { isValidUrl } from "./navigationBar/hook/useCheckUrl";
import { useNavBarStore } from "./navigationBar/navBar";
import { useElementSize } from "@vueuse/core";
const target = ref(null);

const updateSize = (data) => {
  deskSize.value = data;
};
const debounceUpdateSize = useDebounceFn((data) => {
  updateSize(data);
}, 1000);
const folderStore = useFolderStore();
const { isDrag } = storeToRefs(folderStore);
// 自由布局
const freeLayoutStore = useFreeLayoutStore();
const { isFreeLayout, getFreeLayoutData, freeLayoutEnv } =
  storeToRefs(freeLayoutStore);
// 桌面
const deskStore = useDeskStore();
const { isEnterFolder, mouseInElement, isEnterBar, deskSize } =
  storeToRefs(deskStore);

mouseInElement.value = useMouseInElement(target);
// 图标组件
const iconStore = myIcons();
const { iconOption } = storeToRefs(iconStore);
const { classes } = defineProps(["classes"]);
//
const navBar = useNavBarStore();
const { proxy } = getCurrentInstance();
const pureName=(name)=>{
  if(name.endsWith('.lnk')){
    return  name.substring(0,name.length-4);
  }
  if(name.endsWith('.url')){
   return name.substring(0,name.length-4);
  }
  if(name.endsWith('.exe')){
    return name.substring(0,name.length-4);
  }
  return name
}
const handleDrop = async (dragEvent) => {
  console.log("handleDrop", isEnterBar.value);
  if (isEnterBar.value || isEnterFolder.value) {
    return;
  }
  dragEvent.preventDefault();
  let files = dragEvent.dataTransfer.files;
  let link = dragEvent.dataTransfer.getData("text/plain");

  if (files && files.length > 0) {
    for (const file of files) {
      const fileImage = await tsbApi.system.extractFileIcon(file.path);

      const obj = {
        ...iconOption,
        open: {
          type: "tableApp",
          value: file.path,
        },
        titleValue: pureName(file.name),
        src: fileImage,
      };

      const id = Date.now();

      const { offsetX, offsetY } = dragEvent;
      const addCard = () => {
        useAddCard(
          "myIcons",
          {
            iconList: [{ ...obj }],
          },
          id
        );
      };
      if (isFreeLayout.value) {
        getFreeLayoutData.value[id] = {
          left: offsetX,
          top: offsetY,
          index: 1,
          id,
        };

        setTimeout(addCard, 100);
      } else {
        addCard();
      }
    }
  } else if (link && link !== "") {
    if (isDrag.value) return;

    // 判断url是否有http/https
    if (!link.match(/^(http:\/\/|https:\/\/)/)) {
      link = "http://" + link;
    }

    // 判断添加http后，是否是一个有效的链接
    if (isValidUrl(link)) {
      // const name = await useGetUrlName(link);
      const icon = await getFavicon(link);

      const obj = {
        ...iconOption,
        open: {
          type: "default",
          value: link,
        },
        titleValue: icon.pageTitle || "网址链接",
        src:
          icon.faviconURL ||
          "https://a.apps.vip/icons/iconSelect/emoji/globe-showing-asia-australia.svg",
      };

      const id = Date.now();

      const { offsetX, offsetY } = dragEvent;
      const addCard = () => {
        useAddCard(
          "myIcons",
          {
            iconList: [{ ...obj }],
          },
          id
        );
      };

      if (isFreeLayout.value) {
        getFreeLayoutData.value[id] = {
          left: offsetX,
          top: offsetY,
          index: 1,
          id,
        };

        setTimeout(addCard, 100);
      } else {
        addCard();
      }
    }
  }
};

const handleDragenter = (dragEvent) => {
  dragEvent.preventDefault();
};

const handleDragover = (dragEvent) => {
  dragEvent.preventDefault();
};

const test = () => {
  // proxy.$bus.emit("closeControl")
};
</script>

<style lang="scss" scoped></style>
