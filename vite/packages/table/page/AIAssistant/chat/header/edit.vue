<template>
  <Dialog
    v-model:name="value.name"
    v-model:icon="value.icon"
    :index="value.icon.id"
  ></Dialog>
  <div class="flex justify-evenly mt-4">
    <XtButton w="200" @click="clear()">清空对话记录</XtButton>
    <XtButton w="200" @click="del()">删除对话</XtButton>
  </div>
  
</template>

<script>
import { mapWritableState, mapActions } from "pinia";
import { message } from "ant-design-vue";
import { aiStore } from "../../../../store/ai";

import Dialog from "../components/Dialog.vue";
import { Modal } from "ant-design-vue";
export default {
  computed: {
    ...mapWritableState(aiStore, ["selectTopicIndex", "chatList"]),
  },
  components: {
    Dialog,
  },
  props: {
    data: {},
  },
  data() {
    return { visible: true, value: { ...this.data } };
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
