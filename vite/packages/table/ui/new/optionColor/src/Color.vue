<template>
  <div class="w-full pb-2 rounded-xl xt-bg-2">
    <template v-if="switch">
      <div class="item-box">
        <div
          class="flex items-center justify-center mr-4 item"
          :key="item"
          :style="{ background: props.colorList[`${'color' + item}`] }"
          v-for="(item, index) in colorNum"
          @click="chooseBg(item)"
        >
          <xt-new-icon
            v-show="color == colorList[`${'color' + item}`]"
            icon="ri:checkbox-circle-fill"
            size="20"
          ></xt-new-icon>
        </div>
        <!-- <span class="mt-2">其他：</span> -->
        <!-- <color-picker
          v-model:pureColor="color"
          v-on:update:pureColor="updateBackground"
          :defaultList="colorList"
          :linearList="linearList"
          :isLinear="isLinear"
        /> -->
        <ColorPicker
          v-model:color="color"
          @change="updateBackground"
          :defaultList="colorList"
          :linearList="linearList"
          :isLinear="isLinear"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, toRefs, onMounted } from "vue";
import ColorPicker from "./components/ColorPicker.vue";
export interface colorProps {
  switch?: boolean;
  color?: string;
  colorList?: any;
  linearList?: any;
  // 是否有渐变
  isLinear?: boolean;
  // 显示颜色数量
  colorNum?: number;
}
const props = withDefaults(defineProps<colorProps>(), {
  switch: true,
  colorList: {
    color1: "#508BFE",
    color2: "#815BD0",
    color3: "#C8BF55",
    color4: "#DE5D5D",
    color5: "#57BF60",
    color6: "#DE5DB3",
    color7: "#000000",
    color8: "#808080",
    color9: "#43CADE",
    color10: "#FFFFFF",
  },
  linearList: {
    color1: " linear-gradient(135deg, #A8A9EE 0%, #3398DA 100%)",
    color2: " linear-gradient(135deg, #CEA8EE 0%, #333ADA 100%)",
    color3: " linear-gradient(135deg, #549FA6 0%, #33DA9E 100%)",
    color4: " linear-gradient(135deg, #EEA8A8 0%, #DA337A 100%",
    color5: "  linear-gradient(135deg, #C0EEA8 0%, #DAAD33 100%)",
    color6: "  linear-gradient(135deg, #D55E5E 0%, #DA6733 100%)",
    color7: "  linear-gradient(135deg, #A8BCEE 0%, #3363DA 100%)",
    color8: " linear-gradient(135deg, #EEA8A8 0%, #33B4DA 100%)",
    color9: "  linear-gradient(135deg, #EEA8A8 0%, #B633DA 100%)",
    color10: " linear-gradient(135deg, #A8EEA8 0%, #3354DA 100%)",
    color11: 'linear-gradient(to right, rgb(0, 0, 0), rgb(67, 67, 67))',
    color12:'linear-gradient(to right, rgb(118, 184, 82), rgb(141, 194, 111))',
  },
  isLinear: true,
  colorNum: 6,
});
const { colorNum,color} = toRefs(props);
// 按钮回调
const emit = defineEmits(["update:color", "cb"]);
const chooseBg = (item) => {
  // 双击取消
  colorIndex.value === item ? colorIndex.value = 0 : colorIndex.value = item
  emit("update:color", props.colorList[`${"color" + colorIndex.value}`]);
  emit("cb", props.colorList[`${"color" + colorIndex.value}`]);
};
const updateBackground = (item) => {
  emit("cb", item);

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
:deep(.vc-color-wrap){
  width:40px;
  height:40px;
  border-radius: 10px;
}
</style>
