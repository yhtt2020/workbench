<template>

    <div v-if="visible"  class="home-blur fixed inset-0 p-12" style="z-index: 999"  >
      <back-btn  @click="hide()"></back-btn>
      <div  v-if="step===1" class="flex flex-row items-center justify-center w-full h-full" style="position: relative" >

          <div @click.stop="()=>{}" class="w-1/2  h-82 max-w-lg rounded-xl flex flex-col  pt-6  mr-10 p-10 px-15" style="background: rgba(33, 33, 33, 1);" >
            <div>
              <a-row :gutter="20">
                <a-col class="pt-3">
                  <UsergroupAddOutlined class="text-white icon"/>
                </a-col>
                <a-col>

                  <div class="title" >创建小队</div>作为组长，创建您的小队，<strong class="text-white">限时抢占小组靓号</strong>
                </a-col>

              </a-row>

              <div @click="()=>{this.step=2}" class="rounded-xl h-10 w-100 flex justify-center items-center mt-4 pointer" style="background: rgba(42, 42, 42, 1);">立即创建</div>
            </div>
            <div class="mt-6">
              <a-row   :gutter="20">
                <a-col  class="pt-3">
                  <UsergroupAddOutlined class="text-white icon"/>
                </a-col>
                <a-col><div class="title">加入小队</div>作为小队成员，加入小队</a-col>

              </a-row>
              <a-row class="mt-4" :gutter="10">
                <a-col :span="12">
                  <a-input placeholder="团队号" class="h-10 rounded-xl text-center"></a-input>
                </a-col>
                <a-col :span="12">
                  <div class="rounded-xl h-10 w-100 flex justify-center items-center pointer" style="background: rgba(42, 42, 42, 1);">加入</div>
                </a-col>
              </a-row>

            </div>
          </div>

      </div>


        <CreateTeam @created="created"  v-if="step===2"></CreateTeam>

    </div>


</template>

<script>
import {UsergroupAddOutlined} from '@ant-design/icons-vue'
import CreateTeam from "./CreateTeam.vue";
import BackBtn from "./comp/BackBtn.vue";
export default {
  name: "TeamTip",
  components:{
    BackBtn,
    CreateTeam, UsergroupAddOutlined
  },
  props:{
    visible:false,
  },
  data(){
    return {
      step:1
    }
  },
  mounted() {
    this.step=1
  },
  methods:{
    created(){
      this.$emit(
        'update:visible',false
      )
    },
    hide(){
      console.log(this.step)
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
