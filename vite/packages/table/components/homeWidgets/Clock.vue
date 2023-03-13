<template>
  <div class="card content" v-if="clockEvent.length <= 0">

      <Icon
        style="width: 2em; height: 2em"
        icon="gengduo1"
        class="title-icon"
        @click="showDrawer"
      ></Icon>



    <div style="text-align: center; margin-top: 1em">暂无闹钟</div>
    <a-empty :description="null" :image="simpleImage" />
    <a-button type="primary" style="background: #676767;border: none">立即添加</a-button>
  </div>
  <div class="card content" v-else>
    <Icon
      style="width: 2em; height: 2em"
      icon="gengduo1"
      class="title-icon"
      @click="showDrawer"
    ></Icon>
    <div style="text-align: center; font-size: 1.5em">下一个闹钟</div>
    <div style="font-size: 3em; margin-top: 0.5em">
      {{ clockEvent[0].dateValue.hours }}:{{ clockEvent[0].dateValue.minutes }}
    </div>
    <div style="font-size: 1.5em; margin-top: 0.5em" class="text-more">
      {{ clockEvent[0].eventValue }}
    </div>
  </div>
  <a-drawer
    style="border-radius: 100%"
    :width="100"
    :height="120"
    class="drawer"
    :closable="false"
    placement="bottom"
    :visible="visible"
    @close="onClose"
  >

123213
  </a-drawer>
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
      visible:false
    };
  },
  computed: {
    ...mapWritableState(tableStore, ["appDate", "clockEvent"]),
  },
  methods: {
    onContextMenuClick(e) {
      console.log(e);
    },
    showDrawer()  {
      this.visible = true;
    },
     onClose() {
     this.visible = false;
    }
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
.drawer{
  margin: 10em;
}
</style>
