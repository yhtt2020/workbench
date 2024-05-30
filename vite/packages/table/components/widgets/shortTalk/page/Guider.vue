<template>
  <xt-container
    :header="header"
    v-model:customSize="customData.customSize"
    :envLimit="['guest', 'offline']"
    :customData="customData"
    :customIndex="customIndex"
    :options="options"
    ref="homelSlotRef"
    :desk="desk"
    @delete="deleteCard"
  >
    <div
      class="mt-1 overflow-hidden guider-body xt-scrollbar"
      style="height: 360px"
    >
      <div
        class="guider-cell pointer"
        v-for="(item, index) in dataList"
        :key="index"
        @click="jumpUrl(item.url)"
      >
        <div class="flex items-center cell-icon">
          <Icon :icon="item.icon" width="20" height="20" />
        </div>
        <span style="margin-left: 10px">{{ item.title }}</span>
      </div>
    </div>
  </xt-container>
</template>

<script>
import Widget from "../../../card/Widget.vue";
// import {mapActions, mapState,mapWritableState} from "pinia";
// import { shortTalkStore } from '../store'
import { Icon } from "@iconify/vue";
import { communityNavStore } from "../../../bottomPanel/store/communityNavStore";
import { mapActions } from "pinia";


export default {
  components: {
    Widget,
    Icon,
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
      dataList: [
        // {
        //     title:"短说社区客服",
        //     icon:'fluent-emoji-flat:globe-with-meridians',
        //     url:'',
        // },
        {
          title: "短说通用版使用手册",
          icon: "fluent-emoji-flat:thought-balloon",
          url: "https://www.yuque.com/thisky/wbogn1",
        },
        {
          title: "短说企业版使用手册",
          icon: "fluent-emoji-flat:thought-balloon",
          url: "https://www.yuque.com/thisky/osz34h",
        },
        {
          title: "短说PC端使用手册",
          icon: "fluent-emoji-flat:thought-balloon",
          url: "https://www.yuque.com/thisky/ew0ak2",
        },
        {
          title: "短说部署安装文档",
          icon: "fluent-emoji-flat:thought-balloon",
          url: "https://www.yuque.com/thisky/ulwd0g",
        },
        {
          title: "短说接入第三方应用方案",
          icon: "fluent-emoji-flat:thought-balloon",
          url: "https://www.yuque.com/thisky/emfp20",
        },
        {
          title: "短说移动端二次开发手册",
          icon: "fluent-emoji-flat:thought-balloon",
          url: "https://www.yuque.com/thisky/ixokka",
        },
        {
          title: "短说PC端二次开发手册",
          icon: "fluent-emoji-flat:thought-balloon",
          url: "https://www.yuque.com/thisky/ne5ut5",
        },
      ],
      header: {
        title: "社区助手",
        // ifyIcon:'akar-icons:chat-question',
        showIcon:"/logo/shortGuider.svg",
        rightIcon: [
          {
            ifyIcon: "fluent:open-20-filled",
          },
        ],
      },
      customSize: "2x4",
    };
  },
  async mounted() {
    this.customData.customSize = "2x4";
  },
  emits: ["delete"],
  computed: {
    options() {
      return {
        customDel: this.openWay === "nav" ? true : false,
        disableEdit:this.isCommunityDesktop(this.desk),
      };
    },
  },
  methods: {
    ...mapActions(communityNavStore, ["isCommunityDesktop"]),

    jumpUrl(url) {
      browser.openInUserSelect(url);
    },
    deleteCard() {
      this.$emit("delete");
    },
  },
};
</script>

<style lang="scss" scoped>
.top-icon {
  position: absolute;
  top: 17px;
}
.top-icon svg {
  width: 20px;
  height: 20px;
}
.guider-body {
  display: flex;
  flex-direction: column;
  position: relative;
  top: -3px;
}

.guider-cell {
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  display: flex;
  padding: 0 14px;
}
.guider-cell:not(:nth-of-type(1)) {
  margin-top: 12px;
}

.guider-cell span {
  margin-left: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 400;
}
</style>
