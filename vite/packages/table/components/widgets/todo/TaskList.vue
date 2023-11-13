<template>
  <div class="flex items-center justify-center h-full" v-if="!data.length">
    <a-empty description="点击进入待办应用" image="/emoji/sleep.png"></a-empty>
  </div>
  <vue-custom-scrollbar :settings="scrollbarSettings" style="height: 100%">
    <div v-for="(task,index) in data" :key="task.nanoid">
      <div class="task-item">
        <div class="todo-style" style="min-width: 32px">
          <!-- <a-checkbox v-model:checked="task.completed"></a-checkbox> -->
          <a-checkbox @change="changeState($event,task)"></a-checkbox>
        </div>
        <div
          style="
          flex: auto;
          text-wrap: normal;
          word-break: break-all;
          width: 0;
          user-select: text;
        "
        >
          <div
            :class="{ completed: task.completed }"
            class="title truncate"
          >
          <span style="margin-bottom: 0; line-height: 28px;color: var(--primary-text);"
          ><to-top-outlined v-if="task.isTop"/> {{ task.title }}</span
          >
          </div>
          <div class="detail truncate"> {{ task.description }}</div>
        </div>
        <div>
        <span
          style="
            margin-left: 5px;
            white-space: nowrap;
            word-break-wrap: none;
            display: inline-block;
          "
          class="dead-time"
          v-if="task.deadTime"
        >{{ getDistance(task.deadTime) }}</span
        >
        </div>
      </div>
    </div>
  </vue-custom-scrollbar>

</template>

<script lang="ts">
import {ITaskInfo} from "../../../page/app/todo/interfaces";
import dayjs from "dayjs";
import {mapActions, mapState, mapWritableState} from "pinia";
import {taskStore} from "../../../page/app/todo/stores/task";
import {ToTopOutlined} from "@ant-design/icons-vue";
import VueCustomScrollbar from "../../../../../src/components/vue-scrollbar.vue";
import Emoji from "../../comp/Emoji.vue";
import XtButton from "../../../ui/libs/Button/index.vue";
import {PlusSquareOutlined} from '@ant-design/icons-vue'

export default {
  name: "TaskList",
  props: {
    data: [] as ITaskInfo[],
  },
  components: {
    XtButton,
    Emoji,
    VueCustomScrollbar,
    ToTopOutlined,
    PlusSquareOutlined
  },
  data() {
    return {
      scrollbarSettings: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
      ellipsis: {
        rows: 1,
      },
      dragStartTimer: null
    };
  },
  computed: {
    ...mapWritableState(taskStore, ["activeTask"]),
    notFinish() {
      return JSON.parse(JSON.stringify(this.data))
    }
  },
  methods: {
    ...mapActions(taskStore, ["setActiveTask", "removeTask"]),
    getDistance(deadTime) {
      let now = dayjs().unix();
      let distance = deadTime - now;
      let displayText = "";

      function distanceToText(distance: number) {
        let displayText = "";
        if (distance > 31536000) {
          displayText = String(Math.floor(distance / 31536000)) + "年";
        } else if (distance > 86400) {
          displayText = String(Math.floor(distance / 86400)) + "天";
        } else if (distance > 3600) {
          displayText = String(Math.floor(distance / 3600) + "小时");
        } else if (distance > 60) {
          displayText = String(Math.floor(distance / 60) + "分钟");
        }
        return displayText;
      }

      if (distance > 0) {
        displayText = distanceToText(distance);
      } else {
        displayText = "已过期" + distanceToText(-distance);
      }
      return displayText;
    },
    changeState(event, task) {
      this.data.forEach(item => {
        if (item.nanoid === task.nanoid) {
          this.dragStartTimer = setTimeout(() => {
            item.completed = event.target.checked
          }, 2000)
        } else {
          item.completed = false
        }
      })
    },
  },
  beforeDestroy() {
    clearTimeout(this.dragStartTimer);
  },
}
</script>

<style scoped lang="scss">
:deep(.ant-checkbox-inner) {
  border: none
}

.task-item {
  height: 64px;
  background: var(--mask-bg);
  border-radius: 12px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  margin-bottom: 9px;
}

.completed {
  text-decoration: line-through;
  color: #ccc;
}

.title {
  font-size: 16px;
  color: var(--primary-text);
  font-weight: 500;
}

.detail {
  color: var(--secondary-text);
}
</style>
