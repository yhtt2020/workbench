<template>
 <vue-custom-scrollbar id="containerWrapper" :settings="settingsScroller" class="grow shrink" style="height: 100%;">
  <viewer :images="myPaperList" :options="options" class="px-2.5">
   <a-row :gutter="[20, 20]" id="bingImages">
    <a-col class="image-wrapper" v-for="img in myPaperList" :span="6">
     <img @contextmenu.stop="openSetting(img)" :src="fileImageExtension(img) ? img.path : img.src" :data-source="img.path" :alt="img.resolution"   class="image-item pointer relative"/>

     <div v-if="fileImageExtension(img)" @click="previewVideo(img)"  class="play-icon flex items-center justify-center pointer" style="">
      <!-- <Icon icon="bofang" style="font-size:3em;></Icon> -->
      <MyContentIcon icon="fluent:play-16-filled" style="font-size: 1.8rem;"/>
     </div>

     <div class="absolute right-0 p-2.5" style="top: -10px;">
      <div class="bottom-actions pointer" @click.stop="addToActive(img)"  :style="{ background: isInActive(img) ? 'rgba(255,0,0,0.66)' : '' }">
       <Icon v-if="!isInActive(img)" icon="tianjia1"></Icon>
       <Icon v-else icon="yiwancheng"></Icon>
      </div>
     </div>
    </a-col>
   </a-row>
  </viewer>
 </vue-custom-scrollbar>
</template>

<script>
import { mapActions,mapWritableState } from 'pinia';
import { fileImageExtension,isInActive } from '../../libs/utils';
import { paperStore } from '../../../../store/paper';
import { Icon as MyContentIcon } from '@iconify/vue'

export default {
  name: "MyContent",

  components:{
   MyContentIcon,
  },

  props: ["myPaperList"],

  data() {
    return {
     options: { url: 'data-source',},

     settingsScroller: {
      useBothWheelAxes: true,
      swipeEasing: true,
      suppressScrollY: false,
      suppressScrollX: true,
      wheelPropagation: true,
     },
    }
  },

  methods:{
   fileImageExtension,isInActive,
   ...mapActions(paperStore,['addToActive']),
   // 开启壁纸设置
   openSetting(item){ this.$emit('paperSetting',item);},
   // 播放动态壁纸
   previewVideo(img){
    this.$emit('playPaperVideo',img);
   },
  },
};
</script>

<style lang="scss" scoped>
.play-icon {
 position: absolute;
 z-index: 99;
 background: rgba(0, 0, 0, 0.51);
 text-align: center;
 width: 4em;
 height: 4em;
 left: 50%;
 top: 50%;
 border-radius: 100px;
 transform: translate(-50%, -50%);
}
</style>