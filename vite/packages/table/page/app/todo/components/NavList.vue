<template>
  <div class="nav-items">
    <div class="item"
      @click="setTab('personal')"
      :class="{ active: this.isActive('personal') }"
    >
      <div class="nav-wrapper font-color flex items-center justify-between">
        <div>
          <Icon icon="user" style="color:var(--secondary-text);font-size:20px"></Icon>
          <span class="ml-2.5">个人</span>
        </div>
        <span>{{
          this.tasks.filter((task) => !task.completed).length
        }}</span>
      </div>
    </div>
    <div class="item"
      @click="this.setTab('today')"
      :class="{ active: this.isActive('today') }"
    >
      <div class="nav-wrapper font-color flex items-center">
        <Icon icon="shoucang" style="color:var(--secondary-text);font-size:20px"></Icon>
        <span class="ml-2.5">今天</span>
      </div>
    </div>
    <div class="item" @click="this.setTab('week')" :class="{ active: this.isActive('week') }">
      <div class="nav-wrapper font-color flex items-center">
        <Icon icon="carryout" style="color:var(--secondary-text);font-size:20px"></Icon>
        <span class="ml-2.5">7天</span>
      </div>
    </div>
    <!--    <li @click="()=>{this.setTab('group');}" :class="{'active':this.isActive('group')}">-->
    <!--      <div class="nav-wrapper">-->
    <!--        <team-outlined style="font-size:16px"/>-->
    <!--        团队-->
    <!--      </div>-->
    <!--    </li>-->
    </div>
</template>

<script lang="ts">
import { mapState, mapWritableState } from "pinia";
import { listStore } from "../stores/list";
import { taskStore } from "../stores/task";
import {
  AlertOutlined,
  UserOutlined,
  TeamOutlined,
  CalendarOutlined,
} from "@ant-design/icons-vue";
import dayjs from "dayjs";
export default {
  name: "NavList",
  components: {
    AlertOutlined,
    UserOutlined,
    TeamOutlined,
    CalendarOutlined,
  },
  data() {
    return {
      currentTab: {
        name: "personal",
      },
      tabs: [
        {
          index: 0,
          alias: "个人",
          name: "personal",
        },
        {
          index: 1,
          alias: "今天",
          name: "today",
        },
        {
          index: 2,
          alias: "最近七天",
          name: "week",
        },
        {
          index: 3,
          alias: "团队",
          name: "group",
        },
      ],
    };
  },
  computed: {
    ...mapState(listStore, ["lists", "displayLists"]),
    ...mapWritableState(taskStore, ["taskFilter"]),
    ...mapWritableState(listStore, ["activeList"]),
    ...mapState(taskStore, [
      "activeTask",
      "currentTasks",
      "tasks",
      "list",
    ]),
  },
  methods: {
    setTab(name) {
      this.activeList = {};
      this.currentTab.name = name;
      switch (name) {
        case "personal":
          this.taskFilter = null;
          break;
        case "today":
          this.taskFilter = (task) => {
            if (!task.deadTime) return false;
            else {

              return task.deadTime - Date.now() / 1000 <= 86400;
            }
          };
          break;
        case "week":
          this.taskFilter = (task) => {
            if (!task.deadTime) return false;
            else {
              return task.deadTime - Date.now() / 1000 <= 604800;
            }
          };
          break;
      }
    },
    isActive(name) {
      if (Object.keys(this.activeList).length) {
        return false;
      } else {
        if (this.currentTab.name === name) {
          return true;
        } else {
          return false;
        }
      }
    },
  },
};
</script>

<style scoped lang="scss">
.nav-items {
  color: var(--primary-text);
  border-bottom: 1px solid var(--divider);
  .item {
    font-size: 13px;
    .nav-wrapper {
      cursor: pointer;
      height: 48px;
      padding: 0 12px;
      border-radius: 10px;
      line-height: 48px;
    }
    &.active,
    &:hover {
      .nav-wrapper {
        background: var(--active-secondary-bg) !important;
      }
    }
  }
}
</style>
