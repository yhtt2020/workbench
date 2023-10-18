<template>
  <div style="display: flex;height: 100%">
    <SecondPanel   @change-tab="changeTab" :menus="tabs"  ></SecondPanel>
    <div style="flex-grow: 1;flex-shrink: 1;height: 100%;display: flex;flex-direction: column;overflow: hidden;">
      <router-view>
      </router-view>
    </div>
  </div>


</template>

<script>
import GradePanel from '../components/comp/GradePanel.vue'
import ComPanel from '../components/comp/ComPanel.vue'
import ComActionPanel from '../components/comp/ComActionPanel.vue'
import GroupPanel from '../components/comp/GroupPanel.vue'

import SecondPanel from '../components/SecondPanel.vue'
import browser from '../js/common/browser'

export default {
  name: 'Social',
  components: { SecondPanel, GroupPanel, GradePanel, ComPanel, ComActionPanel },
  data () {
    return {
      tabs:[
        {
          index: 'com',
          title: '版本历史',
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
       },
       {
        title:'消息',
        index:'message',
        icon:'message',
        route:{
          name:'message'
        }
       },
       {
        title:'榜单',
        index:'rank',
        icon:'trophy',
        route:{
          name:'rank'
        }
       },
      //  {
      //   title:'推广中心',
      //   index:'promotion',
      //   icon:'trophy',
      //   route:{
      //     name:'promotion'
      //   }
      //  },
      //  {
      //   title:'账单(开发中)',
      //   index:'bill',
      //   icon:'zhangdan',
      //   route:{
      //     name:'bill',
      //   }
      //  }
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
      browser.openInInner(url)
    },
    changeTab (data) {
      this.$router.push(data.menu.route)
    },
  }
}
</script>

<style scoped lang="scss">
:deep(.muuri-item ) {
  /* any styles to card on the item container */
  /* only to override positioning */
  margin: 5px;

.muuri-item-content {
  /* card any markup you like */
}

&.muuri-item-dragging {
 }

&.muuri-item-releasing {
 }

&.muuri-item-hidden {
 }
}

</style>
