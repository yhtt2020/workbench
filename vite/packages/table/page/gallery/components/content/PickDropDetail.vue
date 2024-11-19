<template>
  <div class="pickModal rounded-lg p-4 xt-modal">
    <!-- 排序的tab切换 -->
    <xt-tab
      class="mb-4 xt-bg-2"
      style="height: 40px !important"
      :list="orderList"
      v-model="currentOrder"
    />

    <!-- 大类的tab切换 -->
    <xt-tab
      class="mb-4 xt-bg-2"
      style="height: 40px !important"
      :list="cateHowList"
      v-model="currentCateHow"
    />

    <!-- 子类的下拉选择 -->
    <xt-select
      :list="cateWhatList"
      v-model="currentCateWhat"
      style="margin-right: 12px; text-align: start"
      @click.native="handleSelectClick"
      :borderClass="'rounded-md w-full '"
      :zIndex="100002"
      :border="false"
      @change="handleEmitData"
      h="40"
    />

    
   <div class="select-footer">
    <div class="flex items-center justify-start mb-4 mt-4">
      <span class="xt-text-2 xt-font font-400 mr-4" :class="isModal ? 'font-14':'font-16'">壁纸</span>
      <span class="xt-text xt-font font-400" :class="isModal ? 'font-14':'font-16'">{{paperNick.name}}</span>
    </div>

    <div class="flex items-center justify-start mb-4" v-if="paperNick.synopsis !== ''">
      <span class="xt-text-2 xt-font font-400 mr-4" :class="isModal ? 'font-14':'font-16'">简介</span>
      <span class="xt-text xt-font font-400"  :class="isModal ? 'font-14':'font-16'">{{paperNick.synopsis}}</span>
    </div>

    <div class="flex items-center justify-start mb-4">
      <span class="xt-text-2 xt-font font-400 mr-4" :class="isModal ? 'font-14':'font-16'">官网</span>
      <xt-button h="0" style="width: auto !important;" @click="toOfficialWebsite">
        <div class="flex items-center justify-center">
          <span class="xt-text xt-font font-400" :class="isModal ? 'font-14':'font-16'" style="color: var(--active-bg) !important;">访问官网</span>
        </div>
      </xt-button>
    </div>

    <div class="flex items-center justify-center xt-text-2 xt-font font-400" :class="isModal ? 'font-14':'font-16'">
      「拾光壁纸」提供技术支持
    </div>
   </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { pickPaperStore } from "../../store/PickPaperStore";
import browser from "../../../../js/common/browser";

const pickStore = pickPaperStore();
const { orderValue, cateWhatValue, cateHowValue, paperNick } =
  storeToRefs(pickStore);

const props = defineProps({
  isModal: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['emitPick'])

// 排序
const orderList = ref([
  { index: "D", name: "最新", value: "date" },
  { index: "S", name: "趋势", value: "score" },
  { index: "R", name: "随机", value: "random" },
]);

// 大类列表
const cateHowList = ref([
  { name: "全部", value: "" },
  { name: "摄影", value: "photography" },
  { name: "其他", value: "general" },
]);

// 子类列表
const cateWhatList = ref([
  { name: "全部", value: "" },
  { name: "风光", value: "landscape" },
  { name: "美女", value: "girl" },
  { name: "人物", value: "character" },
  { name: "生灵", value: "living" },
  { name: "其他", value: "general" },
]);

/**当前order排序**/
const currentOrder = ref(orderValue.value);
watch(
  () => currentOrder.value,
  (newVal) => {
    orderValue.value = newVal;
  }
);

/**当前大类**/
const currentCateHow = ref(cateHowValue.value);
watch(
  () => currentCateHow.value,
  (newVal) => {
    cateHowValue.value = newVal;
  }
);

/**当前子类**/ 
const currentCateWhat = computed(() => {
  const index = cateWhatList.value.findIndex((find) => {
    return String(cateWhatValue.value) === String(find.value);
  });
  return cateWhatList.value[index]?.value;
});
/**触发回调**/ 
const handleEmitData = (evt) => {
 cateWhatValue.value = evt;
 emit('emitPick');
};

// 阻止dropdown菜单关闭触发事件
const handleSelectClick = (evt) => {
 evt.stopPropagation();
};

// 访问官网
const toOfficialWebsite = () => {
 browser.openInInner("https://timeline.ink");
};


</script>

<style lang="scss" scoped>
.pickModal {
  border: 1px solid var(--divider);
  box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.03);
  box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.1);
  box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.2);
  width: 100%;
  display: flex;
  flex-direction: column;
}

.select-footer {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

:deep(.panel-title) {
  margin-left: 8px !important;
}

:deep(.nav-box) {
  border-radius: 8px !important;
}

:deep(.round-dot) {
  background: var(--active-text) !important;
}

:deep(.ant-select-arrow) {
  color: var(--primary-text) !important;
}

:deep(.ant-select-selection-item) {
  text-align: center !important;
}
</style>
