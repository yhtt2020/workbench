<script lang="ts">
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
import configStore from "./stores/config";
import taskStore from './stores/task'
import listStore from "./stores/list";
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
import Modal from "../../../components/Modal.vue";

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
    Modal
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
      promptVisible: false,
      backBtn: false
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
      // this.addNewListVisible = true;
      this.promptVisible = true
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
      // this.addNewListVisible = false;
      this.promptVisible =false
      this.newList.title = "";
    },
  },
};
</script>

<template>
  <a-config-provider :locale="zhCN" :getPopupContainer="getPopupContainer">
    <div class="todo-box">
      <a-layout theme="light" style="height:100%;background:none;">
        <a-layout-sider
          style="height:100%;background:none;border-right: 1px solid var(--divider);padding:12px;"
          theme="light"
        >
          <div v-if="backBtn" class="flex items-center pointer ml-3 mb-3.5">
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
          <Modal blurFlag="true" v-model:visible="promptVisible" v-if="promptVisible" style="z-index:99999;">
            <div class="p-5 xt-modal flex flex-col justify-center items-center" style="width:400px;height:207px;border-radius:16px">
              <div class="head-nav">
                <span>创建清单</span>
                <div>
                  <Icon @click="promptVisible = false" icon="guanbi" style="color:var(--primary-text);font-size:24px"></Icon>
                </div>
              </div>
             <div class="mt-6 mb-8">
              <a-input v-model:value="newList.title" spellcheck ="false" class="input" placeholder="清单名称" aria-placeholder="font-size: 16px;" style="height: 48px;"/>
             </div>
              <div class="modal-btn">
                <div class="mr-3 rounded-lg xt-bg-2 pointer" @click="promptVisible = false">取消</div>
                <div class="mr-3 rounded-lg xt-bg-2 pointer" @click="addNewList()">确定</div>
              </div>
            </div>
          </Modal>
          <div class="small-title">
            清单
            <span
              @click="showAddList()"
              style="float: right;"
            >
            <Icon icon="tianjia2" class="pointer" style="color:var(--secondary-text);font-size:20px"></Icon>
            </span>
          </div>
          <div :style="backBtn ? 'height:calc(100% - 232px)' :  'height:calc(100% - 194px)'">
            <a-empty v-if="displayLists.length === 0" :image="simpleImage" />
            <VueCustomScrollbars
              :settings="settings"
              style="height:100%;"
            >
              <ListList :data="displayLists"></ListList>
            </VueCustomScrollbars>
          </div>
        </a-layout-sider>

        <div class="box-content" style="background:none">
          <div class="middle-title">
            <span v-if="Object.keys(this.activeList).length === 0">
              全部待办
            </span>
            <span v-else>
              {{ activeList.title }}
            </span>
          <a-dropdown :trigger="['click']">
            <span
              class="hover-none"
              style="
                float: right;
                cursor: pointer;
                color:var(--secondary-text);
                position: relative;
                top: 3px;
              "
              >
              <Icon icon="gengduo1" style="color:var(--secondary-text);font-size:20px"></Icon>
            </span>

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
                <Icon icon="filter" style="color:var(--secondary-text);font-size:20px"></Icon>
              </span>
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
        <div>
          <TaskInput class="select-input"></TaskInput>
        </div>
        <VueCustomScrollbars
          :settings="settings"
          style="position: relative; height: calc(100% - 96px);"
        >
          <TaskList :data="displayList"></TaskList>
        </VueCustomScrollbars>
      </div>
      <div style="background:none;width:100%;height: 100%">
        <ActiveTaskDetail @addList="showAddList"></ActiveTaskDetail>
      </div>
      <div></div>
    </a-layout>
    </div>
  </a-config-provider>
</template>
<!-- <style lang="scss">
.nav-items {
  // background: red;
  color: var(--primary-text);
  .item {
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
</style> -->
<style scoped lang="scss">
// .small-title {
//   font-size: 12px;
//   padding-left: 10px;
//   padding-top: 10px;
// }
  .small-title {
    height: 48px;
    padding: 0 12px;
    border-radius: 10px;
    line-height: 48px;
    color: var(--secondary-text);
  }
.box-content{
  padding: 12px;
  width: 320px;
  border-right: 1px solid var(--divider);
}
.middle-title {
  color: var(--primary-text);
}
.todo-box{
  height: 100%;
  width: 100%;
  background: var(--primary-bg);
  border-radius: 12px;
  overflow: hidden;
}
.head-nav{
  width: 100%;
  height: 72px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  color: var(--primary-text);
  font-weight: 500;
  div{
    width: 44px;
    height: 44px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--secondary-bg);
    border-radius: 12px;
    cursor: pointer;
    position: absolute;
    right: 0px;
  }
}
.modal-btn {
  display: flex;
  font-size: 16px;
  color: var(--primary-text);
  > div {
    width: 120px;
    height: 44px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 12px;
    background: var(--mask-bg);
  }
  >div:nth-child(2){
    background: var(--active-bg) !important;
  }
}
.input{
  width:227px;
  height: 48px;
  background: var(--secondary-bg);
  border-radius: 12px;
  color: var(--primary-text);
  font-size: 16px;
  border: 1px solid rgba(255,255,255,0.2);
}
</style>
