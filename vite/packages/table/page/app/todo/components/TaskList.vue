<script lang="ts">
import { ITaskInfo } from "../interfaces";
import dayjs from "dayjs";
import { mapActions, mapState } from "pinia";
import { taskStore } from "../stores/task";
import { ToTopOutlined } from "@ant-design/icons-vue";
import { configStore } from "../store";
export default {
  name: "TaskList",
  props: {
    data: [] as ITaskInfo[],
  },
  components: {
    ToTopOutlined,
  },
  data() {
    return {
      ellipsis: {
        rows: 1,
      },
    };
  },
  computed: {
    ...mapState(taskStore, ["activeTask"]),
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
  },
};
</script>

<template>
  <div
    v-if="data.length === 0"
    style="margin-left: -20px; margin-top: calc((100vh - 69px) / 2 - 50px)"
  >
    <a-empty description=""></a-empty>
  </div>
  <ul class="task-list">
    <a-dropdown :trigger="['contextmenu']" v-for="task in data">
      <li :class="{ active: task === activeTask }" @click="setActiveTask(task)">
        <div style="display: flex">
          <div style="min-width: 25px">
            <a-checkbox v-model:checked="task.completed"></a-checkbox>
          </div>
          <div
            style="
              flex: auto;
              text-wrap: normal;
              word-break: break-all;
              width: 0;
            "
          >
            <div
              :class="{ completed: task.completed }"
              style="
                word-break: break-all;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
              "
            >
              <span style="margin-bottom: 0; line-height: 28px"
                ><to-top-outlined v-if="task.isTop" /> {{ task.title }}</span
              >
            </div>
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
      </li>
      <template #overlay>
        <a-menu>
          <a-menu-item @click="removeTask(task.nanoid)">删除</a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </ul>
</template>
<style>
.ant-typography del {
  color: #ccc;
}
</style>
<style scoped lang="scss">
.dead-time {
  float: right;
  font-size: 12px;
}

.task-list {
  list-style: none;
  padding-left: 0;

  li {
    &:hover,
    &.active {
      border-radius: 4px;
    }

    line-height: 28px;

    padding: 3px 10px;
    .completed {
      text-decoration: line-through;
      color: #ccc;
    }
  }
}
</style>
