<script lang="ts" setup>
import {onMounted, ref} from "vue";
import ImageSet from "./image/ImageSet.vue";
import SliderSet from "./image/SliderSet.vue";
import {image} from './image/image'
import {storeToRefs} from "pinia";
const props = defineProps({
  customIndex: {},
  customData: {},
  desk: {}
})
const option = {
  resize: true,
}
const sizeList = [
  {value: "1x1", name: "1x1"},
  {value: "2x2", name: "2x2"},
  {value: "2x4", name: "2x4"},
  {value: "4x4", name: "4x4"},
  {value: "4x6", name: "4x6"},
]
const settingVisible = ref(false)
const sliderVisible = ref(false)
const imageSetRef=ref()
const {imgList,defaultImg} = storeToRefs(image())
const menuList = [
  {
    icon: "shezhi1",
    title: "设置",
    fn: () => {

      imgList.value=customData.value.imgList;
      console.log(image().imgList,'图片列表')

      settingVisible.value=true

    },
  },
]
const header = {
  title: '图片组件',
  // ifyIcon: 'fluent:notepad-16-regular',
  showIcon: "/logo/memorandum.svg",
  leftHover: true,
  leftHoverName: "打开应用",
  leftHoverIcon: "fluent:open-16-regular",
}
onMounted(() => {
  if(customData.value.imgList?.length>0){
    //此处
  }else{
    customData.value.imgList=[{...defaultImg.value}]
  }
})

const customData = ref(props.customData)
const updateSize = (val) => {
  customData.value.customSize = val;
  customData.value.currentSize = [...val][0]
};
</script>

<template>
  <xt-container @resize="updateSize" :menu-list="menuList" v-model:customSize="customData.customSize"
                :customIndex="customIndex" :sizeList="sizeList" :custom-data="customData" :desk="desk" :header="header"
                :options="option">
    图片组件图片组件
  </xt-container>

  <ImageSet  v-if="settingVisible"
             v-model="settingVisible"
             @save="closeSet"
             :mask="0" ref="imageSetRef" :custom-data="customData"></ImageSet>
  <xt-modal v-if="sliderVisible"
            v-model="sliderVisible"
            title="「图片组」设置"
            :mask="false"
            @close="sliderVisible = false">
    <SliderSet :custom-data="customData"></SliderSet>
  </xt-modal>
</template>

<style scoped lang="scss">

</style>
