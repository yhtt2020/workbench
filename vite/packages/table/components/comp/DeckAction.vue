<template>
  <SecondPanel size="small" @changeTab="change" :menus="menus">

  </SecondPanel>
</template>

<script>
import SecondPanel from '../SecondPanel.vue'

export default {
  name: 'DeckAction',
  data () {
    return {
      menus: [
        {
          title: '浏览器',
          index: 'browser'
        },
        {
          title: '提示',
          index: 'tip'
        },
        {
          title: '音频',
          index: 'sound'
        }, {
          title: '键鼠',
          index: 'key'
        },{
          title:'应用',
          index:'app'
        }
      ]
    }
  },
  components: { SecondPanel },
  methods: {
    change (tab) {
      console.log(tab)
    }
  }
}
</script>

<style scoped>

</style>
