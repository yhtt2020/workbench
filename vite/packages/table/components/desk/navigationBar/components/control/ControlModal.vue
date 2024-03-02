<template>
  <div
    class="rounded-xl flex flex-col justify-between control-container xt-shadow pl-4 pt-4 tt-container-box-1234"
    id="controlId"
    ref="modalRef"
  >
    <div class="flex items-center justify-between">
      <div class="flex items-center justify-center">
        <xt-new-icon
          icon="fluent:toggle-multiple-16-regular"
          size="20"
          class="mr-2"
        ></xt-new-icon>
        <span class="xt-text font-14 xt-font">控制中心</span>
      </div>
      <template v-if="!editVisible">
        <div
          class="flex items-center justify-center pr-4 pointer"
          @click="editClick"
        >
          <xt-button style="width: auto !important" h="0">
            <div class="flex items-center justify-center tt-container-box-1234">
              <xt-new-icon
                icon="fluent:compose-16-regular"
                size="20"
              ></xt-new-icon>
            </div>
          </xt-button>
        </div>
      </template>
      <template v-else>
        <div class="flex items-center">
          <div
            class="mr-3 flex items-center pointer justify-center"
            @click="restList"
          >
            <xt-button style="width: auto !important" h="0">
              <div class="flex items-center justify-center">
                <xt-new-icon
                  icon="fluent:arrow-clockwise-16-regular"
                  size="20"
                  class="mr-2"
                  :color="'var(--link)'"
                >
                </xt-new-icon>
                <span class="xt-font font-14 xt-theme-text tt-container-box-1234">重置</span>
              </div>
            </xt-button>
          </div>
          <div class="flex items-center pointer pr-4" @click="finshEdit">
            <xt-button style="width: auto !important" h="0">
              <div class="flex items-center justify-center tt-container-box-1234" >
                <span class="xt-font xt-theme-text font-14">完成编辑</span>
              </div>
            </xt-button>
          </div>
        </div>
      </template>
    </div>
    <template v-if="!editVisible">
      <ControlDesk />
    </template>
    <template v-else>
      <EditControlDesk ref="editRef" />
    </template>

    <div class="mt-2 mb-4" style="width: 520px">
      <div class="mx-auto xt-bb w-full"></div>
    </div>

    <div class="flex items-center justify-center mb-4">
      <template v-for="item in bottomButton">
        <a-tooltip placement="top" :title="item.name">
          <xt-button
            w="54"
            h="54"
            style="border-radius: 12px"
            class="mr-3 button-item xt-bg-t-2 tt-container-box-1234"
            @click="item.fn"
          >
            <div class="flex items-center justify-center">
              <xt-new-icon :icon="item.newIcon" size="24"></xt-new-icon>
            </div>
          </xt-button>
        </a-tooltip>
      </template>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  computed,
  onMounted,
  getCurrentInstance,
  onBeforeMount,
} from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { appStore } from "../../../../../store";
import { controlStore } from "../../hook/controlStore";

import ControlDesk from "./ControlDesk.vue";
import EditControlDesk from "./EditControlDesk.vue";

const router = useRouter();
const emit = defineEmits(["close"]);

const { proxy } = getCurrentInstance();

const props = defineProps({
  full: {
    type: Boolean,
    default: false,
  },
});

const app = appStore();
const { userInfo } = storeToRefs(app);
const controls = controlStore();
const { control, initList, removeControlList } = storeToRefs(controls);

const editVisible = ref(false);
const editRef = ref(null);

// 触发编辑
const editClick = () => {
  editVisible.value = true;
};

// 完成编辑
const finshEdit = () => {
  editVisible.value = false;
};

// 重置
const restList = () => {
  control.value.oldList = JSON.parse(JSON.stringify(initList.value));
  control.value.newList = [];
};

const bottomButton = ref([
  {
    newIcon: "fluent:person-16-regular",
    name: "用户中心",
    fn: () => {
      router.push({ path: "/my" });
      emit("close");
    },
  },
  {
    newIcon: "fluent:lock-closed-16-regular",
    name: "锁屏",
    fn: () => {
      router.push({ path: "/lock" });
      emit("close");
    },
  },
  {
    newIcon: "fluent:full-screen-maximize-16-regular",
    name: "全屏",
    fn: () => {
      app.toggleFullScreen();
    },
  },
  {
    newIcon: "fluent:power-20-filled",
    name: "电源",
    fn: () => {
      router.push({ path: "/power" });
      emit("close");
    },
  },
  {
    newIcon: "fluent:settings-16-regular",
    name: "设置",
    fn: () => {
      router.push({
          name:'home'
        })
        setTimeout(() => {
          proxy.$bus.emit("openSystemSet")
        }, 500);
      emit("close");
    },
  },
  // {
  //   newIcon:'fluent:settings-16-regular',name:'清除测试数据',
  //   fn:()=>{
  //     controlStore().initData();
  //     // router.push({ name: 'setting' });
  //     // emit('close')
  //   }
  // }
]);
function handleClick(e) {
    if (e.target?.closest(".tt-container-box-1234") == null) {
      emit("close");
    }
  }
onMounted(() => {
  proxy.$bus.on("closeControl", () => {
    emit("close");
  });

  proxy.$bus.on("closeControl", () => {
    emit("close");
  });
  window.addEventListener("click",handleClick);
});

onBeforeMount(() => {
  window.removeEventListener("click",handleClick);
});
</script>

<style lang="scss" scoped>
.control-container {
  backdrop-filter: blur(50px);
  background: var(--primary-bg);
  width: 548px;
}
.button-item {
  &:last-of-type {
    margin-right: 0 !important;
  }
}
</style>
