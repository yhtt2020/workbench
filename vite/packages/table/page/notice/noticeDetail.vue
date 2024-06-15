<template>
  <div
    class="w-full h-full flex items-center justify-center"
    v-if="list.length === 0"
  >
    <EmptyStatus text="暂时没有消息通知" />
  </div>
  <div
    class="w-full flex-1 px-3 xt-text"
    v-else
    style="height: calc(100% - 63px)"
  >
    <vue-custom-scrollbar :settings="settingsScroller" style="height: 100%">
      <div v-for="item in displayList" class="mb-3">
        <xt-menu name="name" @contextmenu="revID = item" :menus="menus">
          <div class="w-full h-full flex flex-col p-4 xt-bg-2 rounded-xl">
            <!-- 标题 -->
            <div class="flex justify-between mb-3">
              <div class="flex">
                <a-avatar
                  :size="24"
                  shape="square"
                  :src="item?.content?.icon ? item?.content?.icon : item?.icon"
                ></a-avatar>
                <div class="font-16 font-400 xt-font xt-text ml-3">
                  {{ item?.content?.title ? item?.content?.title : item?.title }}
                </div>
              </div>
              <xt-button
                w="21"
                h="21"
                @click="delSingleHistoryNotice(item)"
                v-if="item.type !== 'push'"
              >
                <div class="flex items-center justify-center">
                  <DetailIcon
                    icon="akar-icons:circle-x-fill"
                    class="category-button pointer"
                    style="font-size: 1.25rem; color: var(--secondary-text)"
                  />
                </div>
              </xt-button>
            </div>

            <!-- 内容 -->
            <div class="font-16 font-400 xt-font xt-text mb-2">
              <NoticeBody :noticeContent="item"></NoticeBody>
            </div>
            
            <!-- 查看按钮 -->
            <div class="flex justify-between">
              <div
                class="flex items-center justify-center xt-font"
                style="color: var(--disable-text)"
              >
                {{ item?.content?.time ?  formatTime(item?.content?.time) : formatTime(item?.time)}}
              </div>
              <div class="flex flex-end gap-2">
                <UrlButtons
                  @viewNow="reviewMessage(item)"
                  :urls="item.urls"
                ></UrlButtons>
              </div>
            </div>
          </div>
        </xt-menu>
      </div>
      <div style="height: 12px"></div>
    </vue-custom-scrollbar>
  </div>
</template>

<script>
import { mapActions, mapWritableState } from "pinia";
import { formatTime } from "../../util";
import { Icon as DetailIcon } from "@iconify/vue";
import { chatStore } from "../../store/chat";
import { noticeStore } from "./store/noticeStore";
import { TUIConversationService } from "@tencentcloud/chat-uikit-engine";

import EmptyStatus from "../../apps/chat/page/empty/EmptyStatus.vue";
import UrlButtons from "./part/UrlButtons.vue";
import NoticeBody from "./part/NoticeBody.vue";


export default {
  props: ["list", "type"],

  components: {
    NoticeBody,
    UrlButtons,
    DetailIcon,
    EmptyStatus,
  },

  data() {
    return {
      revID: "",
      menus: [
        {
          name: "打开应用",
          callBack: () => {},
          newIcon: "fluent:open-20-filled",
        },
        {
          name: "删除通知",
          callBack: (item) => {
            // console.log("删除", this.revID);
            this.delSingleHistoryNotice(this.revID);
          },
          newIcon: "akar-icons:trash-can",
        },
      ],
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true,
      },
    };
  },

  computed: {
    filterList() {
      // return this.list
      // if(this.type === 'system'){
      //   return this.list
      // }else{
      //   const messageList = this.list.filter((item)=>{
      //     if(item.content.type === 'message'){
      //       return item
      //     }
      //   })
      //   return messageList
      // }
    },
    displayList() {
      if (this.list) {
        return this.list.map((item) => {
          if (item.content.urls) {
            var urls = JSON.parse(item.content.urls);
          } else {
            urls = [];
          }
          return {
            ...item,
            urls,
          };
        });
      } else {
        return [];
      }
    },
  },

  methods: {
    formatTime,
    ...mapActions(chatStore, ["updateConversation"]),
    ...mapActions(noticeStore, ["delSingleHistoryNotice", "clear"]),
    // 消息详情查看
    reviewMessage(data) {
      if(data?.content?.conversationID){
        this.updateConversation(data?.content?.conversationID), 
        this.$router.push({ name: "chatMain" });
        TUIConversationService.switchConversation(data?.content?.conversationID);
      }
      this.$emit("close");
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
