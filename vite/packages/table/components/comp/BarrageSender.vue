<template>
  <a-input-group compact>
    <a-input style="width:calc(100% - 70px);" @keyup.enter="postBarrage" v-model:value="postContent"
             :placeholder="'发送至'+currentChannel.title+'频道'">
      <template #addonBefore>
        <span style="color:var(--primary-text)">{{ currentChannel.title }}</span>
      </template>
    </a-input>
    <a-button @click="postBarrage" type="primary">发送</a-button>
  </a-input-group>
</template>

<script>
import { message } from 'ant-design-vue'
import { mapActions, mapState } from 'pinia'
import { teamStore } from '../../store/team'

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
        let channelType=this.CONST.CHANNEL.PUBLIC
        let pageUrl='table'
        if(this.currentChannel.name!=='all'){
          channelType=this.CONST.CHANNEL.TEAM
          pageUrl=this.myTeamNo
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

<style scoped>

</style>
