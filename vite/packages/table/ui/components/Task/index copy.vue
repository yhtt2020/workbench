<template>
  <xt-mask :modelValue="false">
    <div ref="el" class="box">
      <slot></slot>
    </div>
  </xt-mask>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      tour: null,
    };
  },
  props: {
    modelValue: {
      default: false,
    },
  },
  methods: {
    createTour() {
      this.tour = this.$shepherd({
        useModalOverlay: true,
      });

      this.tour.addStep({
        attachTo: { element: this.$refs.el, on: "top" },
        text: "Test",
      });
    },
    start() {
      this.createTour();
      this.tour.start();
    },
  },
  mounted() {},
  watch: {
    modelValue(newV) {
      console.log("newV :>> ", newV);
      if (newV) {
        this.start();
      } else {
        this.tour.hide();
      }
    },
  },
});
</script>

<style lang="scss">
// .shepherd-content {
//   background: var(--modal-bg) !important;
//   border: 1px solid var(--divider) !important;
// }
// .shepherd-element {
// //   margin-top: 12px;
//   background: none;
// }
// .shepherd-text {
//   color: var(--primary-text) !important;
// }
// .shepherd-arrow:before {
//   border: 1px solid var(--divider) !important;
//   background: var(--modal-bg) !important;
// }
</style>
