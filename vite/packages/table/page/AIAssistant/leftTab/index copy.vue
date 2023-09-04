<template>
  <xt-left-menu :list="menuList" last="1" end="2">
    <!--  -->
    <template #test>
      <setting-filled />
    </template>
  </xt-left-menu>

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
import { SettingFilled } from "@ant-design/icons-vue";
export default {
  components: {
    CreateTopic,
    Edit,

    SettingFilled,
  },
  computed: {
    ...mapWritableState(aiStore, [
      "selectTab",
      "isFull",
      "temperature",
      "count",
    ]),
  },
  data() {
    return {
      select: "Chat",
      menuList: [
        {
          icon: "message",
          // img: "/icons/bg.png",
          callBack: () => {
            this.selectTab = "Chat";
          },
        },
        // {
        //   slot: "test",
        //   callBack: () => {
        //     this.createChatVisible = true;
        //   },
        // },
        {
          flag: true,
          icon: "tianjia2",
          // img: "/img/task/star.png",

          callBack: () => {
            this.createChatVisible = true;
          },
        },
        {
          flag: true,
          icon: "setting",
          callBack: () => {
            this.setVisible = true;
          },
          children: [
            {
              icon: "message",
              name: "message",
              callBack: () => {
                this.selectTab = "Chat";
              },
            },
            {
              icon: "message",
              name: "message",
              callBack: () => {
                this.selectTab = "Chat";
              },
            },
          ],
        },
      ],
      setVisible: false,
      createChatVisible: false,
    };
  },
};
</script>

<style lang="scss" scoped></style>
