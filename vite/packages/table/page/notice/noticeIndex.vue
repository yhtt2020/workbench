<template>
  <div class="flex h-full">
    <xt-left-menu :list="leftApp" end="2"></xt-left-menu>
    <div class="w-full" v-if="rightVisible !== 'setting'">
      <NoticeRightTop  :appType="rightVisible" :list="appContentList" :appItem="topTitle"></NoticeRightTop>
      <AllNotice v-if="rightVisible === 'all'" :list="appContentList"></AllNotice>
      <NoticeDetail v-else :list="otherList"></NoticeDetail>
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
import { noticeStore } from '../../store/notice'
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

  setup() {
    const store = noticeStore();
    
    const data = reactive({
      rightVisible:'all', // 切换消息
      topTitle:'',
      otherList:[],
      promptStatus:store?.$state.noticeSettings.enablePlay
    })

    const selectTab = (item) => {
      data.rightVisible = item.alias
      data.topTitle = {
        image:item.img,
        title:item.title
      }
    };

    const clickSetting = (item) => {
      data.rightVisible = item.alias
    };

    const enableNotice = () => {
      const enable = store.$state.noticeSettings.enable = !store.$state.noticeSettings.enable
      store.setNoticeOnOff(enable)
      if(enable){
        leftApp.value[leftApp.value.length - 2].icon = 'notification'
      }else{
        leftApp.value[leftApp.value.length - 2].icon = 'notification-off'
      }
    };

    const appContentList = computed(()=>{   // 通过计算属性获取消息通知历史数据
      return store.$state.notice.messageContent
    })

    watch(()=>data.rightVisible,(newVal)=>{  // 根据不同应用列表类型进行数据分类
      if(newVal !== 'all'){
        const index =  _.forEach(appContentList.value,function(o){ return o?.doc.appType === newVal })
        data.otherList = index
      }else{
        return;
      }
    })

    const changeEnable = (evt)=>{
      store.setMessagePrompt(evt)
    }

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
        title: "团队聊天",
        callBack: selectTab,
      },
      {
        icon:"notification",
        callBack: enableNotice,
      },
      {
        icon: "shezhi",
        alias:'setting',
        callBack: clickSetting,
      },
    ]);

    return{
      leftApp,appContentList,
      ...toRefs(data),changeEnable,
    }
  },
});
</script>

<style lang="scss" scoped>
</style>