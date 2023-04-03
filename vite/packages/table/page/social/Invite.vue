<template>
  <div style="margin-left:11.5em; width: calc(100vw - 20.5em);">
    <div class="card mr-3" style="height: calc(100vh - 13em) ;width: calc(100vw - 20.5em);">
      <div class="line-title">
        邀请好友
      </div>
      <p>目前想天工作台仍然在测试阶段，并未面向大众公开下载使用。如果您的好友对此类软件有兴趣，可通过下方生成邀请码，赠与对方。</p>
      <p>兑换比例方式：每200小时可兑换1枚邀请码。 <br>
        您的在线总时长：<strong class="text-green-400">{{ totalHours }}</strong> 小时，总计可兑换：<strong class="text-red-400">{{ canExchange }}</strong>，已兑换：<strong class="text-green-400">{{exchanged}}</strong>，剩余：<strong class="text-red-400">{{ leave }}</strong>。   <a-button type="primary">兑换1枚</a-button></p>

      <a-table :dataSource="codes" :columns="columns" >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'create_time'">
              {{friendlyDate(record.create_time) }}
          </template>
          <template v-else-if="column.key === 'update_time'">
            <span v-if="record.create_time!==record.update_time">
              {{friendlyDate(record.update_time) }}
            </span>
            <span v-else>未使用</span>
          </template>
          <template v-else-if="column.key === 'key'">
            <span >
              {{record.key }} <a-tag>复制</a-tag>
            </span>
          </template>
          <template v-else-if="column.key === 'status'">
            <a-tag color="green" v-if="record.status===1">有效</a-tag>
            <a-tag color="geekblue" v-else-if="record.status===2">已使用</a-tag>
          </template>
        </template>
      </a-table>
    </div>

  </div>

</template>

<script>
import { appStore } from '../../store'
import {mapState} from 'pinia'
import Template from '../../../user/pages/Template.vue'

export default {
  name: 'Invite',
  components: { Template },

  data(){
    return{
      codes:[{
        id:1,
        key:'mcltf***0JMeqoJ',
        status:1,
        create_time:Date.now(),
        update_time:Date.now()
      },
        {
          id:2,
          key:'52i****7IUshEhc',
          status:2,
          create_time:Date.now(),
          update_time:Date.now()+23
        }],
      columns:[
        {
          title: '序号',
          dataIndex: 'id',
          key: 'id',
        },
        {
          title: '邀请码',
          dataIndex: 'key',
          key: 'key',
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
        },
        {
          title: '生成日期',
          dataIndex: 'create_time',
          key: 'create_time',
        },
        {
          title: '使用日期',
          dataIndex: 'update_time',
          key: 'update_time',
        },
      ]
    }
  },
  computed:{
    ...mapState(appStore,['userInfo']),
    totalHours(){
      console.log(this.userInfo.onlineGradeExtra)
      return (this.userInfo.onlineGradeExtra.cumulativeHours)
    },
    canExchange(){
      return (this.userInfo.onlineGradeExtra.cumulativeHours/200).toFixed(0)
    },
    exchanged(){
      return this.codes.length
    },
    leave(){
      return this.canExchange-this.exchanged
    }
  },methods:{
    friendlyDate:tsbApi.util.friendlyDate
  }
}
</script>

<style scoped>
.card{
  background: #252525;
}
</style>
