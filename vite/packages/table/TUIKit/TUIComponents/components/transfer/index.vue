<template>
 <div class="flex flex-col" style="width: 400px !important;height: 400px !important;padding: 12px !important;">
  <div class="top-close flex items-center">
    <div class="font-16 flex items-center justify-center" style="color: var(--primary-text);">添加好友</div>
    <div class="rounded-lg pointer active-button h-12 w-12 flex items-center justify-center" style="background: var(--secondary-bg);" @click="closeAddFriend">
      <Icon icon="guanbi" style="color: var(--secondary-text);width: 24px !important; height: 24px !important;"></Icon>
    </div>
  </div>

  <div class="flex flex-col" style="margin-top: 16px !important;">
    <a-input class=" h-11 mb-6" :spellcheck="false" v-model:value="friendValue" style="border-radius: 12px;"  @input="handleInput($event)"  enterkeyhint="search" placeholder="输入用户ID搜索" >
      <template #suffix>
        <SearchOutlined style="color:var(--secondary-text);font-size: 1.25em;" />
      </template>
    </a-input>

    <div class="flex flex-col" style="color: var(--primary-text);" v-if="addFriendLists.length !== 0 && friendValue !== ''">
      <div class="font-14" style="color: var(--primary-text);">搜索结果</div>
      <div class="flex flex-col">
       <div v-for="item in addFriendLists" class="flex items-center justify-between" style="padding: 12px;">
         <div class="flex items-center">
          <a-avatar  :size="32" :src="item.avatar"></a-avatar>
          <div style="margin-left: 16px;">{{ item.nick }}</div>
         </div>

         <div v-if="isFriend" class=" flex items-center justify-center rounded-lg" style="background: var(--secondary-bg);color:var(--secondary-text);padding: 10px;">
          已添加
         </div>

         <div v-else class="active-button flex items-center justify-center pointer rounded-lg"
          style="background: var(--active-bg);color:var(--active-text);padding: 10px;" @click="addFriendButton(item)"
         >
           加好友
         </div>
       </div>
      </div>

    </div>



    <div v-else class="flex items-center  justify-center" style="color: var(--primary-text);margin-top: 50px;">
      <a-empty :image="simpleImage" />
    </div>



  </div>


 </div>





  <!-- <div class="transfer" :class="[isH5 ? 'transfer-h5' : '']">
    <header class="transfer-h5-header" v-if="isH5">
      <i class="icon icon-back" @click="cancel"></i>
      <span class="title">{{ title }}</span>
    </header>
    <main class="main">
      <div class="left">
        <header v-if="isSearch">
          <input
            type="text"
            @keyup.enter="handleInput"
            :placeholder="$t('component.请输入userID')"
            enterkeyhint="search"
          />
        </header>
        <main>
          <ul class="list">
            <li class="list-item" @click="selectedAll" v-if="optional.length > 1 && !isRadio">
              <i
                class="icon"
                :class="[selectedList.length === optional.length ? 'icon-selected' : 'icon-unselected']"
              ></i>
              <span class="all">{{ $t('component.全选') }}</span>
            </li>
            <li class="list-item" v-for="(item, index) in list" :key="index" @click="selected(item)">
              <i
                class="icon"
                :class="[
                  item?.isDisabled && 'disabled',
                  selectedList.indexOf(item) > -1 ? 'icon-selected' : 'icon-unselected',
                ]"
              ></i>
              <template v-if="!isCustomItem">
                <img
                  class="avatar"
                  :src="item?.avatar || 'https://web.sdk.qcloud.com/component/TUIKit/assets/avatar_21.png'"
                  onerror="this.src='https://web.sdk.qcloud.com/component/TUIKit/assets/avatar_21.png'"
                />
                <span class="name">{{ item?.nick || item?.userID }}</span>
                <span v-if="item?.isDisabled">（{{ $t('component.已在群聊中') }}）</span>
              </template>
              <template v-else>
                <slot name="left" :data="item" />
              </template>
            </li>
          </ul>
        </main>
      </div>
      <div class="right">
        <header v-if="!isH5">{{ title }}</header>
        <ul class="list" v-show="resultShow">
          <p v-if="selectedList.length > 0 && !isH5">
            {{ $t('component.已选中') }}{{ selectedList.length }}{{ $t('component.人') }}
          </p>
          <li class="list-item space-between" v-for="(item, index) in selectedList" :key="index">
            <aside>
              <template v-if="!isCustomItem">
                <img
                  class="avatar"
                  :src="item?.avatar || 'https://web.sdk.qcloud.com/component/TUIKit/assets/avatar_21.png'"
                  onerror="this.src='https://web.sdk.qcloud.com/component/TUIKit/assets/avatar_21.png'"
                />
                <span v-if="!isH5">{{ item.nick || item.userID }}</span>
              </template>
              <template v-else>
                <slot name="right" :data="item" />
              </template>
            </aside>
            <i class="icon icon-cancel" @click="selected(item)" v-if="!isH5"></i>
          </li>
        </ul>
        <footer>
          <button class="btn btn-cancel" @click="cancel">{{ $t('component.取消') }}</button>
          <button v-if="selectedList.length > 0" class="btn" @click="submit">{{ $t('component.完成') }}</button>
          <button v-else class="btn btn-no" @click="submit">{{ $t('component.完成') }}</button>
        </footer>
      </div>
    </main>
  </div> -->

</template>

<script>
import { defineComponent, reactive, watchEffect, toRefs, computed,ref, onMounted } from 'vue';
import { SearchOutlined } from '@ant-design/icons-vue'
import { appStore } from '../../../../store'
import _ from 'lodash-es'

export default defineComponent({
  props:[
    'isH5',
  ],

  // props: {
  //   list: {
  //     type: Array,
  //     default: () => [],
  //   },
  //   selectedList: {
  //     type: Array,
  //     default: () => [],
  //   },
  //   isSearch: {
  //     type: Boolean,
  //     default: () => true,
  //   },
  //   isRadio: {
  //     type: Boolean,
  //     default: () => false,
  //   },
  //   isCustomItem: {
  //     type: Boolean,
  //     default: () => false,
  //   },
  //   title: {
  //     type: String,
  //     default: () => '',
  //   },
  //   type: {
  //     type: String,
  //     default: () => '',
  //   },
  //   isH5: {
  //     type: Boolean,
  //     default: () => false,
  //   },
  //   resultShow: {
  //     type: Boolean,
  //     default: () => true,
  //   },
  // },

  components:{ SearchOutlined },

  setup(props, ctx){
    const friendValue = ref('')
    const data = reactive({
      addFriendLists:[],
      simpleImage:'/img/state/null.png', // 空状态图片
      friendLists:[], // 获取好友列表进行比较
    })

    const infoStore = appStore()  // 获取state用户信息
    const isSelfUid = infoStore.$state.userInfo.uid  // 是否为自己的uid

    const TIM = window.$TUIKit.TIM  // 大tim

    const closeAddFriend = () =>{  // 关闭添加好友弹窗
      ctx.emit('close')
    }

    const handleInput = async () => {   // 好友搜索

      if(parseInt(friendValue.value) === isSelfUid){
        return
      }else{
        const val = friendValue.value
        console.log(val);
        const imResponse = await  window.$chat.getUserProfile({userIDList:[`${val}`]})
        data.addFriendLists = imResponse.data
      }

    }

    const addFriendButton = async (item) =>{  // 点击添加好友按钮

      const option = {
        to:item.userID,
        type:TIM.TYPES.SNS_ADD_TYPE_BOTH,
        source: 'AddSource_Type_Web',
        remark:item.nick
      }

      await window.$chat.addFriend(option)
      ctx.emit('close')
    }



    const isFriend = computed(()=>{
      const index = _.find(data.friendLists,function(o){ return o.userID === friendValue.value })
      if(index){
        return true
      }else{
        return false
      }
    })

    const loadFriend = async () => {   // 加载获取好友列表
      const res = await window.$chat.getFriendList()
      data.friendLists = res.data
    }

    onMounted(loadFriend)



    return{
      friendValue,...toRefs(data),isFriend,

      handleInput,closeAddFriend,addFriendButton,loadFriend,
    }
  }








  // methods:{
  //   closeGroup(){
  //     this.$emit('close')
  //   }
  // },

  // setup(props, ctx) {
  //   const data = reactive({
  //     type: '',
  //     list: [],
  //     selectedList: [],
  //     isSearch: true,
  //     isCustomItem: false,
  //     title: '',
  //   });

  //   watchEffect(() => {
  //     if (props.isCustomItem) {
  //       for (let index = 0; index < props.list.length; index++) {
  //         if (props.list[index].conversationID.indexOf('@TIM#SYSTEM') > -1) {
  //           // eslint-disable-next-line vue/no-mutating-props
  //           props.list.splice(index, 1);
  //         }
  //         data.list = props.list;
  //       }
  //     } else {
  //       data.list = props.list;
  //     }
  //     data.selectedList = props.selectedList;
  //     data.isSearch = props.isSearch;
  //     data.isCustomItem = props.isCustomItem;
  //     data.title = props.title;
  //     data.type = props.type;
  //   });

  //   // 可选项
  //   const optional = computed(() => data.list.filter((item) => !item.isDisabled));

  //   const handleInput = (e) => {
  //     ctx.emit('search', e.target.value);
  //   };

  //   const selected = (item) => {
  //     if (item.isDisabled) {
  //       return;
  //     }
  //     let list = data.selectedList;
  //     const index = list.indexOf(item);
  //     if (index > -1) {
  //       return data.selectedList.splice(index, 1);
  //     }
  //     if (props.isRadio) {
  //       list = [];
  //     }
  //     list.push(item);
  //     data.selectedList = list;
  //   };

  //   const selectedAll = () => {
  //     if (data.selectedList.length === optional.value.length) {
  //       data.selectedList = [];
  //     } else {
  //       data.selectedList = [...optional.value];
  //     }
  //   };

  //   const submit = () => {
  //     ctx.emit('submit', data.selectedList);
  //   };

  //   const cancel = () => {
  //     ctx.emit('cancel');
  //   };

  //   return {
  //     ...toRefs(data),
  //     optional,
  //     handleInput,
  //     selected,
  //     selectedAll,
  //     submit,
  //     cancel,
  //   };
  // }
})
</script>

<style lang="scss" scoped src="./style/transfer.scss"></style>
<style lang="scss" scoped>
.font-16{

  font-size: 16px;
  font-weight: 500;
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

.font-400{

  font-size: 16px;
  font-weight: 400;
}

:deep(.ant-input-affix-wrapper){
  border: 1px solid var(--divider) !important;
  background: var(--secondary-bg) !important;
  cursor: pointer;
}

.font-14{

  font-size: 14px;
  font-weight: 400;
}

:deep(.ant-input){
  color: var(--secondary-text) !important;
  font-size: 1.15em;
  &::placeholder{
    color: var(--secondary-text) !important;
  }
}

.top-close{
  width: 100%;
  height: 48px;
  padding: 12px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  >div:nth-of-type(2){
    position: absolute;
    right: 12px;
  }
}
</style>
