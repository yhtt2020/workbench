<script lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import "./assets/index.scss";
import { sortType } from "./consts";
import {
  AlertOutlined,
  CalendarOutlined,
  UserOutlined,
  TeamOutlined,
  MenuUnfoldOutlined,
  ToTopOutlined,
  MoreOutlined,
  PlusOutlined,
  EllipsisOutlined,
  ClockCircleOutlined,
  SortAscendingOutlined,
  OrderedListOutlined,
  SwapLeftOutlined,
} from "@ant-design/icons-vue";
import { mapActions, mapGetters, mapState, mapWritableState } from "pinia";
import { databaseStore, configStore, listStore, taskStore } from "./store";
import { MenuState } from "./consts";
import { Empty } from "ant-design-vue";
import { ITaskInfo as TaskInfo } from "./interfaces";
import ActiveTaskDetail from "./components/ActiveTaskDetail.vue";
import dayjs from "dayjs";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import TaskList from "./components/TaskList.vue";
import TaskInput from "./components/TaskInput.vue";
import ListList from "./components/ListList.vue";
import VueCustomScrollbars from "./components/VueScrollbar.vue";
import NavList from "./components/NavList.vue";

export default {
  computed: {
    ...mapState(taskStore, [
      "activeTask",
      "currentTasks",
      "tasks",
      "displayList",
    ]),
    ...mapState(configStore, ["config"]),
    ...mapWritableState(listStore, ["activeList"]),
    ...mapState(listStore, ["lists", "displayLists"]),
  },
  components: {
    NavList,
    VueCustomScrollbars,
    TaskInput,
    ActiveTaskDetail,
    TaskList,
    ListList,
    AlertOutlined,
    CalendarOutlined,
    UserOutlined,
    TeamOutlined,
    MenuUnfoldOutlined,
    ToTopOutlined,
    MoreOutlined,
    PlusOutlined,
    EllipsisOutlined,
    ClockCircleOutlined,
    SortAscendingOutlined,
    OrderedListOutlined,
    SwapLeftOutlined,
  },
  data() {
    return {
      sortType,
      settings: {
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: false,
      },
      zhCN,
      MenuState,
      addNewListVisible: false,
      newList: {},
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
    };
  },
  async mounted() {
    await databaseStore().init();
    databaseStore().$subscribe((mutation, state) => {
      databaseStore().save();
    });
  },
  methods: {
    ...mapActions(taskStore, ["setActiveTask"]),
    ...mapActions(listStore, {
      addList: "add",
    }),
    ...mapActions(configStore, ["showCompleted", "hideCompleted", "setSort"]),
    showAddList() {
      this.addNewListVisible = true;
    },
    getPopupContainer(el, dialogContext) {
      if (dialogContext) {
        return dialogContext.getDialogWrap();
      } else {
        return document.body;
      }
    },

    addNewList() {
      this.addList(this.newList);
      this.addNewListVisible = false;
      this.newList.title = "";
    },
  },
};
</script>

<template>
  <a-config-provider :locale="zhCN" :getPopupContainer="getPopupContainer">
    <div class="todo-box">
      <a-layout theme="light" style="height:100%;background:none">
        <a-layout-sider
          v-show="config.menuState === MenuState.UN_FOLD"
          style="background:none;border-right: 1px solid var(--divider)"
          theme="light"
        > 
          <div class="flex items-center mx-3 pointer px-3" style="height:48px;">
            <Icon icon="xiangzuo" style="color:var(--secondary-text);font-size:20px"></Icon>
            <span class="xt-text-2 ml-3" style="font-size: 14px;">返回</span>
          </div>
          <NavList />
          <a-modal
            v-model:visible="addNewListVisible"
            title="创建清单"
            :width="300"
            centered
            @ok="addNewList()"
          >
            <a-input
              @pressEnter="addNewList()"
              placeholder="清单名称"
              v-model:value="newList.title"
            />
          </a-modal>
          <div class="small-title">
            清单
            <span
              @click="showAddList()"
              style="float: right;"
            >
              <plus-outlined
            /></span>
          </div>
          <div>
            <a-empty v-if="displayLists.length === 0" :image="simpleImage" />
            <VueCustomScrollbars
              :settings="settings"
              style="position: relative; height: calc(100vh - 137px)"
            >
              <ListList :data="displayLists"></ListList>
            </VueCustomScrollbars>
          </div>
        </a-layout-sider>

        <div class="main-content" style="background:none" v-show="config.menuState === MenuState.UN_FOLD">
          <div class="middle-title">
            <span v-if="Object.keys(this.activeList).length === 0">
            全部待办
          </span>
          <span v-else>
            {{ activeList.title }}
          </span>
          <a-dropdown :trigger="['click']"
            ><span
              class="hover-none"
              style="
                float: right;
                font-size: 18px;
                cursor: pointer;
                color: #dfdfdf;
              "
              ><ellipsis-outlined
            /></span>
            <template #overlay>
              <a-menu>
                <a-menu-item
                  v-if="!config.showComplete"
                  @click="showCompleted"
                  key="showCompleted"
                  >显示已完成</a-menu-item
                >
                <a-menu-item v-else @click="hideCompleted" key="hideCompleted"
                  >隐藏已完成</a-menu-item
                >
              </a-menu>
            </template>
          </a-dropdown>
          <a-dropdown :trigger="['click']">
            <span
              style="
                float: right;
                font-size: 18px;
                cursor: pointer;
                margin-right: 5px;
                color: #dfdfdf;
              "
            >
              <span
                style="
                  display: inline-block;
                  margin-right: 5px;
                  vertical-align: middle;
                  margin-top: -5px;
                "
              >
                <swap-left-outlined
                  style="
                    transform: rotate(270deg);
                    font-size: 12px;
                    margin-right: -3px;
                  " /><clock-circle-outlined style="font-size: 12px"
              /></span>
            </span>
            <template #overlay>
              <a-menu>
                <a-menu-item
                  @click="setSort(activeList, sortType.TIME)"
                  key="time"
                >
                  <clock-circle-outlined />
                  时间排序
                </a-menu-item>
                <a-menu-item
                  @click="setSort(activeList, sortType.TITLE)"
                  key="title"
                >
                  <sort-ascending-outlined />
                  标题排序
                </a-menu-item>
                <a-menu-item
                  @click="setSort(activeList, sortType.LIST)"
                  key="list"
                >
                  <ordered-list-outlined />
                  清单排序
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
        <div style="margin-top: 5px; margin-bottom: 5px">
          <TaskInput class="select-input"></TaskInput>
        </div>
        <VueCustomScrollbars
          :settings="settings"
          style="position: relative; height: calc(100vh - 67px)"
        >
          <TaskList :data="displayList"></TaskList>
        </VueCustomScrollbars>
      </div>
      <div
        theme="light"
        style="position: relative;background:none; flex: auto !important; width: 0"
        class="right-content"
      >
        <ActiveTaskDetail @addList="showAddList"></ActiveTaskDetail>
      </div>
      <div></div>
    </a-layout>
    </div>
  </a-config-provider>
</template>
<style>
body {
  user-select: none;
  overflow: hidden;
}
</style>
<style lang="scss">
.nav-items {
  margin: 0 12px;
  color: var(--primary-text);
  .item {
    margin: 0;
    .nav-wrapper {
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

    font-size: 13px;
  }
}

.full-modal {
  .ant-modal {
    max-width: 100%;
    top: 0;
    padding-bottom: 0;
    margin: 0;
  }

  .ant-modal-content {
    display: flex;
    flex-direction: column;
    height: calc(100vh);
  }

  .ant-modal-body {
    flex: 1;
  }
}
</style>
<style scoped lang="scss">
// .small-title {
//   font-size: 12px;
//   padding-left: 10px;
//   padding-top: 10px;
// }
  .small-title {
    height: 48px;
    padding: 0 24px;
    border-radius: 10px;
    line-height: 48px;
    color: var(--secondary-text);
  }

.middle-title {
  font-size: 13px;
}
.todo-box{
  height: 100%;
  width: 100%;
  background: var(--primary-bg);
  border-radius: 12px;
  // overflow: auto;
}
</style>
