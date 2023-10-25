<template>
  <div class="flex flex-col" style="padding:12px;width: 400px;height: 400px;">
    <div class="flex items-center justify-between">
      <div class="font-16 flex items-center justify-center" style="color:var(--primary-text);width: 95%;">加入群聊</div>
      <div class="flex rounded-lg active-button pointer items-center w-12 h-12 justify-center"
        style="background: var(--secondary-bg);" @click="closeJoinGroup"
      >
        <Icon icon="guanbi" style="color: var(--primary-text);width: 24px;height: 24px;"></Icon>
      </div>
    </div>

    <div style="margin: 24px 0;" >
      <a-input placeholder="输入群ID搜索" :spellcheck="false" v-model:value="searchId" class="h-12" style="border-radius: 12px;"
        @keyup.enter="searchGroup"
      >
        <template #suffix>
          <SearchOutlined @click="searchGroup"/>
        </template>
      </a-input>
    </div>

    <div class="flex items-center  justify-center" style="color: var(--primary-text);margin-top: 50px;"  v-if="searchResult.length === 0">
      <a-empty :image="simpleImage"/>
    </div>

    <template v-else>
      <vue-custom-scrollbar :settings="settingsScroller" style="height:100%; margin-bottom: 16px;">
        <div class="flex justify-between items-center" v-for="item in searchResult" style="margin-bottom: 8px;">
          <div class="flex">
            <a-avatar shape="square" :size="48" :src="item.avatar"></a-avatar>
            <div class="flex flex-col" style="margin-left:16px;">
              <span style="color: var(--primary-text);">{{ item.name }}</span>
              <span style="color: var(--primary-text);">{{ total }}人</span>
            </div>
          </div>
          <div class="flex items-center rounded-lg pointer  justify-center active-button"
           style="padding: 9px 18px; color: var(--active-text);background: var(--active-bg);"
           @click="joinGroup(item)"
          >
           加入
          </div>
        </div>
      </vue-custom-scrollbar>
    </template>

  </div>


  <!-- <div class="group" :class="[isH5 ? 'group-h5' : '']">
      <div  class="group-box">
        <header>
          <h1 v-if="!isEdit">{{$t('TUISearch.发起群聊')}}</h1>
          <h1 v-else>{{$t(`TUISearch.${editConfig.title}`)}}</h1>
          <i class="icon" :class="[isH5 ? 'icon-back' : 'icon-close']" @click="cancel"></i>
        </header>
        <ul class="group-list" v-if="!isEdit">
          <li class="group-list-item">
              <label>{{$t('TUISearch.群头像')}}</label>
              <img class="icon" :src="profile.avatar"/>
          </li>
          <ul>
            <li class="group-list-item">
                <label>{{$t('TUISearch.群名称')}}</label>
                <input v-if="!isH5" type="text" v-model="profile.name" placeholder="请输入群名称">
                <span class="group-h5-list-item-content" v-else @click="edit('name')">
                  <p class="content">{{profile.name}}</p>
                  <i class="icon icon-right"></i>
                </span>
            </li>
            <li class="group-list-item">
                <label>{{$t('TUISearch.群ID')}}<text>({{$t('TUISearch.选填')}})</text></label>
                <input v-if="!isH5" type="text" v-model="profile.groupID">
                <span class="group-h5-list-item-content" v-else @click="edit('groupID')">
                  <p class="content">{{profile.groupID}}</p>
                  <i class="icon icon-right"></i>
                </span>
            </li>
            <li class="group-list-introduction">
              <div class="group-list-item">
                <label>{{$t('TUISearch.群类型')}}</label>
                <ul class="select" v-if="!isH5">
                  <li
                    class="select-item"
                    v-for="(item,index) in type"
                    :key="index"
                    :class="[profile.type === item.type && 'selected']"
                    @click="selected(item)">
                    <main>
                      <div class="select-item-header">
                        <aside class="left">
                          <img class="icon" :src="item.icon"/>
                          <span class="select-item-label">{{item.label}}</span>
                        </aside>
                        <i v-if="profile.type === item.type" class="icon icon-selected"></i>
                      </div>
                      <span class="select-item-detail">{{$t(`TUISearch.${item.detail}`)}}</span>
                      <a :href="Link.product.url" target="view_window">{{$t(`TUISearch.${item.src}`)}}</a>
                    </main>
                  </li>
                </ul>
                <span class="group-h5-list-item-content" v-else @click="edit('type')">
                  <p class="content">{{groupTypeDetail.label}}</p>
                  <i class="icon icon-right"></i>
                </span>
              </div>
              <article class="group-h5-list-item-introduction"  v-if="isH5">
                <label class="introduction-name">{{groupTypeDetail.label}}：</label>
                <span class="introduction-detail">{{$t(`TUISearch.${groupTypeDetail.detail}`)}}</span>
                <a :href="Link.product.url" target="view_window">{{$t(`TUISearch.${groupTypeDetail.src}`)}}</a>
              </article>
            </li>
          </ul>
        </ul>
        <div class="group-list group-list-edit" v-else>
          <input type="text" v-model="editConfig.value" v-if="editConfig.type === 'input'" :placeholder="$t(`TUISearch.${editConfig.placeholder}`)">
          <ul class="select" v-else>
            <li
              class="select-item"
              v-for="(item,index) in type"
              :key="index"
              :class="[editConfig.value === item.type && 'selected']"
              @click="selectedEdit(item)">
              <main>
                <div class="select-item-header">
                  <aside class="left">
                    <img class="icon" :src="item.icon"/>
                    <span class="select-item-label">{{item.label}}</span>
                  </aside>
                  <i v-if="editConfig.value === item.type" class="icon icon-selected"></i>
                </div>
                <span class="select-item-detail">{{$t(`TUISearch.${item.detail}`)}}</span>
                <a :href="Link.product.url" target="view_window">{{$t(`TUISearch.${item.src}`)}}</a>
              </main>
            </li>
          </ul>
        </div>
        <footer class="group-profile-footer">
          <button v-if="!isEdit && !isH5" class="btn-default" @click="cancel">{{$t('TUISearch.取消')}}</button>
          <button class="btn-submit" @click="submit(profile)" :disabled="profile.name === '' && !isEdit">{{$t('TUISearch.创建')}}</button>
        </footer>
      </div>
    </div> -->

</template>
<script >
import { computed, defineComponent, reactive, toRefs,watch } from 'vue';
// import Link from '../../../../../utils/link';
import { SearchOutlined } from '@ant-design/icons-vue'
import _ from 'lodash-es'
import { message } from 'ant-design-vue';
import {chatStore} from '../../../../../../store/chat'

const TUISearch = defineComponent({
  name: 'group',
  props: {
    isH5: {
      type: Boolean,
      default: () => false,
    },
  },

  components:{
    SearchOutlined,
  },

  setup(props,ctx){

    // const TUIServer = TUISearch?.TUIServer?.TUICore.TUIServer.TUIGroup;
    const TUIServer = window.$chat
    const { t } = window.$TUIKit.config.i18n.useI18n();
    const Server = window.$TUIKit

    const chat = chatStore()

    const data = reactive({
      searchId:'',
      currentGroup: null,
      env: Server.TUIEnv,
      searchResult:[],
      simpleImage:'/img/state/null.png',
      settingsScroller: {  // 滚动条配置
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
      total:chat.$state.limitTotal
    })

    const closeJoinGroup = () =>{  // 关闭加入群聊弹窗
      ctx.emit('close')
    }

    const searchGroup = () =>{  // 根据群组id进行群组搜索
      TUIServer.searchGroupByID(data.searchId).then((res=>{
        if(data.searchResult.some(item => item.groupID === res.data.group.groupID)){
         return
        }else{
         data.searchResult.push(res.data.group)
        }
      })).catch(error=>{
        message.warn('该群聊为私群,不支持搜索')
        console.error(error)
      })
    }

    const joinGroup = async(group) =>{ // 加入群组方法
      // console.log('排查问题::>>',group)
      const disabledJoin = group.joinOption === 'DisableApply'
      if(disabledJoin){
        message.warn('群管理员开启了禁止加群设置')
        ctx.emit('close')
      }else{
        const options = {
         groupID: group.groupID,
         applyMessage: group.applyMessage ||  t('TUIContact.加群'),
         // t('TUIContact.加群')
         type: group?.type,
        }
        const res = await TUIServer.joinGroup(options);
        // console.log('检测::>>',res);
        if(res.data.status === 'WaitAdminApproval'){
         message.success('入群申请已发出,等待群主和管理员审核')
         data.currentGroup = { apply:true }
        }
        ctx.emit('close')
      }

    }

    watch(()=>data.searchId,(newVal)=>{
      if(newVal === ''){
        data.searchResult = []
      }
    })

    return{
      closeJoinGroup,...toRefs(data),searchGroup,joinGroup,
    }

  }




  // setup(props, ctx) {
  //   const data = reactive({
  //     profile: {
  //       groupID: '',
  //       name: '',
  //       type: '',
  //       avatar: '',
  //       introduction: '',
  //       notification: '',
  //       joinOption: '',
  //     },
  //     editConfig: {
  //       title: '',
  //       value: '',
  //       key: '',
  //       type: '',
  //       placeholder: '',
  //     },
  //     isEdit: false,
  //     type: [
  //       {
  //         icon: 'https://web.sdk.qcloud.com/im/assets/images/Public.svg',
  //         label: '陌生人社交群（Public）',
  //         type: group.TUIServer.TUICore.TIM.TYPES.GRP_PUBLIC,
  //         detail: '类似 QQ 群，创建后群主可以指定群管理员，用户搜索群 ID 发起加群申请后，需要群主或管理员审批通过才能入群。详见',
  //         src: '产品文档',
  //       },
  //       {
  //         icon: 'https://web.sdk.qcloud.com/im/assets/images/Meeting.svg',
  //         label: '临时会议群（Meeting）',
  //         type: group.TUIServer.TUICore.TIM.TYPES.GRP_MEETING,
  //         detail: '创建后可以随意进出，且支持查看入群前消息；适合用于音视频会议场景、在线教育场景等与实时音视频产品结合的场景。详见',
  //         src: '产品文档',
  //       },
  //       {
  //         icon: 'https://web.sdk.qcloud.com/im/assets/images/Work.svg',
  //         label: '好友工作群（Work）',
  //         type: group.TUIServer.TUICore.TIM.TYPES.GRP_WORK,
  //         detail: '类似普通微信群，创建后仅支持已在群内的好友邀请加群，且无需被邀请方同意或群主神奇。详见',
  //         src: '产品文档',
  //       },
  //       {
  //         icon: 'https://web.sdk.qcloud.com/im/assets/images/AVChatroom.svg',
  //         label: '直播群（AVChatroom）',
  //         type: group.TUIServer.TUICore.TIM.TYPES.GRP_AVCHATROOM,
  //         detail: '创建后可以随意进出，没有群成员数量上限，但不支持历史消息存储；适合与直播产品结合，用于弹幕聊天场景。详见',
  //         src: '产品文档',
  //       },
  //     ],
  //   });

  //   data.profile.type = data.type[0].type;
  //   data.profile.avatar = data.type[0].icon;

  //   const groupTypeDetail = computed(()=> {
  //     return data.type.filter((item)=> {
  //       return item.type === data.profile.type;
  //     })[0];
  //   });

  //   const selected = (item) => {
  //     if (data.profile.type !== item.type) {
  //       data.profile.type = item.type;
  //       data.profile.avatar = item.icon;
  //     }
  //   };

  //   const submit = (profile) => {
  //     if (data.isEdit) {
  //       (data.profile )[data.editConfig.key] = data.editConfig.value;
  //       return data.isEdit = !data.isEdit;
  //     }
  //     const options = {
  //       name: profile.name,
  //       type: profile.type,
  //       groupID: profile.groupID,
  //       avatar: profile.avatar,
  //     };
  //     ctx.emit('submit',  options);
  //   };

  //   const cancel = () => {
  //     if (data.isEdit) {
  //       return data.isEdit = !data.isEdit;
  //     }
  //     ctx.emit('cancel');
  //   };

  //   const edit = (label) => {
  //     data.isEdit = !data.isEdit;
  //     data.editConfig.key = label;
  //     data.editConfig.value = (data.profile)[label];
  //     switch (label) {
  //       case 'name':
  //         data.editConfig.title = '设置群名称';
  //         data.editConfig.placeholder = '请输入群名称';
  //         data.editConfig.type = 'input';
  //         break;
  //       case 'groupID':
  //         data.editConfig.title = '设置群ID';
  //         data.editConfig.placeholder = '请输入群ID';
  //         data.editConfig.type = 'input';
  //         break;
  //       case 'type':
  //         data.editConfig.title = '选择群类型';
  //         data.editConfig.type = 'select';
  //         break;
  //     }
  //   };

  //   const selectedEdit = (item) => {
  //     if (data.editConfig.value !== item.type) {
  //       data.editConfig.value = item.type;
  //     }
  //   };

  //   return {
  //     ...toRefs(data),
  //     selected,
  //     submit,
  //     cancel,
  //     Link,
  //     edit,
  //     selectedEdit,
  //     groupTypeDetail,
  //   };
  // },
});

export default TUISearch;
</script>

<style lang="scss" scoped src="./style/index.scss"></style>

<style lang="scss" scoped>
.font-16{

  font-size: 16px;
  font-weight: 500
}

.active-button{
  &:active{
    filter: brightness(0.8);
    opacity: 0.8;
  }
  &:hover{
    opacity: 0.8;
  }
}

:deep(.ant-input){
  color: var(--secondary-text) !important;
  font-size: 1.15em;
  &::placeholder{
    color: var(--secondary-text) !important;
  }
}
:deep(.ant-input-suffix){
  color: var(--secondary-text) !important;
  font-size: 1.5em;
  cursor: pointer;
}

:deep(.ant-empty-image){
  width:80px;
  height:80px;
}
</style>
