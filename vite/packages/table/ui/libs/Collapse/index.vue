<template>
  <div class="box rounded-xl">
    <a-collapse
      ghost
      class="xt-text xt-bg-2 rounded-xl "
      expandIconPosition="right"
      v-model:activeKey="activeKey"
    >
      <a-collapse-panel :show-arrow="showArrow">
        <template #header>
          <slot name="title"> {{ title }}</slot>
        </template>
        <slot>
          {{ content }}
        </slot>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>
<script lang="ts" setup>
import { ref,computed,watch, onMounted } from 'vue';

export interface collapse {
  modelValue:any,
  title:any,
  content:any,
  showArrow:boolean,
  isActive:any,
  index:any,
}

const props = withDefaults(defineProps<collapse>(),{
  title: "test title",
  content:"test content",
  showArrow:false,
  isActive:{},
  index:null,
})

const activeKey = ref(false);
const emits = defineEmits(["update:modelValue", "cb"]);

watch(()=>activeKey.value,(newVal)=>{
  emits("update:modelValue",{val:newVal[0],index:props.index} );
})
</script>

<style lang="scss" scoped>
.ant-collapse {
  border-radius: 12px;
}
.box {
  :deep(.ant-collapse-header) {
    color: var(--primary-text) !important;
  }
  :deep(.ant-collapse-content-box) {
    padding-top: 0 !important;

    color: var(--primary-text) !important;
  }
}
</style>
