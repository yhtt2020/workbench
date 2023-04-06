<template>
  <div class="second-panel"  :class="{'large':this.size==='large','small':this.size==='small'}" id="secondPanel" style="">
    <div  style="margin-bottom:2em;" v-if="gallery === true">
      <div :onClick="goHome"  class="second-panel-back  bg-white cursor-pointer bg-opacity-10 rounded-lg flex items-center " style="padding: 0.5em 1em;">
        <span>
          <Icon icon="xiangzuo" style="font-size: 2em; margin-right: 0.2em;"></Icon>
        </span>
        <span style="font-size: 1.75em;">返回</span>
      </div>
    </div>
    <div @click="change($event,menu)" class="menu" :class="{'active':current(menu)}"
         v-for="(menu) in menus">
     <Icon v-if="menu.icon" :icon="menu.icon"></Icon>  {{ menu.title }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'SecondPanel',
  props: [
    'menus',
    'logo',
    'size',
    'search',
    'close',
    'back',
    'goHome',
    'gallery'
  ],
  emits: [
    'changeTab'
  ],
  data () {
    return {
      panel: {},
      activeIndex: '',
    }
  },
  mounted () {
    this.panel = document.getElementById('secondPanel')
    this.activeIndex = this.menus[0].index
    //this.panel.style.marginTop = -this.panel.offsetHeight / 2-20 + 'px'
  },
  computed:{

  },
  methods: {
    current(menu){
      if(menu.route){
        return this.$route.name===menu.route.name || this.$route.path===menu.route.path
      }else{
        console.log(this.activeIndex,menu.index)
        return this.activeIndex===menu.index
      }

    },
    change (e, menu) {
      this.activeIndex = menu.index
      console.log(this.activeIndex)
      console.log(this.activeIndex)
      this.$emit('changeTab', {
        index: menu.index,
        menu: menu,
        event: e
      })
    }
  }
}
</script>

<style scoped lang="scss">
.second-panel {
  &.small{}
  height: auto;
  border-radius: 6px;
  position: fixed;
  top: 5em;

  .menu {
    &:hover {
      background: #696969;
    }

    &.active {
      background: #595959;
    }

    width: 8em;
    padding-left: 1em;
    font-size: 1.3em;
    height: 3em;
    line-height: 3em;
    border-radius: 0.3em;
    cursor: pointer;
    margin-bottom: 0.5em;
  }
}

</style>
