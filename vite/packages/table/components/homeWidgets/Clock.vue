<template>
  <div class="card content" v-if="clockEvent.length <= 0">
    <a-dropdown :trigger="['contextmenu']">
      <Icon
        style="width: 2em; height: 2em"
        icon="gengduo1"
        class="title-icon"
      ></Icon>

      <template #overlay>
        <a-menu @click="(e) => onContextMenuClick(e)">
          <a-menu-item key="1">设置</a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>

    <div style="text-align: center; margin-top: 1em">暂无闹钟</div>
    <a-empty :description="null" :image="simpleImage" />
<!--    <a-button type="primary" style="background: #676767;border: none">立即添加</a-button>-->
  </div>
  <div class="card content" v-else>
    <Icon
      style="width: 2em; height: 2em"
      icon="gengduo1"
      class="title-icon"
    ></Icon>
    <div style="text-align: center; font-size: 1.5em">下一个闹钟</div>
    <div style="font-size: 3em; margin-top: 0.5em">
      {{ clockEvent[0].dateValue.hours }}:{{ clockEvent[0].dateValue.minutes }}
    </div>
    <div style="font-size: 1.5em; margin-top: 0.5em" class="text-more">
      {{ clockEvent[0].eventValue }}
    </div>
  </div>
</template>

<script>
import { Empty } from "ant-design-vue";
import { mapWritableState } from "pinia";
import { tableStore } from "../../store";
export default {
  name: "Clock",
  data() {
    return {
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
    };
  },
  computed: {
    ...mapWritableState(tableStore, ["appDate", "clockEvent"]),
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

  .title-icon {
    position: absolute;
    right: 1em;
  }
}
.ant-dropdown-open {
  border-radius: 100%;
}
[ant-click-animating-without-extra-node='true']::after, .ant-click-animating-node{
 background:#676767 ;
  box-shadow: #676767;
  animation: none
}
</style>
