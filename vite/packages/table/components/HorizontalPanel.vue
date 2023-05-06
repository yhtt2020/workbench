<template>
  <div class="flex flex-row nav-list-container rounded-xl p-1 s-bg">
    <div v-for="(item,index) in navList" class="h-10 w-40 flex justify-center items-center rounded-xl pointer"
         @click="clickNav(item,index)" :class="activeIndex===index?'s-item':''">{{ item.title }}
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
    }
  },
  data () {
    return {
      activeIndex: 0
    }
  },
  watch: {
    selectType () {
      this.posType()
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
  }
}
</script>

<style scoped>

</style>
