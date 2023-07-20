<script lang="ts">
import {defineComponent} from 'vue'
import SecondPanel from "../../components/SecondPanel.vue";
import {chatStore} from "../../store/chat";
import {mapActions} from "pinia";

export default defineComponent({
  name: "index",
  components: {SecondPanel},
  data() {
    return {
      menus: [{
        title: '聊天',
        index: 'chat',
        route:
          {
            name: 'chat'
          }
      },

        {
          title: '联系人',
          index: 'contact',
          route:
            {
              name: 'contact'
            }
        }

      ],
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
  }
})
</script>

<template>
  <div class="flex" style="width: 100%;height: 100%">
    <div>
      <SecondPanel   @changeTab="changeTab" :menus="menus">

      </SecondPanel>
    </div>

    <div style="flex: 1;height: 100%">
      <div class="s-bg xt-bg" style="height: calc(100% - 1em);border-radius: 10px;overflow: hidden;margin-top: 1em;margin: 0.5em">

      <router-view></router-view>
      </div>
    </div>
  </div>


</template>

<style scoped lang="scss">

</style>
