<template>
  <xt-left-menu v-model="select" :list="menuList" end="2"></xt-left-menu>
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
  <!-- <div class="flex justify-between flex-col items-center">
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
     
    </div>
  </div> -->
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
