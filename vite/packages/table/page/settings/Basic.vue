<template>
  <div style="display: flex">
    <div class="settings-menus">
      <div @click="setMenu(menu)" v-for="menu in menus" class="item" :class="{'active':currentMenu===menu.name}">
        {{ menu.title }}
      </div>
    </div>
    <div style="padding: 1em">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
const menus = [
  {
    title: '通用设置',
    name: 'common',
    route: {
      name: 'common'
    }
  },
  {
    title: '浏览器设置',
    name: 'browser',
    route: {
      name: 'browser'
    }
  },
  {
    title: '按键设置',
    name: 'key',
    route: {
      name: 'key'
    }
  }

]
export default {
  name: 'Basic',
  data () {
    return {
      menus,
      currentMenu: 'key'
    }
  },
  mounted () {
    // this.$router.replace({
    //       name:'key'
    //     })
    //this.setMenu(this.menus[2])
    // this.$router.push({
    //   name:'key'
    // })
  },
  methods: {
    setMenu (menu) {
      this.currentMenu = menu.name
      if (menu.route) {
        this.$router.push(menu.route)
      }
    },
    setKeyStatus (keyCode, status) {
      switch (keyCode) {
        case 16:
          this.shift = status
          break
        case 17:
          this.ctrl = status
          break
        case 18:
          this.alt = status
          break
      }
    }
  }
}
</script>

<style scoped lang="scss">
.settings-menus {
  background: #3b3b3b;
  width: 8em;
  padding: 0.3em;
  height: 100vh;
  border-radius: 0.3em;

  .item {
    cursor: pointer;

    &.active, &:hover {
      background: rgba(145, 145, 145, 0.81);
      color: rgba(255, 255, 255, 0.65);
    }

    border-radius: 0.3em;
    line-height: 3em;
    text-align: center;
    margin: 0.5em;
  }
}

</style>
