<template>
  <div class="wallheaven-header">
    <a-row justify="center">
      <a-col class="wallheaven-item" :span="4" v-for="item in wallTitle" :class="wallStatus === item.id ? 'wallheaven-active':''" @click="wallTitleClick(item)"> 
        {{ item.name }}
      </a-col>
    </a-row>
  </div>
  <WallHot v-if="wallStatus === 0" />
  <WallAcg v-if="wallStatus === 1"/>
  <WallPeople v-if="wallStatus === 2"/>
</template>

<script>
import { defineComponent,ref } from 'vue'
import WallHot from './WallheavenItem/WallHot.vue';
import WallAcg from './WallheavenItem/WallAcg.vue';
import WallPeople from './WallheavenItem/WallPeople.vue'
export default defineComponent({
  name: 'Wallheaven',
  components:{
    WallHot,
    WallAcg,
    WallPeople
  },
  data(){
    return{
      wallTitle:[
       {
        id:0,
        name:'热门推荐',
        categories:'111',
       },
       {
        id:1,
        name:'动漫精选',
        categories:'010',
       },
       {
        id:2,
        name:'人物精选',
        categories:'001',
       }
      ],
      wallStatus:0,
    }
  },
  methods:{
    // wallheaven壁纸分类标题
    wallTitleClick(item){
      this.wallStatus = item.id
      this.categories = item.categories
      if(this.wallStatus == 0){
        this.wallTypeValue = 'hot'
      }else if(this.wallStatus == 1){
        this.wallTypeValue = 'date_added'
      }else if(this.wallStatus == 2){
        this.wallTypeValue = 'date_added'
      }
    },
  }
})
</script>

<style lang="scss" scoped>
.wallheaven-header {
  width: auto;
  padding-bottom: 32px;
  .wallheaven-item {
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    user-select: none;
    padding: 11.87px 28px 11px 28px;
    margin-right: 16px;
  }
  .wallheaven-active {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 12px;
  }
}
</style>