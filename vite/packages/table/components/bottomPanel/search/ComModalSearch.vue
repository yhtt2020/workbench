<template>
  <div class="w-full">
    <div class="h-16 flex items-center justify-between px-4">
      <!-- 搜索 -->
      <a-input
        class="h-8 xt-mask xt-text"
        style="
          width: 215px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        "
        placeholder="搜索"
        :maxlength="10"
        allow-clear
        v-model:value="searchValue"
        @change="changeSearchValue()"
      >
        <xt-ify-icon
          class="absolute"
          icon="fluent:search-20-filled"
          size="20"
        />
      </a-input>
      <div class="font-14 flex items-center">
        <div>打开方式：</div>
        <a-select
          v-model:value="browserType"
          class="xt-bg"
          style="width: 142px"
          placeholder="Tags Mode"
          :options="linkType"
        ></a-select>

        <div
          class="xt-bg-2 h-8 w-8 flex justify-center items-center rounded-lg ml-3 pointer"
          @click="close"
        >
          <xt-ify-icon icon="fluent:dismiss-16-regular" size="16" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, getCurrentInstance } from "vue";
import { storeToRefs } from "pinia";
import { favoStore } from "../../../apps/favorites/store";
import { communityNavStore } from "../store/communityNavStore";

const emit = defineEmits(["close"]);

const favo = favoStore();
const { browserType } = storeToRefs(favo);
const communityNav = communityNavStore();
const { appModalList } = storeToRefs(communityNav);

const { proxy } = getCurrentInstance();

const linkType = ref([
  { label: "系统默认浏览器", value: "system" },
  { label: "想天浏览器", value: "thisky" },
  { label: "工作台内打开", value: "work" },
]);
const searchValue = ref("");

const close = () => {
  emit("close");
};

const changeSearchValue = () => {
  if (searchValue.value !== "") {
    const textRegex = new RegExp(searchValue.value, "i");
    const mList = appModalList.value[1].list.concat(appModalList.value[0].list);
    const result = mList.filter((item) => {
      return textRegex.test(item.name) || textRegex.test(item.url);
    });
    // console.log('搜索',result);
    proxy.$bus.emit("getSearchList", result);
  } else {
    proxy.$bus.emit("getSearchList", []);
  }
};
</script>

<style lang="scss" scoped>
:deep(.ant-select-selector) {
  border-radius: 8px !important;
}
.divider {
  width: 100%;
  height: 1px;
  background-color: var(--divider);
  margin-top: 8px;
  margin-bottom: 8px;
}
.scroll-color::-webkit-scrollbar-thumb {
  background-color: #ccc; /* 滚动条颜色 */
  border-radius: 6px; /* 滚动条圆角 */
}

.scroll-color::-webkit-scrollbar-thumb:hover {
  background-color: #999; /* 悬停时滚动条颜色 */
}

.scroll-color::-webkit-scrollbar-track {
  border-radius: 6px; /* 轨道圆角 */
}

.select {
  background: rgba(80, 139, 254, 0.2);
}
</style>