<template>
  <xt-mask :modelValue="false">
    1
    <div ref="el">Testing</div>
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
