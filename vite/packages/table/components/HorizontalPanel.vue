<template>
  <div class="flex flex-row nav-list-container rounded-lg p-1" :class="bgColor">
    <div v-for="(item,index) in navList" class=" w-40 flex justify-center items-center rounded-lg pointer"
         @click="clickNav(item,index)" :class="activeIndex===index?'s-item':''" :style="{height:itemHeight}">{{ item.title }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'HorizontalPanel',
  emits:['changed'],
  props: {
    navList: {
      type: Array,
      default: () => []
    },
    selectType: {
      type: Object,
      default: () => {}
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
  data () {
    return {
      activeIndex: 0
    }
  },
  computed:{
    itemHeight(){
      return this.height + 'px'
    }
  },
  watch: {
    'selectType': {
      handler(){
        this.posType()
      }

    }
  },
  mounted () {
    this.posType()
  },
  methods: {
    posType () {
      if(this.selectType){
        if (this.selectType.name && this.navList.length > 0) {
          this.activeIndex = this.navList.findIndex(item => {
            return item.name === this.selectType.name
          })
        }
      }

    },
    clickNav (item, index) {
      this.activeIndex = index
      this.$emit('update:selectType', item)
      this.$emit('changed')
    }
  },
}
</script>

<style scoped>

</style>
