<template>
  <div class="flex justify-between items-center">
    <div class="flex items-center">
      <!-- 搜索 和 创建 -->
      <!-- <a-input
        style="width: 156px; height: 48px"
        class="xt-border rounded-xl xt-bg-2 pl-4"
        v-model:value="searchValue"
        placeholder="搜索"
      >
        <template #suffix>
          <Icon
            icon="sousuo"
            style="font-size: 20px"
            class="cursor-pointer"
            @click="searchTopic()"
          ></Icon>
        </template>
      </a-input> -->

      <div class="text-base">{{ selectTitle }}</div>
    </div>

    <div class="flex">
      <XtButton
        w="128"
        v-if="0"
        icon="tishi-xianxing"
        text="订阅已过期"
        type="warn"
        class="mx-2"
        @click="buyVisible = true"
      ></XtButton>

      <XtIcon icon="shezhi1" @click="openEdit()"> </XtIcon>
    </div>
  </div>

  <!-- 充值 -->
  <xt-old-modal v-model="buyVisible" title="购买" :isFooter="false">
    <Store style="width: 440px"></Store>
  </xt-old-modal>
  <!-- 编辑 -->
  <XtDrawer placement="right" v-model="settingVisible">
    <template #title>
      <XtTitle type="header"
        >设置
        <template #right>
          <XtButton
            @click="saveEdit()"

            type="theme"
            h="40"
            w="80"
          >保存</XtButton>
        </template>
      </XtTitle>
    </template>
    <Edit :data="topicList[selectTopicIndex]" ref="editRef" @del="del"></Edit>
  </XtDrawer>
</template>

<script>
import { defineAsyncComponent } from "vue";
import _ from "lodash-es";
import { mapWritableState, mapActions } from "pinia";
import { aiStore } from "../../../../store/ai";
import { message } from "ant-design-vue";
export default {
  computed: {
    ...mapWritableState(aiStore, [
      "serachTopic",
      "selectTopicIndex",
      "topicList",
      "selectTitle",
    ]),
    getSelectTopic() {
      return this.topicList.find((item) => item.id === this.selectTopicIndex);
    },
  },
  components: {
    Edit: defineAsyncComponent(() => import("./edit.vue")),
  },
  data() {
    return {
      createChatVisible: false,
      buyVisible: false,
      searchValue: "",
      settingVisible: false,
    };
  },
  methods: {
    ...mapActions(aiStore, ["delTopic"]),
    del() {
      this.settingVisible = false;
      this.delTopic();
      message.success("删除成功");
    },
    openEdit() {
      if (this.topicList[this.selectTopicIndex] !== undefined) {
        this.settingVisible = true;
      } else {
        message.error("你还未选择对话，请先创建会话");
      }
    },
    searchTopic() {
      this.serachTopic = this.searchValue;
    },
    saveEdit() {
      let editRef = this.$refs.editRef;
      this.topicList[this.selectTopicIndex] = _.cloneDeep(editRef.value);
      this.settingVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped></style>
