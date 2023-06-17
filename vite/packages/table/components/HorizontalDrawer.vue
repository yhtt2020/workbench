<template>
  <a-drawer v-model:visible="detailDisplay" :title="drawerTitle" @close="onClose"
  :bodyStyle="{textAlign:'left',overflow:'hidden',}" placement="right"  width="500"
  >

   <vue-custom-scrollbar  @touchstart.stop @touchmove.stop @touchend.stop  :settings="settingsScroller" style="height: 86vh;">
    <div class="w-full h-12 flex items-center  justify-center pointer my-4 rounded-lg s-list"
      v-for="(item,index) in rightSelect" :class="defaultGameIndex === index ? 'drawer-active':''" @click="selectedAreaSuit(item,index)"
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
.drawer-active{
  background: var(--active-bg);
  color: var(--active-text);
}


::v-deep .ps__thumb-y{
  display: none !important;
}
</style>
<style>
.ant-drawer-header{
  border-bottom: none !important;
}
.s-list{
  background: var(--secondary-bg);
}
</style>
