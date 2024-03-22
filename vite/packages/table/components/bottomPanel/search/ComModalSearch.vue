<template>
  <div class="w-full">
    <div class="h-16 flex items-center justify-between px-4">
      <!-- 搜索 -->
      <div class="flex">
        <a-input
          class="h-8 xt-mask xt-text"
          style="
            width: 215px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 10px;
          "
          placeholder="搜索"
          :maxlength="10"
          :allow-clear="false"
          v-model:value="searchValue"
          @change="changeSearchValue()"
        >
          <template #suffix>
            <xt-ify-icon
              v-if="searchValue === ''"
              class="absolute right-3 xt-text-2"
              icon="fluent:search-20-filled"
              size="20"
              @click="changeSearchValue()"
            />
            <xt-ify-icon
              v-else
              icon="fluent:dismiss-16-regular"
              size="16"
              class="absolute right-3 xt-text-2"
              @click="searchValue = ''"
            ></xt-ify-icon>
          </template>
        </a-input>

        <xt-option-select
          class="select-container"
          :list="fileTypeList"
          v-model="fileType"
          :border="false"
        />
      </div>

      <div class="font-14 flex items-center">
        <div class="xt-font xt-text-2 font-14">网站打开方式：</div>
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
import { ref, computed, getCurrentInstance,watch } from "vue";
import { storeToRefs } from "pinia";
import { favoStore } from "../../../apps/favorites/store";
import { communityNavStore } from "../store/communityNavStore";
import { apps } from '../hooks/getFileType';
import { doc } from "../../desk/addIcon/hook/defaultData";

const emit = defineEmits(["close"]);

const favo = favoStore();
const { browserType } = storeToRefs(favo);
const communityNav = communityNavStore();
const { appModalList, fileType } = storeToRefs(communityNav);

const { proxy } = getCurrentInstance();

const linkType = ref([
  { label: "系统默认浏览器", value: "system" },
  { label: "想天浏览器", value: "thisky" },
  { label: "工作台内打开", value: "work" },
]);
const searchValue = ref("");
// 文件类型下拉列表
const fileTypeList = ref([
  { name: "全部类型", value: "all" },
  { name: "文件", value: "file" },
  { name: "网页", value: "web" },
  { name: "轻应用", value: "lightApp" },
  { name: "系统应用", value: "systemApp" },
  { name: "酷应用", value: "coolApp" },
  { name: "软件", value: "soft" },
]);

const close = () => {
  emit("close");
};

const changeSearchValue = () => {
  if (searchValue.value !== "") {
    const textRegex = new RegExp(searchValue.value, "i");
    const mList = appModalList.value[1].list;
    const result = mList.filter((item) => {
      return textRegex.test(item.name) || textRegex.test(item.url);
    });
    proxy.$bus.emit("getSearchList", result);
  } else {
    proxy.$bus.emit("getSearchList", []);
  }
};

// 根据下拉选择的类型结果返回不同数据
const getFileList = (data) =>{
  let result = [];
  const list = appModalList.value[1].list;
  if(data === 'all'){
    result = list;
  }
  else if(data === 'file'){
    result = list.filter((item) => {
      if (typeof item.value === "string" && item.value.startsWith("C:\\")){
        // 拆分获取文件扩展名
        const fileName = item.value.split("\\").pop().split(".");
        const filesName = `.${item.value.split("\\").pop().split(".").pop()}`;
        const isFile = doc.some((someItem) => {
          return someItem === filesName;
        });
        return fileName.length == 1 || isFile;
      }
    });
  }
  else if(data === 'soft'){
    result = list.filter((item) => {
      if (typeof item.value === "string" && item.value.startsWith("C:\\")){
        const filesName = `.${item.value.split("\\").pop().split(".").pop()}`;
        const isSoft = apps.some((someItem) => {
          return someItem === filesName;
        });
        return isSoft;
      }
    });
  }
  else if (data === 'web'){
    result = list.filter((item) => {
      return item.type === 'default';
    });
  }
  else {
    result = list.filter((item) => {
      return item.type === data;
    });
  }
  return result;
}

// 使用监听器监听fileType的变化
watch(()=>fileType.value, (value) => {
  proxy.$bus.emit("getSelectList", getFileList(value));
},{ deep:true,immediate:true });

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

:deep(.select-container) {
  height: 32px !important;
  border-radius: 8px !important;
  margin-left: 12px;
  max-width: 120px !important;
  background: var(--secondary-bg) !important;
  & .ant-select-selection-item {
    line-height: 32px !important;
  }
}
</style>