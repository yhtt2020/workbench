<template>
  <div>
    <Widget :desk="desk" :sizeList="sizeList" :options="options" :customIndex="customIndex" ref="cardSlot"
      :customData="customData">
      <template #left-title-icon>
        <div class="icon" style=" width: 38px; height: 24px;position: absolute;left: 4px;top:14px">
          <!-- <RobotOutlined style="font-size: 20px" /> -->
          <AiIcon icon="fluent:bot-24-regular" style="font-size: 22px;" />
        </div>
      </template>
      <div class="mt-4">
        <a-input v-model:value="inputValue" :bordered="false" placeholder="问我任何问题" class=" xt-bg h-[48px] rounded-xl"
          @keyup.enter="enterMsg">
          <template #suffix>
            <SendOutlined class="xt-text-2 pointer" style="font-size: 20px;" @click="enterMsg" />
          </template>
        </a-input>
        <div class="mt-2 mb-2 text-base xt-text">最近对话</div>
        <template v-if="recentList">
          <div class="mb-3 xt-bg rounded-xl" v-for="index in copyNum"
            :style="{ height: copyNum !== 1 ? '56px' : '48px', lineHeight: copyNum !== 1 ? '56px' : '48px', }" >
            <div class="flex items-center h-full ml-4"  @click="goPage(index - 1)">
              <!-- <AiIcon icon="fluent:chat-16-regular" style="font-size: 20px;" class="mr-3 xt-text" /> -->
              <xt-base-icon class="mr-3 text-xl xt-text"
                :icon="recentList[index - 1]?.icon.name || 'message'"></xt-base-icon>
              <div class="text-base xt-text ">{{ recentList[index - 1]?.name }}</div>
            </div>
          </div>
        </template>
        <template v-else>
          <div v-if="copyNum == 1" style="text-align: center;font-size: 16px;">暂无数据</div>
          <DataStatu v-else imgDisplay="/img/test/load-ail.png" :btnToggle="false" textPrompt="暂无数据"
            class="mt-4"></DataStatu>
        </template>
      </div>

    </Widget>
  </div>
</template>

<script>
import Widget from "../card/Widget.vue";
import {
  MessageOutlined,
  SendOutlined,
  RobotOutlined,
} from "@ant-design/icons-vue";
import DataStatu from "./DataStatu.vue";
import { aiStore } from "../../store/ai";
import { mapWritableState } from "pinia";
import { Icon as AiIcon } from '@iconify/vue'
export default {
  name: "AIaides",
  components: {
    Widget,
    MessageOutlined,
    SendOutlined,
    RobotOutlined,
    DataStatu,
    AiIcon
  },
  props: {
    customIndex: {
      type: Number,
      default: 0,
    },
    customData: {
      type: Object,
      default: () => { },
    },
    desk: {
      type: Object,
    },
  },
  data() {
    return {
      sizeList: [
        { title: "2x2", height: 1, width: 1, name: "2x2" },
        { title: "2x4", height: 2, width: 1, name: "2x4" },
      ],
      options: {
        className: "card small ",
        title: "AI助手",
        icon: "",
        type: "AIaides",
      },
      currentIndex: 0,
      settingVisible: false,
      inputValue: "",
    };
  },
  methods: {
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
      console.log(index);
      this.selectTopicIndex = this.recentList[index].id;
      this.$router.push({ name: "ai" });
    },
  },
  computed: {
    ...mapWritableState(aiStore, ["recentList", "selectTopicIndex"]),
    // 判断尺寸大小
    showSize() {
      if (this.customData && this.customData.width && this.customData.height) {
        return { width: this.customData.width, height: this.customData.height };
      }
      return this.sizeList[0];
    },
    // 判断不同高度返回不同具体会话个数
    copyNum() {
      return this.showSize.height == 1 ? 1 : this.recentList?.slice(0, 4).length;
    },
  },
};
</script>
<!-- <style lang="scss" scoped>
.content {
  box-sizing: border-box;
  width: 252px;
  margin-top: 15px;
  display: flex;
  flex-direction: column;

  .input {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 252px;
    height: 48px;
    border-radius: 12px;
    margin-top: -6px;
    // margin: auto 5px;
    :deep(.ant-input) {
      color: var(--secondary-text);
      font-size: 14px;
      height: 40px;
      width: 100%;
      padding-left: 16px;
      &::placeholder {

        font-size: 14px;
        font-weight: 400;
        color: var(--secondary-text);
      }
    }
  }
  .ai-con {

    font-size: 16px;
    font-weight: 400;
    // margin-top: -5px;
  }
  .ai-msg {
    width: 252px;
    // height: 48px;
    border-radius: 12px;
    display: flex;
    // justify-content: center;
    align-items: center;
    // margin-top: 1.7%;
    margin-bottom: 12px;
    cursor: pointer;
    .msg-icon {
      font-size: 18px;
      margin-left: 17.25px;
      margin-right: 13.25px;
      flex-shrink: 0;
    }
    .msg-title {

      font-size: 16px;
      // width: 80%;
      color: var(--primary-text);
      font-weight: 400;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
</style> -->
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
