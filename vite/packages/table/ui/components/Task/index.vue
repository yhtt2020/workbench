<template>
  <xt-mask :modelValue="modelValue">
    <div style="z-index: 999999" ref="el" @click.prevent.stop="next($event)">
      <slot></slot>
    </div>
  </xt-mask>
</template>

<script>
import { defineComponent } from "vue";
import { guide } from "./guide";
import { taskStore } from "../../../apps/task/store";
import { mapWritableState } from "pinia";

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
    fn: {},
  },
  computed: {
    ...mapWritableState(taskStore, ["taskID", "step"]),
    task() {
      return guide[this.taskID][this.step];
    },
  },
  watch: {
    modelValue: {
      handler(newV) {
        this.$nextTick(() => {
          if (newV) {
            this.start();
          } else {
            if (this.tour) {
              // this.tour.destroy();
            }
          }
        });
      },
      immediate: true,
    },
  },
  methods: {
    next(event) {
      if (!this.modelValue) return;
      event.stopPropagation(); // 阻止事件冒泡
      this.action();
    },
    action() {
      this.tour.next();
      this.step++;
      this.$emit("cb");
      if (this.task?.flag) {
        console.log("任务以完成 :>> ");
      }
    },
    start() {
      this.$nextTick(() => {
        setTimeout(() => {
          this.createTour();
          this.tour.start();
        }, this.task?.time ?? 0);
      });
    },
    createTour() {
      this.tour = this.$shepherd({
        useModalOverlay: true,
      });

      this.tour.addStep({
        attachTo: { element: this.$refs.el, on: this.task?.position ?? "top" },
        text: this.task.text,
        title: this.task.title,
        buttons: [
          {
            text: "下一步",
            action: (tour) => {
              this.action();
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

<style>
.tour-step {
  margin-bottom: 20px;
  text-align: center;
  border: 1px solid #ccc;
  padding: 20px;
}
.shepherd-element {
  border: 1px solid var(--divider) !important;
}
.shepherd-content,
.shepherd-header {
  background: var(--modal-bg) !important;
}
.shepherd-element {
  z-index: 9999999999999 !important;
  margin-top: 12px;
  background: none;
}
/* 内容文本 */
.shepherd-text {
  color: var(--primary-text) !important;
}
.shepherd-title {
  font-size: 16px !important;
  color: var(--primary-text) !important;
}
.shepherd-button {
  background: var(--active-bg) !important;
}
/* 箭头 */
.shepherd-arrow:before {
  z-index: 9999999999999 !important;
  border: 1px solid var(--divider) !important;
  background: var(--modal-bg) !important;
}
</style>
