<template>

  <div class="second-panel" id="secondPanel" style="">
    <div style="padding-left: 1em">
      <a-avatar shape="square" :size="50" :src="logo">
      </a-avatar>
    </div>
    <div style="margin-top: 2.5em;margin-bottom:2em">
      <a-input-search style="width: 8em;margin-left: 1em" placeholder="搜索"></a-input-search>
    </div>
    <div @click="change($event,menu)" class="menu" :class="{'active':activeIndex===menu.index}" v-for="(menu,index) in menus">
      {{ menu.title }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'SecondPanel',
  props: [
    'menus',
    'logo'
  ],
  emits:[
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
    this.activeIndex=this.menus[0].index
    //this.panel.style.marginTop = -this.panel.offsetHeight / 2-20 + 'px'
  },
  methods:{
    change(e,menu){
      this.activeIndex=menu.index
      this.$emit('changeTab',{
        index:menu.index,
        menu:menu,
        event:e
      })
    }
  }
}
</script>

<style scoped lang="scss">
.second-panel {
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
