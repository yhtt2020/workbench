<!-- 频道目录创建弹窗 -->
<template>
  <xt-modal v-if="categoryVisible" v-model="categoryVisible" title="添加分组">
    <div style="width: 500px" class="h-full flex flex-col">
      <a-input
        placeholder="分组名称"
        v-model:value="categoryName"
        class="h-10 search"
        style="
          border-radius: 8px;
          text-align: center;
          background: var(--secondary-bg);
        "
        @pressEnter="createCategory"
        ref="categoryRef"
      />

      <div class="flex items-center justify-end pt-4">
        <xt-button
          w="64"
          h="40"
          class="mr-3 category-button"
          @click="categoryVisible = false"
        >
          取消
        </xt-button>
        <xt-button w="64" h="40" type="theme" @click="createCategory">
          确定
        </xt-button>
      </div>
    </div>
  </xt-modal>
</template>

<script setup>
import { message } from "ant-design-vue";
import { nextTick, ref, toRefs } from "vue";
import { CommunityAPI } from "../../api/communityAPI";
import { chatCommunityStore } from "../../store/chatCommunity";

const chatCommunity = chatCommunityStore();
const comAPI = new CommunityAPI();
const props = defineProps({
  no: {
    type: String,
    required: true,
  },
  currentCategoryName: {
    type: String,
    default: "",
  },
});
const { no, currentCategoryName } = toRefs(props);

//ref定义区域
const categoryName = ref(currentCategoryName.value);
const categoryRef = ref(null);

// 开启社群频道分组创建弹窗
const categoryVisible = ref(false);
const openCategoryModal = () => {
  categoryVisible.value = true;
  nextTick(() => {
    categoryRef.value.focus();
  });
};

// 创建分组
const createCategory = async () => {
  if (categoryName.value !== "") {
    const option = {
      communityNo: Number(no.value),
      name: categoryName.value,
      type: "category",
      role: "category",
    };
    const res = await comAPI.createCommunityChannel(option);
    if (res.status === 1) {
      message.success(`${res.info}`);
      chatCommunity.getCategoryList(Number(no.value));
      chatCommunity.getCommunityTree(Number(no.value));
      categoryVisible.value = false;
    }
  } else {
    message.warning("请输入分组名称");
  }
};

defineExpose({
  openCategoryModal,
});
</script>

<style lang="scss" scoped>
:deep(.ant-input) {
  color: var(--secondary-text) !important;
  font-size: 16px !important;
  &::placeholder {
    color: var(--secondary-text) !important;
  }
}
</style>