<template>
  <div class="flex flex-row w-auto rounded-xl p-1 s-bg" >
    <div v-for="(item,index) in navList" class="h-10 w-40 flex justify-center items-center rounded-xl pointer" @click="clickNav(item,index)" :class="activeIndex===index?'s-item':''">{{item.title}}</div>
  </div>
</template>

<script>
export default {
  name: "HorizontalPanel",
  props:{
    navList:{
      type:Array,
      default:()=>[]
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
      this.$emit('clickNav')
    }
  }
}
</script>

<style scoped>

</style>
