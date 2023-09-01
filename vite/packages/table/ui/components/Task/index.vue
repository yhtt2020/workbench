<template>
  <xt-mask :modelValue="modelValue">
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
  },

  mounted() {
    this.createTour();
    this.tour.start();
  },
});
</script>
<style lang="scss">
.shepherd-content {
  background: var(--modal-bg) !important;
  border: 1px solid var(--divider) !important;
}
.shepherd-element {
  margin-top: 12px;
  background: none;
}
.shepherd-text {
  color: var(--primary-text) !important;
}
.shepherd-arrow:before {
  border: 1px solid var(--divider) !important;
  background: var(--modal-bg) !important;
}
</style>
