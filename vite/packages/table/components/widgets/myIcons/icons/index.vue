<template>
  <IconsFullScreen
    @updateGroupTitle="updateGroupTitle"
    :groupTitle="groupTitle"
    v-if="isIconsFullScreen"
    @closeFullScreen="closeFullScreen"
    :iconLists="iconList"
    @disbandGroup="disbandGroup"
    @deleteIcons="deleteIcons"
    @editIcons="editIcons"
    @dragAddIcon="dragAddIcon"
  >
  </IconsFullScreen>
  <Custom
    v-if="zoom.state"
    v-model:width="w"
    v-model:height="h"
    :zoom="zoom"
    :groupTitle="groupTitle"
    :iconList="iconList"
    @updateGroupTitle="updateGroupTitle"
    @iconsRightClick="iconsRightClick"
    @fullScreenClick="fullScreenClick"
    @editIcons="editIcons"
    @deleteIcons="deleteIcons"
    @updateWidth="updateWidth"
    @updateHeight="updateHeight"
  ></Custom>
  <div v-else class="item-list no-drag" @click="fullScreenClick($event)">
    <div class="item">
      <template v-for="i in 4">
        <img
          v-if="iconList[i - 1]"
          class="img"
          :src="renderIcon(iconList[i - 1].src)"
          style="object-fit: cover"
        />
        <div v-else class="img"></div>
      </template>
    </div>
    <div class="title xt-text">{{ groupTitle }}</div>
  </div>
</template>

<script>
import IconsFullScreen from "./fullScreen.vue";
import Custom from "./Custom.vue";
import {renderIcon} from '../../../../js/common/common'
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
  components: {
    Custom,
    IconsFullScreen,
  },
  data() {
    return {
      isIconsFullScreen: false, // 全屏开关
      menus: [{ label: "删除", callBack: this.delColor }],
      w: this.width,
      h: this.height,
    };
  },
  watch: {
    w(newV) {
      this.$emit("update:width", newV);
    },
    h(newV) {
      this.$emit("update:height", newV);
    },
  },
  methods: {
    renderIcon,
    iconsRightClick() {
      this.$emit("iconsRightClick");
    },
    fullScreenClick(event) {
      if (event.ctrlKey && event.button === 0) {
        this.$emit("custom-event");
        return;
      }
      this.isIconsFullScreen = true;
    },

    dragAddIcon(icon) {
      this.$emit("dragAddIcon", icon);
    },
    // 多图标全屏模式关闭
    closeFullScreen() {
      this.isIconsFullScreen = false;
    },
    // 解除多图标分组
    disbandGroup() {
      this.$emit("disbandGroup");
    },

    // 更新多图标组件标题
    updateGroupTitle(title) {
      this.$emit("updateGroupTitle", title);
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
};
</script>

<style lang="scss" scoped>
.xt-hover {
  border-radius: 8px;
}

.item-list {
  margin: 0 10px;
  width: 114px;
  height: 96px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  flex-direction: column;
  font-size: 14px;
  cursor: pointer;
  .item {
    margin-top: 10px;
    width: 56px;
    height: 56px;
    background: var(--primary-bg);
    border-radius: 6px;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    justify-content: center;
    align-content: center;

    .img {
      width: 22px;
      height: 22px;
      margin: 2px;
      border-radius: 6px;
    }
  }

  .title {
    margin-top: 4px;
    padding: 0 5px;
    width: 80%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: center;
    height: 18px;
    line-height: 18px;
  }
}
</style>
