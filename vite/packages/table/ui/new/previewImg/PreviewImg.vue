<template>
    <div @click="clickFn(index)" v-if="visible">
        <slot></slot>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive,getCurrentInstance,computed,onMounted,toRefs,onBeforeUnmount } from 'vue'
import 'hevue-img-preview/css/default.css'
const {proxy} = getCurrentInstance()
export interface imgPreviewProps {
    imgList: Array<string>; // 预览图片列表,需要传入只包含图片地址的数组，否则无法预览
    maskClose?: boolean; // 点击遮罩关闭
    controlOption?:{
        controlBar?: boolean; // 控制条
        closeBtn?: boolean; // 关闭按钮
        arrowBtn?: boolean; // 箭头按钮
    };
    index?: number; // 当前图片索引,如果是多图预览，必须要传入索引，否则会出现点开图片预览后，图片索引不正确的问题
    // 阻止触发
    preventTrigger?: boolean
}
const props = withDefaults(defineProps<imgPreviewProps>(),{
    imgList: [],
    maskClose: true,
    controlOption:{
        controlBar: true,
        closeBtn: true,
        arrowBtn: true,
    },
    index: 0
})

const visible = ref(false)

const {index,imgList,maskClose,controlOption} = toRefs(props)

// 点击图片预览
const clickFn = (index: Number) => {
    if(props.preventTrigger) return
    proxy.$hevueImgPreview({
        nowImgIndex: index,
        multiple:true,
        imgList: imgList.value,
        clickMaskCLose:controlOption.value.closeBtn && !controlOption.value.closeBtn ? true : maskClose.value,
        arrowBtn:imgList.value.length === 1 ? false : controlOption.value.arrowBtn,
        controlBar:controlOption.value.controlBar,
        closeBtn:controlOption.value.closeBtn,
    })
}

onMounted(() => {
    // console.log('imgList=',imgList.value,'index=',index);
    visible.value = true
})

onBeforeUnmount(() => {
    visible.value = false
})

</script>
<style lang='scss' scoped></style>
