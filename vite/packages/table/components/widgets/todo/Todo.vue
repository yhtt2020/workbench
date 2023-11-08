<template>
  <Widget
    :options="options"
    :sizeList="sizeList"
    :customData="customData"
    :desk="desk"
    ref="todoSlot"
    :menuList="toggleTodoList"
    :env="env"
  >
    <template #right-menu>
      <div @click="todoPage" class="float-right pointer" style=" z-index: 0;  margin-left: 10px">
        <RightOutlined />
      </div>
    </template>

    <div style="height:100%;">
      <div @click="todoPage" class="pointer" style="position: absolute;left: 12px;top:12px;">
        <!-- <Icon icon="check-square" style="color:var(--secondary-text);font-size:24px"></Icon> -->
        <newIcon icon="fluent:checkmark-square-24-regular" style="color:var(--secondary-text);font-size:24px"/>
      </div>

      <div class="head-title">
        <div   @click.stop="showDrawer">{{ selectTodo.title }}
        </div>

      </div>

      <div @click.stop style="cursor: auto;height:calc( 100% - 30px);position: relative" class="mt-2 ">
        <Tasklist class="content-box " :data="notFinish"></Tasklist>

        <div style="position:absolute;display: flex;right:0;align-content: end;bottom:0;z-index: 99">
          <div v-if="addVisible" style="display: flex;margin-bottom:-15px;width: 250px;">
            <xt-button class="mr-2" style="margin-top:9px" @click="toggleInput" :w="42" :h="47" type="default">
              <left-outlined/>
            </xt-button>
            <div style="flex:1;">
              <TaskInput  @added="added" :addToList="selectTodo" ref="input"></TaskInput>
            </div>
          </div>
          <div>

            <xt-button v-if="!addVisible" @click="toggleInput" :w="40" :h="40" type="theme">
              <plus-outlined/>
            </xt-button>
          </div>

        </div>


      </div>

    </div>
  </Widget>
  <a-drawer v-model:visible="openSettings" title="设置" placement="right" width="500">
    <div class="flex flex-col" style="color:var(--primary-text)">
      <span class="drawer-title" style="margin-top:0;">类型</span>
      <span v-for="(item,index) in todoType" :key="index"
            @click.stop="getTodoType(item)"
            :class="selectTodo.nanoid === item.nanoid ? 'active-index':''"
            class="h-12 py-3 mb-4 text-center rounded-lg pointer change xt-bg-2 show-game-time">
         {{ item.title }}
      </span>
      <span class="drawer-title">清单</span>
      <span v-for="(item,index) in listType" :key="index"
            @click.stop="getTodoType(item,index)"
            :class="selectTodo.nanoid === item.nanoid ? 'active-index':''"
            class="h-12 py-3 mb-4 text-center rounded-lg pointer change xt-bg-2 show-game-time">
         {{ item.title }}
      </span>
    </div>
  </a-drawer>
</template>

<script lang="ts">
import Widget from '../../card/Widget.vue'
import {mapActions, mapWritableState} from 'pinia'
import Tasklist from './TaskList.vue'
import {databaseStore, listStore, taskStore} from "../../../page/app/todo/store";
import {PlusOutlined, LeftOutlined,RightOutlined} from "@ant-design/icons-vue";
import XtButton from "../../../ui/libs/Button/index.vue";
import Modal from "../../Modal.vue";
import TaskInput from "../../../page/app/todo/components/TaskInput.vue";
import {Tippy} from "vue-tippy";
import {message} from 'ant-design-vue'
import {Icon as newIcon} from '@iconify/vue'
export default {
  name: 'Todo',
  components: {
    Tippy,
    TaskInput,
    Modal,
    XtButton, PlusOutlined, LeftOutlined,RightOutlined,
    Widget,
    Tasklist,
    newIcon
  },
  props: {
    customIndex: {
      type: Number,
      default: 0
    },
    customData: {
      type: Object,
      default: () => {
      }
    },
    desk: {
      type: Object
    },
  },
  data() {
    return {
      addVisible: false,

      // options: {className: 'card small',title: '',icon: 'check-square',type: 'todo'},
      options: {className: 'card small', title: '', type: 'todo'},
      sizeList: [{title: '2x2', height: 1, width: 1, name: '1x1'}, {title: '2x4', height: 2, width: 1, name: '1x2'}],
      openSettings: false,
      toggleTodoList: [{
        icon: 'shezhi1', title: '设置', fn: () => {
          this.openSettings = true;
          this.$refs.todoSlot.visible = false
        }
      }],
      todoType: [
        {title: '个人', nanoid: 'T00111'},
        {title: '今天', nanoid: 'T00222'},
        {title: '七天', nanoid: 'T00333'}
      ],
      // 清单
      listType: [],
      todoIndex: 0,
      selectTodo: {title: '个人', nanoid: 'T00111'},
      taskList: [],
      env:{
        web: false,
        mobile: false,
        client: false,
        offline:false
      }
    }
  },
  computed: {
    ...mapWritableState(taskStore, ["taskFilter", "displayList", 'tasks']),
    ...mapWritableState(listStore, ["activeList", "lists"]),
    notFinish() {
      return this.taskList.filter(item => !item.completed)
    }
  },
  async mounted() {
    //初始化数据
    await databaseStore().init();
    databaseStore().$subscribe(() => {
      databaseStore().save();
    });
    // if (this.customData?.id) {
    //   this.todoIndex = this.customData.id
    // }
    if (this.customData?.currentTodo) {
      this.selectTodo = this.customData.currentTodo
    }
    this.listType = this.lists?.map((item, index) => {
      return Object.assign({}, {'title': item.title, 'nanoid': item.nanoid})
    })
    if (!this.listType.length) this.selectTodo = {title: '个人', nanoid: 'T00111'}
    this.getTodoType(this.selectTodo)

  },
  methods: {
    added(){
      this.getTodoType(this.selectTodo)
      message.success('添加任务成功。')
    },
    showDrawer() {
      this.openSettings = true
      this.$refs.todoSlot.visible = false
    },
    toggleInput() {
      this.addVisible = !this.addVisible
      setTimeout(() => {
        this.$refs.input.focus()
      }, 200)
    },
    getTodoType(item, index) {
      this.customData.currentTodo = item
      this.selectTodo = item
      // this.customData.id = index
      // this.todoIndex = this.customData.id
      this.openSettings = false
      switch (item.nanoid) {
        case 'T00111':
          this.taskList = this.tasks
          break;
        case 'T00222':
          this.taskList = []
          break;
        case 'T00333':
          this.taskList = []
          break;
        default:
          this.taskList = this.tasks.filter(t => t.listNanoid[0] === item.nanoid)
          break;
      }
    },
    todoPage() {
      this.$router.push({name: 'todo'})
    }
  }
}
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
