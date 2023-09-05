<template>
  <div class="flex w-full h-full">
    <!--  -->
    <div class="flex flex-col px-3" :style="doubleCol ? { width: '336px' } : { width: '240px' }"
      style="border-right:1px solid var(--divider)">

      <div class="flex flex-col">
        <div class="flex justify-between mb-2.5">
          <span class="font-500" style="color:var(--primary-text);">想天工作台官方社群</span>
          <ChatDropDown @updatePage="updatePage" />
        </div>
        <div class="font-14" style="color:var(--secondary-text);">
          欢迎加入想天工作台官方社群，在这里您可以了解到和产品有关的一切
        </div>
      </div>

      <a-divider style="height: 1px;margin: 12px 0; background-color: var(--divider)" />

      <vue-custom-scrollbar :settings="settingsScroller" style="height: 100%;">
        <ChatFold title="常用">
          <div class="flex flex-col" v-if="doubleCol === false">
            <div class="flex items-center py-3 pointer" v-for="item in use">
              <template v-if="item.type === 'message'">
                <MessageOutlined style="color:var(--warning);font-size: 1.25em;" />
              </template>
              <template v-if="item.type === 'link'">
                <LinkOutlined style="color:var(--active-bg);font-size: 1.25em;" />
              </template>
              <span class="ml-3 font-16" style="color: var(--primary-text);">{{ item.title }}</span>
            </div>
          </div>
          <div class="flex grid grid-cols-2 gap-4" v-else>
            <div class="flex items-center py-3 pointer" v-for="item in use">
              <template v-if="item.type === 'message'">
                <MessageOutlined style="color:var(--warning);font-size: 1.25em;" />
              </template>
              <template v-if="item.type === 'link'">
                <LinkOutlined style="color:var(--active-bg);font-size: 1.25em;" />
              </template>
              <span class="ml-3 font-16" style="color: var(--primary-text);">{{ item.title }}</span>
            </div>
          </div>
        </ChatFold>

        <ChatFold title="产品相关">
          <div class="flex flex-col" v-if="doubleCol === false">
            <div class="flex items-center py-3 pointer" v-for="item in product">
              <template v-if="item.type === 'message'">
                <MessageOutlined style="color:var(--warning);font-size: 1.25em;" />
              </template>
              <template v-if="item.type === 'link'">
                <LinkOutlined style="color:var(--active-bg);font-size: 1.25em;" />
              </template>
              <template v-if="item.type === 'app'">
                <AppstoreOutlined style="color:var(--success);font-size: 1.25em;" />
              </template>
              <span class="ml-3 font-16" style="color: var(--primary-text);">{{ item.title }}</span>
            </div>
          </div>
          <div class="flex grid grid-cols-2 gap-4" v-else>
            <div class="flex items-center py-3 pointer" v-for="item in product">
              <template v-if="item.type === 'message'">
                <MessageOutlined style="color:var(--warning);font-size: 1.25em;" />
              </template>
              <template v-if="item.type === 'link'">
                <LinkOutlined style="color:var(--active-bg);font-size: 1.25em;" />
              </template>
              <template v-if="item.type === 'app'">
                <AppstoreOutlined style="color:var(--success);font-size: 1.25em;" />
              </template>
              <span class="ml-3 font-16" style="color: var(--primary-text);">{{ item.title }}</span>
            </div>
          </div>
        </ChatFold>

        <ChatFold title="交流群">
          <div class="flex flex-col" v-if="doubleCol === false">
            <div class="flex items-center py-3 pointer" v-for="item in talkGroup">
              <MessageOutlined style="color:var(--warning);font-size: 1.25em;" />
              <span class="ml-3 font-16" style="color: var(--primary-text);">{{ item.title }}</span>
            </div>
          </div>
          <div class="flex grid grid-cols-2 gap-4" v-else>
            <div class="flex items-center py-3 pointer" v-for="item in talkGroup">
              <MessageOutlined style="color:var(--warning);font-size: 1.25em;" />
              <span class="ml-3 font-16" style="color: var(--primary-text);">{{ item.title }}</span>
            </div>
          </div>
        </ChatFold>
      </vue-custom-scrollbar>

    </div>

    <div class="flex">
      <Commun></Commun>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs, ref } from 'vue'
import ChatDropDown from '../components/chatDropDown.vue'
import ChatFold from '../components/chatFold.vue'
import Commun from '../Commun.vue'
import { chatList } from '../../../js/data/chatList'
import { AppstoreOutlined, MessageOutlined, LinkOutlined } from '@ant-design/icons-vue'
import { chatStore } from '../../../store/chat'

export default defineComponent({

  components: {
    AppstoreOutlined, MessageOutlined, LinkOutlined,
    ChatDropDown,
    ChatFold,
    Commun
  },

  setup() {
    const chat = chatStore()

    const doubleCol = ref(chat.$state.settings.showDouble)
    const data = reactive({
      use: chatList.commonUse,
      product: chatList.productRelated,
      talkGroup: chatList.group,

      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      }
    })

    const updatePage = () => {
      doubleCol.value = chat.$state.settings.showDouble
    }

    return {
      doubleCol,
      ...toRefs(data), updatePage,
    }
  }
})
</script>

<style lang="scss" scoped>
.font-500 {
  font-family: PingFangSC-Medium;
  font-size: 16px;
  font-weight: 500;
}

.font-14 {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  font-weight: 400;
}

.font-16 {
  font-family: PingFangSC-Regular;
  font-size: 16px;
  font-weight: 400;
}
</style>