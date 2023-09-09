<template>
  <div
    style="opacity: 1000"
    :style="{ zIndex: zIndexValue }"
    ref="el"
    @click.prevent.stop="next($event)"
    @contextmenu.prevent.stop="next($event)"
  >
    <slot></slot>
  </div>
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
    ...mapWritableState(taskStore, ["taskID", "step",'success']),
    task() {
      return guide[this.taskID][this.step];
    },
    zIndexValue() {
      return this.modelValue ? 99999999999 : null;
    },
    currentStep() {
      let length = this.taskID ? guide[this.taskID]?.length - 2 : 0;
      let next = this.task?.next ? this.task?.next : "下一步";
      return `${next} ${this.step} / ${length}`;
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
      console.log('next :>> ', );
      this.action();
      event.stopPropagation(); // 阻止事件冒泡  
    },
    action() {
      this.$emit("cb");
      this.tour.next();
      this.step++;
      console.log('action :>> ', this.task.success);
      console.log('this.step :>> ', this.step);
      if (this.task.success) {
        console.log("任务以完成 :>> ");
        this.success = true
        // 发奖励
       
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
            text: this.currentStep,
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
  padding-bottom: 0 !important;
}
.shepherd-element {
  z-index: 9999999999999 !important;
  margin-top: 12px;
  background: none;
}
/* 内容文本 */
.shepherd-text {
  color: var(--primary-text) !important;
  font-size: 14px !important;
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
.shepherd-modal-overlay-container.shepherd-modal-is-visible {
  z-index: 9999999999999999 !important;
}
</style>
