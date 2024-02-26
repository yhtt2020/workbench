<template>
    <div draggable="true" @dragstart="handleDragStart" @dragend="handleDragEnd">
        <slot></slot>
    </div>
</template>
  
<script setup>
import {getCurrentInstance} from 'vue'
import { storeToRefs } from "pinia";
import { useAddCard } from "../../../../../ui/hooks/useAddCard";

import { defaultFolderData } from "../../../../../apps/folder/src/components/options";
import {useFileConversionIcon} from '../../../../../ui/hooks/useDataConversion'

import { useNavBarStore } from '../../navBar'

import { useFreeLayoutStore } from "../../../freeLayout/store";

import { useDeskStore } from "../../../store";

// 图标托起提示
import TipsInfo from './TipsInfo.vue';
import { useToast } from 'vue-toastification'
const toast = useToast()

const deskStore = useDeskStore();
const { mouseInElement,isEnterBar } = storeToRefs(deskStore);

const freeLayoutStore = useFreeLayoutStore();
const { isFreeLayout, getFreeLayoutData, freeLayoutEnv } =
  storeToRefs(freeLayoutStore);

const navBarStore = useNavBarStore()
const { navBarId, navBarItem,isLeaveBar,isEnterDesk,neverTip } = storeToRefs(navBarStore)
const props = defineProps({
    data: {},
    currentId: ''
});
const emits = defineEmits(["deleteFile" ]);

const { proxy } = getCurrentInstance()

// 是否按下ctrl键
let isCtrl = false
/**
 * 文件托起
 */
const handleDragStart = (event) => {
    if(!neverTip.value){
      ctrlTip()  
    }
    navBarId.value = props.currentId
    navBarItem.value = props.data
    console.log('数据传递成功')
    console.log(event.ctrlKey,'<<<<<<');
    isCtrl = event.ctrlKey
};
// 文件拖拽弹起
const handleDragEnd = (event) => {
    // 判断是否处在当前文件夹
    // if (navBarId.value != props.currentId) {
    //     emits("deleteFile", props.data);
    //     console.log('你不在当前文件夹')
    // }
    if(isLeaveBar.value) {
        emits("deleteFile", props.data);
        isLeaveBar.value = false
        console.log('数据添加成功')
    }

    if(isEnterDesk.value ) {
        let obj
        let id = Date.now()
        if(props.data.type === 'folder') {
            obj = {
                ...defaultFolderData,
                list: props.data.children,
                customSize:props.data.customSize || '2x2',
                name:props.data.name,
                layout:props.data.layout || 'rows',
            }
            if(isFreeLayout.value){
                const { x, y } = mouseInElement.value;
                const { scrollLeft, scrollTop } = freeLayoutEnv.value;

                getFreeLayoutData.value[id] = {
                    left: scrollLeft + x,
                    top: scrollTop + y -50,
                    index: 1,
                    id,
                }
            }
            proxy.$bus.emit("addCard", obj);
        }else{
            obj = useFileConversionIcon(props.data)
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
                iconList: [{ ...obj }],
              },
              id
            );
        }
        if(!isCtrl){
           emits("deleteFile", props.data); 
        }
        

    }
    // 数据回收
    navBarItem.value = "";
    navBarId.value = "";
    // isEnterDesk.value = false
};

const ctrlTip = () =>{
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
          timeout: 5000,
          toastClassName: "notice-toast",
        }
    );
}
</script>
  
<style lang="scss" scoped></style>
  