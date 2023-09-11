<template>
  <template v-if="modelValue">
    <xt-mask :modelValue="true"> </xt-mask>
    <Teleport to="body">
      <div
        class="fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 rounded-xl xt-modal xt-shadow p-3"
        style="z-index: 99999999"
      >
        <div class="flex items-center justify-center">
          <div
            style="
              border-radius: 50%;
              background: var(--warning);
              width: 21px;
              height: 21px;
              color: #000;
            "
            class="xt-base-btn"
          >
            i
          </div>
          <div class="xt-text text-base ml-4">提示</div>
        </div>
        <div class="my-3">
          {{ text }}
        </div>
        <div class="flex  justify-center">
          <xt-button @click="onNo()">取消</xt-button>
          <xt-button class="ml-3" type="theme" @click="onOk()">确定</xt-button>
        </div>
      </div>
    </Teleport>
  </template>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    default: true,
  },
  text: {},
});

const emits = defineEmits(["ok", "no"]);

const onNo = () => {
  emits("no");
};
const onOk = () => {
  emits("ok");
};
</script>

<style lang="scss" scoped></style>
