<template>
    <div 
      draggable="true" 
      @dragstart="handleDragStart" 
      @dragend="handleDragEnd">
        <slot></slot>
    </div>
</template>
  
<script setup>
import {getCurrentInstance,onMounted,computed} from 'vue'
import { storeToRefs } from "pinia";
import { useAddCard } from "../../../../../ui/hooks/useAddCard";

import { defaultFolderData } from "../../../../../apps/folder/src/components/options";
import {useFileConversionIcon} from '../../../../../ui/hooks/useDataConversion'

import { useNavBarStore } from '../../navBar'

import { useFreeLayoutStore } from "../../../freeLayout/store";

import { useDeskStore } from "../../../store";

// 获取桌面信息
import _ from 'lodash-es'
import { homeStore } from '../../../../../store/home';
import { cardStore } from '../../../../../store/card';
const home = homeStore()
const card = cardStore()
const {currentDeskId} = storeToRefs(home)
const {desks} = storeToRefs(card)

// 图标托起提示
import TipsInfo from './TipsInfo.vue';
import { useToast } from 'vue-toastification'
import {ctrlTip} from '../../hook/toastTip'
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

// 特殊图标阻止拖拽添加到桌面
const isSpecial = computed(() => {
  return ['commun' , 'control'].includes(props.data.value)
})

// 是否按下ctrl键
let isCtrl = false
/**
 * 文件托起
 */
const handleDragStart = (event) => {
  // 当被拖拽时，提示
    if(!neverTip.value && !isSpecial.value){
      ctrlTip()  
    }
    // 传递导航栏id
    navBarId.value = props.currentId
    // 传递拖拽数据
    navBarItem.value = props.data
    console.log('数据传递成功')
    console.log(event.ctrlKey,'<<<<<<');
    // 判断是否按下ctrl键
    isCtrl = event.ctrlKey
};
// 文件拖拽弹起
const handleDragEnd = (event) => {
    // 判断是否处在当前文件夹
    // if (navBarId.value != props.currentId) {
    //     emits("deleteFile", props.data);
    //     console.log('你不在当前文件夹')
    // }

    // 判断是否离开导航栏，如果离开了则删除数据
    if(isLeaveBar.value) {
        emits("deleteFile", props.data);
        isLeaveBar.value = false
        console.log('数据添加成功')
    }

    // 判断是否进入桌面
    if(isEnterDesk.value ) {
        let obj
        let id = Date.now()
        if(isSpecial.value){
          toast.error('特殊图标不允许拖拽到桌面',{
            timeout:1500
          })
          return
        }
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
            // proxy.$bus.emit("addCard", obj);
            addFolder(obj)
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
        // 如果按下了ctrl键则不删除数据
        if(!isCtrl){
           emits("deleteFile", props.data); 
        }
        

    }
    // 数据回收
    navBarItem.value = "";
    navBarId.value = "";
    // isEnterDesk.value = false
};

// 获取当前桌面数据
const currentDesk = computed(()=>{
  let desk = desks.value.find((item)=>{
    return item.id === currentDeskId.value
  })
  return desk
})

// 导航栏文件夹添加到桌面
const addFolder = (item) => {
  item.list = _.cloneDeep(item.list)
  let value = _.cloneDeep(item)
  currentDesk.value.cards.push({
    name: "folder",
    id: Date.now(),
    customData: value,
  })
}
</script>
  
<style lang="scss" scoped></style>
  