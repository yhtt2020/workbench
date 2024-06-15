<template>
  <xt-container
    v-model:customSize="customData.customSize"
    :header="header"
    :options="options"
    :sizeList="sizeList"
    :customData="customData"
    :customIndex="customIndex"
    :envLimit="['guest', 'offline']"
    :desk="desk"
    @delete="deleteCard"
  >
    <div class="flex flex-col mt-1 overflow hot-box" style="height: 95%">
      <vue-custom-scrollbar
        @touchstart.stop
        @touchmove.stop
        @touchend.stop
        :settings="settingsScroller"
        style="height: 100%"
      >
        <div
          v-for="item in hotList"
          :key="item.id"
          @click="jump(item.title)"
          class="flex items-center justify-between w-full rounded-lg pointer set-type"
          style="margin: 8px 0 8px"
        >
          <span class="sort">{{ item.id }}</span>
          <div class="flex items-center flex-1 ml-3">
            <div
              class="truncate"
              style="color: var(--primary-text); font-size: 16px"
              :style="
                customData.width === 2 ? 'max-width:390px' : 'max-width: 214px;'
              "
            >
              {{ item.title }}
            </div>
          </div>
          <div
            v-if="customData.width === 2"
            style="color: var(--secondary-text); font-size: 16px"
          >
            {{ fix(item.heat) }}
          </div>
        </div>
      </vue-custom-scrollbar>
    </div>
  </xt-container>
</template>

<script>
import Widget from "../card/Widget.vue";
import { mapActions, mapWritableState } from "pinia";
import { hotStore } from "../../store/hot";
import browser from "../../js/common/browser";
import { message } from "ant-design-vue";
import { Icon as newIcon } from "@iconify/vue";
import { communityNavStore } from "../bottomPanel/store/communityNavStore";

export default {
  name: "HotSearch",
  components: {
    Widget,
    newIcon,
  },
  props: {
    customIndex: {
      type: Number,
      default: 0,
    },
    customData: {
      type: Object,
      default: () => {},
    },
    desk: {
      type: Object,
    },
    openWay: {
      type: String,
      default: "desk",
    },
  },
  emit: ["delete"],
  data() {
    return {
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true,
      },
      sizeList: [
        { value: "2x4", name: "2x4" },
        { value: "4x4", name: "4x4" },
      ],
      hotList: [],
      refreshFlag: false,
    };
  },
  computed: {
    ...mapWritableState(hotStore, ["data"]),

    header() {
      return {
        title: "微博热搜",
        // ifyIcon:'ri:weibo-fill',
        showIcon:"/logo/weibo.svg",
        refresh:{
          state:this.refreshFlag ? true : false,
          fn:this.refreshNow,
          tip:'刷新',
        }
      }
    },
    options() {
      return {
        customDel: this.openWay === "nav" ? true : false,
        defaultData: {
          customSize: "2x4",
          _updateFlag: "24531",
        },
        disableEdit: this.isCommunityDesktop(this.desk),
        cardName: '微博热搜'
      };
    },
  },
  async mounted() {
    this.getData().then(() => {
      this.hotList = this.data;
    });
    if (this.customData.customSize === undefined) {
      this.customData.customSize = "2x4";
    }
    if (this.options.disableEdit) {
      this.sizeList = [];
    } else {
      this.sizeList = [
        { value: "2x4", name: "2x4" },
        { value: "4x4", name: "4x4" },
      ];
    }
  },

  methods: {
    ...mapActions(hotStore, ["getData", "refresh"]),
    ...mapActions(communityNavStore, ["isCommunityDesktop"]),

    deleteCard() {
      this.$emit("delete");
    },
    jump(words) {
      browser.openInUserSelect("https://s.weibo.com/weibo?q=" + words);
    },
    refreshNow() {
      this.refreshFlag = true;
      this.refresh();
      setTimeout(() => {
        this.refreshFlag = false;
        message.success({ content: "刷新榜单成功", key: "refreshWeibo" });
      }, 500);
    },
    fix(heat) {
      const display = heat.split(" ");
      if (display.length === 1) {
        return heat;
      }
      display[1] = (Number(display[1]) / 10000).toFixed(1) + "万";
      return display[0] + " " + display[1];
    },
  },
  watch: {
    customSize(newVal, oldVal) {
      this.customData.customSize = newVal;
    },
  },
};
</script>

<style scoped lang="scss">
// .hot-box{
//   height: 95%;
//   overflow-x: hidden;
//   overflow-y: auto;
// }
// .hot-box::-webkit-scrollbar{
//   display: none;
// }

.sort {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--mask-bg);
  border-radius: 4px;
  font-size: 16px;
  color: var(--primary-text);
  font-weight: 600;
}

.set-type:nth-of-type(1) > span {
  background: #fe2c46;
}

.set-type:nth-of-type(2) > span {
  background: #ff6600;
}

.set-type:nth-of-type(3) > span {
  background: #faaa10;
}

.active-index {
  background: var(--active-bg) !important;
}
</style>
