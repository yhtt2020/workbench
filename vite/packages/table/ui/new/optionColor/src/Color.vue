<template>
  <div class="w-full pb-2 rounded-xl xt-bg-2">
    <template v-if="switch">
      <div class="item-box">
        <div class="flex items-center justify-center mr-4 item" :key=" item "
          :style=" { background: props.colorList[`${'color' + item}`] } " v-for="   item, index    in   6   "
          @click="chooseBg(item)">
          <xt-new-icon
            v-show="color == colorList[`${'color' + item}`]"
            icon="ri:checkbox-circle-fill"
            size="20"
          ></xt-new-icon>
        </div>
        <colorP @change=" updateBackground " />
      </div>

    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, toRefs } from "vue";
import colorP from '../../../../components/desk/navigationBar/components/EditIcon/Children/colorP.vue'
export interface colorProps {
  switch?: boolean;
  color?: string;
  colorList?: any;
}
const props = withDefaults(defineProps<colorProps>(), {
  switch: true,
  colorList: {
    color1: '#508BFE',
    color2: '#815BD0',
    color3: '#C8BF55',
    color4: '#DE5D5D',
    color5: '#57BF60',
    color6: '#DE5DB3',
  }
});
const { color } = toRefs(props);
// 按钮回调
const emit = defineEmits(["update:color"]);
const chooseBg = (item) => {
  colorIndex.value = item;
  emit("update:color", props.colorList[`${"color" + item}`]);
};
const updateBackground = (item) => {
  console.log("item :>> ", item);
  
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
