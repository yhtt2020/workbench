<template>
  <div class="w-full h-full xt-bg py-2 pr-2">
    <xt-left-menu :list="filterList" model="id" end="2">
      <div class="flex flex-col w-full">
        <div class="flex w-full h-11 mb-4 items-center justify-between">
          <div class="flex items-center">
            <NoticeIcon v-if="top.type === 'system'" icon="fluent:alert-16-regular" style="font-size: 1.5rem;"/>
            <span class="category-16-500 xt-text ml-3 xt-font">{{ top.title }}</span>
          </div>
          <NoticeIcon icon="ant-design:clear-outlined" class="pointer category-button" style="font-size: 1.3rem;color: var(--secondary-text);" @click="clearAll(top.type)"/>
        </div>
        <NoticeDetail :type="top.type" :list="detailList" />
      </div>
    </xt-left-menu>
  </div>
</template>

<script setup >
import { reactive, ref, computed,onMounted } from "vue";
import { storeToRefs } from "pinia";
import { noticeStore } from "./store/noticeStore";
import { appStore } from "../../store";
import { Icon as NoticeIcon } from '@iconify/vue'

import NoticeDetail from "./noticeDetail.vue";

const app = appStore()
const notice = noticeStore()
const { settings } = storeToRefs(app)
const { detailList } = storeToRefs(notice)

const top = ref({
  newIcon:"fluent:alert-16-regular",
  img:'',
  title: "全部消息通知",
  type:'system'
})

const selectTab = (item) =>{
  // console.log('查看数据',item);
  top.value = item
}

const clickSetting = () =>{

}

const enableNotice = () =>{
  const enable = settings.value.noticeEnable = !settings.value.noticeEnable
  app.setNoticeOnOff(enable)
}


const clearAll = () =>{
  notice.delAllHistoryNotice()
}



const leftList = ref([
  {
    id: "all",
    newIcon:"fluent:grid-16-regular",
    img: "",
    alias: "all",
    title: "全部消息通知",
    type:'system',
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
    type:'message',
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