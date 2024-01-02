<template>
  <xt-left-menu :list="filterList" model="id" last="5" end="3" leftMargin="py-3" leftClass="xt-bg-m">
    <template v-if="top.type !== 'setting'">
      <div class="flex flex-col w-full" >
        <div class="flex w-full h-10 mb-4  px-3 pt-3 items-center justify-between">
          <div class="flex items-center">
            <xt-new-icon :icon="top.newIcon" size="20"></xt-new-icon>
            <span class="font-16 font-500 xt-text ml-3 xt-font">{{ top.newName }}</span>
          </div>
          <xt-button style="width: auto !important;" h="0" @click="clearAll">
            <div class="flex items-center justify-center">
              <xt-new-icon icon="fluent:delete-16-regular" size="20"></xt-new-icon>
            </div>
          </xt-button>
          <!-- <NoticeIcon icon="ant-design:clear-outlined" class="pointer category-button" style="font-size: 1.3rem;color: var(--secondary-text);" /> -->
        </div>
        <NoticeDetail :type="top.type" :list="filetDetailList"  @close="close"/>
      </div>
    </template>

    <template v-else>
      <div class="flex flex-col w-full p-3">
        <span class="font-16 font-500 mb-3 xt-text xt-font">设置</span>
        <NoticeSetting />
      </div>
    </template>
  </xt-left-menu>


  <teleport to='body'>
    <NoticeEditorModal ref="editorRef"/>
  </teleport>
</template>

<script setup >
import { reactive, ref, computed,onMounted } from "vue";
import { storeToRefs } from "pinia";
import { noticeStore } from "./store/noticeStore";
import { appStore } from "../../store";
import { Icon as NoticeIcon } from '@iconify/vue'

import NoticeDetail from "./noticeDetail.vue";
import NoticeSetting from "./noticeSetting.vue";
import NoticeEditorModal from "./components/NoticeEditorModal.vue";

import { message } from 'ant-design-vue'

const app = appStore()
const notice = noticeStore()
const { settings } = storeToRefs(app)
const { detailList } = storeToRefs(notice)

const emits = defineEmits(["closeMessage"])

const top = ref({
  newIcon:"fluent:alert-16-regular",
  id: "all",
  newName:'全部消息',
  type:'system'
})

const editorRef = ref(null);

const selectTab = (item) =>{
  // console.log('查看数据',item);
  top.value = item
}

const clickSetting = (item) =>{
  top.value = item
}

const enableNotice = () =>{
  const enable = settings.value.noticeEnable = !settings.value.noticeEnable
  app.setNoticeOnOff(enable)
}


const clearAll = () =>{
  notice.clear(top.value.type)
  message.success('已为您清空本地消息（不包含推送等网络消息）')
}

const close = () =>{
  emits('closeMessage')
}



const leftList = ref([
  {
    id: "all",
    newIcon:"fluent:grid-16-regular",
    alias: "all",
    newName: "全部消息",
    name:'全部',bg:'var(--secondary-bg)',
    callBack: (item)=>{
      selectTab(item)
    },
  },
  {
    newIcon:'fluent:alert-16-regular',  name:'系统',
    newName:'系统消息',id:'system',bg:'var(--secondary-bg)',
    callBack: (item)=>{ selectTab(item)},
  },
  {
    id: "IM",
    newIcon:"fluent:chat-16-regular",
    alias: "teamChat",
    newName: "社群沟通",
    name:'社群',bg:'var(--secondary-bg)',
    type:'message',
    callBack: (item)=>{
      selectTab(item)
    },
  },
  {
    newIcon:'fluent:mail-16-regular', name:'推送',
    newName:'推送消息 ',id:'push',bg:'var(--secondary-bg)',
    callBack: (item)=>{ selectTab(item)},
  },
  {
    newIcon:'fluent:emoji-smile-slight-24-regular',name:'助手', id:'IA',newName:'智能助手',bg:'var(--secondary-bg)',
    callBack: (item)=>{ selectTab(item)},
  },

  {
    newIcon:'fluent:send-32-regular', flag: true,
    callBack:()=>{
      editorRef.value.openEditorModal();
    }
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
    type:'setting',
    callBack:(item)=>{
      clickSetting(item)
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

const filetDetailList = computed(()=>{
  switch(top.value.id){
    case 'all': // 全部消息通知
      return detailList.value;
    case 'system':  // 系统消息通知
      const filterSystem = detailList.value.filter((item)=>{ return item.type === 'system' });
      console.log(filterSystem)
      return filterSystem;
    case 'IM':  // 社群消息通知
      const filterMessage = detailList.value.filter((item)=>{ return item.type === 'message' });
      return filterMessage;
    case 'push': // 推送消息通知
      const filterPush = detailList.value.filter((item)=>{ return item.type === 'push' });
      return filterPush;
    case 'IA': // 助手消息通知
      return [];
  }
})


onMounted(()=>{
  notice.getNoticeList()
})
</script>

<style lang="scss" scoped>
:deep(.xt-bt){
  border-top: none !important;
}
:deep(.xt-br){
  border-right: none !important;
}
</style>
