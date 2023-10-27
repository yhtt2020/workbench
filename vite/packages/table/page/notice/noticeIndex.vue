<template>
  <div class="w-full h-full xt-bg py-2">
    <xt-left-menu :list="filterList" model="id" end="2">
      <NoticeDetail />
    </xt-left-menu>
  </div>
</template>

<script setup >
import { reactive, ref, computed,onMounted } from "vue";
import { storeToRefs } from "pinia";
import { noticeStore } from "./store/noticeStore";
import { appStore } from "../../store";

import NoticeDetail from "./noticeDetail.vue";

const app = appStore()
const notice = noticeStore()
const { settings } = storeToRefs(app)

const data = reactive({
  
})

const selectTab = (item) =>{
  // console.log('查看数据',item);
}

const clickSetting = () =>{

}

const enableNotice = () =>{
  const enable = settings.value.noticeEnable = !settings.value.noticeEnable
  app.setNoticeOnOff(enable)
}



const leftList = ref([
  {
    id: "all",
    newIcon:"fluent:grid-16-regular",
    img: "",
    alias: "all",
    title: "全部消息通知",
    callBack: (item)=>{
      selectTab(item)
    },
  },
  {
    id: "IM",
    newIcon:"",
    img: "/icons/IM.png",
    alias: "teamChat",
    title: "社群沟通",
    callBack: (item)=>{
      selectTab(item)
    },
  },
  {
    id: "notice",
    newIcon:"fluent:alert-16-regular",
    title: "通知",
    flag: true,
    callBack:()=>{
      enableNotice()
    },
  },
  {
    newIcon:"fluent:settings-16-regular",
    alias: "setting",
    title: "设置",
    flag: true,
    callBack:()=>{
      clickSetting()
    },
  }
])

const filterList = computed(() => {
  const copyList = [...leftList.value]

  if(settings.value.noticeEnable){
    const openList = copyList.map((item)=>{
      return {...item,newIcon:item.id === 'notice' ? 'fluent:alert-off-16-regular' : item.newIcon}
    })
    return openList
  }else{
    const closeList = copyList.map((item)=>{
      return {...item,newIcon:item.id === 'notice' ? 'fluent:alert-16-regular' : item.newIcon}
    })
    return closeList
  }

})

onMounted(()=>{
  notice.getNoticeList()
})
</script>

<style lang="scss" scoped>
</style>