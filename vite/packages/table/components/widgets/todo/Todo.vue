<template>
  <xt-container
    v-model:customSize="customData.customSize"
    @leftClick="todoPage"
    :header="header"
    :options="options"
    :sizeList="sizeList"
    :customData="customData"
    :customIndex="customIndex"
    :desk="desk"
    ref="todoSlot"
    :menuList="toggleTodoList"
    :env="env"
    @delete="deleteCard"
  >
    <div style="height: 100%">
      <div
        @click.stop
        style="cursor: auto; height: calc(100% - 10px); position: relative"
        class="mt-2"
      >
        <Tasklist
          class="content-box"
          :data="notFinish"
          :disableEdit="options?.disableEdit"
          :todoDesk="desk"
        ></Tasklist>

        <div
          style="
            position: absolute;
            display: flex;
            right: 0;
            align-content: end;
            bottom: 0;
            z-index: 99;
          "
          v-if="isEdit"
        >
          <div
            v-if="addVisible"
            style="display: flex; margin-bottom: -15px; width: 250px"
          >
            <xt-button
              class="mr-2"
              style="margin-top: 9px"
              @click="toggleInput"
              :w="42"
              :h="47"
              type="default"
            >
              <left-outlined />
            </xt-button>
            <div style="flex: 1">
              <TaskInput
                @added="added"
                :addToList="selectTodo"
                ref="input"
              ></TaskInput>
            </div>
          </div>
          <div>
            <xt-button
              v-if="!addVisible"
              @click="toggleInput"
              :w="40"
              :h="40"
              type="theme"
            >
              <plus-outlined />
            </xt-button>
          </div>
        </div>
      </div>
    </div>
  </xt-container>
  <a-drawer
    v-model:visible="openSettings"
    title="设置"
    placement="right"
    width="500"
  >
    <div class="flex flex-col" style="color: var(--primary-text)">
      <CardSettingExplain v-if="communityAuth(desk?.communityNo)"/>

      <span class="drawer-title" style="margin-top: 0">类型</span>
      <span
        v-for="(item, index) in todoType"
        :key="index"
        @click.stop="getTodoType(item)"
        :class="selectTodo.nanoid === item.nanoid ? 'active-index' : ''"
        class="h-12 py-3 mb-4 text-center rounded-lg pointer change xt-bg-2 show-game-time"
      >
        {{ item.title }}
      </span>
      <span class="drawer-title">清单</span>
      <span
        v-for="(item, index) in listType"
        :key="index"
        @click.stop="getTodoType(item, index)"
        :class="selectTodo.nanoid === item.nanoid ? 'active-index' : ''"
        class="h-12 py-3 mb-4 text-center rounded-lg pointer change xt-bg-2 show-game-time"
      >
        {{ item.title }}
      </span>
    </div>
  </a-drawer>
</template>

<script lang="ts">
import Widget from "../../card/Widget.vue";
import { mapActions, mapWritableState } from "pinia";
import Tasklist from "./TaskList.vue";
import {
  PlusOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons-vue";
import XtButton from "../../../ui/libs/Button/index.vue";
import Modal from "../../Modal.vue";
import TaskInput from "../../../page/app/todo/components/TaskInput.vue";
import { Tippy } from "vue-tippy";
import { message } from "ant-design-vue";
import { Icon as newIcon } from "@iconify/vue";
import { taskStore } from "../../../page/app/todo/stores/task";
import { listStore } from "../../../page/app/todo/stores/list";
import { communityNavStore } from "../../bottomPanel/store/communityNavStore";
import CardSettingExplain from "../../CardSettingExplain.vue";
import { communityAuth,communityMember } from "../../../apps/communityDesk/hooks/deskCreateMethod";
import { saveData } from "../../../save/saveData";
import { loadData } from "../../../save/loadData";


export default {
  name: "Todo",
  components: {
    Tippy,
    TaskInput,
    Modal,
    XtButton,
    PlusOutlined,
    LeftOutlined,
    RightOutlined,
    Widget,
    Tasklist,
    newIcon,
    CardSettingExplain
  },
  props: {
    customIndex: {
      type: Number,
      default: 0,
    },
    customData: {
      type: Object,
      default: () => {},
    },
    desk: {
      type: Object,
      default: () => {},
    },
    openWay: {
      type: String,
      default: "desk",
    },
  },
  emits: ["delete"],
  data() {
    return {
      addVisible: false,
      sizeList: [
        { value: "2x2", name: "2x2" },
        { value: "2x4", name: "2x4" },
      ],
      openSettings: false,
      toggleTodoList: [
        {
          icon: "shezhi1",
          title: "设置",
          fn: () => {
            this.openSettings = true;
            this.$refs.todoSlot.visible = false;
          },
        },
      ],
      todoType: [
        { title: "个人", nanoid: "T00111" },
        { title: "今天", nanoid: "T00222" },
        { title: "七天", nanoid: "T00333" },
      ],
      // 清单
      listType: [],
      todoIndex: 0,
      selectTodo: { title: "个人", nanoid: "T00111" },
      taskList: [],
      env: {
        web: false,
        mobile: false,
        client: false,
        single: false,
      },
    };
  },
  computed: {
    ...mapWritableState(taskStore, ["taskFilter", "displayList", "tasks"]),
    ...mapWritableState(listStore, ["activeList", "lists"]),

    notFinish() {
      return this.taskList.filter((item) => !item.completed);
    },

    header() {
      return {
        // ifyIcon:"fluent:checkmark-square-24-regular",
        showIcon:"/logo/todo.svg",

        title: this.selectTodo.title,
        leftHover: this.options.disableEdit ? false : true,
        leftHoverName: this.selectTodo.title,
        leftHoverIcon: "fluent:open-16-regular",

        // leftHoverIcon: "fluent:checkmark-square-24-regular",

        rightIcon: this.options.disableEdit
          ? []
          : [
              {
                ifyIcon: "fluent:chevron-right-16-regular",
                fn: this.todoPage,
                tip: "前往主应用",
              },
            ],
      };
    },
    options() {
      return {
        customDel: this.openWay === "nav" ? true : false,
        disableEdit: this.isCommunityDesktop(this.desk),
        cardName: '待办'
      };
    },
    isEdit() {
      return !this.options.disableEdit;
    },
  },
  async mounted() {
    listStore()
    //初始化数据
    // await databaseStore().init();
    // databaseStore().$subscribe(() => {
    //   databaseStore().save();
    // });
    // if (this.customData?.id) {
    //   this.todoIndex = this.customData.id
    // }
   setTimeout(()=>{
     console.log(this.customData?.currentTodo,'currentTodo',this.lists,'this.list')
     if (this.customData?.currentTodo) {
       this.selectTodo = this.customData.currentTodo;
     }
     this.listType = this.lists?.map((item, index) => {
       return Object.assign({}, { title: item.title, nanoid: item.nanoid });
     });
     if (!this.listType.length)
       this.selectTodo = { title: "个人", nanoid: "T00111" };
     this.getTodoType(this.selectTodo);
     if (this.customData.customSize === undefined) {
       this.customData.customSize = "2x2";
     }

     // 在社群成员桌面的场景下将尺寸切换操作进行屏蔽
     if (this.options.disableEdit) {
       this.sizeList = [];
       this.toggleTodoList = [];
     } else {
       this.sizeList = [
         { value: "2x2", name: "2x2" },
         { value: "2x4", name: "2x4" },
       ];
       this.toggleTodoList = [
         {
           icon: "shezhi1",
           title: "设置",
           fn: () => {
             this.openSettings = true;
             this.$refs.todoSlot.visible = false;
           },
         },
       ];
     }

     if(communityMember(this.desk?.communityNo)){
       const target = {
         customIndex:this.customIndex,
         desk:this.desk
       }
       loadData("desk",target).then((rs)=>{
         if(rs){
           this.taskList =  Object.keys(rs).map(key => (rs[key]))
         }
       })
     }
   },3000)
  },
  methods: {
    ...mapActions(communityNavStore, ["isCommunityDesktop"]),
    communityAuth,

    deleteCard() {
      this.$emit("delete");
    },
    added() {
      this.getTodoType(this.selectTodo);
      message.success("添加任务成功。");
      if(this.communityAuth(this.desk?.communityNo)){
        const target = {
          customIndex:this.customIndex,
          desk:this.desk
        }
        saveData(this.notFinish,"desk",target);
        this.$bus.emit("updateSync");
      }
    },
    showDrawer() {
      this.openSettings = true;
      this.$refs.todoSlot.visible = false;
    },
    toggleInput() {
      this.addVisible = !this.addVisible;
      setTimeout(() => {
        this.$refs.input?.focus();
      }, 200);
    },
    getTodoType(item, index) {
      this.customData.currentTodo = item;
      this.selectTodo = item;
      // this.customData.id = index
      // this.todoIndex = this.customData.id
      this.openSettings = false;
      switch (item.nanoid) {
        case "T00111":
          this.taskList = this.tasks;
          break;
        case "T00222":
          this.taskList = [];
          break;
        case "T00333":
          this.taskList = [];
          break;
        default:
          this.taskList = this.tasks.filter(
            (t) => t.listNanoid[0] === item.nanoid
          );
          break;
      }
    },
    todoPage() {
      this.$router.push({ name: "todo" });
    },
  },
  watch: {
    customSize(newVal, oldVal) {
      this.customData.customSize = newVal;
    },
  },
};
</script>

<style scoped lang="scss">
.content-box {
  height: calc(100% - 35px);
  margin-top: 10px;
  overflow: hidden;
}

.active-index {
  background: var(--active-bg) !important;
}

.drawer-title {
  font-size: 16px;
  color: var(--primary-text);
  letter-spacing: 0;
  font-weight: 500;
  margin: 12px 0 24px;
}

.head-title {
  position: absolute;
  height: 24px;
  line-height: 24px;
  padding: 0 8px;
  cursor: pointer;
  border-radius: 4px;
  left: 45px;
  top: 12px;
  color: var(--primary-text);
  display: flex;
}
</style>
