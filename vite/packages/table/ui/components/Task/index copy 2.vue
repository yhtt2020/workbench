<template>
  <xt-mask :modelValue="modelValue">
    <div ref="el" class="box">
      <slot></slot>
    </div>
  </xt-mask>
</template>

<script>
import { defineComponent } from "vue";

// export default defineComponent({
//   data() {
//     return {
//       tour: null,
//     };
//   },
//   props: {
//     modelValue: {
//       default: false,
//     },
//   },
//   methods: {
//     createTour() {
//       this.tour = this.$shepherd({
//         useModalOverlay: true,
//       });

//       this.tour.addStep({
//         attachTo: { element: this.$refs.el, on: "top" },
//         text: "Test",
//       });
//       this.tour.hide();

//       console.log("this.tour :>> ", this.tour);
//     },
//     start() {
//       this.createTour();
//       this.tour.start();
//     },
//   },

//   mounted() {
//     // this.createTour();
//     // this.tour.start();
//   },
//   watch: {
//     modelValue: {
//       handler(newV) {
//         if (newV) {
//           if (this.tour) {
//             this.tour.show();
//           } else {
//             this.start();
//           }
//         } else {
//           if (this.tour) {
//             this.tour.hide();
//           }
//         }
//       },
//       immediate: true,
//     },
//   },
// });
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
  watch: {
    modelValue: {
      handler(newV) {
        console.log("watch :>> ");
        if (newV) {
          if (this.tour) {
            console.log("2 :>> ", 2);
            this.tour.show();
          } else {
            console.log("1 :>> ", 1);
            this.test();
          }
        } else {
          if (this.tour) {
            this.tour.hide();
          }
        }
      },
      immediate: true,
    },
  },
  methods: {
    test() {
      console.log("123 :>> ", 123);
      this.createTour();
      this.tour.start();
    },
    createTour() {
      this.tour = this.$shepherd({
        useModalOverlay: true,
      });

      this.tour.addStep({
        attachTo: { element: this.$refs.el, on: "top" },
        text: "Test",
        buttons: [
          {
            text: "下一步1",
            action: (tour) => {
              // 在这里处理按钮点击事件，例如跳转到下一个导览步骤
              // tour.next();
              // return this.cancel();
            },
          },
        ],
      });
      // this.tour.addSteps([
      //   {
      //     canClickTarget: false,
      //     attachTo: { element: this.$refs.el, on: "bottom" },
      //     title: "顶部导航",
      //     text: "内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容。",
      //     buttons: [
      //       {
      //         action() {
      //           return this.next();
      //         },
      //         text: "下一步(1/3)",
      //       },
      //     ],
      //   },
      //   // 2
      //   {
      //     canClickTarget: false,
      //     attachTo: { element: this.$refs.el1, on: "bottom" },
      //     title: "新手引导",
      //     text: "点击打开新手引导的操作按钮。",
      //     buttons: [
      //       {
      //         action() {
      //           return this.next();
      //         },
      //         text: "下一步",
      //       },
      //     ],
      //   },
      //   // 3
      //   {
      //     attachTo: { element: this.$refs.el2, on: "bottom" },
      //     title: "操作按钮",
      //     text: "操作按钮操作按钮操作按钮操作按钮。",
      //     buttons: [
      //       {
      //         action() {
      //           return this.cancel();
      //         },
      //         text: "完成",
      //       },
      //     ],
      //   },
      // ]);
    },
  },

  mounted() {},
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
