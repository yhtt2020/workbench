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
    <div class="box-flex">
      <div>{{ this.history?.date }}</div>
      <div>{{ this.history?.title }}</div>
    </div>
  </xt-container>
</template>

<script>
import { CalendarOutlined } from "@ant-design/icons-vue";
import { mapActions,mapWritableState } from "pinia";
import Widget from "../../card/Widget.vue";
import { Icon } from "@iconify/vue";
import { getHistoryInfo } from "../../../store/historyInfo";
import { communityNavStore } from "../../bottomPanel/store/communityNavStore";

export default {
  components: {
    Widget,
    Icon,
    CalendarOutlined,
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
  emit: ["delete"],
  data() {
    return {
      loading: false,
      history: {
        date: "",
        tetle: "",
      },
      timer: "12",
    };
  },
  mounted() {
    this.customData.customSize = "2x2";
    this.onHistoryMessage();
    // 设置一次性定时器 当天12点过后自动触发事件
    let now = new Date();
    var midnight = new Date();
    midnight.setHours(23, 59, 59, 999); // 设置时间为今天的最后一秒
    var remainingTime = midnight.getTime() - now.getTime(); // 计算剩余时间戳
    this.timer = setTimeout(() => {
      this.onHistoryMessage();
    }, remainingTime);
  },
  // 组件卸载后 清除定时器
  unmounted() {
    clearTimeout(this.timer);
  },
  methods: {
    ...mapActions(communityNavStore,['isCommunityDesktop']),


    // 获取今天所发生的的事情
    async onHistoryMessage() {
      if (!this.loading) {
        this.loading = true;
        await getHistoryInfo("/app/juhe/get").then((res) => {
          let random = Math.floor(Math.random() * res.length);
          this.history = res[random];
          this.loading = false;
        });
      }
    },
    // 自定义删除卡片
    deleteCard() {
      this.$emit("delete");
    },
  },
  computed: {
    header() {
      return {
        title: "历史上的今天",
        // ifyIcon:"fluent:clock-12-regular",historyInfo
        showIcon:"/logo/clock.svg",
        refresh: {
          fn: this.onHistoryMessage,
          tip: "刷新",
          state: this.loading ? true : false,
        },
      };
    },
    options() {
      return {
        customDel: this.openWay === "nav" ? true : false,
        disableEdit:this.isCommunityDesktop(this.desk),
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.icon {
  width: 20px;
  height: 20px;
  position: relative;
  top: -22px;
  left: 0;
}
:deep(.anticon svg) {
  width: 18px !important;
  height: 18px !important;
}
.box-flex {
  display: flex;
  flex-direction: column;
  width: 240px;
  height: 150px;
  position: relative;
  top: 2px;
  font-size: 24px;
  font-family: "优设标题黑";
  text-align: center;
  justify-content: space-evenly;
}
.box-flex div {
  padding: 0 5px;
  margin-top: -5px;
  white-space: pre-wrap;
}
@font-face {
  font-family: "优设标题黑";
  src: url("../../../../../public/font/优设标题黑.ttf");
}

.refresh {
  position: relative;
  top: 4px;
}
</style>
