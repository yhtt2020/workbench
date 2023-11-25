<template>
  <vue-custom-scrollbar :settings="settingsScroller">
    <div
      v-for="item in 5" class="px-4 py-2 flex w-full justify-between rounded-xl member-item"
    >
      <div class="flex items-center">
        <div class="flex w-8 h-8 mr-4 items-center justify-center">
          <a-avatar
            shape="circle"
            :size="32"
            src="https://up.apps.vip/avatar/013.png"
          />
        </div>
        <div class="flex flex-col">
          <span class="xt-font font-16 font-400 xt-text">Edith Turner</span>
          <span class="xt-font font-14 font-400 xt-text-2">陌生人</span>
        </div>
      </div>
      <div style="display: none;" class="right-dropdown">
        <Dropdown :enableButton="true" :unbutton="false" :id="22" newIcon="fluent:more-horizontal-16-regular" :list="memberList" @callbackParams="callbackParams"/>
      </div>
    </div>
  </vue-custom-scrollbar>
</template>

<script>
import { ref,reactive,computed,toRefs } from 'vue'

import Dropdown from '../float/Dropdown.vue';

export default {
  components:{
    Dropdown
  },
  setup(props,ctx){

    const data =reactive({
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true,
      },
      dropID:'',
    })

    const callbackParams = (args) =>{
      // console.log('查看args',args);
      data.dropID = args
    }

    const memberList = ref([
      {
        title:'发消息',newIcon:'ant-design:message-outlined',
        callBack:()=>{
          // console.log('查看id',data.dropID);
        }
      },
      {
        title:'移出社群',newIcon:'fluent:delete-16-regular',color:'var(--error)',type:'deletePacket',
        callBack:()=>{
          // console.log('查看id',data.dropID);
        }
      }
    ])

    return{
      memberList,
      ...toRefs(data),callbackParams,
    }
  }
};
</script>

<style lang="scss" scoped>
.member-item {
  &:hover {
    background: var(--active-secondary-bg);
    .right-dropdown{
      display: block !important;
    }
  }
}
</style>