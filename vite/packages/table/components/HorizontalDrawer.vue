<template>
  <a-drawer v-model:visible="detailDisplay" :title="drawerTitle" @close="onClose" style="text-align: center;"
  :bodyStyle="{textAlign:'left',overflow:'hidden',}" placement="right"  width="500"
  > 
   <vue-custom-scrollbar  @touchstart.stop @touchmove.stop @touchend.stop  :settings="settingsScroller" style="height: 86vh;">
    <div class="w-full h-12 flex items-center right-select-active  justify-center pointer my-4 rounded-lg s-bg"
      v-for="(item,index) in rightSelect" :class="defaultGameIndex === index ? 'active':''" @click="selectedAreaSuit(item,index)"
    >
      {{ item.name }}
    </div>
   </vue-custom-scrollbar>
  </a-drawer>
</template>

<script>
export default {
  props:{
    drawerTitle:String,
    rightSelect:{
      type:Array,
      default:()=>[]
    },
    selectRegion:String,
  },
  data(){
    return{
      detailDisplay:false,
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
      defaultGameIndex:0,
    }
  },
  mounted(){
    this.posRegion()
  },
  watch:{
    'selectRegion':{
      handler(){
        this.posRegion()
      }
    }
  },
  methods:{
    openDrawer(){
      this.detailDisplay = true
    },
    selectedAreaSuit(item,index){
      this.$emit('getArea',item)
      this.defaultGameIndex = index
      this.detailDisplay = false 
    },
    posRegion(){
      if(this.selectRegion){
        console.log(this.selectRegion);
        if(this.selectRegion && this.rightSelect.length > 0){
          this.defaultGameIndex = this.rightSelect.findIndex(el=>{
            return el.id === this.selectRegion
          })
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.active{
  background: rgba(255,255,255,0.40);
}
.btn-active:active{
  filter: brightness(0.8);
  background:rgba(42, 42, 42, 0.25);
} 
</style>