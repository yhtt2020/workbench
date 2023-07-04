<template>
  <div style="position: relative;">
<<<<<<< HEAD
    <div class="" style="width: 100px; height: 100px;position: relative;">
      <img :src="url" class="w-full h-full object-contain" alt="">
=======
    <div v-if="url"  class="" style="width: 100px; height: 100px;position: relative;">
      <img :src="url" class="w-full h-full object-cover" alt="">
>>>>>>> develop-50
      <div v-if="tag" class="rounded-lg w-10 tag"
      :style="{background:tagColor?tagColor:'rgba(0,0,0,0.8)'}"
      >
     {{ tag }}
      </div>
     <a-avatar :size="50" class="avatar-tag" :src="avatar" :style="rarityBorder" style="position: relative"></a-avatar>
     <OnlineTag style="position: absolute;right:5px;bottom: 5px;z-index: 99" v-if="online"></OnlineTag>
    </div>
    <div v-else class="">
      <div v-if="tag" class="rounded-lg w-10 tag"
           :style="{background:tagColor?tagColor:'rgba(0,0,0,0.8)'}" style="margin-bottom:25px"
      >
        {{ tag }}
      </div>
      <a-avatar :size="55"  :src="avatar" :style="rarityBorder"></a-avatar>
      <OnlineTag style="position: absolute;right:12px;bottom: 0px;z-index: 99" v-if="online"></OnlineTag>
    </div>
  </div>
</template>

<script>
import OnlineTag from './OnlineTag.vue'
import {rareColor} from '../../js/data/teamAvatar'
export default {
  name: 'UserAvatar',
  components: { OnlineTag },
  props: ['avatar', 'tag', 'online', 'tagColor','rare','url'],
  computed:{
    rarityBorder(){ // 通过计算属性将稀有度边框UI进行渲染
      const index = rareColor.find(el=>{
       return el.id === this.rare
      })
      return{
        border:`4px solid ${index.avatar_color}`
      }
    },
  }
}
</script>

<style scoped>
.tag {
  position: absolute;
  display: inline-block;
  z-index: 9;
  bottom: -30px;
  right: 10px;
  transform: translateX(-50%);
  left: 50%;
  font-size: 0.8em;
  color: white
}

:deep(.ps__rail-y){
  display: none !important;
}
:deep(.ps__thumb-y){
  display: none !important;
}

.avatar-tag{
  position: absolute !important;
  transform: translateX(-50%) !important;
  top: 20% !important;
  left: 50% !important;
  z-index: -1;
}
</style>
