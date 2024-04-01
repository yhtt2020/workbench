<!-- 用户选择 -->
<template>
  <div class="forward-container flex">
    <div class="flex-1 forward-left flex flex-col">
      <!-- 搜索 -->
      <a-input
        class="h-10 xt-bg-2"
        v-model:value="forwardText"
        placeholder="搜索好友、群聊"
        style="color: var(--secondary-text); border-radius: 8px"
        @change="search"
      >
        <template #suffix>
          <div
            class="flex items-center justify-center pointer active-button"
            @click="search"
            v-if="forwardText === ''"
          >
            <xt-ify-icon
              icon="fluent:search-16-regular"
              size="20"
              class="xt-text-2"
            />
          </div>
          <div
            class="flex items-center justify-center"
            v-else
            @click="clearForwardText"
          >
            <xt-ify-icon
              icon="fluent:dismiss-circle-16-filled"
              size="16"
              class="xt-text-2"
            />
          </div>
        </template>
      </a-input>

      <!-- 列表 -->
      <div class="flex flex-col mt-4">
        <div class="flex items-center justify-between w-full mb-4">
          <span class="font-14 xt-text">最近聊天</span>
          <a-checkbox v-model:checked="currentChecked">全选</a-checkbox>
        </div>
        <xt-scrollbar :y="true" style="height: 304px">
          <div class="flex flex-col">
            <template v-for="(item, index) in currentList">
              <div
                class="flex p-3 w-full items-center rounded-lg pointer mb-4"
                :class="{ 'select-bg': isSelect(index) }"
                @click="selectForward(item)"
              >
                <a-avatar
                  shape="square"
                  v-if="item.type === 'GROUP'"
                  size="32"
                  :src="item?.avatar"
                />
                <a-avatar v-else size="32" :src="item?.avatar" />
                <span class="ml-4 xt-text">{{ item.nick }}</span>
              </div>
            </template>
          </div>
        </xt-scrollbar>
      </div>
    </div>

    <!-- 分割线 -->
    <a-divider
      type="vertical"
      style="height: 400px; background-color: var(--divider); margin: 0 16px"
    />

    <div class="flex-1 forward-right flex flex-col">
      <span class="font-14 mb-4 xt-text-2">
        已选中（{{ currentRightList.length }}人）
      </span>
      <!-- 列表 -->
      <xt-scrollbar :y="true" style="height: 300px">
        <div class="flex flex-col">
          <template v-for="item in currentRightList">
            <div
              class="flex p-3 w-full rounded-lg justify-between items-center pointer"
            >
              <div class="flex items-center">
                <a-avatar
                  shape="square"
                  v-if="item.type === 'GROUP'"
                  size="32"
                  :src="item?.avatar"
                />
                <a-avatar v-else size="32" :src="item?.avatar" />
                <span class="ml-4 xt-text">{{ item.nick }}</span>
              </div>
              <xt-button
                h="0"
                style="width: auto !important"
                @click="deleteForward(item)"
              >
                <div class="flex items-center justify-center">
                  <xt-ify-icon
                    icon="akar-icons:circle-minus-fill"
                    size="20"
                    class="xt-text-2"
                  />
                </div>
              </xt-button>
            </div>
          </template>
        </div>
      </xt-scrollbar>
      <!-- 按钮 -->
      <div class="flex items-center justify-end w-full h-10 mt-4">
        <xt-button
          w="100"
          h="40"
          @click="handleClose"
          style="border-radius: 8px; margin-right: 16px"
        >
          取消
        </xt-button>
        <xt-button
          w="100"
          h="40"
          type="theme"
          @click="handleForward"
          style="border-radius: 8px"
        >
          确定
        </xt-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, toRefs, watch, watchEffect } from "vue";
import _ from "lodash-es";

const emit = defineEmits(["close", "forward"]);

const props = defineProps({
  currentLeftList: {
    type: Array,
    default: () => [],
  },
});
const { currentLeftList } = toRefs(props);

const currentList = ref([]);
// 右侧选中列表
const currentRightList = ref([]);

// 搜索功能
const forwardText = ref("");
const search = () => {
  if (forwardText.value !== "") {
    const searchArr = currentLeftList.value?.filter((item) => {
      return item?.nick?.includes(forwardText.value);
    });
    currentList.value = searchArr;
  } else {
    currentList.value = currentLeftList.value;
  }
};
const clearForwardText = () => {
  forwardText.value = "";
};

// 全选功能
const currentChecked = ref(false);
// 监听全选
watch(
  () => currentChecked.value,
  (newVal) => {
    if(newVal){
      currentRightList.value = currentList.value;
    }else {
      currentRightList.value  = []
    }
  }
);

watchEffect(() => {
  if (forwardText.value === "") {
    currentList.value = currentLeftList.value;
  }
});

// 实现选中功能
const selectForward = (item) => {
  const index = _.findIndex(currentRightList.value, function (findItem) {
    return findItem?.userID === item?.userID;
  });
  if (index > -1) {
    currentRightList.value.splice(index, 1);
  } else {
    currentRightList.value.push(item);
  }
};
const isSelect = (index) => {
  const indexStatus = _.some(currentRightList.value, function (item) {
    return item?.userID === currentList.value[index]?.userID;
  });
  return indexStatus;
};

// 取消用户选中功能
const deleteForward = (item) => {
  const index = _.findIndex(currentRightList.value, function (findItem) {
    return findItem?.userID === item?.userID;
  });
  currentRightList.value.splice(index, 1);
};

// 关闭弹窗
const handleClose = () => {
  emit("close");
};
// 确定转发
const handleForward = () => {
  emit("forward", currentRightList.value);
};
</script>

<style lang="scss" scoped>
.forward {
  &-container {
    width: 650px;
  }
  &-left {
    width: 239px;
  }
}
:deep(.ps__rail-y) {
  display: none !important;
}
:deep(.ant-checkbox-wrapper) {
  span {
    color: var(--secondary-text) !important;
  }
}
:deep(.ant-input) {
  &::placeholder {
    color: var(--secondary-text) !important;
  }
}
.select-bg {
  background: var(--active-secondary-bg);
  border: 1px solid var(--active-bg);
}
</style>

