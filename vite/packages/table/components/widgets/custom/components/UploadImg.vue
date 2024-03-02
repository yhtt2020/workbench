<template>
    <div class="flex items-center justify-between" v-if="typeof imgSrc.src === 'object' || Object.keys(imgSrc).length == 0">
        <xt-button w="150" h="40" style="background-color: var(--active-bg);" @click="importImg">选择图片</xt-button>
        <xt-button w="150" h="40" style="background-color: var(--primary-bg);" @click="openMy">选自壁纸收藏</xt-button>
    </div>
    <div v-else class="relative">
        <img :src="imgSrc.src" alt="" class="w-[100px] h-[100px] rounded-xl" >
        <div
            class="absolute top-0 flex items-center justify-center flex-shrink-0 w-5 h-5 translate-x-1/2 -translate-y-1/2 rounded-full pointer"
            @click="deleteImg"
            style="background: rgba(255, 255, 255, 0.5);left: 80px;"
          >
            <xt-new-icon icon="fluent:dismiss-16-regular" size="12"></xt-new-icon> 
          </div>
    </div>
    <Teleport to="body">
        <ModalList
            v-if="visible"
            v-model:visible="visible"
            title="我的收藏"
            :imgList="myPapers"
            @sendImg="sendImg"
        ></ModalList>
    </Teleport>
</template>

<script setup lang='ts'>
import { ref, reactive,watch,onMounted,toRefs } from 'vue'
import { storeToRefs } from 'pinia';
import ModalList from '../../../comp/ModalList.vue';
import { paperStore } from '../../../../store/paper';
const usePaper = paperStore();
const { myPapers } = storeToRefs(usePaper);

const props = defineProps({
    img: {
        type: Object,
        default: {}
    }
})
const {img} = toRefs(props)

const imgSrc = ref({})
const visible = ref(false)
const importImg = async() => {
    let openPath = await tsbApi.dialog.showOpenDialog({
        title: "选择导入的代码",
        filters: [
          { name: "图片", extensions: ["png", "jpg", "jpeg", "bmp", "gif"] },
          {
            name: "视频",
            extensions: ["mp4", "mpeg", "avi", "rmvb"],
          },
          { name: "全部", extensions: ["*"] },
        ],
        properties: ["multiSelections"],
      });
      if (!openPath) {
        return;
      } else {
        const imgReg = /.(jpg|jpeg|gif|bmp|png)$/; // 匹配图片正则
        const videoReg = /.(mp4|mpeg|avi|rmvb)$/; // 匹配视频正则
        imgSrc.value = {};
        if (imgReg.test(openPath[0])) {
            imgSrc.value.src = openPath[0];
        } else if (videoReg.test(openPath[0])) {
            imgSrc.value.srcProtocol = openPath[0];
        }
      }
}

const openMy = () => {
    visible.value = true
}

const sendImg = (img) => {
    imgSrc.value = img
    visible.value = false
}

const deleteImg = () => {
    imgSrc.value = {}
}

onMounted(() => {
    imgSrc.value.src = img.value.src || img.value 
    console.log('imgSrc',imgSrc.value.src,Object.keys(imgSrc.value.src).length);
})

const emit = defineEmits(['update:img'])

watch(()=>imgSrc.value, (val) => {
    emit('update:img',val)
})
</script>
<style lang='scss' scoped></style>