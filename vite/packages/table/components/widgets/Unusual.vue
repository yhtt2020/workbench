<template>
  <div
    class="flex flex-col items-center justify-center w-full h-full primary-text"
  >
    <xt-ify-icon :icon="newIcon" size="56" class="mb-4" />


    <template v-if="disableEdit">
      <div class="mb-4 xt-text-2 font-14" v-if="description">
        {{ description }}
      </div>
    </template>

    <template v-else>
      <div class="mb-4 xt-text-2 font-14" v-if="title">
        {{ title }}
      </div>
    </template>

    <div class="flex w-full items-center justify-center" v-if="!disableEdit">
      <xt-button
        v-if="normalButtonTitle"
        type="primary"
        style="width: auto !important;padding: 0 16px;"
        h="32"
        :radius="8"
        @click="add"
        :style="addButtonTitle ? { marginRight:'12px', } : {}"
      >
        {{ normalButtonTitle }}
      </xt-button>
      <template v-if="menuAble">
        <xt-menu :menus="menuList" model="click" name="name" fn="cb">
          <xt-button
            type="text"
            h="32"
            style="width: auto !important;padding: 0 16px;"
            :style="{ background: `${buttonColor}` }"
            :radius="8"
          >
            {{ addButtonTitle }}
          </xt-button>
        </xt-menu>
      </template>

      <template v-else>
        <xt-button
          @click="addEvent"
          type="theme"
          v-if="addButtonTitle"
          h="32"
          style="width: auto !important;padding: 0 16px;"
          :radius="8"
        >
          {{ addButtonTitle }}
        </xt-button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from "vue";

const emit = defineEmits(['back']);

export interface unusualType {
  // 新图标
  newIcon?: string;
  // 普通按钮的文字描述
  normalButtonTitle: string;
  // 添加按钮的文字描述
  addButtonTitle?: string;
  // 是否开启右键下拉菜单
  menuAble?: boolean;
  // 下拉菜单列表
  menuList?: any;
  buttonColor?: any;
  // 标题
  title?: string;
  // 是否可以编辑
  disableEdit?: boolean;
  description?:string;
}

const props = withDefaults(defineProps<unusualType>(), {
  newIcon: "",
  normalButtonTitle: "",
  addButtonTitle: "",
  menuAble: false,
  buttonColor: "",
  title: "",
  disableEdit: false,
  description: "",
});
const { newIcon, normalButtonTitle, addButtonTitle, menuAble, buttonColor,title,disableEdit,description } =
  toRefs(props);


// 添加
const  add = () => {
  emit('back');
}

const addEvent=()=>{
  emit('add')
}

</script>

<style lang="scss" scoped>
</style>
