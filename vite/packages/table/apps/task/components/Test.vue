<template>
  <xt-button @click="test()">开始游览</xt-button>
  <div class="tour-step" ref="el">步骤1</div>
  <div class="tour-step" ref="el1">步骤2</div>
  <div class="tour-step" ref="el2">步骤3</div>
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
    test() {
      this.createTour();
      this.tour.start();
    },
    createTour() {
      this.tour = this.$shepherd({
        useModalOverlay: true,
      });

      //   this.tour.addStep({
      //     attachTo: { element: this.$refs.el, on: "top" },
      //     text: "Test",
      //     buttons: [
      //       {
      //         text: "下一步",
      //         action: (tour) => {
      //           // 在这里处理按钮点击事件，例如跳转到下一个导览步骤
      //           tour.next();
      //         },
      //       },
      //     ],
      //   });
      this.tour.addSteps([
        {
          canClickTarget: false,
          attachTo: { element: this.$refs.el, on: "bottom" },
          title: "顶部导航",
          text: "内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容。",
          buttons: [
            {
              action() {
                return this.next();
              },
              text: "下一步(1/3)",
            },
          ],
        },
        // 2
        {
          canClickTarget: false,
          attachTo: { element: this.$refs.el1, on: "bottom" },
          title: "新手引导",
          text: "点击打开新手引导的操作按钮。",
          buttons: [
            {
              action() {
                return this.next();
              },
              text: "下一步",
            },
          ],
        },
        // 3
        {
          attachTo: { element: this.$refs.el2, on: "bottom" },
          title: "操作按钮",
          text: "操作按钮操作按钮操作按钮操作按钮。",
          buttons: [
            {
              action() {
                return this.cancel();
              },
              text: "完成",
            },
          ],
        },
      ]);
    },
  },

  mounted() {},
});
</script>

<style>
.tour-step {
  margin-bottom: 20px;
  text-align: center;
  border: 1px solid #ccc;
  padding: 20px;
}
</style>
