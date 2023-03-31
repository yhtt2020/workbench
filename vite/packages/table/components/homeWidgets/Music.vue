<template>
  <HomeComponentSlot :options="options">
    <div @click="enterMusic" class="pointer" style="text-align: center;padding:3em">
      <a-avatar :size="100" :class="{'playing':status.music.playing}" style="border:3px solid #999"  :src="status.music.cover || 'https://a.apps.vip/icons/wyy.png'"></a-avatar>
    </div>
    <a-row :gutter="10">
      <a-col :span="12">
        <div class="sub-card">
          喜欢<br>
          <Icon icon="shoucang" style="width: 3em;height:3em;margin-top: 1em"></Icon>
        </div>
      </a-col>
      <a-col :span="12">
        <div class="sub-card">
          歌单<br>
          <Icon icon="liebiaoshitu" style="width: 3em;height:3em;margin-top: 1em"></Icon>
        </div>
      </a-col>
    </a-row>
  </HomeComponentSlot>
</template>

<script>
import { appStore } from '../../store'
import {mapWritableState} from 'pinia'
import HomeComponentSlot from "./HomeComponentSlot.vue";
export default {
  name: 'Music',
  data(){
    return {
      options:{
        className:'card',
        title:'网易云',
        icon:'wangyiyunyinle',
        type:'music'
      },
    }
  },
  components:{
    HomeComponentSlot
  },
  computed:{
    ...mapWritableState(appStore,['status'])
  },
  methods:{
    enterMusic(){
      this.$router.push('/music')
    }
  }
}
</script>

<style scoped>

</style>
