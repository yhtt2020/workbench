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
    displayList(){
      return this.data.sort((a,b)=>{
        return -((a.isTop?1:0)-(b.isTop?1:0))
      })
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
  },
};
</script>

<template>
  <div
    v-if="data.length === 0"
    style="margin-left: -20px; margin-top: calc((100vh - 96px) / 2 - 100px)"
  >
    <a-empty description=""></a-empty>
  </div>
  <div class="task-list">
    <a-dropdown :trigger="['contextmenu']" v-for="task in displayList">
      <div class="task-item" :class="{ active: task === activeTask }" @click="setActiveTask(task)">
        <div class="h-12 flex items-center px-3">
          <div class="todo-style" style="min-width: 32px">
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
              <span style="margin-bottom: 0; line-height: 28px;color: var(--primary-text);"
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
      </div>
      <template #overlay>
        <span class="pointer" @click="removeTask(task.nanoid)">
          <a-menu theme="dark" class="del-btn">
            <a-menu-item class="xt-text">删除</a-menu-item>
          </a-menu>
        </span>

      </template>
    </a-dropdown>
  </div>
</template>
<style scoped lang="scss">
:deep(.ant-checkbox-inner){
  border:none
}


.dead-time {
  float: right;
  font-size: 12px;
  color: var(--primary-text);
}

.task-list {
  .task-item {
    &:hover,
    &.active {
      background:var(--active-secondary-bg);
      border-radius: 10px;
    }
    .completed {
      text-decoration: line-through;
      color: #ccc;
    }
  }
}
.del-btn{
  width: 120px;
  height:60px;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--secondary-bg) !important;
  border: 1px solid rgba(255,255,255,0.1);
  box-shadow: 0px 0px 20px 0px rgba(0,0,0,0.5);
}
.del-btn:hover{
  opacity: 0.8;
}
</style>
