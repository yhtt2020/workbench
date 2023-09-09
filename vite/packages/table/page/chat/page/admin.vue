<script lang="ts">
import {defineComponent} from 'vue'
import VueCustomScrollbar from "../../../../../src/components/vue-scrollbar.vue";
import {mapActions, mapState} from "pinia";
import {chatAdminStore} from "../chatAdminStore";

export default {
  name: "admin",
  components: {VueCustomScrollbar},
  data() {
    return {
      showDetail: false,

    }
  },
  computed:{
    ...mapState(chatAdminStore,['stats'])
  },
  mounted() {
    this.refreshStats()
  },

  methods: {
    ...mapActions(chatAdminStore, ['refreshStats'])
  }
}
</script>

<template>
  <div>
    <div class="p-2 m-2 h-full">
      <vue-custom-scrollbar class="w-full" ref="scrollerbar" style="height:calc(100%)" :settings="{}">
      <div class="line-title">
        统计面板
      </div>
      <div class="line">
        昨日IM大盘数据 —— {{ stats.AppName }}（AppId:{{ stats.AppId }} {{ stats.Company }}） 报告期数：{{stats.Date}}
        <div style="float: right">
          <xt-button @click="showDetail=true;$refs.scrollerbar.update()" type="theme" v-if="!showDetail">查看全部
          </xt-button>
          <xt-button @click="showDetail=false;$refs.scrollerbar.update()" type="theme" v-else>隐藏</xt-button>
        </div>
      </div>
      <div class="pd-2">
          <div class="text-center flex stats-container "
               style="flex-wrap: wrap;gap:10px;justify-content: center;"

               :style="!showDetail?'height: 90px;overflow: hidden':'height: auto;'">
            <div class="xt-bg rounded-lg p-2  " :span="4">
              <a-statistic title="活跃用户" :value="stats.ActiveUserNum">

              </a-statistic>
            </div>
            <div class="xt-bg rounded-lg p-2 " :span="4">
              <a-statistic title="新增注册人数" :value="stats.RegistUserNumOneDay">
              </a-statistic>
            </div>
            <div class="xt-bg rounded-lg p-2" :span="4">
              <a-statistic title="累计注册人数" :value="stats.RegistUserNumTotal">
              </a-statistic>
            </div>
            <div class="xt-bg rounded-lg p-2" :span="4">
              <a-statistic title="登录次数" :value="stats.LoginTimes">
              </a-statistic>
            </div>
            <div class="xt-bg rounded-lg p-2" :span="4">
              <a-statistic title="登录人数" :value="stats.LoginUserNum">
              </a-statistic>
            </div>
            <div class="xt-bg rounded-lg p-2 p-2" :span="4">
              <a-statistic title="上行消息数" :value="stats.UpMsgNum">
              </a-statistic>
            </div>
            <div class="xt-bg rounded-lg p-2 p-2" :span="4">
              <a-statistic title="发消息人数" :value="stats.SendMsgUserNum">
              </a-statistic>
            </div>
            <div class="xt-bg rounded-lg p-2 p-2" :span="4">
              <a-statistic title="APNs 推送数" :value="stats.APNSMsgNum">
              </a-statistic>
            </div>
            <div class="xt-bg rounded-lg p-2 p-2" :span="4">
              <a-statistic title="上行消息数（C2C）" :value="stats.C2CUpMsgNum">
              </a-statistic>
            </div>
            <div class="xt-bg rounded-lg p-2 p-2" :span="4">
              <a-statistic title="下行消息数（C2C）" :value="stats.C2CDownMsgNum">
              </a-statistic>
            </div>
            <div class="xt-bg rounded-lg p-2 p-2" :span="4">
              <a-statistic title="发消息人数（C2C）" :value="stats.C2CSendMsgUserNum">
              </a-statistic>
            </div>
            <div class="xt-bg rounded-lg p-2 p-2" :span="4">
              <a-statistic title="APNs 推送数（C2C）" :value="stats.C2CAPNSMsgNum">
              </a-statistic>
            </div>
            <div class="xt-bg rounded-lg p-2 p-2" :span="4">
              <a-statistic title="最高在线人数" :value="stats.MaxOnlineNum">
              </a-statistic>
            </div>
            <div class="xt-bg rounded-lg p-2 p-2" :span="4">
              <a-statistic title="下行消息总数（C2C和群）" :value="stats.DownMsgNum">
              </a-statistic>
            </div>
            <div class="xt-bg rounded-lg p-2 p-2" :span="4">
              <a-statistic title="关系链对数增加量" :value="stats.ChainIncrease">
              </a-statistic>
            </div>
            <div class="xt-bg rounded-lg p-2 p-2" :span="4">
              <a-statistic title="关系链对数删除量" :value="stats.ChainDecrease">
              </a-statistic>
            </div>
            <div class="xt-bg rounded-lg p-2 p-2" :span="4">
              <a-statistic title="上行消息数（群）" :value="stats.GroupUpMsgNum">
              </a-statistic>
            </div>
            <div class="xt-bg rounded-lg p-2 p-2" :span="4">
              <a-statistic title="上下行消息数（群）" :value="stats.GroupDownMsgNum">
              </a-statistic>
            </div>
            <div class="xt-bg rounded-lg p-2 p-2" :span="4">
              <a-statistic title="发消息人数（群）" :value="stats.GroupSendMsgUserNum">
              </a-statistic>
            </div>
            <div class="xt-bg rounded-lg p-2 p-2" :span="4">
              <a-statistic title="APNs 推送数（群）" :value="stats.GroupAPNSMsgNum">
              </a-statistic>
            </div>
            <div class="xt-bg rounded-lg p-2 p-2" :span="4">
              <a-statistic title="发消息群组数" :value="stats.GroupSendMsgGroupNum">
              </a-statistic>
            </div>
            <div class="xt-bg rounded-lg p-2 p-2" :span="4">
              <a-statistic title="入群总数" :value="stats.GroupJoinGroupTimes">
              </a-statistic>
            </div>
            <div class="xt-bg rounded-lg p-2 p-2" :span="4">
              <a-statistic title="退群总数" :value="stats.GroupQuitGroupTimes">
              </a-statistic>
            </div>
            <div class="xt-bg rounded-lg p-2 p-2" :span="4">
              <a-statistic title="新增群组数" :value="stats.GroupNewGroupNum">
              </a-statistic>
            </div>
            <div class="xt-bg rounded-lg p-2 p-2" :span="4">
              <a-statistic title="累计群组数" :value="stats.GroupAllGroupNum">
              </a-statistic>
            </div>
            <div class="xt-bg rounded-lg p-2 p-2" :span="4">
              <a-statistic title="解散群个数" :value="stats.GroupDestroyGroupNum">
              </a-statistic>
            </div>
            <div class="xt-bg rounded-lg p-2 p-2" :span="4">
              <a-statistic title="回调请求数" :value="stats.CallBackReq">
              </a-statistic>
            </div>
            <div class="xt-bg rounded-lg p-2 p-2" :span="4">
              <a-statistic title="回调应答数" :value="stats.CallBackRsp">
              </a-statistic>
            </div>
          </div>


      </div>
      </vue-custom-scrollbar>

    </div>
  </div>

</template>

<style scoped lang="scss">
.stats-container{
  &>div{
    width: 150px;
  }
}
</style>
