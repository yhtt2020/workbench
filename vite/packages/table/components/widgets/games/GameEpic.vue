<template>
  <xt-container
    :header="header"
    v-model:customSize="customData.customSize"
    :customData="customData"
    :platLimit="['web']"
    :envLimit="['guest', 'offline', 'single']"
    :options="options"
    :customIndex="customIndex"
    :desk="desk"
    @delete="deleteCard"
  >
    <div class="flex items-center justify-center flex-col h-full">
      <xt-option-tab
        v-model="epicType"
        :list="epicTips"
        :circle="false"
        style="height: 40px;margin-bottom: 0 !important;"
      />

      <!-- 本周免费 -->
      <template v-if="epicType === 'now'">
        <TheWeekEpicDetail :thisList="epicData?.promotionalList"/>
      </template>

      <!-- 即将推出 -->
      <template v-else-if="epicType === 'next'">
        <NextWeekEpicDetail :nextList="epicData?.upcomingList"/>
      </template>
    </div>
  </xt-container>
</template>

<script>
import { mapWritableState, mapActions } from "pinia";
import { epicStore } from "../../../store/epicStore";
import { message } from "ant-design-vue";
import { communityNavStore } from "../../bottomPanel/store/communityNavStore";

import TheWeekEpicDetail from "./components/TheWeekEpicDetail.vue";
import NextWeekEpicDetail from "./components/NextWeekEpicDetail.vue";

export default {
  components: {
    TheWeekEpicDetail,
    NextWeekEpicDetail
  },

  props: ["desk", "customIndex", "customData", "openWay"],

  data() {
    return {
      epicTips: [
        { name: "限时免费", value: "now" },
        { name: "即将推出", value: "next" },
      ],
      epicType: "now",
      refreshFlag: false,
      env: {
        web: false,
        mobile: false,
        client: false,
        single: false,
      },
    };
  },

  computed: {
    ...mapWritableState(epicStore, ["epicData"]),
    header() {
      return {
        title: "Epic喜加一",
        // ifyIcon:'cib:epic-games',
        showIcon: "/logo/epic.svg",
        refresh: {
          fn: this.refreshNow,
          tip: "刷新",
          state: this.refreshFlag ? true : false,
        },
      };
    },
    options() {
      return {
        customDel: this.openWay === "nav" ? true : false,
        disableEdit: this.isCommunityDesktop(this.desk),
        cardName: "Epic喜加一",
      };
    },
  },

  mounted() {
    this.getEpicData();
    // if (Object.keys(this.epicData).length !== 0) {
    //   this.unPromotionList = this.epicData.unPromotionList;
    //   this.promotionList = this.epicData.promotionList;
    // }
    this.customData.customSize = "2x4";
  },
  emit: ["delete"],
  methods: {
    ...mapActions(epicStore, ["getEpicData", "refresh"]),
    ...mapActions(communityNavStore, ["isCommunityDesktop"]),

    deleteCard() {
      this.$emit("delete");
    },
    // 点击刷新
    refreshNow() {
      this.refreshFlag = true;
      this.refresh();
      setTimeout(() => {
        this.refreshFlag = false;
      }, 500);
    },

    enterWeek(item) {
      const data = {
        ...item,
        image: item.keyImages[0].url,
        price: item.price.totalPrice.fmtPrice.originalPrice,
        days: this.epicType.name === "week" ? item.days.end : item.days.start,
      };
      this.detailShow = true;
      this.detailList = data;
    },
    detailBack() {
      this.detailShow = false;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
