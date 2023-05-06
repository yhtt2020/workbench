<template>
  <div class="flex flex-row nav-list-container rounded-xl p-1 s-bg" >
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
    },
    selectType:{
      type:Object,
      default:()=>{}
    }
  },
  data(){
    return {
      activeIndex:0
    }
  },
  mounted () {
    if(this.selectType){
      this.activeIndex = this.navList.findIndex(item=>{
        return item.name===this.selectType.name
      })
    }
  },
  methods:{
    clickNav(item,index){
      this.activeIndex = index
      this.$emit('update:selectType',item)
    }
  }
}
</script>

<style scoped>

</style>
