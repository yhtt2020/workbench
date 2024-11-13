<template>
  <div class="flex items-center">
    <div class="flex items-center justify-center rounded-xl xt-bg h-[38px] w-[40px]" style="border: 1px solid var(--divider);">
      <xt-mix-icon
        :type="isIfy"
        class="xt-bg"
        :maskIndex="99999999"
        :bg="bg"
        v-model:icon="currentIcon"
        boxR="10px"
        :select="true"
        :upload="upload"
        @cb="updateIcon"
        ref="iconRef"
        :menus="menus"
      />
    </div>
    <div class="ml-3" style="width: 100%; height: 40px">
      <xt-input
        class="xt-b xt-bg-t-2"
        v-model="currentInput"
        @blur="updateInput"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, toRefs, onMounted, computed } from "vue";
import { checkIsIfyIcon } from "../../../../components/card/hooks/addCardToNav";
const props = defineProps({
  icon: {
    type: String,
    default:
      "https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/jmPD-I__T-SMyc-LMzn",
  },
  bg: {
    default: "var(--main-bg)",
  },
  input: {},
  upload:{
    default:true
  },
  menus:{
    default:()=>{
      return ["icon", "emoji","截图"]
    }
  }
});
const { icon } = toRefs(props);
const currentIcon = ref(props.icon);
const currentInput = ref(props.input);
const emits = defineEmits(["update:icon", "cb", "update:input"]);
const updateIcon = (icon) => {
  currentIcon.value = icon;

  console.log("icon :>> ", icon);
  emits("update:icon", icon);
  emits("cb", icon);
};

const updateInput = () => {
  emits("update:input", currentInput.value);
};

const isIfy = computed(() => {
  return checkIsIfyIcon(currentIcon.value).value ? 'ify' : 'select'
})

watch(
  () => icon.value,
  (newV) => {
    currentIcon.value = newV;
  }
);
const iconRef=ref()
const showUpload=()=>{
  iconRef.value.showUpload()
}

defineExpose({showUpload})
</script>

<style lang="scss" scoped></style>
