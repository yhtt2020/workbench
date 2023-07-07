<template>
  <Teleport to="body">
    <div
      class="h-full w-full xt-mask-2 fixed top-0 left-0 flex"
      style="z-index: 99990"
    >
      <div
        style="width: 100%;z-index: 999901"
        
        @click.stop=""
        class="flex justify-center items-center"
      >
        <slot name="left"></slot>
      </div>

      <div class="flex-1">
        <div
          class="p-4 xt-modal"
          style="width: 500px; height: 100%; overflow-y: scroll"
        >
          <slot name="right"></slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script>
import Icon from "./icon.vue";
import Edit from "./edit.vue";
export default {
  props: {
    data: {},
  },
  components: {
    Edit,
    Icon,
  },
  data() {
    return {
      iconObj: null,
    };
  },
  methods: {
    close() {
      this.$emit("close");
    },
    getIconObj(data) {
      this.iconObj = { ...data };
      console.log("1 :>> ", this.iconObj);
    },
  },
};
</script>

<style lang="scss" scoped></style>
