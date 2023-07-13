<template>
  <div style="position: relative;text-align: center;height: 50px">
    <template v-if="showDetail === false">
      <div v-if="tag" class="rounded-lg w-10 tag" :style="{background:tagColor?tagColor:'rgba(0,0,0,0.8)'}">
        {{ tag }}
      </div>
      <FrameAvatar  :frame="frame" framePlacement="left" :avatarSize="50" style="" :avatarUrl="avatar" :frameUrl="frameUrl"></FrameAvatar>
      <OnlineTag style="position: absolute;right:5px;bottom: 5px;z-index: 99" v-if="online"></OnlineTag>
    </template>
    <template v-else>
      <div v-if="tag" class="rounded-lg w-10 tag" :style="{background:tagColor?tagColor:'rgba(0,0,0,0.8)',}">
        {{ tag }}
      </div>
      <FrameAvatar :frame="frame" framePlacement="left" :avatarSize="50"  :avatarUrl="avatar" :frameUrl="frameUrl"></FrameAvatar>
      <OnlineTag style="position: absolute;right:20px;bottom: 15px;z-index: 99" v-if="online"></OnlineTag>
    </template>
  </div>
</template>

<script>
import OnlineTag from './OnlineTag.vue'
import FrameAvatar from '../avatar/FrameAvatar.vue';
import BorderAavtar from '../avatar/BorderAavtar.vue';
export default {
  name: 'UserAvatar',
  components: { OnlineTag,FrameAvatar,BorderAavtar},
  props: ['avatar', 'tag', 'online', 'tagColor','showDetail','frameUrl','frame'],
  computed:{
    // rarityBorder(){ // 通过计算属性将稀有度边框UI进行渲染
    //   const index = rareColor.find(el=>{
    //    return el.id === this.rare
    //   })
    //   return{
    //     border:`4px solid ${index.avatar_color}`
    //   }
    // },
  },
  data(){
    return{
    }
  }
}
</script>

<style scoped>
.tag {
  position: absolute;
  display: inline-block;
  z-index: 9;
  bottom: -5px;
  right: 10px;
  transform: translateX(-50%);
  left: 50%;
  font-size: 0.8em;
  color: white
}
</style>
