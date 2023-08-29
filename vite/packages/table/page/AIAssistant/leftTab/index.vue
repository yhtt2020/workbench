<template>
  <xt-left-menu :list="menuList" last="1" end="2"> </xt-left-menu>
  <!-- <home-outlined />
  <setting-filled />
  <smile-outlined />
  <sync-outlined spin />
  <smile-outlined :rotate="180" /> -->
  <!-- 新建对话 -->
  <XtView
    v-model="createChatVisible"
    type="popup"
    title="新建模板"
    :showFull="false"
  >
    <CreateTopic @close="createChatVisible = false"></CreateTopic>
  </XtView>
  <!-- 系统设置 -->
  <xt-drawer title="12" v-model="setVisible" placement="right">
    <template #title>
      <div>设置</div>
    </template>
    <Edit></Edit>
  </xt-drawer>
</template>

<script>
import CreateTopic from "../chat/left/createTopic.vue";
import { mapWritableState } from "pinia";
import { aiStore } from "../../../store/ai";
import Edit from "./edit.vue";
// import {
//   HomeOutlined,
//   SettingFilled,
//   SmileOutlined,
//   SyncOutlined,
// } from "@ant-design/icons-vue";
export default {
  components: {
    CreateTopic,
    Edit,

    // HomeOutlined,
    // SettingFilled,
    // SmileOutlined,
    // SyncOutlined,
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
      select: "Chat",
      menuList: [
        {
          icon: "message",
          callBack: () => {
            this.selectTab = "Chat";
          },
        },

        {
          icon: "tianjia2",
          callBack: () => {
            this.createChatVisible = true;
          },
        },
        {
          icon: "setting",
          callBack: () => {
            this.setVisible = true;
          },
        },
      ],
      setVisible: false,
      createChatVisible: false,
    };
  },
};
</script>

<style lang="scss" scoped></style>
