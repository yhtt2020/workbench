<template>
  <a-input-group class="barrage-sender" compact>
    <a-input  style="width:calc(100% - 70px);border:none" @keyup.enter="postBarrage" v-model:value="postContent"
             :placeholder="'发送至'+currentChannel.title+'频道'">
      <template #addonBefore>
        <span style="color:var(--primary-text)">{{ currentChannel.title }}</span>
      </template>
    </a-input>
    <xt-button  style="border-top-left-radius: 0;border-bottom-left-radius: 0;border-radius:6px" type="theme" :w="70" :h="32" class="xt-text" @click="postBarrage" >发送</xt-button>
  </a-input-group>
</template>

<script>
import { message } from 'ant-design-vue'
import { mapActions, mapState } from 'pinia'
import { teamStore } from '../../store/team'
import {completeTask} from "../../apps/task/page/branch/task.ts"
export default {
  name: 'BarrageSender',
  props:['currentChannel'],
  emits:['loadTeamBarrage','loadAllBarrages'],
  data(){
    return {
      postContent:'',
      CONST:[]
    }
  },
  mounted () {
    this.CONST = tsbApi.barrage.CONST
  },
  computed:{
    ...mapState(teamStore, ['my','myTeamNo','myTeam']),
  },
  methods:{
    ...mapActions(teamStore,['updateMy']),
    async postBarrage () {

      if (!this.postContent) {
        message.error('请输入弹幕内容')
        return
      } else {
        completeTask('Z0501')
        let channelType=this.CONST.CHANNEL.PUBLIC
        let pageUrl='table'
        if(this.currentChannel.name!=='all'){
          channelType=this.CONST.CHANNEL.TEAM
          pageUrl=this.myTeamNo
          completeTask('Z0502')
          if(String(pageUrl).trim()===''){
            await this.updateMy()
            if(String(pageUrl).trim()===''){
              message.error('小队号错误，无法发送弹幕')
            }
            return
          }
        }
        let data = {
          channel_type:channelType ,
          content: this.postContent,
          page_url: String(pageUrl),
        }
        let rs = await tsbApi.barrage.add(data)
        if (rs.status) {
          this.postContent = ''
          if (!this.hideAdmin) {
            this.hideAdmin = true
          }
          console.log('33233333 :>> ', 33233333);
          message.success('弹幕发送成功')
          setTimeout(() => {
            if(this.currentChannel.name==='all'){
              this.$emit('loadAllBarrages')
            }else{
              this.$emit('loadTeamBarrage')
            }
          }, 5000)
        } else {
          console.error(rs)
          message.error('弹幕发送失败，失败原因：' + rs)
        }
      }
    },
  }
}
</script>

<style lang="scss">
.barrage-sender{
  .ant-input-group{
    border: none;
  }
  .ant-input-group-addon{
    border-radius: 6px;
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
  }
  .ant-input,.ant-input-group-addon{
    &::-webkit-input-placeholder{
      color:var(--secondary-text) !important;
    }
    border-color:var(--secondary-bg);
    background: var(--secondary-bg);
    color:var(--primary-text) !important;
  }
}
</style>
