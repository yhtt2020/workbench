<template>
  <Modal v-if="visible" :visible="visible">
    <div class="flex flex-col rounded-lg" style="padding:12px; width:650px;height:534px;background: var(--modal-bg);">
      <div class="w-full h-12 flex items-center justify-center mb-4" style="position:relative;">
        <div class="w-full h-12 flex items-center justify-center font-16" style="color:var(--primary-text)">
          分享{{ alias }}
        </div>
        <div class="close-button active-button pointer flex rounded-lg items-center justify-center  "
             style="background: var(--secondary-bg);" @click="closeForwardModal"
        >
          <CloseOutlined style="font-size: 1.5em;color:var(--secondary-text);"/>
        </div>
      </div>

      <div class="flex-grow flex justify-between w-full px-1">
        <div class="flex flex-col" style="width: 293px;">
          <a-input class="h-11" v-model:value="forwardText" placeholder="搜索好友、群聊"
                   style="color:var(--secondary-text);" @pressEnter="enterSearch" @change="search($event)">
            <template #suffix>
              <div class="flex items-center justify-center pointer active-button" @click="enterSearch">
                <SearchOutlined style="font-size: 1.5em;color:var(--secondary-text);"/>
              </div>
            </template>
          </a-input>
          <span class="font-400 my-3" style="color:var(--secondary-text);">最近聊天</span>
          <vue-custom-scrollbar :settings="settingsScroller" style="height: 350px;">
            <!-- :class="{'select-bg':isSelect(index)}" -->
            <div v-for="(item,index) in list" class="flex items-center rounded-lg p-3 pointer"
                 @click="selectItem(item)">
              <a-avatar shape="square" v-if="item.type === 'GROUP'" size="32"
                        :src="item?.groupProfile?.avatar"></a-avatar>
              <a-avatar v-else size="32" :src="item?.userProfile?.avatar"></a-avatar>
              <span class="ml-4" style="color: var(--primary-text);">{{
                  item.type === 'C2C' ? item?.userProfile?.nick : item?.groupProfile?.name
                }}</span>
            </div>
          </vue-custom-scrollbar>
        </div>

        <a-divider type="vertical" style="height: 100%; background-color:var(--divider);"/>

        <div class="flex flex-col" style="width: 293px;">
          <span class="font-400" style="color:var(--secondary-text);">已选({{ rightSelectList.length }}个)</span>
          <vue-custom-scrollbar :settings="settingsScroller" style="height: 371px;">
            <div class="flex flex-col">
              <div v-for="item in rightSelectList" class="flex justify-between p-3 pointer">
                <div class="flex tems-center">
                  <a-avatar shape="square" v-if="item.type === 'GROUP'" size="32"
                            :src="item?.groupProfile?.avatar"></a-avatar>
                  <a-avatar v-else size="32" :src="item?.userProfile?.avatar"></a-avatar>
                  <span class="ml-4" style="color: var(--primary-text);">{{
                      item.type === 'C2C' ? item?.userProfile?.nick : item?.groupProfile?.name
                    }}</span>
                </div>
                <div class="flex items-center justify-center pointer active-button" @click="cancelSelect(item)">
                  <MinusCircleOutlined style="color: var(--primary-text);"/>
                </div>
              </div>
            </div>
          </vue-custom-scrollbar>
          <div class="flex justify-end  h-12">
            <div class="flex items-center">
              <a-button class="rounded-lg"
                        style="background: var(--secondary-bg);color:var(--secondary-text);width:100px;height: 44px;"
                        @click="closeForwardModal">取消
              </a-button>
              <a-button class="ml-4 rounded-lg" type="primary" style="width:100px;height: 44px;color:var(--active-text);"
                        @click="doShare">分享
              </a-button>
            </div>
          </div>
        </div>
      </div>
    </div>

  </Modal>
</template>

<script>
import { defineComponent, onMounted, reactive, toRefs, computed } from 'vue'
import { CloseOutlined, SearchOutlined, MinusCircleOutlined } from '@ant-design/icons-vue'
import _ from 'lodash-es'
import { message } from 'ant-design-vue'
import Modal from '../../components/Modal.vue'
import TIM from '../../TUIKit/TUICore/tim'
import TencentCloudChat from 'tim-js-sdk'
// import { pinyin,match,toRaw } from 'pinyin-pro'
export default defineComponent({
  components: {
    Modal,
    CloseOutlined, SearchOutlined, MinusCircleOutlined

  },

  props: ['content', 'type', 'visible','alias'],

  setup (props, ctx) {
    const C2CType=TencentCloudChat.TYPES.CONV_C2C
    const GroupType=TencentCloudChat.TYPES.CONV_GROUP
    console.log(C2CType,GroupType)

    const data = reactive({
      list: [],
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
      rightSelectList: [], // 存放选中用户和群聊
      forwardText: '', // 转发搜索
      allList: []
    })

    // 获取会话列表
    const getForwardList = async () => {
      const list = window.$TUIKit.TUIServer.TUIConversation.store.conversationList
      const sortList = list.sort((a, b) => {
        return b.lastMessage.lastTime - a.lastMessage.lastTime
      })
      data.allList = sortList // 将所有的数据进行获取
      console.log('获取20条', sortList.slice(0, 20).length)
      data.list = sortList.slice(0, 20)  // 只获取20条
    }

    // 关闭转发对话框
    const closeForwardModal = () => {
      ctx.emit('close')
    }

    // 点击左侧选中
    const selectItem = (item) => {
      const index = _.findIndex(data.rightSelectList, function (o) { return o.conversationID === item.conversationID })
      if (index === -1) {
        data.rightSelectList.push(item)
      } else {
        return
      }
    }

    // 根据右侧选中内容进行左侧选中状态显示
    // const isSelect = (index) =>{
    //  // console.log(data.rightSelectList.includes(index));
    //  // const indexStatus = _.findIndex(data.rightSelectList,function(o){ return o.conversationID === data.list[index].conversationID })
    //  // return indexStatus
    // }

    // 点击右侧取消选中
    const cancelSelect = (item) => {
      const index = _.findIndex(data.rightSelectList, function (o) {
        return o.conversationID === item.conversationID
      })
      data.rightSelectList.splice(index, 1)
    }

    // 点击转发按钮
    const forwardSend = async (e) => {
      if (data.rightSelectList.length !== 0) {
        for (let i = 0; i < data.rightSelectList.length; i++) {
          await forwardMessage(data.rightSelectList[i])
        }
        ctx.emit('close')
      } else {
        message.warn('请选择需要转发的群和用户')
        e.preventDefault()
      }
    }

    const doShare= async (e) => {
      if (data.rightSelectList.length !== 0) {
        for (let i = 0; i < data.rightSelectList.length; i++) {
          await shareContent(data.rightSelectList[i])
        }
        ctx.emit('close')
      } else {
        message.warn('请选择需要分享的群和用户')
        e.preventDefault()
      }
    }

    const shareContent=async (target)=>{
      console.log('触发分享',props.content,target)
      const messageContent={
        to: target.type === 'C2C' ? target.userProfile.userID : target.groupProfile.groupID,
        conversationType: `${target.type}`,
        payload:props.content
      }
      console.log('需要发送的消息',messageContent)
     let msg=  await window.$chat.createCustomMessage(messageContent)
      let promise =  window.$chat.sendMessage(msg);
      promise.then(function(imResponse) {
        // 发送成功
        message.success('转发成功')
      }).catch(function(imError) {
        // 发送失败
        message.error('转发失败')
      });
    }
    // 创建转发消息
    const forwardMessage = async (data) => {
      const option = {
        to: data.type === 'C2C' ? data.userProfile.userID : data.groupProfile.groupID,
        conversationType: `${data.type}`,
        payload: props.content
      }
      const r = await window.$chat.createForwardMessage(option)
      await window.$chat.sendMessage(r)
    }

    // 搜索
    const enterSearch = () => {
      data.list = []
      let searchResult = []
      if (data.forwardText === '') {
        return
      }

      // const forwardTextAsRaw = toRaw(data.forwardText);
      // const inputPinyin = pinyin(forwardTextAsRaw,{style:'NORMAL'})
      // console.log('输入的拼音',inputPinyin);
      searchResult = data.allList.filter(item => {
        // const text = item.type === 'C2C' ? item.userProfile.nick : item.groupProfile.name

        // // const itemPinyin = pinyin(item,{style:'NORMAL'})

        // return data.forwardText === text

        const text = item.type === 'C2C' ? item.userProfile.nick : item.groupProfile.name
        const id = item.type  === 'C2C' ? item.userProfile.userID : item.groupProfile.groupID

       // const namePinyin = pinyin(item.type === 'C2C' ? item.userProfile.nick : item.groupProfile.name,{
      //   style:pinyin.STYLE_NORMAL
      // })
      // console.log('过滤的拼音结果::>>',namePinyin);

      if(text.includes(data.forwardText)){
        return item
      }
       if(id.includes(data.forwardText)){
         return item
       }
      })
      // console.log('结果',searchResult);
      data.list = searchResult

    }

    // 实时搜索
    const search = () =>{
     if(data.forwardText.trim() === ''){
      getForwardList()
     }else{
      return;
     }
    }

    onMounted(() => {
      getForwardList()
    })
    return {
      ...toRefs(data),
      ...toRefs(props),
      doShare,
      getForwardList, closeForwardModal,
      selectItem, cancelSelect, forwardSend,
      forwardMessage, enterSearch,search,
      // isSelect,
    }
  }
})
</script>

<style lang="scss" scoped>
.close-button {
  position: absolute;
  right: 12px;
  width: 48px;
  height: 48px;
}

.active-button {
  &:active {
    filter: brightness(0.8);
    opacity: 0.8;
  }

  &:hover {
    opacity: 0.8;
  }
}

.font-16 {

  font-size: 16px;
  font-weight: 500;
}

:deep(.ant-input-affix-wrapper) {
  border-radius: 12px;
}

.font-400 {

  font-size: 16px;
  font-weight: 400;
}

.select-bg {
  background: var(--active-secondary-bg);
  border: 1px solid var(--active-bg);
}

:deep(.ant-btn) {
  border-radius: 8px;
}

:deep(.ant-input) {
  &::placeholder {
    color: var(--secondary-text) !important;
  }
}
</style>
