<template>
  <div draggable="true" @dragstart="handleDragStart" @dragend="handleDragEnd">
    <slot></slot>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useFolderStore } from "../store";
import { inject } from "vue";
// import { useAddCard } from "../hooks/useAddCard";
import { useAddCard } from "../../../../ui/hooks/useAddCard";

import { useDeskStore } from "../../../../components/desk/store";
import { useFreeLayoutStore } from "../../../../components/desk/freeLayout/store";

// 图标托起提示和ctrl复制图标
import { useNavBarStore } from '../../../../components/desk/navigationBar/navBar'
import { useToast } from 'vue-toastification'
import TipsInfo from '../../../../components/desk/navigationBar/components/folder/TipsInfo.vue';
const toast = useToast()
const navBar = useNavBarStore()
const { neverTip } = storeToRefs(navBar)

// 自由布局
const freeLayoutStore = useFreeLayoutStore();
const { isFreeLayout, getFreeLayoutData, freeLayoutEnv } =
  storeToRefs(freeLayoutStore);
// 获取桌面数据
const deskStore = useDeskStore();
const { mouseInElement,isEnterBar } = storeToRefs(deskStore);
const emits = defineEmits(["deleteFile", ]);

const index = inject("index", "");
const data = inject("data", "");
const isOutside = inject("isOutside", "");
const folderStore = useFolderStore();
const { dragId, isDrag, move, currentId, currentData,folderFlag } =
  storeToRefs(folderStore);
const props = defineProps({
  data: {},
});

let isCtrl = false
/**
 * 文件托起
 */
const handleDragStart = (event) => {
  ctrlTip()
  move.value = false;
  isDrag.value = true;
  dragId.value = index.value;
  currentId.value = index.value;
  currentData.value = props.data;
  folderFlag.value = "folder"
  isCtrl = event.ctrlKey
};
// const handleDragLeave = (event) => {
//   console.log("handleDragLeave :>> ");
// };
// const handleDragEnter = (event) => {
//   console.log("handleDragEnter :>> ");
// };
// 文件拖拽弹起
const handleDragEnd = (event) => {
  dragId.value = "";
  // if (data.value.sort === "free") return;
  isDrag.value = false;
  if (data.value.model !== "custom") {
    return;
  }
  // 判断托起的文件所属文件夹ID与当前文件夹ID是否一致
  if (!isOutside.value) {
    return;
  }
  if (!move.value) {
    const file = {
      model: "file",
      size: "mini",
      open: {
        type: currentData.value.type,
        value: currentData.value.value,
      },
      titleValue: currentData.value.name,
      isTitle: currentData.value.isName,
      src: currentData.value.icon,
      isRadius: currentData.value.isRadius,
      radius: currentData.value.radius,
      imgState: currentData.value.iconState,
      imgShape: currentData.value.iconShape,
      isBackground: currentData.value.isBg,
      backgroundColor: currentData.value.bg,
      backgroundIndex: 0,
    };

    let id = Date.now();
    if (isFreeLayout.value) {
      const { x, y } = mouseInElement.value;
      const { scrollLeft, scrollTop } = freeLayoutEnv.value;

      getFreeLayoutData.value[id] = {
        left: scrollLeft + x,
        top: scrollTop + y -50,
        index: 1,
        id,
      };
    }
    useAddCard(
      "myIcons",
      {
        iconList: [{ ...file }],
      },
      id
    );
    
    if(!isCtrl){
      emits("deleteFile", props.data);
    }

    return;
  }
  // 判断托起的文件是不是拖入导航栏
  if (!isEnterBar.value){
    if(isCtrl) return
    emits("deleteFile", props.data);
    return;
  }
  // 判断是否处在当前文件夹
  if (index.value != currentId.value) {
    if(isCtrl) return
    emits("deleteFile", props.data);
  }
  // 数据回收
  dragId.value = "";
  currentId.value = "";
};

const ctrlTip = () => {
  if (neverTip.value) return;
  toast(
    {
      component: TipsInfo,
    },
    {
      position: "top-right",
      icon: false,
      closeOnClick: false,
      closeButton: false,
      pauseOnFocusLoss: true,
      pauseOnHover: true,
      timeout: 0,
      toastClassName: "notice-toast",
    }
  );
};
</script>

<style lang="scss" scoped></style>
