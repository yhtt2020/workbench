<template>
  <xt-container
    v-model:customSize="customData.customSize"
    :header="header"
    :customData="customData"
    :customIndex="customIndex"
    :options="options"
    ref="homelSlotRef"
    :desk="desk"
    :envLimit="['guest', 'offline', 'single']"
    @delete="deleteCard"
  >
    <div class="box-border">
      <div
        class="card-body"
        v-for="(value, index) in gameData.slice(0, 3)"
        :key="index"
        @click="jump(value.url)"
      >
        <div class="left-card">
          <div class="title-article xt-text">{{ value.title }}</div>
          <div class="message-article xt-text-2">{{ value.description }}</div>
          <div class="bottom-article" style="margin-top: 9px">
            <div class="time-article">{{ value.ctime }}</div>
            <div class="source-article">{{ value.source }}</div>
          </div>
        </div>
        <div class="right_card">
          <img class="img-article" :src="value.picUrl" alt="" />
        </div>
      </div>
    </div>
  </xt-container>
</template>

<script>
import axios from "axios";
import Widget from "../../card/Widget.vue";
import { Icon as MyIcon } from "@iconify/vue";
import { message } from "ant-design-vue";
import { getGameInfo } from "../../../store/gameInfomation";
import browser from "../../../js/common/browser";
import { mapActions,mapWritableState  } from "pinia";
import { communityNavStore } from "../../bottomPanel/store/communityNavStore";


export default {
  name: "gameInformation",
  components: {
    Widget,
    MyIcon,
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
    menuList: {
      type: Array,
    },
    desk: {
      type: Object,
    },
    editing: {
      type: Boolean,
    },
    openWay: {
      type: String,
      default: "desk",
    },
  },
  data() {
    return {
      gameData: [],
      customSize: "4x4",
      refreshFlag: false,
    };
  },
  mounted() {
    this.onGetInfo();
    this.customData.customSize = "4x4";
  },
  emit: ["delete"],
  methods: {
    ...mapActions(communityNavStore, ["isCommunityDesktop"]),

    // 自定义删除卡片
    deleteCard() {
      this.$emit("delete");
    },
    async onGetInfo() {
      let dataList = await getGameInfo("/app/juhe/get", 0);
      this.gameData = dataList;
    },
    jump(url) {
      // console.log("https:"+url);
      browser.openInUserSelect("https:" + url);
    },
    refreshNow() {
      this.refreshFlag = true;
      this.onGetInfo().then(() => {
        this.refreshFlag = false;
      });
    },
  },
  computed: {
    header() {
      return {
        title: "电竞资讯",
        // ifyIcon:'fluent:games-16-filled',
        showIcon:"/logo/news.svg",
        refresh: {
          fn: this.refreshNow,
          tip: "刷新",
          state: this.refreshFlag ? true : false,
        },
      };
    },
    options() {
      return {
        defaultData: {
          customSize: "4x4",
        },
        customDel: this.openWay === "nav" ? true : false,
        disableEdit:this.isCommunityDesktop(this.desk),
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.card > svg {
  width: 24px;
  height: 24px;
  position: absolute;
  top: 17px;
}
.box {
  overflow: hidden;
}
.card-body {
  position: relative;
  width: 544px;
  height: 110px;
  margin-top: 12px;
  margin-right: 14px;
  // border: 1px solid #fff;
  padding: 8px;
}
.left-card {
  width: 368px;
}
.title-article {
  width: 368px;
  height: 20px;
  font-size: 14px;
  color: #fff;
  opacity: 0.85;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-bottom: 8px;
  cursor: pointer;
}
.message-article {
  width: 368px;
  height: 40px;
  font-size: 14px;
  color: #fff;
  margin-top: 8p;
  opacity: 0.6;
  white-space: pre-wrap; /* 允许换行 */
  word-wrap: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  cursor: pointer;
}

.time-article {
  width: 107px;
  height: 17px;
  font-size: 12px;
  opacity: 0.4;
  float: left;
  cursor: pointer;
}

.source-article {
  font-size: 12px;
  max-width: 100px;
  height: 17px;
  opacity: 0.4;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  float: right;
  cursor: pointer;
}

.img-article {
  width: 148px;
  height: 94px;
  position: absolute;
  top: 10px;
  left: 384px;
  cursor: pointer;
  // border: 1px solid #fff;
}
</style>
