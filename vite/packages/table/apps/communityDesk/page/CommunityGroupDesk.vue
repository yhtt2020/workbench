<!-- 社群桌面 -->
<template>
  <!-- 社群桌面模块 -->
  <template v-if="!communityVisible">
    <DeskDetailPage
      :currentDeskId="currentDeskId"
      :settings="settings"
      :desk-list="deskList"
      :showTabs="showTabs"
      :showTopBar="showTopBar"
      :showTools="showTools"
      @updateCurrentDesk="updateId"
      @add="doAddDesk"
    />
  </template>

  <!-- 社群桌面空时,引导创建桌面弹窗 -->
  <CreateDeskModal ref="createDeskRef" @createDesk="doAddDesk('空白桌面')" />
</template>

<script>
import { nanoid } from "nanoid";
import { mapActions, mapWritableState } from "pinia";
import { deskTemplates } from "../../../js/data/deskTemplates";

// page文件
import CreateDeskModal from "../components/CreateDeskModal.vue";
import DeskDetailPage from "./deskDetail/DeskDetailPage.vue";

// store文件
import { communityNavStore } from "../../../components/bottomPanel/store/communityNavStore";

export default {
  name: "CommunityGroupDesk",

  emits: ["update:currentDeskId"],

  props: {
    // 桌面设置
    settings: {
      type: Object,
      default: {},
    },
    // 桌面列表
    deskList: {
      type: Array,
      default: [],
    },
    //是否显示tabs
    showTabs: {
      type: Boolean,
      default: true,
    },
    //是否显示顶部栏
    showTopBar: {
      type: Boolean,
      default: true,
    },
    //是否显示工具栏
    showTools: {
      type: Boolean,
      default: true,
    },
    // 当前桌面id
    currentDeskId: {
      type: String,
      default: "0",
    },
    // 用于切换桌面
    communityVisible: {
      type: Boolean,
      default: true,
    },
  },

  components: {
    CreateDeskModal,
    DeskDetailPage,
  },

  data() {
    return {
      // 桌面标题
      deskTitle: "",
      // 当前选中桌面
      selectDesk: { title: "日常桌面", name: "daily" },
    };
  },

  computed: {
    ...mapWritableState(communityNavStore, ["currentCommunity"]),

    communityInfo() {
      return this.currentCommunity?.item;
    },
  },

  mounted() {
    // 开启社群桌面引导创建弹窗
    this.$bus.on("openCommunityDesk", () => {
      this.$nextTick(() => {
        this.$refs.createDeskRef?.openCommunityDeskModal();
      });
    });
  },

  methods: {
    // 社群桌面引导弹窗创建桌面方法
    doAddDesk(deskName) {
      if (deskName) {
        this.deskTitle = deskName;
      }
      if (this.deskTitle.trim() === "") {
        message.error("请输入新桌面名称");
        return;
      }
      if (this.deskTitle.length >= 16) {
        message.error("新桌面名称长度不可超过16");
        return;
      }
      let desk = {
        name: this.deskTitle,
        id: nanoid(4),
        icon: "desktop",
        cards: this.cleanMuuriData(deskTemplates[this.selectDesk.name]),
        communityNo: this.communityInfo?.no,
        communityDeskId: `${this.communityInfo?.no}_${nanoid(4)}`,
      };
      if (deskName) {
        desk.cards = [];
      }
      this.deskList.unshift(desk);
      this.$emit("changeDesk", { id: desk.id });
      this.deskTitle = "";
    },

    // 解决桌面卡片数据重置
    cleanMuuriData(list) {
      list.forEach((li) => {
        li.id = nanoid(8);
        delete li["_$muuri_id"];
      });
      return [...list];
    },
    // 更新当前桌面id
    updateId(id) {
      this.$emit("update:currentDeskId", id);
      this.$emit("changeDesk", { id: id });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>