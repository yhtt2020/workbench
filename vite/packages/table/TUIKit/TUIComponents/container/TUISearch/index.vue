<template>
  <div class="TUI-search" style="padding: 0 16px !important;margin-top: 13px;" :class="[env.isH5 ? 'TUI-search-H5' : '']" ref="dialog">
    <a-dropdown @click="toggleOptionalShow" placement="topLeft" class="ml-4" :trigger="['click']">
      <div class="w-11 active-button h-11 rounded-lg pointer flex items-center justify-center" style="background: var(--secondary-bg);">
        <Icon icon="tianjia2" style="color: var(--secondary-text);"></Icon>
      </div>
      <template #overlay>
        <div class="flex items-center rounded-lg " style="background: var(--modal-bg);padding: 16px !important;">
          <div v-for="(item,index) in addList" style="margin-right: 20px;" class="flex add-item  flex-col items-center justify-center pointer" @click="showOpen(item.type,index)">
            <div  class="flex items-center add-hover rounded-lg justify-center h-11 w-11" style="background: var(--secondary-bg);margin-bottom: 10px;">
              <Icon :icon="item.icon" style="color: var(--secondary-text);"></Icon>
            </div>
            <div class="font-12" style="color: var(--secondary-text);">{{ item.title }}</div>
          </div>
        </div>
      </template>
    </a-dropdown>
  </div>

  <teleport to='body'>
    <Modal v-if="open" v-model:visible="open" :blurFlag="true">
      <CreateGroup v-if="addIndex === 1" @submit="create" @close="close" @cancel="toggleOpen" :isH5="env.isH5" />
      <AddFriend v-if="addIndex === 0" @close="close"></AddFriend>
      <Transfer :server="TUIServer" :isSearch="needSearch" @close="close" :title="showTitle" :list="searchUserList" :isH5="env.isH5" :isRadio="createConversationType === 'isC2C'" @search="handleSearch" @submit="submit" @cancel="toggleOpen" v-if="addIndex === 2"/>
    </Modal>
  </teleport>



  <!-- <Dialog :show="open" :isH5="env.isH5" :isHeaderShow="false" :isFooterShow="false" :background="false" @update:show="(e) => (open = e)">
    <Transfer :isSearch="needSearch" :title="showTitle" :list="searchUserList" :isH5="env.isH5" :isRadio="createConversationType === 'isC2C'" @search="handleSearch" @submit="submit" @cancel="toggleOpen" v-if="step === 1"/>
    <CreateGroup v-else @submit="create" @cancel="toggleOpen" :isH5="env.isH5" />
  </Dialog> -->
</template>
<script>
import { defineComponent, reactive, ref, toRefs } from 'vue';
import CreateGroup from './components/createGroup';
import Modal from '../../../../components/Modal.vue';
import Transfer from '../../components/transfer/index.vue';
import AddFriend from '../../components/transfer/addFriend.vue';

// import Dialog from '../../components/dialog/index.vue';

import { useStore } from 'vuex';
import constant from '../constant';
import { onClickOutside } from '@vueuse/core';
import { handleErrorPrompts, handleSuccessPrompts } from '../utils';


const TUISearch = defineComponent({
  name: 'TUISearch',

  components: {
    Transfer,Modal,
    CreateGroup,AddFriend

    // Dialog,

  },


  setup(props) {
    const TUIServer = TUISearch?.TUIServer;
    const { t } = TUIServer.TUICore.config.i18n.useI18n();
    const data = reactive({
      open: false,
      searchUserID: '',
      selectedList: [],
      allUserList: [],
      searchUserList: [],
      step: 1,
      group: {
        groupID: '',
        name: '',
        type: '',
        avatar: '',
        introduction: '',
        notification: '',
        joinOption: '',
        memberList: [
          {
            userID: '',
          },
        ],
      },
      showTitle: '',
      createConversationType: '',
      env: TUIServer.TUICore.TUIEnv,
      optionalShow: !TUIServer.TUICore.TUIEnv.isH5,
      needSearch: !TUIServer.TUICore.isOfficial,
      TUIServer:TUISearch?.TUIServer
    });

    TUIServer.bind(data);

    const GroupServer = TUIServer?.TUICore?.TUIServer?.TUIGroup;
    CreateGroup.TUIServer = TUIServer;

    const addList = reactive(  // 左侧底部更多操作按钮
      [
        {title:'发起群聊',icon:'message',type:'isGroup'},
        {title:'加入群聊',icon:'team',type:'addGroup'},
        {title:'添加好友',icon:'tianjiachengyuan',type:'isC2C'}
      ]
    )

    const addIndex = ref(0)

    const VuexStore = (( window )?.TUIKitTUICore?.isOfficial && useStore && useStore()) || {};

    const dialog = ref();

    onClickOutside(dialog, () => {
      if (data.env.isH5) {
        data.optionalShow = false;
        data.searchUserList = [...data.allUserList];
      }
    });

    // 初始化群组属性  Initialize group parameters
    const initGroupOptions = () => {
      data.group = {
        groupID: '',
        name: '',
        type: '',
        avatar: '',
        introduction: '',
        notification: '',
        joinOption: '',
        memberList: [
          {
            userID: '',
          },
        ],
      };
    }

    const toggleOpen = () => {
      data.open = false

      // data.open = !data.open;
      // if (!data.open) {
      //   data.searchUserID = '';
      //   data.step = 1;
      //   initGroupOptions();
      // }
    }

    const submit = (userList) => {
      if (data.createConversationType === constant.typeC2C) {
        const { userID } = userList[0];
        handleCurrentConversation(userID, 'C2C');
        toggleOpen();
      } else {
        if (!CreateGroup.TUIServer) {
          const message = t('TUISearch.创建群聊，请注册 TUIGroup 模块');
          handleErrorPrompts(message, data.env);
        }
        initGroupOptions();
        data.group.memberList = userList.map((item) => ({ userID: item.userID }));
        data.step = 2;
      }
      data.searchUserList = [...data.allUserList];
    }

    // creating group
    const create = async (params) => {
      if (params.type === TUIServer.TUICore.TIM.TYPES.GRP_PUBLIC) {
        data.group.joinOption = TUIServer.TUICore.TIM.TYPES.JOIN_OPTIONS_NEED_PERMISSION;
      }
      const options = { ...data.group, ...params };
      if (params.type === TUIServer.TUICore.TIM.TYPES.GRP_AVCHATROOM) {
        delete options.memberList;
        delete options.joinOption;
      }
      try {
        const imResponse = await GroupServer.createGroup(options);
        const message = t('TUISearch.创建成功');
        handleSuccessPrompts(message, data.env);
        (window)?.TUIKitTUICore?.isOfficial && VuexStore?.commit && VuexStore?.commit('handleTask', 3);
        toggleOpen();
        if (params.type === TUIServer.TUICore.TIM.TYPES.GRP_AVCHATROOM) {
          GroupServer.joinGroup({
            groupID: imResponse.data.group.groupID,
            applyMessage: '',
            type: imResponse.data.group.type,
          });
        }
        handleCurrentConversation(imResponse.data.group.groupID, 'GROUP');
      } catch (imError) {
        handleErrorPrompts(imError, data.env);
      }
    }

    const handleCurrentConversation = (id, type) => {
      const name = `${type}${id}`;
      TUIServer.getConversationProfile(name).then((imResponse) => {
        // 通知 TUIConversation 模块切换当前会话
        // Notify TUIConversation to toggle the current conversation
        TUIServer.TUICore.TUIServer.TUIConversation.handleCurrentConversation(imResponse.data.conversation);
      });
    }

    const showOpen = (type,index) => {
      addIndex.value = index
      setTimeout(()=>{
        data.open = true;
        switch(type){
          case 'isGroup':
            // data.createConversationType = constant.typeGroup;
            // data.showTitle = t('TUISearch.发起群聊');
            // return data.showTitle;
          case 'addGroup':
            // console.log('打开加入群聊弹窗');
            // return;
          case 'isC2C':
            data.createConversationType = constant.typeC2C;
            data.showTitle = t('TUISearch.发起单聊');
            return data.showTitle;
        }
      },100)

      // data.open = true;
      // data.searchUserList = [...data.allUserList];
      // switch (type) {
      //   case 'isC2C':
      //     data.createConversationType = constant.typeC2C;
      //     data.showTitle = t('TUISearch.发起单聊');
      //     return data.showTitle;
      //   case 'isGroup':
          // data.createConversationType = constant.typeGroup;
          // data.showTitle = t('TUISearch.发起群聊');
          // return data.showTitle;
      // }
    }

    const toggleOptionalShow = () => {
      if (data.env.isH5) {
        data.optionalShow = !data.optionalShow;
      }
    }

    const handleSearch = async (val) => {
      try {
        const imResponse = await TUIServer.getUserProfile([val]);
        if (!imResponse.data.length) {
          handleErrorPrompts(t('TUISearch.该用户不存在'), data.env);
          data.searchUserList = [...data.allUserList];
          return;
        }
        data.searchUserList = imResponse.data;
        const searchAllResult = data.allUserList.filter((item) => item.userID === imResponse.data[0].userID);
        data.allUserList = searchAllResult.length ? data.allUserList : [...data.allUserList, ...data.searchUserList];
      } catch (error) {
        handleErrorPrompts(t('TUISearch.该用户不存在'), data.env);
        data.searchUserList = [...data.allUserList];
        return;
      }
    }

    const close = () => { // 关闭弹窗回调函数
      data.open = false
    }


    return {
      ...toRefs(data), toggleOpen, handleSearch, submit, create,
      showOpen,toggleOptionalShow,dialog,addList,addIndex,close
    }
  },
})
export default TUISearch
</script>

<style lang="scss" scoped src="./style/index.scss"></style>
<style lang="scss" scoped>
.font-12{

  font-size: 12px;
  font-weight: 400;
}

.add-item{
  &:last-of-type{
   margin-right: 0 !important;
  }
}

:deep(.add-hover:hover){
  background: var(--active-secondary-bg) !important;
}

/**
:deep(.active-bg){
  background: var(--active-secondary-bg) !important;
  &>svg{
    color: var(--active-text) !important;
  }
}
**/

.active-button{
  &:active{
    filter: brightness(0.8);
    opacity: 0.8;
  }
  &:hover{
    opacity: 0.8;
  }
}
</style>
