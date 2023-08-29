<script lang="ts">
import Widget from "./Widget.vue";
import {mapActions} from "pinia";
import {appStore} from "../../store";

export default {
  name: "CoolWidget",
  components: {Widget},
  data(){
    return {
      options: {
        className: 'card small',
        title: '',
        icon: '',
        type: 'fish',
        noTitle: true,
      },
    }
  },
  props: {
    'appName': {
      type: String,
      default: 'demo'
    },
    customIndex: {
      type: Number,
      default: 0
    },
    customData: {
      type: Object,
      default: () => {
      }
    },
    desk: {
      type: Object
    }
  },
  methods:{
    ...mapActions(appStore,['showUserCard']),
    doShowUserCard(){
      this.showUserCard(4)
    }
  }
}
</script>

<template>
  <Widget :options="options"  :customIndex="customIndex" :desk="desk">
    <WujieVue
              width="100%"
              height="100%"
              :name="'dd'"
              url="http://localhost:5173/#/card1"
              :sync="true"
              :fetch="fetch"
              :props="{data:{
                a:1,
                b:2
              },
              methods:{
                showUserCard:doShowUserCard
              }}"
    ></WujieVue>
  </Widget>
</template>

<style scoped lang="scss">

</style>
