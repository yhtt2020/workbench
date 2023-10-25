<template>
  <div class="flex h-full">
    <xt-left-menu :list="filterLeft" model="id" end="2"></xt-left-menu>
    <div class="w-full" v-if="rightVisible !== 'setting'">
      <NoticeRightTop  :appType="rightVisible" :list="appContentList" :appItem="topTitle" @updateNotice="updateNotice"></NoticeRightTop>
      <AllNotice v-if="rightVisible === 'all'" @closeMessage="close" :list="appContentList"></AllNotice>
      <NoticeDetail v-else :list="otherList" @closeMessage="close" ></NoticeDetail>
       <!-- <AllMiddleTip v-if="appType === 'all'" :list="appContentList"></AllMiddleTip> -->
    </div>

    <template v-else>
      <div class="flex flex-col w-full">
        <div class="flex flex-col">
          <span class="font-16 mb-3" style="color:var(--primary-text);">设置</span>
          <div class="flex flex-col mb-3 p-4 rounded-lg" style="background: var(--secondary-bg);">
            <div class="flex justify-between">
              <span class="font-16 mb-2.5" style="color:var(--primary-text);">消息提示音</span>
              <a-switch v-model:checked="promptStatus" @change="changeEnable($event)"></a-switch>
            </div>
            <span class="font-14" style="color:var(--secondary-text)">有新消息接收时，触发提示音</span>
          </div>
        </div>
      </div>
    </template>

  </div>
</template>

<script>
import { defineComponent,ref,toRefs,reactive,computed,watch } from 'vue'
import { appStore } from '../../store'
import { noticeStore } from '../../store/notice'
import { storeToRefs } from 'pinia'
import _ from 'lodash-es'
import NoticeRightTop from '../../components/notice/noticeRightTop.vue'
import AllNotice from '../../components/notice/allNotice.vue'
import AllMiddleTip from '../../components/notice/allMiddleTip.vue'
import NoticeDetail from './noticeDetail.vue'

export default defineComponent({

  components:{
    NoticeRightTop,
    AllNotice,
    AllMiddleTip,
    NoticeDetail
  },

  setup(props,ctx){
    const store = appStore();
    const notice = noticeStore()
    const { settings } = storeToRefs(store)

    const data = reactive({
      rightVisible:'all', // 切换消息
      topTitle:'',
      otherList:[],
      promptStatus:settings.enablePlay
    })


    const enableNotice = () =>{
      const enable = settings.noticeEnable = !settings.noticeEnable
      store.setNoticeOnOff(enable)
    }

    const clickSetting = (item) => {
      data.rightVisible = item.alias
    }

    const changeEnable = (evt)=>{
      store.setMessagePrompt(evt)
    }

    const selectTab = (item) => {
      data.rightVisible = item.alias
      data.topTitle = {
        image:item.img,
        title:item.title
      }
    };



    const appContentList = computed(()=>{   // 通过计算属性获取消息通知历史数据
      return notice.$state.notice.messageContent
    })

    watch(()=>data.rightVisible,(newVal)=>{  // 根据不同应用列表类型进行数据分类
      if(newVal !== 'all'){
        const index =  _.forEach(appContentList.value,function(o){ return o?.doc.appType === newVal })
        data.otherList = index
      }else{
        return;
      }
    })
  

    const leftApp = ref([
      {
        id: "all",
        icon: "appstore",
        img: "",
        alias: "all",
        title: "全部消息通知",
        callBack: selectTab,
      },
      {
        id: "IM",
        icon: "",
        img: "/icons/IM.png",
        alias: "teamChat",
        title: "社群沟通",
        callBack: selectTab,
      },
      {
        id:'notice',
        icon:"notification",
        title: "通知",
        flag: true,
        callBack: enableNotice,
      },
      {
        icon: "shezhi",
        alias:'setting',
        title: "设置",
        flag: true,
        callBack: clickSetting,
      },
    ]);


    const filterLeft = computed(()=>{
      
      const copyList = [...leftApp.value]
      if(settings.value.noticeEnable){
    
        const openList = copyList.map((item)=>{
          return {...item,icon:item.id === 'notice' ? 'notification-off' : item.icon}
        })
        return openList

      }else{
        const closeList = copyList.map((item)=>{
          return {...item,icon:item.id === 'notice' ? 'notification' : item.icon}
        })
        return closeList
      }

    })

    return{
      filterLeft,appContentList,
      ...toRefs(data),changeEnable,
    }
  
  }
});


</script>

<style lang="scss" scoped>
</style>
