<!-- 添加已经创建的桌面数据 -->
<template>
  <xt-modal
    v-if="existDeskVisible"
    v-model="existDeskVisible"
    title="选择已有桌面"
    @close="existDeskVisible = false"
  >
    <div style="width: 500px; height: 480px" class="flex flex-col p-4">
      <!-- 中间桌面数据选择 -->
      <div style="height: 420px" class="grow">
        <xt-scrollbar :y="true" class="h-full">
          <template v-for="item in deskList">
            <div
              class="flex items-center xt-bg-2 px-6 py-4 mb-4 rounded-lg select-hover pointer"
              :class="{ 'select-active': item.id === deskItemId }"
              @click="selectDesk(item)"
            >
              <xt-ify-icon
                icon="fluent-emoji:desktop-computer"
                size="20"
                class="mr-4"
              />
              <span class="xt-text xt-font font-16">{{ item.name }}</span>
            </div>
          </template>
        </xt-scrollbar>
      </div>

      <!-- 底部确定按钮 -->
      <div class="flex items-center justify-end">
        <xt-button
          w="64"
          h="40"
          :radius="8"
          style="margin-right: 12px"
          @click="existDeskVisible = false"
        >
          取消
        </xt-button>
        <xt-button w="64" h="40" :radius="8" type="theme" @click="addDesk">
          确定
        </xt-button>
      </div>
    </div>
  </xt-modal>
</template>

<script setup>
import { ref, computed, toRefs, getCurrentInstance } from "vue";
import { storeToRefs } from "pinia";
import { cardStore } from "../../../store/card";
import { communityNavStore } from "../../../components/bottomPanel/store/communityNavStore";
import _ from "lodash-es";
import { nanoid } from "nanoid";

// 获取全局事件总线程
const { proxy } = getCurrentInstance();

// emit事件触发
const emit = defineEmits(["prev"]);

// 解构store缓存数据
const { desks } = storeToRefs(cardStore());
const communityNav = communityNavStore();
const { currentCommunity } = storeToRefs(communityNav);

// 获取个人桌面已经创建的桌面数据
const deskList = computed(() => {
  const filterDesks = _.filter(desks.value, (desk) => {
    return !desk?.communityNo;
  });
  return filterDesks;
});

// 用于接收当前选中的桌面数据
const deskItemId = ref(deskList.value[0]?.id);

// 开启已经创建的桌面数据选择弹窗
const existDeskVisible = ref(false);
const openExistDeskModal = () => {
  existDeskVisible.value = true;
};

// 返回上一步
const prevStep = () => {
  existDeskVisible.value = false;
  emit("prev");
};

// 选择需要的桌面
const selectDesk = (item) => {
  deskItemId.value = item.id;
};

// 添加桌面
const addDesk = () => {
  // 获取选择中的桌面数据;
  const deskFound = deskList.value.find((desk) => {
    return String(desk.id) === String(deskItemId.value);
  });
  // 社群id;
  const no = currentCommunity.value.item?.no;
  if (deskFound) {
    const option = {
      ...deskFound,
      communityNo: no,
      id:`${nanoid(5)}`,
    };
    // 避免重复添加
    const index = _.findIndex(desks.value, (desk) => {
      return (
        Number(no) === Number(desk?.communityNo) &&
        String(desk.id) === String(option.id)
      );
    });
    if (index === -1) {
      desks.value.unshift(option);
    }
    existDeskVisible.value = false;
    proxy.$bus.emit("updateSync");
  }
};

defineExpose({
  openExistDeskModal,
});
</script>

<style lang="scss" scoped>
.select-active {
  background: rgba(80, 139, 254, 0.2) !important;
  border: 2px solid rgba(80, 139, 254, 0.85);
}
.select-hover {
  &:hover {
    background: rgba(80, 139, 254, 0.2) !important;
  }
}
</style>