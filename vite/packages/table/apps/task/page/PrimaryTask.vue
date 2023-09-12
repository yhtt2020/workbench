<template>
  <!-- 任务弹窗 -->
  <xt-message
    @ok="ok()"
    @no="no()"
    v-model="data.visible"
    :text="data.text"
  ></xt-message>
  <!-- 任务按钮 -->
  <xt-button style="width: 100%" type="theme" @click="taskGuide()"
    >开始任务</xt-button
  >
  <div></div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { guide } from "../../../ui/components/Task/guide";
import { cardStore } from "../../../store/card";
import { taskStore } from "../store";

// 初始化
const store = taskStore();
const router = useRouter();
const props = defineProps({
  task: {},
});
const data = reactive({
  visible: false,
  text: "",
});

// 任务步骤初始化
const init = () => {
  store.step = 1;
  store.isTaskDrawer = false;
};

// 任务引导
const taskGuide = () => {
  let currentTask = guide[store.taskID][0];
  switch (currentTask.type) {
    case "router":
      init();
      router.push({
        name: currentTask.value,
      });
      break;
    case "message":
      data.text = currentTask.value;
      data.visible = true;
      break;
    default:
      break;
  }
};

const ok = () => {
  store.isTaskDrawer = false;

  let obj = {
    size: "mini",
    link: "link",
    linkValue: "",
    open: {
      value: "http://a.apps.vip/doc",
      type: "internal",
    },
    isTitle: true,
    titleValue: "移动图标",
    src: "http://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/mRdv-NzQq-plHV-ZKl_",
    isRadius: true,
    radius: 5,
    imgState: "cover",
    imgShape: "square",
    isBackground: false,
    backgroundColor: "",
    backgroundIndex: 0,
  };
  const card = cardStore();

  let desk = card.desks.find((item) => card.currentDeskId == item.id);
  card.addCard(
    {
      name: "myIcons",
      id: Date.now() + 1,
      customData: { iconList: [{ ...obj }], copy: true },
    },
    desk
  );
  obj.titleValue = "合并图标";
  card.addCard(
    {
      name: "myIcons",
      id: Date.now() + 2,
      customData: { iconList: [{ ...obj }], merge: true },
    },
    desk
  );
  init();
};

const no = () => {
  data.visible = false;
};
</script>

<style lang="scss" scoped></style>
