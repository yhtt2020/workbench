<template>
  <div class="card" >
    <div class="title"><Icon icon="yinle1" style="height: 1.3em;width: 1.3em;margin-right: 0.1em"></Icon> 网易云音乐</div>
    <div @click="enterMusic" class="pointer" style="text-align: center;padding:3em">
      <a-avatar :size="100" :class="{'playing':status.music.playing}" style="border:3px solid #999"  :src="status.music.cover || 'https://a.apps.vip/icons/wyy.png'"></a-avatar>
    </div>
    <a-row :gutter="10">
      <a-col :span="12">
        <div class="sub-card">
          我喜欢<br>
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
  </div>
</template>

<script>
import { appStore } from '../../store'
import {mapWritableState} from 'pinia'

export default {
  name: 'Music',
  computed:{
    ...mapWritableState(appStore,['status'])
  },
  methods:{
    enterMusic(){
      this.$router.push({
        name:'app',
        params:{
          theme:'#242424',
          name:'wyyMusic',
          url:'https://music.163.com',
          preload:'wyyMusic',
          background:true,
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
