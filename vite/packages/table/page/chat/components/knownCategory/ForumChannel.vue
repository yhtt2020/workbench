<template>
  <div class="flex flex-col my-3" style="width: 500px">
    <ModalTop back="true" title="选择社区版块" @close="closeChannel" @back="backChannel"/>
    <div class="flex flex-col px-6">
      <span class="px-4 font-16 font-400 mb-4 xt-text">我创建的版块({{forumList.length}})</span>
      <vue-custom-scrollbar :settings="settingsScroller" style="height: 300px;">
        <div v-for="(item,index) in forumList" class="flex items-center xt-bg-2 mb-3 pointer p-5 rounded-lg" 
         :class="{'select-bg':selectIndex === index}" @click="selectForum(index,item)"
        >
         <a-avatar :size="40" shape="square" :src="item.logo"></a-avatar>
         <span class="font-16 font-400 xt-text ml-3 xt-font">{{ item.name }}</span>
        </div>
      </vue-custom-scrollbar>
      <div class="mt-4 flex items-center justify-end">
        <xt-button w="64" h="40" class="mr-3 category-button" @click="closeChannel">取消</xt-button>
        <xt-button w="64" h="40" class="category-button" type="theme" @click="createForumChannel">确定</xt-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapWritableState } from "pinia";
import { Icon as ForumIcon } from "@iconify/vue";
import { forumStore } from "../../store/forumStore";
import { communityStore } from "../../store/communityStore";
import { channelClass } from "../../../../js/chat/createChannelClass";
import { message } from "ant-design-vue";

import ModalTop from '../ModalTop.vue';

export default {
  props: ["id", "no"],

  components: {
    ForumIcon,ModalTop
  },

  data() {
    return {
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true,
      },
      selectIndex: -1,
      selectForumItem: "",
    };
  },

  computed: {
    ...mapWritableState(forumStore, ["forumList"]),
  },

  async mounted() {
    await this.getForumData();
  },

  methods: {
    ...mapActions(forumStore, ["getForumData"]),
    closeChannel() {
      this.$emit("close");
    },
    backChannel() {
      this.$emit("back");
    },
    selectForum(index, item) {
      if (this.selectIndex === index) {
        this.selectIndex = -1;
        this.selectForumItem = "";
      } else {
        this.selectIndex = index;
        this.selectForumItem = item;
      }
    },
    async createForumChannel(evt) {
      if (this.selectIndex !== -1 && this.selectForumItem !== "") {
        const option = {
          type: "forum",
          id: this.id,
          no: this.no,
          content: {
            name: this.selectForumItem.name,
            props: this.selectForumItem,
          },
        };
        channelClass.secondaryChannel(option);
        message.success('版块关联成功');
        this.closeChannel()
      }else{
        message.warning('版块关联参数必须填完整')
        evt.preventDefault();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.select-bg {
  background: var(--active-secondary-bg) !important;
  border: 1px solid var(--active-bg) !important;
}
</style>
