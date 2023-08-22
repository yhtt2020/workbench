<template>
  <div class="flex justify-between flex-col items-center">
    <xt-tab
      :list="tabList"
      v-model="selectTab"
      mode="col"
      placement="right"
      itemClass="h-16 w-16"
    ></xt-tab>
    <div>
      <xt-icon
        w="40"
        icon="tianjia2"
        size="20"
        @click="createChatVisible = true"
      ></xt-icon>
      <xt-icon icon="setting" @click="setVisible = true"></xt-icon>
      <xt-drawer title="12" v-model="setVisible" placement="right">
        <Edit></Edit>
      </xt-drawer>
      <XtView
        v-model="createChatVisible"
        type="popup"
        title="新建模板"
        :showFull="false"
      >
        <CreateTopic @close="createChatVisible = false"></CreateTopic>
      </XtView>
    </div>
  </div>
</template>

<script>
import CreateTopic from "../chat/left/createTopic.vue";
import { mapWritableState } from "pinia";
import { aiStore } from "../../../store/ai";
import Edit from "./edit.vue";
export default {
  components: {
    CreateTopic,
    Edit,
  },
  computed: {
    ...mapWritableState(aiStore, [
      "selectTab",
      "isFull",
      "temperature",
      "count",
    ]),
    showName() {
      return this.isFull ? false : true;
    },
    widthStyle() {
      if (this.isFull) {
        return {
          width: "60px",
        };
      } else {
        return {
          width: "150px",
        };
      }
    },
  },
  data() {
    return {
 
      setVisible: false,
      createChatVisible: false,
      tabList: [
        {
          tip: "对话聊天",
          icon: "message",
          value: "Chat",
        },
        // {
        //   name: "推荐模板",
        //   icon: "wanggeshitu",
        //   value: "Mode",
        // },
        {
          tip: "我的账号",
          icon: "setting",
          value: "Account",
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped></style>
