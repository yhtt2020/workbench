<template>
  <xt-modal v-model="galleryVisible" :custom="true" :mask="false" boxPadding="py-3 pl-0 pr-3" maskIndex="1010" index="1010">
    <xt-left-menu style="height: 600px;width: 976px;" :list="galleryList" :index="galleryIndex" last="5" end="1">
      <div class="w-full">
        <template v-if="galleryIndex === 'm'">
          <My isModal="true"/>
        </template>
        <template v-if="galleryIndex === 'w'">
          <SiftPaper />
        </template>
        <template v-if="galleryIndex === 'b'">
          <Bing/>
        </template>
        <template v-if="galleryIndex === 's'">
          <Setting />
        </template>
        <template v-if="galleryIndex === 'p'">
          <Picking/>
        </template>
        <template v-if="galleryIndex === 'l'">
          <Lively/>
        </template>
      </div>
    </xt-left-menu>
  </xt-modal>
</template>

<script>
import { ref,reactive,computed, toRefs,getCurrentInstance,onMounted,nextTick } from 'vue';
import { useRouter,useRoute } from 'vue-router';

import My from '../../page/gallery/My.vue';
import Bing from '../../page/gallery/Bing.vue';
import Lively from '../../page/gallery/Lively.vue';
import Picking from '../../page/gallery/Picking.vue';
import Setting from '../../page/gallery/Setting.vue';
import SiftPaper from '../../page/gallery/SiftPaper.vue';

export default {
  components:{
    My,Bing,Lively,Picking,Setting,SiftPaper,
  },
  
  props:[],

  setup(props,ctx){
    const router = useRouter();
    const { proxy } = getCurrentInstance();

    const galleryVisible = ref(false);
    const data = reactive({
      galleryIndex:'m',
    });

    // 开启壁纸应用弹窗
    const  openGalleryModal = () =>{
      galleryVisible.value = true;
    };

    // 切换壁纸模块
    const galleryTab = (item) =>{
      data.galleryIndex = item.index
    }

    
    const galleryList = ref([
      { 
        newIcon:'fluent:star-16-regular', index:'m',  title: '我的收藏', 
        callBack:(item)=>{ galleryTab(item) }, 
      },
      { 
        newIcon:'fluent:emoji-smile-slight-24-regular',index:'w', title:'精选壁纸',
        callBack:(item)=>{ galleryTab(item) }, 
      },
      {
        newIcon:'uim:bing', title: '必应壁纸',index:'b',
        callBack:(item)=>{ galleryTab(item) }, 
      },
      {
        newIcon:'fluent:image-multiple-16-filled',   title:'拾光壁纸',index:'p',
        callBack:(item)=>{ galleryTab(item) }, 
      },
      {
        title: '动态壁纸',index:'l',newIcon:'fluent:image-sparkle-16-regular',
        callBack:(item)=>{ galleryTab(item) }, 
      },
      // {
      //   full:true,
      // },
      {
        index: 's',  title: '设置',newIcon:'fluent:settings-16-regular',
        route: {  name: 'papersSetting' },callBack:(item)=>{ galleryTab(item) }
      }
    ])

    onMounted(()=>{
      nextTick(()=>{
        proxy.$mit.on('closePaper',()=>{
          galleryVisible.value = false
        })
      })
    })
    
    return{
      galleryVisible,galleryList,
      openGalleryModal,
      ...toRefs(data),
    }
  },
 }
</script>

<style lang="scss" scoped>
:deep(#containerWrapper){
  margin: 0 !important;
  height: 580px !important;
}

#pick-content{
  height: 580px !important;
}

#bingImages{
  height: 580px !important;
}

</style>