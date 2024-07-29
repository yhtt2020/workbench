<template>
  <xt-selectIcon
    v-if="visible"
    v-model="visible"
    @getAvatar="getIconUrl"
    :defaultIcon="icon"
    :maskIndex="index"
    :menus="menus"
    :isUpload="upload"
  />
  <!-- <div class="inline-block"> -->
  <div
    class="flex items-center justify-center cursor-pointer xt-text-2"
    :class="class"
    :style="[style, boxStyle]"
    @click="onClick"
  >
    <img
      v-if="currentType == 'select'"
      :src="iconUrl"
      :class="iconClass"
      :style="[
        iconStyle,
        mixIconStyle,
        {
          filter: color ? `drop-shadow(#${color} 1000px 0)` : '',
          transform: color ? 'translateX(-1000px)' : '',
        },
      ]"
    />
    <IfyIcon
      v-else-if="currentType == 'ify'"
      :icon="icon"
      :style="[iconStyle, mixIconStyle]"
      :class="iconClass"
    />
  </div>
  <!-- </div> -->
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { Icon as IfyIcon } from "@iconify/vue";

const visible = ref("");
const mixIconStyle = computed(() => {
  return {
    width: (props.w || props.size) + "px",
    height: (props.h || props.size) + "px",
    "border-radius": props.r + "px",
  };
});

const boxStyle = computed(() => {
  return {
    width: (props.boxW || props.boxSize || props.w || props.size) + "px",
    height: (props.boxH || props.boxSize || props.h || props.size) + "px",
    borderRadius: props.boxR + "px",
  };
});

const props = defineProps({
  class: {
    type: String,
    default: "xt-bg",
  },
  style: {},
  iconClass: {},
  iconStyle: {},
  /**
   * 现在无需传入了 内部通过currentType自行判断
   * select ify
   */
  type: {
    type: String,
    default: "ify",
  },
  icon: {
    default: "majesticons:monitor-line",
    required: true,
  },
  size: {
    default: 20,
  },
  w: {
    default: 0,
  },
  h: {
    default: 0,
  },
  boxSize: 0,
  boxW: {
    default: 0,
  },
  boxH: {
    default: 0,
  },
  // 选择器数组 icon ify图标 emoji表情 goods商品
  menus: {
    default: () => {
      return ["icon", "emoji"];
    },
  },
  index: {
    default: 999999999,
  },
  // 是否支持点击打开选择器
  select: {
    default: false,
  },
  // 是否开启自定义上传图标
  upload: {
    default: false,
  },
  // 外部圆角
  boxR: {
    default: 12,
  },
  // 圆角
  r: {
    default: 6,
  },
});
const currentType = computed(() => {
  let icon = iconUrl.value;

  if (typeof icon !== "string") {
    return "ify";
  }
  // 网络路径判断
  const networkPath = icon.substring(0, 4);
  if (networkPath === "http") {
    return "select";
  }

  // 本地路径判断
  const localPath = icon.substring(0, 1);
  if (localPath === "." || localPath === "/") {
    return "select";
  }
  let local = icon.split(".");
  if (local.length > 1) {
    return "select";
  }

  // 不满足属于其他图标
  return "ify";
});
const emits = defineEmits(["update:icon", "cb", "click"]);

const onClick = () => {
  visible.value = props.select;
  emits("click");
};

const iconUrl = ref(props.icon);
const color = computed(() => {
  if (
    typeof iconUrl.value === "string" &&
    iconUrl.value?.indexOf("color=") >= 0
  ) {
    let colors = iconUrl.value.substr(iconUrl.value.indexOf("color=") + 7);
    return colors;
  }
});
// 获取头像
const getIconUrl = (avatar) => {
  iconUrl.value = avatar;
  emits("update:icon", iconUrl.value);
  emits("cb", iconUrl.value);
};

watch(
  () => props.icon,
  (newV) => {
    iconUrl.value = newV;
  }
);
</script>

<style lang="scss" scoped></style>
