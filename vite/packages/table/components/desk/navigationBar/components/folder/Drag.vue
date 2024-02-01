<template>
    <div draggable="true" @dragstart="handleDragStart" @dragend="handleDragEnd">
        <slot></slot>
    </div>
</template>
  
<script setup>
import { storeToRefs } from "pinia";
import { useAddCard } from "../../../../../ui/hooks/useAddCard";

import { defaultFolderData } from "../../../../../apps/folder/src/components/options";
import {useFileConversionIcon} from '../../../../../ui/hooks/useDataConversion'

import { useNavBarStore } from '../../navBar'

import { useFreeLayoutStore } from "../../../freeLayout/store";

import { useDeskStore } from "../../../store";

const deskStore = useDeskStore();
const { mouseInElement,isEnterBar } = storeToRefs(deskStore);

const freeLayoutStore = useFreeLayoutStore();
const { isFreeLayout, getFreeLayoutData, freeLayoutEnv } =
  storeToRefs(freeLayoutStore);

const navBarStore = useNavBarStore()
const { navBarId, navBarItem,isLeaveBar,isEnterDesk } = storeToRefs(navBarStore)
const props = defineProps({
    data: {},
    currentId: ''
});
const emits = defineEmits(["deleteFile" ]);

/**
 * 文件托起
 */
const handleDragStart = (event) => {
    navBarId.value = props.currentId
    navBarItem.value = props.data
    console.log('数据传递成功')
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
    console.log('isEnterDesk',navBarStore.isEnterDesk)

    if(isEnterDesk.value ) {
        let obj
        let id = Date.now()
        if(props.data.type === 'folder') {
            obj = {
                ...defaultFolderData,
                list: props.data.children,
                customSize:props.data.customSize,
                name:props.data.name,
                layout:props.data.layout,
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
            console.log(obj,'obj')
            useAddCard(
                'folder',
                {
                customData: obj,
                },
                id
            )
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
        emits("deleteFile", props.data);

    }
    // 数据回收
    navBarItem.value = "";
    navBarId.value = "";
    // isEnterDesk.value = false
};
</script>
  
<style lang="scss" scoped></style>
  