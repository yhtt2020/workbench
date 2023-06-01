<template>
  <div class="flex flex-wrap tab-item">
    <div v-for="(item,index) in navList" class="flex items-center  pointer p-3 mr-2 rounded-lg" @click="clickNav(item,index)" :class="navIndex === index ? 's-bg':''">
        <Icon :icon="item.icon" style="font-size: 1.25em;"></Icon>
        <span class="ml-2">{{item.title}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name:'TabSwitching',
  props:{
    navList:{
      type:Array,
      default:()=>[]
    },
    activeType:{
      type:Object,
      default:()=>{}
    }
  },
  data(){
    return{
      navIndex:0,
    }
  },

  watch:{
    'activeType': {
      handler(){
        this.defaultSelect()
      }
    }
  },

  mounted(){
    this.defaultSelect()
  },

  methods:{
    defaultSelect(){
      if(this.activeType){
        if (this.activeType.textname && this.navList.length > 0) {
          this.navIndex = this.navList.findIndex(item => {
            return item.textname === this.activeType.textname
          })
        }
      }
    },
    clickNav(item,index){
      this.navIndex = index
      item.state = false  // 将消息未读状态隐藏
      this.$emit('update:activeType',item)
    }
  }
}
</script>

<style lang="scss" scoped>
.s-bg{
 box-shadow: none !important;
}
</style>