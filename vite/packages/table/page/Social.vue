<template>
  <SecondPanel  @change-tab="changeTab" :menus="tabs"></SecondPanel>
  <router-view>
  </router-view>

</template>

<script>
import GradePanel from '../components/comp/GradePanel.vue'
import ComPanel from '../components/comp/ComPanel.vue'
import ComActionPanel from '../components/comp/ComActionPanel.vue'
import GroupPanel from '../components/comp/GroupPanel.vue'

import SecondPanel from '../components/SecondPanel.vue'

export default {
  name: 'Social',
  components: { SecondPanel, GroupPanel, GradePanel, ComPanel, ComActionPanel },
  data () {
    return {
      tabs:[
        {
          index: 'com',
          title: '互动社区',
          icon:'xiaoxi',
          route:
            {
              name: 'com'
            }
        },
        {
          title: '我的',
          index: 'user',
          icon:'chengyuan',
          route:
            {
              name: 'socialMy',
            }
        },
        {
          title: '邀请',
          index: 'invite',
          icon:'tianjiachengyuan',
          route:
            {
              name: 'invite',
            }
        },
       {
         title: '等级权益',
           index: 'grade',
         icon:'star',
         route:
         {
           name: 'grade',
         }
       }
      ],


      scrollbarSettings: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: true,
        suppressScrollX: false,
        wheelPropagation: true
      },

    }
  },
  async mounted () {

  },
  methods: {
    goUrl(url){
      ipc.send('addTab',{url:url})
    },
    changeTab (data) {
      console.log(data)
      this.$router.push(data.menu.route)
    },
  }
}
</script>

<style scoped>

</style>
