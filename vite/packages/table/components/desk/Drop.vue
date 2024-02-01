<template>
  <div
    class="w-full h-full"
    @drop="handleDrop"
    @dragover="handleDragover"
    @dragenter="handleDragenter"
    ref="target"
    @click="test"
  >
    <slot></slot>
  </div>
</template>
<script></script>
<script setup>
import { nanoid } from "nanoid";
import { ref,getCurrentInstance } from "vue";
import { storeToRefs } from "pinia";
import { myIcons } from "../../store/myIcons";
import { useAddCard } from "../../ui/hooks/useAddCard";
import { useDeskStore } from "./store";
import { useFreeLayoutStore } from "./freeLayout/store";

import { useMouseInElement } from '@vueuse/core'

import {useFolderStore} from '../../apps/folder/src/store'
import {getFavicon,useGetUrlName} from './navigationBar/hook/getUrlName'
const target = ref(null);

const folderStore = useFolderStore();
const {  isDrag } = storeToRefs(folderStore);
// 自由布局
const freeLayoutStore = useFreeLayoutStore();
const { isFreeLayout, getFreeLayoutData, freeLayoutEnv } =
  storeToRefs(freeLayoutStore);
// 桌面
const deskStore = useDeskStore();
const { isEnterFolder, mouseInElement,isEnterBar } = storeToRefs(deskStore);

mouseInElement.value = useMouseInElement(target);
// 图标组件
const iconStore = myIcons();
const { iconOption } = storeToRefs(iconStore);

const { proxy } = getCurrentInstance()

const handleDrop = async (dragEvent) => {
  console.log("handleDrop", isEnterBar.value);
  if (isEnterBar.value || isEnterFolder.value) {
    return;
  }

  dragEvent.preventDefault();
  let files = dragEvent.dataTransfer.files;
  let link = dragEvent.dataTransfer.getData('text/plain');

  if (files && files.length > 0) {
    for (const file of files) {
      const fileImage = await tsbApi.system.extractFileIcon(file.path);
      const obj = {
        ...iconOption,
        open: {
          type: "tableApp",
          value: file.path,
        },
        titleValue: file.name,
        src: fileImage,
      };

      const id = Date.now();
      console.log("我提供的id :>> ", id);

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
  } else if (link && link !== '') {
    if(isDrag.value) return
    const hasHttp = link.includes('http') || link.includes('https');
    if (!hasHttp) {
      link = 'http://' + link;
    }

    // const name = await useGetUrlName(link);
    const icon = await getFavicon(link);

    const obj = {
      ...iconOption,
      open: {
        type: "default",
        value: link,
      },
      titleValue: icon.pageTitle || '网址链接',
      src: icon.faviconURL || 'https://a.apps.vip/icons/iconSelect/emoji/globe-showing-asia-australia.svg',
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
};

const handleDragenter = (dragEvent) => {
  dragEvent.preventDefault();
};

const handleDragover = (dragEvent) => {
  dragEvent.preventDefault();
};

const test = () =>{
  proxy.$bus.emit("closeControl")
}
</script>

<style lang="scss" scoped></style>
