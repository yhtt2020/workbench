<template>
  <template v-if="team">
    <div class="px-3 py-2 flex flex-col" style="height: 100%" >
      <HorizontalPanel :navList="incomeTitle" v-model:selectType="defaultIncome"></HorizontalPanel>
      <div v-if="defaultIncome.name === 'MIC'" class="mt-3  flex flex-col" style="flex:1;height: 0">

        <div  style="height:0;flex:1">
          <a-empty style="margin-top: 3em" description="" v-if="memberDevoteDisplay.length===0">
          </a-empty>
          <vue-custom-scrollbar :settings="outerSettings" style="position:relative;height:100%;  ">
            <div class="flex" style="width: 100%;flex-direction: column">
              <div class="text-center   mt-3  mb-3"   v-for="user in memberDevoteDisplay">
                <a-row style="width: 100%">
                  <a-col :span="8">
                    <UserAvatar :avatar="user.userInfo.avatar" :tag="user.userInfo.uid===teamLeader.uid?'队长':'队员'"></UserAvatar>
                  </a-col>
                  <a-col :span="9" class="text-center">
                    <div class=" pt-3 xt-text" style=" font-size: 14px;  ;font-weight: 500;">
                      {{ user.devote.toFixed(2) }} 分钟</div>
                  </a-col>
                  <a-col :span="7" v-if="user.devote">
                    <xt-button :w="80" :h="40" @click="doExchangeDevote(user.uid)">领取</xt-button>
                  </a-col>
                </a-row>
              </div>
            </div>
          </vue-custom-scrollbar>
        </div>
        <div class="flex items-center rounded-lg py-1 px-2 xt-bg-2" style="height:50px">
          <a-col :span="3" class="mr-4 pt-2">
            <a-avatar class="mt-3 ml-3 mt-2" :size="40" shape="square" style="" :src="team.avatar"></a-avatar>
          </a-col>
          <a-col :span="12">
            <span class="xt-text-2">总共待领取</span><br> <strong>{{total.toFixed(2)}}</strong> 分钟
          </a-col>
          <a-col :span="8">
<!--            <div class="flex justify-between items-center h-12" style="display: block;">-->
<!--              &lt;!&ndash;        <span style="font-size: 16px;font-weight: 400;">累计收益: 0 分钟</span>&ndash;&gt;-->
<!--              <span  @click="doExchangeDevote(0)" class="rounded-lg pointer receive-active flex justify-center items-center bg-black bg-opacity-30 pl-6 pr-6 pt-3 pb-3 xt-bg-2" style="color: var(&#45;&#45;primary-text);">-->

<!--              </span>-->
<!--            </div>-->
            <XtButton class="p-1" type="theme" @click="doExchangeDevote(0)"> 一键领取</XtButton>
          </a-col>
        </div>
      </div>
      <div v-else class="mt-4 flex flex-col text-center"  style="color: var(--primary-text);">
        暂不可用，请等待更新
        <!--      <div class="flex items-center justify-between mt-6">-->
        <!--        <span class="pl-4">队员</span>-->
        <!--        <span>今日贡献</span>-->
        <!--        <span class="pr-4">累计贡献</span>-->
        <!--      </div>-->
        <!--      <a-divider style="height: 1px; background-color: rgba(255,255,255,0.10);" />-->
        <!--      <div class="flex-shrink" style="height:330px">-->
        <!--        <vue-custom-scrollbar :settings="outerSettings" style="position:relative;height:100%;  ">-->
        <!--          <div   class="text-center flex items-center  mb-3 mt-2 pointer pt-2" v-if="teamLeader.userInfo">-->
        <!--            <UserAvatar   :tag="teamLeader.userInfo.uid===userInfo.uid?'我':'队长'" :avatar="teamLeader.userInfo.avatar" style="margin-left:12px;"></UserAvatar>-->
        <!--            <div style="margin-left:35px;font-size: 16px; color: rgba(255,255,255,0.85);font-weight: 500;">200分钟</div>-->
        <!--            <div @click="captainContribute" style="font-size: 16px; color: rgba(255,255,255,0.85);font-weight: 500;" class="ml-6 rounded-lg pointer receive-active flex justify-center items-center bg-black bg-opacity-30 pl-6 pr-6 pt-3 pb-3">领取</div>-->
        <!--          </div>-->
        <!--          <div class="text-center flex items-center justify-between mb-3 pointer  pt-2"   v-for="user in teamMembers">-->
        <!--            <UserAvatar :avatar="user.userInfo.avatar" :tag="user.userInfo.uid===userInfo.uid?'我':''" style="margin-left:12px;"></UserAvatar>-->
        <!--            <div class="ml-7" style="margin-left:35px; font-size: 16px; color: rgba(255,255,255,0.85);font-weight: 500;">200分钟</div>-->
        <!--            <div @click="captainContribute" style="font-size: 16px; color: rgba(255,255,255,0.85);font-weight: 500;" class="ml-6 rounded-lg pointer receive-active flex justify-center items-center bg-black bg-opacity-30 pl-6 pr-6 pt-3 pb-3">领取</div>-->
        <!--          </div>-->
        <!--        </vue-custom-scrollbar>-->
        <!--      </div>-->
        <!--      <div class="flex items-center rounded-lg py-1" style="background: rgba(0,0,0,0.30);">-->
        <!--        <a-col class="mr-4">-->
        <!--          <a-avatar class="mt-3 ml-3" :size="40" shape="square" :src="team.avatar"></a-avatar>-->
        <!--        </a-col>-->
        <!--        <div>-->
        <!--          总计贡献:2000 分钟-->
        <!--        </div>-->
        <!--      </div>-->
      </div>
    </div>

  </template>

</template>

<script>
import {mapState,mapActions} from "pinia";
import {appStore} from "../../store";
import HorizontalPanel from "../HorizontalPanel.vue";
import UserAvatar from "../small/UserAvatar.vue";
import {teamStore} from "../../store/team";
import {message} from "ant-design-vue";
import XtButton from '../../ui/libs/Button/index.vue'
import {completeTask} from "../../apps/task/page/branch/task"

export default {
  name: "TeamDevote",
  components: { XtButton, UserAvatar, HorizontalPanel},
  props:['teamLeader','teamMembers','team'],
  computed:{
    ...mapState(appStore, ['userInfo']),
    ...mapState(teamStore,['membersDevote']),
    memberDevoteDisplay(){
      let display=JSON.parse(JSON.stringify(this.teamMembers))
      display.unshift(JSON.parse(JSON.stringify(this.teamLeader)))

      display.map(user=>{
        user.devote = this.membersDevote[user.uid]||0
      })


      return display.filter(member=>{
        return Number(member.uid)!== Number(this.userInfo.uid)
      })
    },
    total(){
      let total=0
       this.memberDevoteDisplay.forEach(devote=>{
        total+=devote.devote
      })
      return total
    }
  },
  data(){
    return {
      incomeTitle:[{title:'我的收益',name:'MIC'},{title:'小队贡献',name:'CB'}],
      defaultIncome:{title:'我的收益',name:'MIC'},
      teamIncome:[],  // 小队收益
      teamCB:[],  // 小队贡献
      outerSettings: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
      rarity:4, // 稀有度
      avatar_url:'/img/excellent _avatar.svg',
    }
  },
  async mounted() {
    await this.getMemberDevote()
  },
  methods:{
    ...mapActions(teamStore,['getMemberDevote','exchangeDevote']),
    // 我的额外收益领取
    myExtra(){

    },
    // 小队收益
    async doExchangeDevote(uid = 0) {
      let rs = await this.exchangeDevote(uid)
      if (rs.status) {
        message.success('兑换成功')
      // 支线任务点
      completeTask('Z0402')
        await this.getMemberDevote()
      } else {
        message.error('兑换失败，失败原因：' + rs.info)
      }
    },
    // 小队贡献
    captainContribute(){}

  }
}
</script>

<style scoped>
.btn-active:active{
  filter: brightness(0.8);
  background: rgba(80,139,254, 0.8);
}
.nav-list-container{
  background: rgba(255, 255, 255, 0.2) !important;
  border-radius: 8px !important;
}
.nav-list-container ::v-deep .s-item{
  border-radius: 6px !important;
}
.ant-divider-horizontal{
  margin: 16px 0 16px 0 !important;
}

.receive-active:active{
  filter: brightness(0.8);
  background: rgba(0,0,0,0.40);
}
::v-deep .ant-avatar-image{
  position: relative;
  top:-5px;
}
</style>
