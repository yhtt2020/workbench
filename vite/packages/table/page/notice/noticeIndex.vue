<template>
  <xt-left-menu :list="filterList" model="id" leftMargin="py-3" leftClass="xt-bg-m" :end="3">
    <template v-if="top.type !== 'setting'">
      <div class="flex flex-col w-full">
        <div
          class="flex w-full h-10 mb-4 px-3 pt-3 items-center justify-between"
        >
          <div class="flex items-center">
            <xt-new-icon :icon="top.newIcon" size="20"></xt-new-icon>
            <span class="font-16 font-500 xt-text ml-3 xt-font">{{
              top.newName
            }}</span>
          </div>
          <xt-button style="width: auto !important" h="0" @click="clearAll">
            <div class="flex items-center justify-center">
              <xt-new-icon
                icon="fluent:delete-16-filled"
                size="20"
              ></xt-new-icon>
            </div>
          </xt-button>
          <!-- <NoticeIcon icon="ant-design:clear-outlined" class="pointer category-button" style="font-size: 1.3rem;color: var(--secondary-text);" /> -->
        </div>
        <NoticeDetail :type="top.type" :list="filetDetailList" @close="close" />
      </div>
    </template>

    <template v-else>
      <div class="flex flex-col w-full p-3">
        <span class="font-16 font-500 mb-3 xt-text xt-font">设置</span>
        <NoticeSetting />
      </div>
    </template>
  </xt-left-menu>

  <teleport to="body">
    <NoticeEditorModal ref="editorRef" />
  </teleport>
</template>

<script setup >
import { reactive, ref, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { noticeStore } from "./store/noticeStore";
import { appStore } from "../../store";
import { Icon as NoticeIcon } from "@iconify/vue";

import NoticeDetail from "./noticeDetail.vue";
import NoticeSetting from "./noticeSetting.vue";
import NoticeEditorModal from "./components/NoticeEditorModal.vue";

import { message } from "ant-design-vue";

const app = appStore();
const notice = noticeStore();
const { settings } = storeToRefs(app);
const { loginVisible } = storeToRefs(app);
const { detailList } = storeToRefs(notice);

const emits = defineEmits(["closeMessage"]);

const top = ref({
  newIcon: "fluent:alert-16-filled",
  id: "all",
  newName: "全部消息",
  type: "system",
});

const editorRef = ref(null);
const selectTab = (item) => {
  top.value = item;
};

const clickSetting = (item) => {
  top.value = item;
};

const enableNotice = () => {
  const enable = (settings.value.noticeEnable = !settings.value.noticeEnable);
  app.setNoticeOnOff(enable);
};

const clearAll = () => {
  notice.clear();
};

const close = () => {
  emits("closeMessage");
};

const leftList = ref([
  {
    id: "all",
    newIcon: "fluent:grid-16-filled",
    alias: "all",
    newName: "全部消息",
    name: "全部",
    bg: "var(--secondary-bg)",
    callBack: (item) => {
      selectTab(item);
    },
  },
  {
    newIcon: "fluent:alert-16-filled",
    name: "系统",
    newName: "系统消息",
    id: "system",
    bg: "var(--secondary-bg)",
    callBack: (item) => {
      selectTab(item);
    },
  },
  {
    id: "IM",
    newIcon: "fluent:chat-16-filled",
    alias: "teamChat",
    newName: "社群沟通",
    name: "社群",
    bg: "var(--secondary-bg)",
    type: "message",
    callBack: (item) => {
      selectTab(item);
    },
  },
  {
    newIcon: "fluent:mail-16-filled",
    name: "推送",
    newName: "推送消息 ",
    id: "push",
    bg: "var(--secondary-bg)",
    callBack: (item) => {
      selectTab(item);
    },
  },
  {
    newIcon: "fluent:emoji-smile-slight-24-filled",
    name: "助手",
    id: "IA",
    newName: "智能助手",
    bg: "var(--secondary-bg)",
    callBack: (item) => {
      selectTab(item);
    },
  },

  {
    newIcon: "fluent:send-32-filled",
    flag: true,
    callBack: () => {
      // 游客模式下不能打开编辑窗
      if (window.$useEnv("guest")) {
        loginVisible.value = true;
      } else {
        editorRef.value.openEditorModal();
        close();
      }
    },
  },
  {
    id: "notice",
    newIcon: "fluent:alert-16-filled",
    title: "通知",
    flag: true,
    callBack: () => {
      enableNotice();
    },
  },
  {
    newIcon: "fluent:settings-16-filled",
    alias: "setting",
    title: "设置",
    type: "setting",
    callBack: (item) => {
      clickSetting(item);
    },
  },
]);

const filterList = computed(() => {
  const copyList = [...leftList.value];

  if (settings.value.noticeEnable) {
    const openList = copyList.map((item) => {
      return {
        ...item,
        newIcon:
          item.id === "notice" ? "fluent:alert-off-16-filled" : item.newIcon,
      };
    });
    return openList;
  } else {
    const closeList = copyList.map((item) => {
      return {
        ...item,
        newIcon: item.id === "notice" ? "fluent:alert-16-filled" : item.newIcon,
      };
    });
    return closeList;
  }
});

const filetDetailList = computed(() => {
  switch (top.value.id) {
    // 全部消息通知
    case "all":
      return detailList.value;
    // 系统消息通知
    case "system":
      const filterSystem = detailList.value.filter((item) => {
        return item.type === "system";
      });
      return filterSystem;
    // 社群消息通知
    case "IM":
      const filterMessage = detailList.value.filter((item) => {
        return item.type === "message";
      });
      return filterMessage;
    // 推送消息通知
    case "push":
      const filterPush = detailList.value.filter((item) => {
        return item.type === "push";
      });
      return filterPush;
    // 助手消息通知
    case "IA":
      return [];
  }
});

onMounted(() => {
  notice.getNoticeList();
});
</script>

<style lang="scss" scoped>
:deep(.xt-bt) {
  border-top: none !important;
}
:deep(.xt-br) {
  border-right: none !important;
}
</style>
