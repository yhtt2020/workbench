<template>
  <XtZoom v-model:width="w" v-model:height="h">
    <div
      class="xt-bg xt-shadow rounded-xl xt-text relative controller"
      :style="[size]"
    >
      <XtBaseIcon
        @click="iconsRightClick()"
        icon="gengduo1"
        class="absolute icon"
        style="right: 4px; top: 4px"
      ></XtBaseIcon>
      <div class="text-center">{{ groupTitle }}</div>
      <div class="flex flex-wrap">
        <div
          v-for="(item, index) in iconList"
          @contextmenu.prevent.stop="rightClick(index)"
          @click="rightClick(index)"
        >
          <Icon v-bind="item" :index="index" size="icons" :data-index="index">
          </Icon>
        </div>
        <div
          style="width: 93px; height: 90px"
          class="flex justify-center items-center flex-col cursor-pointer"
          @click="fullScreenClick($event)"
          v-if="iconList.length > 5"
        >
          <XtIcon icon="gengduo1" w="40"></XtIcon>
          <div class="truncate w-full text-center mt-2">更多</div>
        </div>
      </div>
    </div>
  </XtZoom>
  <XtDrawer v-model:data="visible">
    <Set
      @editIcons="editIcons(index)"
      @deleteIcons="deleteIcons(index)"
      v-model:data="visible"
    ></Set>
  </XtDrawer>
</template>

<script>
import Icon from "../components/icon.vue";
import Set from "./Set.vue";
export default {
  props: {
    width: {},
    height: {},
    iconList: {
      type: Object,
      default: () => {},
    },
    groupTitle: {
      type: String,
    },
    zoom: {
      type: Object,
    },
  },
  data() {
    return {
      index: 0,
      visible: false,
      w: this.width,
      h: this.height,
    };
  },
  watch: {
    w(newV) {
      this.$emit("update:width", newV);
    },
    h(newV) {
      console.log("HHHHH newV :>> ", newV);
      this.$emit("update:height", newV);
    },
  },
  components: {
    Set,
    Icon,
  },
  methods: {
    iconsRightClick() {
      this.$emit("iconsRightClick");
    },
    rightClick(index) {
      this.index = index;
      this.visible = true;
    },
    fullScreenClick(event) {
      this.$emit("fullScreenClick", event);
    },
    // 删除多图标组件中的单个图标
    deleteIcons(index) {
      this.$emit("deleteIcons", index);
    },
    // 编辑多图标组件中的单个图标
    editIcons(index) {
      this.$emit("editIcons", index);
    },
  },
  computed: {
    size() {
      console.log('this.h :>> ', this.h);
      return {
        width: `${this.w}px`,
        height: `${this.h}px`,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.icon {
  display: none;
}
.controller:hover .icon {
  display: block !important;
}
</style>
