<template>
  <div class="w-full rounded-xl xt-bg-2 pb-3">
    <template v-if="switch">
      <div class="item-box">
        <div
          class="flex items-center justify-center mr-4 item"
          :key="item"
          :style="{ background: colorList[`${'color' + item}`] }"
          v-for="(item, index) in 14"
          @click="chooseBg(item)"
        >
          <xt-new-icon
            v-show="color == colorList[`${'color' + item}`]"
            icon="ri:checkbox-circle-fill"
            size="20"
          ></xt-new-icon>
        </div>
      </div>
      <div
        class="h-[1px] w-full mt-4 mb-4"
        style="background: var(--divider)"
      ></div>
      <div class="mt-4 text-base xt-text">更多颜色</div>
      <ColorPicker
        v-model:color="colorPicker"
        :w="40"
        :h="40"
        @update:color="updateBackground"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, toRefs } from "vue";
import ColorPicker from "../../../components/ColorPicker/ColorPicker.vue";
export interface colorProps {
  switch?: boolean;
  color?: string;
}
const props = withDefaults(defineProps<colorProps>(), {
  switch: true,
});
const { color } = toRefs(props);
// 按钮回调
const emit = defineEmits(["update:color"]);
const colorPicker = ref("#ffffff");
const colorList = ref({
  color1: "#508BFE",
  color2: "#815BD0",
  color3: "#C8BF55",
  color4: "#DE5D5D ",
  color5: "#57BF60",
  color6: "#DE5DB3",
  color7: "#000000",
  color8: "#7F9CA5",
  color9: "#505050",
  color10: "#43607D",
  color11: "#3A5976",
  color12: "#4F4F80",
  color13: "#804F4F",
  color14: "#FFFFFF",
});
const chooseBg = (item) => {
  colorIndex.value = item;
  emit("update:color", colorList.value[`${"color" + item}`]);
};
const updateBackground = (item) => {
  emit("update:color", item);
};
const colorIndex = ref(0);
</script>

<style lang="scss" scoped>
.item {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  cursor: pointer;
  margin-bottom: 16px;
}
.item-box {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}
</style>
