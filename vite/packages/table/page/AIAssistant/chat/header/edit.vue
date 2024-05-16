<template>
  <div class="p-4 mb-4 xt-bg-2 rounded-xl">
    <xt-option-info title="图标和名称" info="支持自定图标和名称。" />
    <xt-option-icon
      v-model:icon="value.icon.name"
      v-model:input="value.name"
      :menus="['emoji']"
      :upload="false"
    />
  </div>
  <div class="flex justify-evenly mt-4">
    <XtButton w="200" @click="clear()" class="mr-3">清空对话记录</XtButton>
    <XtButton w="200" @click="del()">删除对话</XtButton>
  </div>
</template>

<script>
import { mapWritableState, mapActions } from "pinia";
import { message } from "ant-design-vue";
import { aiStore } from "../../../../store/ai";
import _ from "lodash";
import { Modal } from "ant-design-vue";
export default {
  computed: {
    ...mapWritableState(aiStore, ["selectTopicIndex", "chatList"]),
  },
  props: {
    data: {},
  },
  data() {
    return {
      visible: true,
      value: _.cloneDeep(this.data),
      icon: this.data.icon.name,
    };
  },

  methods: {
    clear() {
      Modal.info({
        centered: true,
        title: "确认删除",
        content: "点击确认会无视保存进行清空",
        okText: "确认",
        maskClosable: true,
        zIndex: 999999999999999,
        onOk: () => {
          this.chatList[this.selectTopicIndex] = [];
          message.success("已清空对话记录");
        },
      });
    },
    del() {
      Modal.info({
        centered: true,
        title: "确认删除",
        content: "点击确认删除整个对话",
        okText: "确认",
        maskClosable: true,
        zIndex: 999999999999999,
        onOk: () => {
          this.$emit("del", this.value.id);
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
