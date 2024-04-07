<template>
  <xt-selectIcon
    :defaultIcon="modelValue"
    :maskIndex="maskIndex"
    :menus="menus"
    :isUpload="upload"
    v-model="visible"
    v-if="visible"
    @getAvatar="getAvatar"
    ref="icon"
  ></xt-selectIcon>
  <div
    class="flex items-center justify-center overflow-hidden pointer"
    :style="{
      height: `${boxH}px`,
      width: `${boxW}px`,
      'border-radius': `${boxR}`,
      background: bg,
      pointer: click ? 'pointer' : false,
    }"
    @click="visible = click"
  >
    <img
      :src="avatarUrl"
      alt=""
      :style="{
        filter: color ? `drop-shadow(#${color} 1000px 0)` : '',
        transform: color ? 'translateX(-1000px)' : '',
        height: h + 'px',
        width: w + 'px',
        'border-radius': `${r}`,
        'object-fit': fit,
      }"
    />
  </div>
</template>

<script setup>
import {
  ref,
  toRefs,
  onMounted,
  onBeforeUnmount,
  computed,
  watch,
  nextTick,
} from "vue";
const visible = ref("");

const props = defineProps({
  // 选择器数组
  menus: {
    default: () => {
      return ["icon", "emoji"];
    },
  },
  // 默认返回图标
  modelValue: {
    default:
      "https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/jmPD-I__T-SMyc-LMzn",
  },
  maskIndex: {
    default: 900,
  },
  // 是否支持点击打开选择器
  click: {
    default: true,
  },
  upload: {
    default: false,
  },
  // 外部宽
  boxW: {
    default: 40,
  },
  // 外部高
  boxH: {
    default: 40,
  },
  // 外部圆角
  boxR: {
    default: 0,
  },
  // 内部宽
  w: {
    default: 20,
  },
  // 内部高
  h: {
    default: 20,
  },
  // 圆角
  r: {
    default: 0,
  },
  // 背景
  bg: {
    default: "",
  },
  fit: {
    default: "cover",
  },
});
const avatarUrl = ref(props.modelValue);
const { modelValue } = toRefs(props);
const emits = defineEmits(["update:modelValue", "cb"]);
const color = computed(() => {
  if (avatarUrl.value.indexOf("color=") >= 0) {
    let colors = avatarUrl.value.substr(avatarUrl.value.indexOf("color=") + 7);
    return colors;
  }
});
// 获取头像
const getAvatar = (avatar) => {
  avatarUrl.value = avatar;
  emits("update:modelValue", avatarUrl.value);
  emits("cb", avatarUrl.value);
};

watch(
  () => modelValue.value,
  (newV) => {
    avatarUrl.value = newV;
  }
);

const icon = ref(null);
const randomIcon = () => {
  visible.value = true;
  return new Promise((resolve) => {
    setTimeout(() => {
      let res = icon.value.onRandom();
      resolve(res);
    }, 1);
  });
};

defineExpose({
  randomIcon,
});
onMounted(() => {});
</script>

<style lang="scss" scoped></style>
