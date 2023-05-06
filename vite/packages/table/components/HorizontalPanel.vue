<template>
  <div class="flex flex-row nav-list-container rounded-lg p-1 " :class="bgColor">
    <div v-for="(item,index) in navList" class="w-40 flex justify-center items-center rounded-lg pointer" :style="{height:height +'px'}" @click="clickNav(item,index)" :class="activeIndex===index?'s-item':''">{{item.title}}</div>
  </div>
</template>

<script>
export default {
  name: "HorizontalPanel",
  props:{
    navList:{
      type:Array,
      default:()=>[]
    },
    selectType:{
      type:Object,
      default:()=>{}
    },
    bgColor:{
      type:String,
      default:'s-bg'
    },
    height:{
      type:Number,
      default:40
    }
  },
  data(){
    return {
      activeIndex:0
    }
  },
  methods:{
    clickNav(item,index){
      this.activeIndex = index
      this.$emit('update:selectType',item)
    }
  },
  mounted() {
    console.log(this.bgColor)
  }
}
</script>

<style scoped>

</style>
