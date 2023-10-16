<template>
  <div>
    <Widget
      :desk="desk"
      :sizeList="sizeList"
      :options="options"
      :customIndex="customIndex"
      ref="cardSlot"
      :customData="customData"
    >
      <template #left-title>
        <div
          class="icon"
          style="
            width: 38px;
            height: 24px;
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            left: 2px;
          "
        >
          <RobotOutlined style="font-size: 20px" />
        </div>
      </template>
      <div class="content">
        <!-- {{ recentList.slice(0,4).length }} -->
        <div class="input xt-bg" style="position: relative ">
          <a-input
            placeholder="问我任何问题"
            :bordered="false"
            v-model:value="inputValue"
            @keyup.enter="enterMsg"
          />
          <SendOutlined
            style="
              position: absolute;
              font-size: 22px;
              right: 16px;
              color: var(--primary-text);
            "
            @click="enterMsg"
          />
        </div>
        <div
          class="ai-con"
          style="
            display: flex;
            text-align: left;
            margin-top: 14px;
            margin-bottom: 12px;
            color: var(--primary-text) ;
            
          "
        >
          最近对话
        </div>
       <template v-if="recentList">
        <div v-for="index in copyNum">
          <div class="ai-msg xt-bg-2" @click="goPage(index)">
            <xt-base-icon
              class="msg-icon"
              :icon="recentList[index]?.icon.name || 'message' "
            ></xt-base-icon>
            <div
              class="msg-title"
              :style="{
                height: copyNum !== 1 ? '56px' : '48px',
                lineHeight: copyNum !== 1 ? '56px' : '48px',
              }"
            >
              {{ recentList[index]?.name }}
            </div>
          </div>
        </div>
       </template>
       <DataStatu v-else imgDisplay="/img/test/load-ail.png" :btnToggle="false" textPrompt="暂无数据" style="margin-top: 200px;"></DataStatu>
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
import DataStatu from "./DataStatu.vue"
import { aiStore } from "../../store/ai";
import { mapWritableState } from "pinia";
export default {
  name: "AIaides",
  components: {
    Widget,
    MessageOutlined,
    SendOutlined,
    RobotOutlined,
    DataStatu,
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
      return this.showSize.height == 1 ? 1 : this.recentList.slice(0,4).length;
    },
  },
};
</script>
<style lang="scss" scoped>
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
      color: var(--primary-text);
      height: 40px;
      width: 100%;
      padding-left: 16px;
      &::placeholder {
        font-family: PingFangSC-Regular;
        font-size: 16px;
        font-weight: 400;
        color: var(--primary-text);
      }
    }
  }
  .ai-con {
    font-family: PingFangSC-Regular;
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
      font-family: PingFangSC-Regular;
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
</style>