<template>
  <a-input ref="inputer"
           class="input main-input" style="background:--var(primary-bg);color:var(--active-text) !important; "
           :size="runtime.windowWidth >= 600 ? 'normal' : 'small'"
           v-model:value="newTask.title"
           @pressEnter="addNewTask"
           :placeholder="getPlaceholder()"
  >
    <template #suffix>
      <TimerSelector v-model="newTask.deadTime"/>
    </template>
  </a-input>
</template>

<script lang="ts">
import dayjs from "dayjs";
import {mapActions, mapState, mapWritableState} from "pinia";
import {taskStore} from "../stores/task";
import {CalendarOutlined} from "@ant-design/icons-vue";
import objectSupport from "dayjs/plugin/objectSupport";
import TimerSelector from "./TimerSelector.vue";
import listStore from "../stores/list";
import configStore from "../stores/config";
// import { completeTask } from "../apps/task/page/branch/task"
 import { completeTask } from "../../../../apps/task/page/branch/task.ts"
import {message} from "ant-design-vue";

dayjs.locale("zh-cn");
dayjs.extend(objectSupport);
export default {
  name: "TaskInput",
  components: {
    TimerSelector,
    CalendarOutlined,
  },
  emits: ['added'],
  props: ['addToList'],
  computed: {
    ...mapWritableState(taskStore, ["currentTasks", "tasks"]),
    ...mapWritableState(listStore, ["activeList"]),
    ...mapWritableState(configStore, ["runtime"]),
    currentList() {
      if (this.addToList && !['T00111', 'T00222', 'T00333'].includes(this.addToList.nanoid)) {
        return this.addToList
      }
      if (Object.keys(this.activeList).length > 0) {
        return this.activeList
      }

    }

  },
  data() {
    return {
      newTask: {
        title: "",
        deadTime: null,
        listNanoid: 0,
      },
    };
  },
  mounted() {

  },
  updated() {
  },
  methods: {
    focus() {
      this.$refs.inputer.focus()
    },
    getPlaceholder() {
      if (this.currentList) {
        return "添加到「" + this.currentList.title + "」";
      } else {
        return "输入待办，回车确认";
      }
    },

    ...mapActions(taskStore, {
      addTask: "add",
    }),

    addNewTask() {
      let task = this.newTask;
      if (this.currentList) {
        task.listNanoid = [this.currentList.nanoid]
      }else{
        task.listNanoid=[]
      }
      if(this.newTask.title.trim()===''){
        message.error('请输入待办内容')
        return
      }
      // 支线任务点
      completeTask('Z0203')

      task = Object.assign(this.newTask, {});
      console.log('添加的任务',task)
      let rs= this.addTask(task);
      if(rs){
        this.newTask.title = "";
        this.newTask.deadTime = null;
        this.newTask.listNanoid = [];
        this.$emit('added')
      }else{
        message.error('数据库写入失败')
      }

    },
  },
};
</script>

<style lang="scss">
.add-task-input {
  input {
    font-size: 13px;
  }
}
</style>
<style lang="scss" scoped>
.input {
  width: 100%;
  height: 48px;
  background: var(--secondary-bg);
  border-radius: 12px;
  color: var(--primary-text);
  font-size: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin: 8px 0;
}

.main-input {
  border: none !important;

  input {
    color: var(--active-text) !important;

    &::placeholder {
      color: var(--active-text) !important;
    }
  }
}
</style>
