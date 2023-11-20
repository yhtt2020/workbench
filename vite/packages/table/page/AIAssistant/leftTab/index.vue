<template>
   <xt-left-menu :list="menuList" last="1" end="3" model="id">
    <template #test>
      <xt-button @click="showRightPanel = !showRightPanel">Toggle Right Panel</xt-button>
    </template>
    <slot></slot>
  </xt-left-menu>

  <!-- 新建对话  -->
  <xt-old-modal v-model="createChatVisible"  title="新建模板"  :isFooter="false">
    <CreateTopic @close="createChatVisible = false"></CreateTopic>
  </xt-old-modal>
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
      showRightPanel: false,
      select: "Chat",
      menuList: [
        {
          icon: "message",
          // float: 'test',
          callBack: () => {
            this.selectTab = "Chat";
          },
        },
        // {
        //   icon: "message",
        //   float: "test",
        //   callBack: () => {
        //     this.selectTab = "Chat";
        //   },
        // },
        {
          full: true,
        },
        {
          flag: true,
          icon: "tianjia2",
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
        },
      ],
      setVisible: false,
      createChatVisible: false,
    };
  },
};
</script>
<style lang="scss" scoped>
</style>
