<template>
  <transition name="fade">
    <div class="home-blur preview-container" v-if="textShow">
      <div class="flex">
        <div class="w-3/4 flex flex-col" style="border-right: 1px solid  rgba(255,255,255,0.10);">
         <div @click="closePreview"  class="w-12 h-12 no-drag button-active  s-item  ml-5 mt-6 flex pointer items-center justify-center rounded-lg">
           <Icon icon="guanbi" style="font-size: 1.5em;"></Icon>
         </div> 
         <div class="w-full flex items-center justify-center" style="margin: 25% 0;" v-if="textPreview.type==='text'">
           <span class="preview-content">{{textPreview.content}}</span>
         </div>
         <div v-if="textPreview.type === 'image'" style="margin:8% 0;" class="w-full flex items-center justify-center">
           <div style="width:800px;height: 450px;" class="rounded-lg">
             <img :src="textPreview.imgUrl" class="rounded-lg" style="width:100%;height: 100%; object-fit: cover;" alt="">
           </div>
         </div>
         <div class="w-full flex items-center justify-center my-6">
           <div class="h-12" v-if="textPreview.type === 'text'">
             123
           </div>
         </div>
        </div>
        <div class="w-1/4 px-6  pt-6 flex flex-col justify-between mb-6" v-if="textPreview.type === 'text'">
         <div class="flex flex-col">
           <div class="flex justify-between mb-6">
             <span class="preview-type">类型</span>
             <span class="preview-text">{{textPreview.title}}</span>
           </div>
           <div class="flex justify-between mb-6">
             <span class="preview-type">时间</span>
             <span class="preview-text">{{textPreview.time }}</span>
           </div>
           <div class="flex justify-between">
             <span class="preview-type">大小</span>
             <span class="preview-text">{{textPreview.capacity}}</span>
           </div>
         </div>
         <div>
            <div v-for="item in copy" class="s-item mb-2 pointer button-active flex justify-between items-center rounded-lg px-4 py-3">
             <span class="preview-text">{{item.title}}</span>
             <span class="preview-type">{{item.intr}}</span>
            </div>
         </div>
        </div>
        <div class="w-1/4 px-6  pt-6 flex flex-col  justify-between mb-6" v-if="textPreview.type === 'image'">
         <div class="flex flex-col">
           <div class="flex item-center justify-between mb-3">
             <span class="preview-type">名称</span>
             <span class="preview-type">{{textPreview.name}}</span>
           </div>
           <div class="flex item-center justify-between mb-3">
             <span class="preview-type">类型</span>
             <span class="preview-type">{{textPreview.title}}</span>
           </div>
           <div class="flex item-center justify-between mb-3">
             <span class="preview-type">时间</span>
             <span class="preview-type">{{textPreview.time}}</span>
           </div>
           <div class="flex item-center justify-between mb-3">
             <span class="preview-type">大小</span>
             <span class="preview-type">{{textPreview.capacity}}</span>
           </div>
           <div class="flex item-center justify-between mb-3">
             <span class="preview-type">格式</span>
             <span class="preview-type">{{textPreview.fileType}}</span>
           </div>
           <div class="flex item-center justify-between mb-3">
             <span class="preview-type">路径</span>
             <span class="truncate preview-type" style="max-width: 242px;">{{textPreview.imgUrl}}</span>
           </div>
         </div>
         <div class="h-12">456</div> 
        </div>
     </div>
    </div>
  </transition>
</template>

<script>
export default {
  props:{
    textShow:{
      type:Boolean,
      default:false
    },
    textPreview:{
      type:Object,
      default:()=>{}
    }
  },
  data(){
    return{
      copy:[
        {title:'复制',intr:'Ctrl + C'},
        {title:'打开链接',intr:'Ctrl + O'},
        {title:'添加到收藏',intr:'Ctrl + S'},
        {title:'删除',intr:'Delete'}
      ],   
    }
  },
  methods:{
    closePreview(){
      this.$emit('closeText',false)
    }
  }   
}
</script>

<style lang="scss" scoped>
.preview-container{
  position: fixed;
  top:0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  background-color: rgba(19, 19, 19, 0.35);
  backdrop-filter: blur(60px);
}


.button-active{
  &:active{
    filter: brightness(0.8);
    background: rgba(42, 42, 42, 0.6);
  }
  &:hover{
    background: rgba(42, 42, 42, 0.6);
  }
}
.preview-content{
  width:600px;
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: rgba(255,255,255,0.60);
  font-weight: 500;
}

.preview-type{
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: rgba(255,255,255,0.60);
  font-weight: 400;
}
.preview-text{
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: rgba(255,255,255,0.85);
  font-weight: 400;
}
</style>