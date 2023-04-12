<template>
<div class="flex flex-row items-center justify-center w-full h-full" >
  <div class="w-1/2 h-52 max-w-md rounded-xl flex flex-col items-center pt-6 px-4 mr-10" style="background: rgba(33, 33, 33, 1);" v-if="!setUp">
    <div class="text-white"><Icon icon="sound" style="font-size: 1.2em" class="mr-2"></Icon>内测须知</div>
    <div class="mt-4 text-xs">在开始本次内测前，请先阅读下方《想天工作台内测须知》，了解相关注意事项和使用帮助。</div>
    <div class=" text-xs	mt-4 pointer" @click="clickAgree"><a-checkbox v-model:checked="known" class="mr-2"></a-checkbox>
      已阅读并同意<span @click.stop="openAgree" class="pointer" style="color: rgba(80, 139, 254, 1);">《想天工作台内测须知》</span></div>
    <div class="h-1/5 w-2/5 rounded-xl flex justify-center items-center text-white mt-4 pointer" style="background: rgba(42, 42, 42, 1);" @click="next">开始</div>
  </div>
  <div class="w-1/2 h-5/12 rounded-xl flex flex-col items-center pt-6 px-4 pb-4" style="background: rgba(33, 33, 33, 1);" v-else>
    <div class="text-white"><Icon icon="rise" style="font-size: 1.2em" class="mr-2"></Icon>升级啦</div>
    <div class="mt-4 text-xs">体验所有功能需要达到一定在线等级，了解各个等级权益和升级规则。</div>
<!--    <div class="flex flex-wrap justify-between">-->
<!--      <div v-for="item in abilityList" class="rounded-xl h-12 mt-2 flex flex-row items-center pl-2" style="background: rgba(42, 42, 42, 1);width: calc(50% - 4px);">-->
<!--        <Icon :icon="item.icon" style="font-size: 1.2em" class="mr-2"></Icon> {{item.name}}</div>-->
<!--    </div>-->
    <div class="rounded-xl h-8 w-5/12 flex justify-center items-center mt-4 pointer" style="background: rgba(42, 42, 42, 1);" @click="goGrade">了解更多</div>
  </div>
</div>
</template>

<script>
import { message } from 'ant-design-vue';
import {mapActions} from "pinia";
import {appStore} from "../../../store";
export default {
  name: "GradeNotice",
  data(){
    return {
      known:false,
      knownTip:false,
      //abilityList:abilityData.splice(0,8),
      setUp:false
    }
  },
  methods:{
    ...mapActions(appStore, ['setAgreeTest']),
    clickAgree(){
      this.known=!this.known
    },
    openAgree(){
      ipc.send('addTab',{url:'   https://www.yuque.com/tswork/mqon1y/hwzcb49pgegupggz'})
    },
    next(){
      if(this.known === false){
        message.info('未勾选');
      }else{
        this.setUp=true
      }
    },
    goGrade(){
      this.setAgreeTest(true)
      this.$router.push({ name: 'grade'})
    }
  }
}
</script>

<style scoped>
:deep(.ant-checkbox){
  color: red;
}
</style>
