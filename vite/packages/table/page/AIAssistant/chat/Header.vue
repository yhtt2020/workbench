<template>
  <div class="flex justify-between items-center mb-2">
    <div class="flex items-center">
      <!-- 搜索 和 创建 -->
      <a-input
        style="width: 156px; height: 48px"
        class="xt-border rounded-xl xt-bg-2 pl-4"
        v-model:value="searchValue"
        placeholder="搜索"
      >
        <template #suffix>
          <Icon icon="sousuo"></Icon>
        </template>
      </a-input>
      <div class="xt-btn w-12 h-12 ml-2" @click="createChatVisible = true">
        <Icon icon="tianjia2"></Icon>
      </div>

      <div class="text-base">AI助1手</div>
    </div>

    <div class="flex">
      <div class="xt-btn w-12 h-12">
        <Icon
          icon="shezhi1"
          class="cursor-pointer"
          style="font-size: 26px"
        ></Icon>
      </div>
      <FullBtn></FullBtn>
    </div>
  </div>
  <Popup v-if="createChatVisible" @close="createChatVisible = false">
    <createTopic></createTopic>
  </Popup>
</template>

<script>
import FullBtn from "../components/FullBtn.vue";
import createTopic from "./createTopic.vue";
import Popup from "../components/Popup.vue";

export default {
  components: {
    Popup,
    createTopic,
  },
  data() {
    return {
      createChatVisible: false,
      searchValue: "",
    };
  },
  components: {
    FullBtn,
  },
};
</script>

<style lang="scss" scoped></style>
