<template>
  <!-- 团队聊天主页面 -->
  <div class="flex" style="width: 100%;height: 100%">
    <!-- 左侧tab切换 -->
    <SecondPanel   @changeTab="changeTab" :menus="menus"></SecondPanel>

    <!-- 右侧内容显示 -->
    <div style="flex: 1;height: 100%;">
      <div class="s-bg xt-bg" style="height: calc(100% - 1em);border-radius: 10px;overflow: hidden;margin-top: 1em;margin: 0.5em">
        <router-view></router-view>
      </div>
    </div>
  </div>

</template>

<script>
import {defineComponent} from 'vue'
import SecondPanel from "../../components/SecondPanel.vue";
import {chatStore} from "../../store/chat";
import {mapActions} from "pinia";

export default defineComponent({
  name: "index",
  components: {SecondPanel},
  data() {
    return {
      menus:[
        // {
        //   title:'桌面',index:'desk',icon:'desktop',
        //   route:{name:'chatDesk'},
        // },
        {
          title: '聊天',index: 'chat',icon:'message',
          route:{ name: 'chat'}
        },
        // {
        //   title: '通讯录',index: 'contact',icon:'team',
        //   route:{ name: 'contact' }
        // },
        {
          title:'小队',index:'team',icon:'smile',
          route:{name:'hall'},
        },
        {
          title: '弹幕',index: 'barrage',icon:'text-align-left',
          route:{ name: 'barrage'}
        },
      ]
    }
  },
  mounted() {
    chatStore().login()
  },
  methods:{
    ...mapActions(chatStore,['login']),
    changeTab (args) {
      this.$router.push(args.menu.route)
      this.tab = args.index
    },
  },
})
</script>


<style scoped lang="scss">
</style>
