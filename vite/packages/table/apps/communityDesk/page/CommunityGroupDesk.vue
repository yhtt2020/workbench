<template>
  <!-- 桌面渲染页面 -->
  <DeskDetailPage
    v-if="!communityVisible"
    :currentDeskId="currentDeskId"
    :settings="settings"
    :desk-list="desks"
    :showTabs="showTabs"
    :showTopBar="showTopBar"
    :showTools="showTools"
    @updateCurrentDesk="updateId"
    @add="doAddDesk"
  />

  <!-- 导入已有桌面的弹窗组件 -->
  <ExistDesktop ref="existDesktopRef" />
</template>

<script>
import { nanoid } from "nanoid";
import { mapActions, mapWritableState } from "pinia";
import { deskTemplates } from "../../../js/data/deskTemplates";

// store文件
import { homeStore } from "../../../store/home";
import { cardStore } from "../../../store/card";
import { communityNavStore } from "../../../components/bottomPanel/store/communityNavStore";

// page文件
import DeskDetailPage from "./deskDetail/DeskDetailPage.vue";
import ExistDesktop from "../components/ExistDesktop .vue";

export default {
  name: "CommunityGroupDesk",

  emits: ["update:currentDeskId", "showMore"],

  props: {
    // 配置项
    settings: {
      type: Object,
      default: () => {},
    },
    // 桌面数据
    deskList: {
      type: Array,
      default: () => [],
    },
    // 切换个人和社群桌面
    communityVisible: {
      type: Boolean,
      default: false,
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
    },
  },

  components: {
    DeskDetailPage,
    ExistDesktop,
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
    ...mapWritableState(homeStore, ["currentDeskId"]),
    ...mapWritableState(cardStore, ["settings", "desks"]),
    ...mapWritableState(communityNavStore, ["currentCommunity"]),

    communityInfo() {
      return this.currentCommunity?.item;
    },
  },

  mounted() {
    // 触发管理员创建默认空桌面
    this.$bus.on("openCommunityDesk", () => {
      this.$nextTick(() => {
        this.doAddDesk("空白桌面");
      });
    });

    // 
    this.$bus.on("openExistDeskListModal",() => {
      this.$nextTick(()=>{
        this.$refs.existDesktopRef?.openExistDeskModal();
      })
    })

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
      };
      if (deskName) {
        desk.cards = [];
      }
      this.deskList.unshift({...desk,communityDeskId: `${this.communityInfo?.no}_${desk?.id}`,});
      this.$emit("changeCommunityDesk", { id: desk.id });
      this.deskTitle = "";
    },

    // 更新桌面id
    updateId(id) {
      this.$emit("update:currentDeskId", id);
      this.$emit("changeCommunityDesk", { id: id });
    },

    // 解决桌面卡片数据重置
    cleanMuuriData(list) {
      list.forEach((li) => {
        li.id = nanoid(8);
        delete li["_$muuri_id"];
      });
      return [...list];
    },

  },
};
</script>

<style scoped>
</style>