<template>
  <xt-zoom v-model:width="w" v-model:height="h" :style="[size]">
    <div
      class="xt-bg xt-shadow rounded-xl xt-text relative controller"
      :style="[size]"
    >
      <XtBaseIcon
        @click="iconsRightClick()"
        icon="gengduo1"
        class="absolute icon"
        style="right: 8px; top: 4px"
      ></XtBaseIcon>
      <div
        class="text-center cursor-pointer mx-auto truncate flex  justify-center items-center"
        :style="[titleSize]"
        style="height: 30px;"
        @click="titleVisible = true"
      >
        {{ groupTitle }}
      </div>
      <div class="flex flex-wrap justify-between">
        <div v-for="i in count" @contextmenu.prevent.stop="rightClick(i - 1)">
          <Icon
            v-if="iconList[i - 1]"
            v-bind="iconList[i - 1]"
            :index="i - 1"
            :size="icons"
            :data-index="i - 1"
            :state="true"
          >
          </Icon>
        </div>
        <div
          :style="[iconsState]"
          class="flex justify-center items-center flex-col cursor-pointer xt-hover rounded-xl"
          @click="fullScreenClick($event)"
          v-if="iconList.length > count"
        >
          <XtIcon icon="gengduo1" w="38"></XtIcon>
          <div
            class="truncate w-full text-center text-xs"
            style="margin-top: 6px"
          >
            更多
          </div>
        </div>
        <!-- 占位 -->
        <div
          v-for="i in blankLabel"
          :key="`placeholder-${i}`"
          style="width: 93px; height: 99px"
        ></div>
      </div>
    </div>
  </xt-zoom>
  <XtDrawer v-model="visible">
    <Set
      @editIcons="editIcons(index)"
      @deleteIcons="deleteIcons(index)"
      v-model:data="visible"
    ></Set>
  </XtDrawer>
  <Teleport to="body">
    <xt-old-modal
      v-model="titleVisible"
      @close="titleVisible = false"
      title="修改分组名"
      :isFooter="false"
    >
      <div class="h-12" style="width: 400px">
        <XtInput v-model="title" @blur="titleBlur()"></XtInput>
      </div>
    </xt-old-modal>
  </Teleport>
</template>

<script>
import Icon from "../components/icon.vue";
import Set from "./Set.vue";
import XtZoom from "../../../../ui/components/Zoom/index.vue";
import { sizeValues } from "../components/iconConfig";
import { message } from "ant-design-vue";
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
      count: 0,
      icons: "icons1",
      titleVisible: false,
      title: this.groupTitle,
    };
  },
  watch: {
    w: {
      async handler(newV) {
        await this.setIconState();
        this.getAppCount();
        this.$emit("update:width", newV);
      },
      immediate: true,
    },
    async h(newV) {
      await this.setIconState();
      this.getAppCount();
      this.$emit("update:height", newV);
    },
  },
  components: {
    Set,
    Icon,
    XtZoom,
  },
  beforeMount() {
    this.getAppCount();
  },
  methods: {
    titleBlur() {
      message.success("成功修改分组名");
      this.$emit("updateGroupTitle", this.title);
    },
    setIconState() {
      if (parseFloat(this.h) > 280) {
        this.icons = "icons2";
      } else {
        this.icons = "icons1";
      }
    },
    getAppCount() {
      const w = parseFloat(this.w);
      const h = parseFloat(this.h);
      const title = 30 * w;
      let icons = w * h - title;
      let icon = sizeValues[this.icons].w * sizeValues[this.icons].h;

      let res = parseInt(icons / icon - 1);
      this.count = res;
    },
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
    titleSize() {
      let w = parseFloat(this.w) - 80;
      return {
        width: w + "px",
      };
    },
    size() {
      return {
        width: `${this.w} !important`,
        height: `${this.h} !important`,
      };
    },
    blankLabel() {
      let row = parseFloat(this.w) / sizeValues[this.icons].w;
      row = parseInt(row);
      let count = this.iconList.length;
      if (count > this.count) {
        count++;
      }
      const item = count % row;
      return item === 0 ? 0 : row - item;
    },
    iconsState() {
      return {
        width: `${sizeValues[this.icons].w}px !important`,
        height: `${sizeValues[this.icons].h}px !important`,
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

:deep(.box) {
  height: 86px !important;
}
</style>
