<template>
  <xt-modal v-model="data.myInfoVisible" title="我的信息">
    <div class="myinfo-container flex flex-col">
      <xt-scrollbar :y="true" class="h-full flex justify-between w-full">
        <div class="w-1/2 flex grow flex-col">
          <span class="xt-text font-16 xt-font mb-3">昵称</span>
          <div class="flex items-center rounded-xl justify-center h-10 px-3 mb-3" style="border: 1px solid var(--divider);background: var(--secondary-bg);">
            <a-input v-model:value="data.randomNick" placeholder="请输入" :bordered="false" style="padding: 0;width:90%;"></a-input>
            <div class="flex p-1 rounded-md pointer" style="background: var(--active-bg);" @click="roll" >
              <Icon id="touzi" ref="touzi" class=" " icon="touzi" style="font-size: 1.5rem"></Icon>
            </div>
          </div>

          <span class="xt-text font-16 xt-font mb-3">头像</span>
          <div class="flex w-full mx-1.5 flex-wrap justify-between" style="position: relative;">
            <UploadImage v-model="infoAvatar"/>
            <div v-for="item in presetAvatar" class="avatar-box rounded-lg pointer  mb-3" @click="selectPresetAvatar(item)"
             :class="{'select-active':data.presetIndex === item.id}"
            >
              <a-avatar :size="48" :src="presetAvatarUrl(item.id)"></a-avatar>
            </div>
          </div>
        </div>
        <a-divider type="vertical" class="myInfo-divider"  style="margin: 0 16px;"/>
        <div class="w-1/2 grow flex flex-col myInfo-divider">
          <span class="xt-text font-16 xt-font mb-3">个性签名</span>
          <a-textarea v-model:value="data.sign" placeholder="暂无签名" 
            class="no-scrollbar"  :rows="3" :maxlength="200" 
            style="height: 100px;margin-bottom:12px;background: var(--secondary-bg);border: 1px solid var(--divider); border-radius: 8px;"
          />
          
          <span class="xt-text font-16 xt-font mb-3">性别</span>
          <xt-tab v-model="selectSexItem" :list="data.selectSex" class="p-1 xt-bg-t-2 h-10" :boxStyle="{ 'border-radius': '10px' }" :itemStyle="{ 'border-radius': '6px' }" />

          <div class="more-info my-3 flex items-center justify-center">
            <div class="flex items-center">
              <span class="xt-text-2 font-16 xt-font pr-0.5">更多个人信息编辑、账号设置等，请前往</span>
              <xt-button h="0" style="width: auto !important;" @click="goYuanCommunity">
                <span class="xt-theme-text">元社区</span>
              </xt-button>
            </div>
          </div>
        </div>
      </xt-scrollbar>
      <div class="w-full flex items-center justify-center">
        <div class="flex">
          <xt-button class="mr-3" h="40" @click="laterSetup">稍后设置</xt-button>
          <xt-button type="theme" h="40" @click="saveMyInfo">保存</xt-button>
        </div>
      </div>
    </div>
  </xt-modal>
</template>

<script setup>
import { ref,computed,onMounted,watch} from 'vue';
import { randomName } from '../../js/data/chatList';
import { storeToRefs } from 'pinia';
import { appStore } from '../../store';
import { message } from 'ant-design-vue';
import browser from '../../js/common/browser';
import { avatarNumber } from '../../js/common/teamAvatar';
import { frameStore } from '../../store/avatarFrame';
import {completeTask} from '../../apps/task/task';

import UploadImage from '../UploadImage.vue';

const app = appStore();
const { userInfo } = storeToRefs(app);
const frame = frameStore();

// 临时数据
const data = ref({
  myInfoVisible:false,
  // 随机昵称
  randomNick:null,
  // 个性签名
  sign:null,
  timer:null,
  i:1, j:1, k:0,
  selectSex:[
    {
      name:'保密',
      value:'0',
    },
    {
      name:'男',
      value:'1',
    },
    {
      name:'女',
      value:'2',
    },
  ],
  // 预设头像选中下标
  presetIndex:'',  
});
// 接收切换到的性别
const selectSexItem = ref('0');
const screenname = randomName;
const presetAvatar = ref(avatarNumber);
// 头像URL
const infoAvatar = ref('');

/**事件方法**/ 
// 打开修改信息弹窗
const openMyInfo = () =>{ data.value.myInfoVisible = true;};
// 稍后设置
const laterSetup = () =>{ data.value.myInfoVisible = false;};
// 预设头像url拼接
const presetAvatarUrl = (id) =>{ return 'https://up.apps.vip/avatar/' +  id + '.png';};

// 随机获取昵称
const roll = (animate=true) =>{
  if(animate){
    if(data.value.timer){
      clearTimeout(data.value.timer);
    }
    $('#touzi').addClass('animate-spin');
    data.value.timer = setTimeout(()=>{
      rollName();
      $('#touzi').removeClass('animate-spin');
    },400);
  }
  else {
    rollName();
  }
};
const rollName = () =>{
  let groups = screenname;
  let j = Math.ceil((Math.random() * groups.length)) - 1;
  if(data.value.j === j){ rollName(); return; };
  data.value.j = j;
  data.value.randomNick = groups[data.value.j];
};
// 保存修改后的信息
const saveMyInfo = async() =>{
  const isEmptyStr = data.value.randomNick && data.value.sign;
  if(infoAvatar.value === ''){
    message.warning('头像不能为空');
    return
  }
  else if(!isEmptyStr){
    message.warning('请完善修改信息');
    return;
  }
  else {
    const infoOption = {
      nickname:data.value.randomNick,
      signature:data.value.sign,
      avatar:infoAvatar.value,
      sex:selectSexItem.value,
    }
    console.log('infoOption',infoOption);
    let result = await frame.updateMyinfo(infoOption);
    console.log("result",result);
    if(result.code === 200){
      message.success('修改成功');
      data.value.myInfoVisible = false;
      completeTask('m0301');
      setTimeout(()=>{
        app.getUserInfo();
      },3 * 1000);
      console.log('数据更新',userInfo.value);
    }
    else{
      message.error('修改失败');
    }
  }
};
// 跳转元社区
const goYuanCommunity = () =>{
  const url = "https://s.apps.vip/user/info";
  browser.openInUserSelect(url);
};
// 选择当前预设头像
const selectPresetAvatar = (item) =>{
  infoAvatar.value = presetAvatarUrl(item.id);
  data.value.presetIndex = item.id;
}




onMounted(()=>{
  console.log('测试',userInfo.value,data.value);
  data.value.randomNick = userInfo.value.nickname;
  data.value.sign = userInfo.value.signature;
  infoAvatar.value = userInfo.value.avatar;
})

defineExpose({
  openMyInfo
})
</script>

<style lang="scss" scoped>
.myinfo-container{
  width: 946px;
}
.animate-spin{
  animation: spin .6s linear infinite !important;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
  overflow-y: auto;
}
.avatar-box{
  width: 72px;
  height: 72px;
  background: var(--secondary-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 6px !important;
}
.select-active{
  border: 1px solid var(--active-bg);
  background: rgba(80,139,254,0.20);
}

/**最大宽度**/
@media screen and (max-width:840px){
  .myinfo-container{
    width:700px !important;
  }
}

/**最小高度和最大高度的响应式**/
@media screen and (max-height:480px) {
  .myinfo-container{
    height: 360px !important;
  }
  .myInfo-divider{
    height:  360px !important;
  }
  .more-info{
    height: 25% !important;
  }
}
@media screen and (min-height:481px) {
  .myinfo-container{
    height:  569px !important;
  }
  .myInfo-divider{
    height:  520px !important;
  }
  .more-info{
    height: 50% !important;
  }
}
:deep(.ps__rail-y){
  display: none !important;
}
</style>