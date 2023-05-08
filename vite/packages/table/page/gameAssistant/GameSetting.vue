<template>
<div class="s-bg  h-20 rounded-lg flex flex-row items-center px-6 mb-4" style="width: 572px">
  <Icon style="height: 36px;width: 36px" icon="steam"></Icon>
  <div class="flex flex-col ml-4 w-2/3">
    <span class="text-white">Steam</span>
    <span>绑定Steam帐号即可同步显示你的游戏数据</span>
  </div>
  <div class="s-item ml-10 w-28 h-12 rounded-lg flex justify-center items-center pointer" @click="bindSteam">
    绑定
  </div>
</div>
  <div class="s-bg  h-20 rounded-lg flex flex-row items-center px-6 mb-4" style="width: 572px">
    <Icon style="height: 36px;width: 36px" icon="position"></Icon>
    <div class="flex flex-col ml-4 w-2/3">
      <span class="text-white">折扣地区</span>
      <span>选择默认的折扣地区</span>
    </div>
    <a-select style="border: 1px solid rgba(255, 255, 255, 0.1);"
              @change="getRegion($event)"    class="w-56 h-auto rounded-lg  text-xs s-item" size="large" :bordered="false" v-model:value="area">
      <a-select-option v-for="item in region" :value="item.id">{{item.name}}</a-select-option>
    </a-select>
  </div>
</template>

<script>
export default {
  name: "gameSetting",
  data(){
    return {
      area:'国区',
      region:[
        {
          id:'us',
          name:'美国'
        },
        {
          id:'ca',
          name:'加拿大'
        },
        {
          id:'gb',
          name:'英国'
        },{
          id:'fr',
          name:'法国'
        },{
          id:'de',
          name:'德国'
        },{
          id:'it',
          name:'意大利'
        },{
          id:'jp',
          name:'日本',
        },{
          id:'cn',
          name:'国区',
        },{
          id:'br',
          name:'巴西',
        },{
          id:'in',
          name:'印度',
        },{
          id:'ru',
          name:'俄罗斯',
        },{
          id:'au',
          name:'澳大利亚',
        },
        {
          id:'hk',
          name:'香港',
        },
        {
          id:'ar',
          name:'阿根廷',
        }

      ],
    }
  },
  methods:{
    getRegion(e){
      console.log(e)
    },
    bindSteam(){

    }
  }
}
</script>

<style scoped>

</style>
