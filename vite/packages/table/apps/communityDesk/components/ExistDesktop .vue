<!-- 添加已经创建的桌面数据 -->
<template>
  <xt-modal v-if="existDeskVisible" v-model="existDeskVisible" custom>
    <div style="width: 500px; height: 480px" class="flex flex-col p-4">
      <!-- 头部 -->
      <div class="w-full flex items-center justify-between mb-4">
        <xt-button w="40" h="40" @click="prevStep">
          <div class="flex items-center justify-center">
            <xt-ify-icon icon="fluent:chevron-left-16-regular" size="20" />
          </div>
        </xt-button>
        <span class="xt-text xt-font font-16">选择桌面</span>
        <xt-button w="40" h="40" @click="existDeskVisible = false">
          <div class="flex items-center justify-center">
            <xt-ify-icon icon="fluent:dismiss-16-regular" size="20" />
          </div>
        </xt-button>
      </div>

      <!-- 中间桌面数据选择 -->
      <div style="height: 150px" class="grow">
        <xt-scrollbar :y="true" class="h-full">
          <template v-for="item in deskList">
            <div
              class="flex items-center xt-bg-2 px-6 py-4 mb-4 rounded-lg"
              :class="{ 'select-active': item.id === currentDesk.id }"
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
        <xt-button w="64" h="40" :radius="8" @click="existDeskVisible = false">
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
import { ref, computed,toRefs } from "vue";
import { storeToRefs } from "pinia";
import { cardStore } from "../../../store/card";
import _ from "lodash-es";

const emit = defineEmits(["prev"]);

// 解构store缓存数据
const { desks } = storeToRefs(cardStore());

// 解构props
const props = defineProps({
 communityNo:{
  type:String,
  required:true,
 }
});
const { communityNo } = toRefs(props)

// 用于接收当前选中的桌面数据
const currentDesk = ref({});

// 获取个人桌面已经创建的桌面数据
const deskList = computed(() => {
  const filterDesks = _.filter(desks.value, (desk) => {
    return !desk?.communityNo;
  });
  return filterDesks;
});

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
  currentDesk.value = item;
};


// 添加桌面
const addDesk = () =>{
  
}

defineExpose({
  openExistDeskModal,
});
</script>

<style lang="scss" scoped>
.select-active {
  background: rgba(80, 139, 254, 0.2) !important;
  border: 2px solid rgba(80, 139, 254, 0.85);
}
</style>