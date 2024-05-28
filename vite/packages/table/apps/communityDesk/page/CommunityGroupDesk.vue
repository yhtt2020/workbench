<template>
  <!-- 桌面渲染页面 -->
  <DeskDetailPage
    :currentDeskId="currentDeskId"
    :settings="settings"
    :desk-list="desks"
    :showTabs="showTabs"
    :showTopBar="showTopBar"
    :showTools="showTools"
    @updateCurrentDesk="updateId"
    @add="doAddDesk"
  />

  <!-- 社群桌面空时,引导创建桌面弹窗 -->
  <CreateDeskModal ref="createDeskRef" @createDesk="doAddDesk('空白桌面')" />
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
import CreateDeskModal from "../components/CreateDeskModal.vue";
import DeskDetailPage from "./deskDetail/DeskDetailPage.vue";

export default {
  name: "CommunityGroupDesk",

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
    ...mapWritableState(homeStore, ["currentDeskId"]),
    ...mapWritableState(cardStore, ["settings", "desks"]),
    ...mapWritableState(communityNavStore, ["currentCommunity"]),

    communityInfo() {
      return this.currentCommunity?.item;
    },
  },

  props: {
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
      this.desks.unshift(desk);
      this.$bus.emit('changeCurrentDesk',{id:desk.id});
      this.deskTitle = "";
    },

    // 更新桌面id
    updateId(id){
      this.currentDeskId = id;
      this.$bus.emit('changeCurrentDesk',{id:id});
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