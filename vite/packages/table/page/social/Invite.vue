<template>


  <div class="s-bg ml-3 p-3 rounded-xl xt-bg " style="width: 800px;min-height: 300px">
    <div class="mb-3" style="width: 300px;">
      <HorizontalPanel :nav-list="tabs" v-model:select-type="tab">
      </HorizontalPanel>
    </div>
    <div class="px-3">
      <vueCustomScrollbar v-if="tab.name==='invite'" :settings="scrollbarSettings" style="height: 100%">
        <div class="" style="height: auto;color: var(--primary-text )" >
          <p>
            目前想天工作台仍然在测试阶段。如果您的好友对此类软件有兴趣，可通过下方生成邀请码，赠与对方。
            <br>对方将获得 <img style="width: 24px" src="https://a.apps.vip/icons/test_sm.png"> 受邀用户勋章。</p>
          <p>兑换方式：每200小时可兑换1枚邀请码，四舍五入（第1个邀请码在100小时释放，第2个在300小时） <br>
            您的在线总时长：<strong class="text-green-400">{{ totalHours }}</strong> 小时，总计可兑换：<strong
              class="text-red-400">{{ canExchange }}</strong>，已兑换：<strong class="text-green-400">{{ exchanged }}</strong>，剩余：<strong
              class="text-red-400">{{ leave }}</strong>。
            <a-button type="primary" @click="confirmExchange" :disabled="leave===0" style="color:var(--main-text)">兑换1枚</a-button>
          </p>

          <a-table :pagination="false" :dataSource="codes" :columns="columns">
            <template #bodyCell="{ column, record,index }">
              <template v-if="column.key === 'createTime'">
                {{ friendlyDate(record.createTime) }}
              </template>
              <template v-else-if="column.key === 'updateTime'">
            <span v-if="record.createTime!==record.updateTime">
              {{ friendlyDate(record.updateTime) }}
            </span>
                <span v-else>未使用</span>
              </template>
              <template v-else-if="column.key === 'key'">
            <span style="padding-left: 2px;padding-right: 2px" class="mr-3" :style="{background:isMarked(record.key)?'#35ad03':'transparent',textDecoration:record.status===2?'line-through':'none'}">
              {{ record.key }}
            </span>
                <a-tag class="pointer" @click="copy(record.key)" >复制</a-tag> <a-tag class="pointer" @click="mark(record.key)">标记</a-tag>
              </template>
              <template v-else-if="column.key === 'status'">
                <a-tag color="green" v-if="record.status===1"  style="color: #6abe39 ">有效</a-tag>
                <a-tag color="geekblue" v-else-if="record.status===2" >已使用</a-tag>
              </template>
              <template v-else-if="column.key==='index'">
                {{codes.length-index}}
              </template>
            </template>
          </a-table>
        </div>

      </vueCustomScrollbar>
      <vueCustomScrollbar v-if="tab.name==='verify'" :settings="scrollbarSettings" style="height: 100%">
        如果您是受邀参与公测，可在下方输入您的专属邀请码。
        <br>
        验证通过后将获得 <img style="width: 24px" src="https://a.apps.vip/icons/test_sm.png"> 受邀用户勋章。
        <div>
          <a-input class="mt-2 mb-2 w-1/2" placeholder="请输入邀请码" style="background: var(--secondary-bg)" v-model:value="code"></a-input>
        </div>
        <div>
          <a-button type="primary">验证邀请码</a-button>
        </div>
      </vueCustomScrollbar>
    </div>

  </div>

</template>

<script>
import { appStore } from '../../store'
import { mapState,mapActions } from 'pinia'
import Template from '../../../user/pages/Template.vue'
import { Modal,message } from 'ant-design-vue'
import { codeStore } from '../../store/code'
import HorizontalPanel from '../../components/HorizontalCaptrue.vue'

export default {
  name: 'Invite',
  components: { HorizontalPanel, Template },

  data () {
    return {
      code:'',
      tabs:[{
        name:'invite',
        title:'邀请好友'
      },{
        name:'verify',
        title:'受邀'
      }],
      tab:{
        name:'invite'
      },
      marked:[],
      scrollbarSettings: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
      codes: [],
      columns: [
        {
          title: '序号',
          dataIndex: 'index',
          key: 'index',
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
          dataIndex: 'createTime',
          key: 'createTime',
        },
        {
          title: '使用日期',
          dataIndex: 'updateTime',
          key: 'updateTime',
        },
        {
          title: '受邀用户',
          dataIndex: 'user',
          key: 'user',
        },
      ]
    }
  },
  mounted () {
    this.loadCodes().then()
    if(this.$route.params.tab){
      this.tab={
        name:this.$route.params.tab
      }
    }
  },
  computed: {
    ...mapState(appStore, ['userInfo']),
    totalHours () {
      return (this.userInfo.onlineGradeExtra.cumulativeHours)
    },
    canExchange () {
      return (this.userInfo.onlineGradeExtra.cumulativeHours / 200).toFixed(0)
    },
    exchanged () {
      return this.codes.length
    },
    leave () {
      return this.canExchange - this.exchanged
    },


  },
  methods: {
    ...mapActions(codeStore, ['exchange','listCodes']),
    friendlyDate: tsbApi.util.friendlyDate,
    copy(text){
      require('electron').clipboard.writeText(text)
      message.success('复制邀请码成功。')
    },
    mark(key){
      let found =this.marked.indexOf(key)
      let mark=false
      if(found>-1){
        this.marked.splice(found,1)
        mark=false
      }else{
        this.marked.push(key)
        mark=true
      }
      localStorage.setItem('marked',JSON.stringify(this.marked))
      if(mark){
        message.success({content:'已为您标记此邀请码，再次标记取消',key:'mark'})
      }else{
        message.success({content:'已为您取消标记',key:'mark'})
      }

    },
    async loadCodes(){
      let rs=await this.listCodes()
      if(rs.status){
        this.codes=rs.data
      }
      let marked
      try{
        marked=JSON.parse(localStorage.getItem('marked'))
      }catch (e) {
        marked=[]
      }

      if(marked===null){
        marked=[]
      }
      this.marked=marked
    },
    isMarked(key){
      return this.marked.indexOf(key)>-1
    },
    confirmExchange () {
      Modal.confirm({
        content: '确认使用200小时在线时长兑换1枚邀请码？此操作无法撤回。兑换并不会减少你的在线时长以及影响你的在线等级，请放心。',
        okText: '确认兑换',
        onOk: async () => {
          let rs = await this.exchange()
          if (rs.status) {
            rs.data.forEach(item=>{
              this.codes.unshift(item)
            })

            message.success('兑换成功。')
          }else{
            message.error('兑换失败，您已无法兑换邀请码。')
          }
        }
      })
    }
  }
}
</script>

<style scoped>
  .ant-table-tbody  {
    &:hover {
      background: red !important;
    }
  }
/* .card {
  background: #252525;
} */
</style>
