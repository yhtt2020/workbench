<template>
  <xt-container
    :header="header"
    :platLimit="['web']"
    :envLimit="['guest', 'offline', 'single']"
    :customData="customData"
    :customIndex="customIndex"
    :desk="desk"
    :sizeList="sizeList"
    :options="options"
    v-model:customSize="customData.customSize"
    ref="gameSmallSlot"
    :menuList="gameMiddleBare"
    @delete="deleteCard"
    @leftClick="goRoute"
  >
    <!-- 小尺寸-->
    <template v-if="customData.customSize === '2x4'">
      <MyGameSmallSize :gameClass="customData.id" :mySteamGameList="steamGameList"  :myOtherGameList="localGameList"   @import="openLocal"/>
    </template>

    <!-- 大尺寸-->
    <template v-else-if="customData.customSize === '4x4'">
      <MyGameLargeSize
        :gameClass="customData.id"
        :mySteamGameList="steamGameList"
        :myOtherGameList="localGameList"
        @import="openLocal"
      />
    </template>
  </xt-container>

  <HorizontalDrawer
    ref="myGameDrawer"
    :drawerTitle="'设置'"
    :rightSelect="showGameType"
    v-model:selectRegion="customData.id"
    @getArea="getGameType"
  />
</template>

<script>
import { mapActions, mapWritableState } from "pinia";
import { steamUserStore } from "../../../store/steamUser";

import HorizontalDrawer from "../../HorizontalDrawer.vue";
import MyGameLargeSize from "./components/MyGameLargeSize.vue";
import MyGameSmallSize from "./components/MyGameSmallSize.vue";

export default {
  name: "MyGameSmall",

  components: {
    HorizontalDrawer,
    MyGameLargeSize,
    MyGameSmallSize,
  },

  props: {
    customIndex: {
      type: Number,
      default: 0,
    },
    customData: {
      type: Object,
      default: () => {
        return {};
      },
    },
    desk: {
      type: Object,
    },
    openWay: {
      type: String,
      default: "desk",
    },
  },

  emits: ["delete"],

  data() {
    return {
      sizeList: [
        { value: "2x4", name: "2x4" },
        { value: "4x4", name: "4x4" },
      ],
      gameMiddleBare: [
        {
          icon: "shezhi1",
          title: "设置",
          fn: () => {
            this.$refs.myGameDrawer.openDrawer();
          },
        },
      ],
      showGameType: [
        { name: "Steam游戏，按最近游玩时间顺序展示", id: "steam" },
        {
          name: "其他游戏，按最近游玩时间顺序展示(正在开发中)",
          id: "other",
        },
      ],
    };
  },

  computed: {
    ...mapWritableState(steamUserStore, ["steamGameList", "localGameList"]),

    // 组件头部
    header() {
      return {
        title: this.myDetailShow === true ? "游戏详情" : "我的游戏",
        showIcon: "/logo/steam.svg",
        leftHover: true,
        leftHoverName: "打开应用",
        leftHoverIcon: "fluent:open-16-regular",
      };
    },
    // 组件配置项
    options() {
      return {
        customDel: this.openWay === "nav" ? true : false,
        cardName: "我的游戏",
      };
    },
  },

  methods: {
    // 删除卡片组件
    deleteCard() {
      this.$emit("delete");
    },
    async openLocal() {
      let openPath = await tsbApi.dialog.showOpenDialog({
        title: "选择导入的代码",
        filters: [{ name: "程序或者快捷方式", extensions: ["exe","url"] },{ name: "全部", extensions: ["*"] }],
        properties: ["multiSelections"],
      });
      console.log(openPath,'open')
      if (!openPath) {
        console.log('no openpath')
        return;
      }
      let dropFiles = await ipc.sendSync("getFilesIcon", {
        files: JSON.parse(JSON.stringify(openPath)),
      });
      console.log(dropFiles,'rop')
      this.modalVisibility = false;
      dropFiles.forEach((game) => {
        this.localGameList.unshift(game);
      });
    },
    // 进入我的游戏应用
    goRoute() {
      this.$router.push({
        name: "myGame",
      });
    },

    // 获取游戏类型
    getGameType(data) {
      this.customData.id = data.id;
    },
  },

  mounted() {
    if (this.customData.customSize === undefined) {
      this.customData.customSize = "2x4";
    } else if (this.customData.id === undefined) {
      this.customData.id = "steam";
    }
  },
};
</script>

<style lang="scss" scoped>
</style>
