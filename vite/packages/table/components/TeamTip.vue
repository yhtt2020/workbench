<template>

    <div v-if="visible"  class="home-blur fixed inset-0 p-12" style="z-index: 999"  >
      <back-btn  @click="hide()"></back-btn>
      <div  v-if="step===1" class="flex flex-row items-center justify-center w-full h-full" style="position: relative" >

          <div @click.stop="()=>{}" class="w-1/2  h-82 max-w-lg rounded-lg flex flex-col  pt-6  mr-10 p-10 px-15" style="background: rgba(33, 33, 33, 1);" >
            <div>
              <a-row :gutter="20">
                <a-col class="pt-3">
                  <UsergroupAddOutlined class="text-white icon"/>
                </a-col>
                <a-col>

                  <div  class="title" >创建小队</div>作为队长，创建您的小队，<strong class="text-white">限时抢占小队靓号</strong>，<a @click="more">了解更多</a>
                </a-col>

              </a-row>

              <div  @click="()=>{this.step=2}" class="rounded-lg h-10 w-100 flex justify-center items-center mt-4 pointer relative" style="background: #535bf2;color: white">
                <GradeSmallTip powerType="team"  lastPowerType="创建小队"></GradeSmallTip>
                立即创建</div>
            </div>
            <div class="mt-6">
              <a-row   :gutter="20">
                <a-col  class="pt-3">
                  <UsergroupAddOutlined class="text-white icon"/>
                </a-col>
                <a-col><div class="title">加入小队</div>作为小队成员，加入小队，<a @click="goHall">前往小队大厅</a></a-col>

              </a-row>
              <a-row class="mt-4" :gutter="10">
                <a-col :span="12">
                  <a-input v-model:value="teamNo" placeholder="小队号" class="h-10 rounded-lg text-center"></a-input>
                </a-col>
                <a-col :span="12">
                  <div @click="join" :style="{'background':!teamNo?'#343434':'#535bf2'}" class="rounded-lg relative h-10 w-100 flex justify-center items-center pointer" style="color: white">加入
                    <GradeSmallTip powerType="team"></GradeSmallTip>
                  </div>

                </a-col>
              </a-row>

            </div>
          </div>

      </div>


        <CreateTeam @created="created"  v-if="step===2"></CreateTeam>

    </div>


</template>

<script>
import { message, Modal } from 'ant-design-vue'
import {mapWritableState,mapActions} from 'pinia'
import {UsergroupAddOutlined} from '@ant-design/icons-vue'
import CreateTeam from "./CreateTeam.vue";
import BackBtn from "./comp/BackBtn.vue";
import { teamStore } from '../store/team'
import GradeSmallTip from './GradeSmallTip.vue'
export default {
  name: "TeamTip",
  components:{
    GradeSmallTip,
    BackBtn,
    CreateTeam, UsergroupAddOutlined
  },
  props:{
    visible:false,
  },
  computed:{
    ...mapWritableState(teamStore,['teamVisible','team'])
  },
  data(){
    return {
      step:1,
      teamNo:'',
    }
  },
  mounted() {
    this.step=1
  },
  methods:{
    ...mapActions(teamStore,['joinByNo','updateTeamShip','updateMy']),
    created(){
      this.$emit(
        'update:visible',false
      )
      this.teamVisible=true
    },
    goHall(){
      this.$router.push({name:'hall'})
      this.$emit(
        'update:visible',false
      )
    },
    more(){
      Modal.info({
        title:'小队说明',
        centered:true,
        content:'创建、加入一个小队的好处：您可以获得每位小队成员5%的在线时长累计加成，加速等级提升，同时体验次时代的小团队协作模式（陆续上线）'
      })
    },
    async join () {
      if(!this.teamNo){
        message.error('请在左侧输入小队号。')
        return
      }
      let rs= await this.joinByNo(this.teamNo)
      if(rs.code===1000){
        let result=rs.data
        if(result.status){
          this.team=result.data
          Modal.success({content:'加入小队成功。',centered:true})
          await this.updateMy(0)
          this.$emit(
            'update:visible',false
          )
          this.teamVisible=true
        }else{
          Modal.error({content:result.info,centered:true})
        }

      }
      // Modal.error({
      //   content: '暂不支持加入小队',
      //   centered: true
      // })
    },
    hide(){
      if(this.step!==1){

        this.step=1
        return
      }
      this.$emit(
        'update:visible',false
      )
    }
  }
}
</script>

<style scoped>
.title{
  font-size: 1.2em;
  color: white;
}
.icon{
  font-size: 2em;
}
</style>
