<template>
    <div
        style="width: 100%;height: 100%;gap: 10px;"
        :class="['listClass']"
        class="flex flex-wrap items-center ">
        <div v-for="(item,index) in imgList">
            <slot name="menu">
                <img 
                    :src="item" 
                    alt="" 
                    @click="clickFn(index)" 
                    :key="index" 
                    :style="{
                        width: imgW + 'px',
                        height: imgH + 'px',
                    }" 
                    class="rounded-lg"
                    :class="['imgClass']"
                    style="object-fit: cover;"> 
            </slot>
           
        </div>
        <!-- 补充内容 -->
        <slot></slot>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive,getCurrentInstance,computed,onMounted } from 'vue'
import 'hevue-img-preview/css/default.css'
const {proxy} = getCurrentInstance()
export interface imgPreviewProps {
    imgList: Array<string>; // 图片列表
    previewList?: Array<string>; // 预览图片列表
    imgW?: number; // 图片宽度
    imgH?: number; // 图片高度
    maskClose?: boolean; // 点击遮罩关闭
    controlOption?:{
        controlBar?: boolean; // 控制条 
        closeBtn?: boolean; // 关闭按钮
        arrowBtn?: boolean; // 箭头按钮
    };
    imgClass?: string; // 图片样式
    listClass?: string; // 列表样式
}
const props = withDefaults(defineProps<imgPreviewProps>(),{
    imgList: [],
    imgW: 100,
    imgH: 100,
    maskClose: true,
    controlOption:{
        controlBar: true,
        closeBtn: true,
        arrowBtn: true,
    },
}) 

// 点击图片预览
const clickFn = (index: Number) => {
    console.log('imgList',props.imgH,props.imgW)
    // 预览图片列表
    const list = props.previewList ? props.previewList : props.imgList
    
    proxy.$hevueImgPreview({
        nowImgIndex: index,
        multiple:true,
        imgList: list,
        clickMaskCLose:props.controlOption.closeBtn && !props.controlOption.closeBtn ? true : props.maskClose,
        arrowBtn:props.imgList.length === 1 ? false : props.controlOption.arrowBtn,
        controlBar:props.controlOption.controlBar,
        closeBtn:props.controlOption.closeBtn,
    })
}

onMounted(() => {
})
</script>
<style lang='scss' scoped></style>