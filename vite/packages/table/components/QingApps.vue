<template>
<div style="padding: 1em;width: 100%">
  <vue-custom-scrollbar :settings="outerSettings" style="position:relative;height:calc(100vh - 14em); width: 100% ">
  <div @click="executeApp(app)" class="app" v-for="app in apps">
    <a-avatar :size="50" :src="app.logo"></a-avatar>
    <div class="name text-more">
      {{app.name}}
    </div>
  </div>
  </vue-custom-scrollbar>
</div>
</template>

<script>
import { mapWritableState } from 'pinia'
// import { apps } from '../store/apps'

const {appModel}=window.$models
export default {
  name: 'QingApps',
  computed:{
    // ...mapWritableState(apps,['myApps','qingApps'])
  },
  data(){
    return {
      apps:[],
      outerSettings:{
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
    }
  },
  async mounted () {
    this.apps=await appModel.getAllApps()
  },
  methods:{
    executeApp(app){
      ipc.send('executeApp',{app:JSON.parse(JSON.stringify(app))})
    }
  }
}
</script>

<style scoped lang="scss">
.app{
  cursor: pointer;
  text-align: center;
  display: inline-block;
  width: 6em;
  vertical-align: top;
  padding: 1em;
  border-radius: 0.2em;
  &:hover{
    background: rgba(12, 12, 12, 0.25);
  }
  .name{
    font-size: 0.8em;
    margin-top: 0.5em;
  }
}
</style>
