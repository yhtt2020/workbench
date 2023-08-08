<template>
  <div class="flex justify-between items-center">
    <div class="flex items-center">
      <!-- 搜索 和 创建 -->
      <a-input
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
      </a-input>

      <XtIcon
        icon="tianjia2"
        class="mx-2"
        @click="createChatVisible = true"
      ></XtIcon>
      <div class="text-base">AI助手</div>
    </div>

    <div class="flex">
      <XtButton
        w="128"
        size="mini"
        icon="tishi-xianxing"
        text="订阅已过期"
        type="warn"
        class="mx-2"
        @click="buyVisible = true"
      ></XtButton>
      <XtIcon icon="shezhi1" @click="settingVisible = true"></XtIcon>
    </div>
  </div>
  <!-- 新建模板 -->
  <XtView
    v-if="createChatVisible"
    model="popup"
    title="新建模板"
    :showFull="false"
    @close="createChatVisible = false"
  >
    <CreateTopic @close="createChatVisible = false"></CreateTopic>
  </XtView>
  <!-- 充值 -->
  <XtView
    model="popup"
    v-if="buyVisible"
    title="购买"
    :showFull="false"
    @close="buyVisible = false"
  >
    <Store style="width: 440px"></Store>
  </XtView>
  <!-- 编辑 -->
  <a-drawer
    :width="497"
    v-model:visible="settingVisible"
    placement="right"
    v-if="settingVisible"
  >
    <template #title>
      <XtTitle  type="header"
        >设置
        <template #right>
          <XtButton
            @click="saveEdit()"
            text="保 存"
            type="theme"
            h="40"
            w="80"
          ></XtButton>
        </template>
      </XtTitle>
    </template>
    <Edit :data="topicList[selectTopicIndex]" ref="editRef"></Edit>
  </a-drawer>
</template>

<script>
import { defineAsyncComponent } from "vue";
import _ from "lodash-es";
import { mapWritableState } from "pinia";
import { aiStore } from "../../../../store/ai";
export default {
  computed: {
    ...mapWritableState(aiStore, [
      "serachTopic",
      "selectTopicIndex",
      "topicList",
    ]),
  },
  components: {
    Store: defineAsyncComponent(() => import("../../account/Store.vue")),
    Edit: defineAsyncComponent(() => import("./edit.vue")),
    CreateTopic: defineAsyncComponent(() => import("./createTopic.vue")),
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
