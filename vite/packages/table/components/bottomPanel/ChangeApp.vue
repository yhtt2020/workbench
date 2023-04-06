<template>
  <div class="p-5 text-base">
    <div class="flex flex-row justify-between items-center">
    <div class="text-white">打开的应用</div>
    <div class="h-10 w-28 bg-gray-800 rounded-xl flex justify-evenly items-center">
      <Icon icon="minus-circle-fill"  class="pointer"></Icon>全部关闭</div>
  </div>
    <div class="mt-2 flex flex-row">
      <div v-for="item in openAppList" class="w-1/3 open-app">
        <div class="flex flex-row items-center w-1/2">
          <div class="h-8 w-8 bg-gray-500 rounded-xl flex justify-evenly items-center mr-2">
            <Icon :icon="item.icon"  class="pointer"></Icon></div>
         {{item.title}}
        </div>
          <img :src="'/img/homeComponent/'+item.img+'.png'" alt="" class="w-2/3 h-full object-contain">
      </div>
    </div>
    <div>
      <div class="text-white mt-8 ">最近使用</div>
      <div class=" flex flex-row">
        <div class="w-2/6  mt-6 last-app" v-for="item in lastAppList">
        <div class="w-2/3  bg-gray-700 rounded-xl p-3 flex flex-row">
          <div>
            <div class="h-10 w-10 bg-gray-500 rounded-xl flex justify-evenly items-center mr-2">
              <Icon :icon="item.icon"  class="pointer"></Icon></div>
          </div>
          <div class="flex flex-col">
            <div class="text-white">{{item.title}}</div>
            <div class="text-xs">{{item.appType}}</div>
          </div>
        </div>
      </div>
      </div>
    </div>
    <div class="w-96 justify-between flex flex-row absolute bottom-8 left-1/2 -translate-x-1/2">
      <div style="width: 56px;height: 56px" class="flex justify-center items-center" v-for="item in listData">
        <Icon :icon="item.icon" style="width: 32px;height: 32px;color:white;" class="pointer" @click.stop="clickListItem(item)"></Icon>
      </div>
    </div>
  </div>
</template>

<script>
import navigationData from '../../js/data/tableData'
export default {
  name: "ChangeApp",
  data(){
    return{
      openAppList:[
        {
          icon:'minus-circle-fill',
          title:'待办',
          img:'clock'
        },
        {
          icon:'minus-circle-fill',
          title:'待办',
          img:'clock'
        },
      ],
      lastAppList:[
        {
          icon:'minus-circle-fill',
          title:'待办',
          appType:'本地应用'
        },
        {
          icon:'minus-circle-fill',
          title:'待办',
          appType:'本地应用'
        },
      ]
    }
  },
  props:{
    full:{
      type:Boolean,
      default:false
    }
  },
  created() {
    navigationData.sendThis(this)
  },
  computed:{
    listData(){
      return navigationData.systemAppList.slice(0,5)
    }
  },
  methods:{
    clickListItem(item){
        item.fn();
        this.$emit('closeChangeApp')
    }
  }
}
</script>

<style scoped>
.open-app,.last-app{
  max-width: 430px;
}
@media screen and (max-height: 600px) and (min-width: 880px) {
  .open-app,.last-app{
    max-width: 280px;
  }
}

</style>
