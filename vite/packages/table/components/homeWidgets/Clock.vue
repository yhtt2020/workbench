<template>
  <div
    class="card content"
    style="height: 14.7em; margin-bottom: 1em; padding: 1em"
    v-if="ClockEvent.length <= 0"
  >
    <a-dropdown :trigger="['contextmenu']">
      <Icon
        style="width: 2em; height: 2em"
        icon="gengduo1"
        class="titleIcon"
      ></Icon>

      <template #overlay>
        <a-menu @click="(e) => onContextMenuClick(e)">
          <a-menu-item key="1">设置</a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>

    <div style="text-align: center; margin-top: 1em">暂无闹钟</div>
    <a-empty :description="null" :image="simpleImage" />
  </div>
  <div
    class="card content"
    style="height: 14.7em; margin-bottom: 1em; padding: 1em"
    v-else
  >
    <Icon
      style="width: 2em; height: 2em"
      icon="gengduo1"
      class="titleIcon"
    ></Icon>
    <div style="text-align: center; font-size: 1.5em">下一个闹钟</div>
    <div style="font-size: 3em; margin-top: 0.5em">
      {{ ClockEvent[0].DateValue.hours }}:{{ ClockEvent[0].DateValue.minutes }}
    </div>
    <div
      style="
        font-size: 1.5em;
        margin-top: 0.5em;
        overflow: hidden; //文本超出隐藏
        text-overflow: ellipsis;
      "
    >
      {{ ClockEvent[0].EventValue }}
    </div>
  </div>
</template>

<script>
import { Empty } from "ant-design-vue";
import { mapWritableState } from "pinia";
import { appStore } from "../../store";
export default {
  name: "Clock",
  data() {
    return {
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
    };
  },
  computed: {
    ...mapWritableState(appStore, ["appDate", "ClockEvent"]),
  },
  methods: {
    onContextMenuClick(e) {
      console.log(e);
    },
  },
};
</script>

<style scoped lang="scss">
.content {
  position: relative;
  text-align: center;

  .titleIcon {
    position: absolute;
    right: 1em;
  }
}
</style>
