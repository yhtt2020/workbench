<template>
<div class="flex flex-row items-center justify-center w-full h-full" >
  <div class="w-1/2  max-w-md rounded-lg flex flex-col items-center pt-6 px-4 mr-10" style="background: rgba(33, 33, 33, 1);height: 250px" v-if="!setUp">
    <div class="text-white"><Icon icon="sound" style="font-size: 1.2em" class="mr-2"></Icon>新用户须知</div>
    <div style="line-height: 2;font-size: 16px" class="mt-4 text-xs">在首次使用前，建议查看新手引导，以免无从下手。<br>强烈建议收藏此文档！！！</div>
    <div style="font-size: 16px" class=" text-xs	mt-4 pointer" @click="clickAgree"><a-checkbox v-model:checked="known" class="mr-2"></a-checkbox>
      已阅读<span @click.stop="openAgree" class="pointer" style="color: rgba(80, 139, 254, 1);">《天天工作台新手引导》</span></div>
    <div class="h-1/5 w-2/5 rounded-lg flex justify-center items-center text-white mt-4 pointer" style="background: rgba(42, 42, 42, 1);" @click="next">开始</div>
  </div>
  <div class="  h-5/12 rounded-lg flex flex-col items-center pt-6 px-4 pb-4" style="font-size:16px;background: rgba(33, 33, 33, 1);width:350px" v-else>
    <div class="text-white"><Icon icon="rise" style="font-size: 1.2em" class="mr-2"></Icon>升级啦</div>
    <div  class="mt-4 text-xs" style="line-height: 2;font-size: 16px">产品功能较多，很难短期内全部了解。<br/>故设置了阶梯式的功能解锁。<br>点击按钮，了解各个等级权益和升级规则。</div>
<!--    <div class="flex flex-wrap justify-between">-->
<!--      <div v-for="item in abilityList" class="rounded-xl h-12 mt-2 flex flex-row items-center pl-2" style="background: rgba(42, 42, 42, 1);width: calc(50% - 4px);">-->
<!--        <Icon :icon="item.icon" style="font-size: 1.2em" class="mr-2"></Icon> {{item.name}}</div>-->
<!--    </div>-->
    <div class="rounded-lg h-8 w-5/12 flex justify-center items-center mt-4 pointer" style="background: rgba(42, 42, 42, 1);" @click="goGrade">了解更多</div>
  </div>
</div>
</template>

<script>
import { message } from 'ant-design-vue';
import {mapActions} from "pinia";
import {appStore} from "../../../store";
import browser from '../../../js/common/browser'
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
      browser.openInSystem('https://www.yuque.com/tswork/mqon1y/xd8yo2745bcxrk3c')
    },
    next(){
      if(this.known === false){
        message.info('请阅读新手引导后确认');
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
