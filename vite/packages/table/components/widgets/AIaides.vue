<template>
  <div>
    <xt-container
      @titleHover="pushToMain"
      :desk="desk"
      :sizeList="sizeList"
      :options="options"
      :customIndex="customIndex"
      ref="cardSlot"
      :customData="customData"
      :envLimit="['guest', 'offline']"
      :header="header"
      v-model:customSize="customData.customSize"
      @delete="doRemoveCard"
    >
      <div class="mt-1">
        <a-input
          v-model:value="inputValue"
          :bordered="false"
          placeholder="问我任何问题"
          class="xt-bg h-[48px] rounded-xl"
          @keyup.enter="enterMsg"
        >
          <template #suffix>
            <SendOutlined
              class="xt-text-2 pointer"
              style="font-size: 20px"
              @click="enterMsg"
            />
          </template>
        </a-input>
        <div class="mt-2 mb-2 text-base xt-text">最近对话</div>
        <template v-if="recentList">
          <div
            class="mb-3 xt-bg rounded-xl cursor-pointer"
            v-for="index in copyNum"
            :style="{
              height: copyNum !== 1 ? '56px' : '48px',
              lineHeight: copyNum !== 1 ? '56px' : '48px',
            }"
          >
            <div
              class="flex items-center h-full ml-4"
              @click="goPage(index - 1)"
            >
              <!-- <AiIcon icon="fluent:chat-16-regular" style="font-size: 20px;" class="mr-3 xt-text" /> -->
              <xt-mix-icon
                class="mr-3 text-xl xt-text"
                :icon="recentList[index - 1].icon.name"
                type="select"
              ></xt-mix-icon>
              <div class="text-base xt-text">
                {{ recentList[index - 1]?.name }}
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div v-if="copyNum == 1" style="text-align: center; font-size: 16px">
            暂无数据
          </div>
          <DataStatu
            v-else
            imgDisplay="/img/test/load-ail.png"
            :btnToggle="false"
            textPrompt="暂无数据"
            class="mt-4"
          ></DataStatu>
        </template>
      </div>
    </xt-container>
  </div>
</template>

<script>
import { useOpenAi } from "../../hooks/src/open/useOpenAi";
import { useAppModal } from "../../apps/appModal/src/hook/useAppModal";

import Widget from "../card/Widget.vue";
import {
  MessageOutlined,
  SendOutlined,
  RobotOutlined,
} from "@ant-design/icons-vue";
import DataStatu from "./DataStatu.vue";
import { aiStore } from "../../store/ai";
import { mapWritableState } from "pinia";
import { Icon as AiIcon } from "@iconify/vue";
import { communityNavStore } from "../bottomPanel/store/communityNavStore";

export default {
  name: "AIaides",
  emit: ["delete"],
  components: {
    Widget,
    MessageOutlined,
    SendOutlined,
    RobotOutlined,
    DataStatu,
    AiIcon,
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
  data() {
    return {
      sizeList: [
        { value: "2x2", name: "2x2" },
        { value: "2x4", name: "2x4" },
      ],
      currentIndex: 0,
      settingVisible: false,
      inputValue: "",
      header: {
        // ifyIcon:"fluent:bot-24-regular",
        showIcon: "/img/appLogo/ai.png",
        title: "AI助手",
        titleHover: true,
        titleHoverName: "打开应用",
      },
    };
  },
  methods: {
    doRemoveCard(value) {
      if (this.openWay === "nav") {
        console.log(value);
        this.$emit("delete", this.customIndex);
      } else {
        return;
      }
    },
    // 跳转至AI，并创建新对话
    enterMsg() {
      if (this.inputValue == "") {
        return;
      }

      this.$router.push({ name: "ai", params: { value: this.inputValue } });
      this.inputValue = "";
    },
    // 跳转至具体会话
    goPage(index) {
      this.selectTopicIndex = this.recentList[index].id;
      // useOpenAi()
      const { openApp } = useAppModal("ai");
      openApp();
      return;
    },
    pushToMain() {
      const { openApp } = useAppModal("ai");
      openApp();
    },
  },
  computed: {
    ...mapWritableState(aiStore, ["recentList", "selectTopicIndex"]),
    ...mapWritableState(communityNavStore, ["currentCommunity"]),

    // 社群角色权限
    communityRole() {
      return this.currentCommunity?.item?.role === "member";
    },

    // 判断尺寸大小
    showSize() {
      if (this.customData.customSize) {
        let arr = this.customData.customSize.split("x");
        return {
          width: arr[0],
          height: arr[1],
        };
      } else {
        return {
          width: 2,
          height: 2,
        };
      }
    },
    // 判断不同高度返回不同具体会话个数
    copyNum() {
      return this.showSize.height == 2
        ? 1
        : this.recentList?.slice(0, 4).length;
    },
    options() {
      // 根据权限设置尺寸大小
      if (this.communityRole) {
        this.sizeList = [];
      } else {
        this.sizeList = [
          { value: "2x2", name: "2x2" },
          { value: "2x4", name: "2x4" },
        ];
      }

      // 根据权限设置标题鼠标经过
      // if (this.communityRole) {
      //   this.header.titleHover = false;
      // } else {
      //   this.header.titleHover = true;
      // }

      return {
        customDel: this.openWay === "nav" ? true : false,
        defaultData: {
          customSize: this.customData.customSize || "2x2",
        },
        disableEdit: this.communityRole,
      };
    },
  },
  watch: {
    customSize(newVal, oldVal) {
      this.customData.customSize = newVal;
    },
  },
  mounted() {
    if (this.customData.customSize == undefined) {
      this.customData.customSize = "2x2";
    }
  },
};
</script>
<style lang="scss" scoped>
:deep(.ant-input-affix-wrapper) {
  font-size: 16px;
  border-radius: 12px;
}
:deep(.ant-input) {
  color: var(--secondary-text) !important;
  &::placeholder {
    color: var(--secondary-text) !important;
  }
}
</style>
