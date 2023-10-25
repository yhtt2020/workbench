<template>
  <div v-if="!activeTask.createTime" style="height: 100%;">
    <span
      class="title-action hover-action flex items-center xt-text pt-3 ml-3"

      style="cursor: pointer;"
    ><!--      @click="toggleMenu"-->
<!--      <Icon v-if="config.menuState === MenuState.UN_FOLD" icon="outdent" style="color:var(&#45;&#45;secondary-text);font-size:20px"></Icon>-->
<!--      <Icon v-else icon="indent" style="color:var(&#45;&#45;secondary-text);font-size:20px"></Icon>-->
<!--      <span class="ml-2" v-if="config.menuState === MenuState.UN_FOLD">折叠</span-->
<!--      ><span class="ml-2" v-else>展开</span>-->
    </span>
    <a-empty
      style="margin-top: calc(100vh / 2 - 130px)"
      description="点击待办查看详情"
    >
    </a-empty>
  </div>
  <div
    v-else
    style="
      height: 100%;
      display: flex;
      flex-direction: column;
      word-break: break-all;
      white-space: break-spaces;
      background: none;
      position: relative;
    "
    class="right-content"
  >
    <div style="height: 100%;margin-bottom: 68px;" class="flex flex-col">
      <div class="top-bar">
        <span class="flex">
<!--          <span class="title-action" style="cursor: pointer"-->
<!--            ><span @click="toggleMenu">-->
<!--              <Icon v-if="config.menuState === MenuState.UN_FOLD" icon="outdent" style="color:var(&#45;&#45;secondary-text);font-size:20px"></Icon>-->
<!--              <Icon v-else icon="indent" style="color:var(&#45;&#45;secondary-text);font-size:20px"></Icon>-->
<!--              </span-->
<!--          ></span>-->
          <span class="mx-4 todo-style">
            <a-checkbox v-model:checked="activeTask.completed"></a-checkbox>
          </span>
          <span class="xt-text flex" @click="selectTime">
            <span class="flex items-center" v-if="activeTask.deadTime">
              <span class="mr-2">  {{ time }}</span>
              <TimerSelector v-model="activeTask.deadTime"
            /></span>
            <span class="flex items-center" v-else>
              <span class="mr-2">设置时间</span>
              <TimerSelector v-model="activeTask.deadTime" />
            </span>
          </span>
        </span>
        <span class="extra-actions">
          <span class="btn-content" @click="toggleTop" v-if="activeTask.isTop">
            <to-top-outlined style="transform: rotate(180deg)" />
            <span>取消置顶</span>
          </span>
          <span class="btn-content" v-else @click="toggleTop">
            <to-top-outlined /> 置顶
          </span>
          <span class="btn-content">
            <Icon icon="gengduo1" style="color:var(--secondary-text);font-size:20px"></Icon>
          </span>
        </span>
      </div>
      <div class="detail-box">
        <div class="flex justify-between">
          <a-row>
            <a-col class="flex items-center">
              <a-input
                style="font-weight: 500;font-size: 16px;color:var(--primary-text)"
                size="small"
                :bordered="false"
                v-model:value="activeTask.title"
              ></a-input>
            </a-col>
          </a-row>
          <div class="convert-editor btn-style">
            <!--             :hidden="!showFormatConvert"-->
            <a-button
              type="primary"
              shape="circle"
              :bordered="false"
              v-if="!editing"
              @click="editing = !editing"
              ><form-outlined/>
            </a-button>
            <div class="flex items-center">
              <span class="btn-content" style="background:var(--active-bg)"  v-if="editing"
                @click="saveAndExit">
                <vertical-left-outlined /> 退出
              </span>
              <template v-if="editing">
                <div style="width:150px">
                  <HorizontalPanel style="min-width: 150px"  :navList="navList" v-model:selectType="selectType" :height="44" ></HorizontalPanel>
                </div>
                <!-- <a-radio-group
                  buttonStyle="outline"
                  v-model:value="activeTask.descriptionType"
                >
                  <a-radio-button
                    style="background: none"
                    title="纯文字模式"
                    value="text"
                  >
                    <align-left-outlined />
                  </a-radio-button>
                  <a-radio-button
                    style="background: none"
                    title="图文编辑器"
                    value="rich"
                  >
                    <pic-left-outlined></pic-left-outlined>
                  </a-radio-button>
                             <a-radio-button style="background: none" title="Markdown编辑器" value="markdown"><span class="icon-markdown">MD</span></a-radio-button>
                </a-radio-group> -->
              </template>
            </div>
          </div>
        </div>
        <VueCustomScrollbars
          :settings="settings"
          style="position: relative;height: 95%;"
        >
          <div
            style="height: 100%;padding: 5px; word-break: break-all;color:var(--primary-text);user-select: text"
            v-html="activeTask.description || '点击【编辑图标】写描述'"
            v-if="!editing"
          ></div>
          <div v-else style="position: relative; padding: 10px 0;height: 100%;">
            <template v-if="activeTask.descriptionType.name === 'text'">
              <a-textarea
                style="
                  height: 100%;
                  min-height: 50px;
                  background: #2a2a2a;
                  border-radius: 6px;
                "
                @focus="this.showFormatConvert = true"
                @blur="this.showFormatConvert = false"
                v-model:value="activeTask.description"
                placeholder="描述"
                :bordered="false"
                :autosize="false"
              >
              </a-textarea>
            </template>
            <div style="height: 100%;" v-if="activeTask.descriptionType.name === 'rich'">
              <Toolbar
                style="border-bottom: 1px solid #ccc"
                :editor="editorRef"
                :defaultConfig="toolbarConfig"
                :mode="mode"
              />
              <Editor
                style="height: 100%; overflow-y: hidden"
                v-model="valueHtml"
                :defaultConfig="editorConfig"
                :mode="mode"
                @onCreated="handleCreated"
              />
            </div>
            <template v-show="activeTask.descriptionType === 'markdown'">
              markdown
            </template>
          </div>
        </VueCustomScrollbars>
      </div>
    </div>
    <div class="select-foot">
      <span class="mr-2">所属清单</span>
      <a-select
        :bordered="false"
        class="select rounded-lg  text-xs"
        size="large"
        mode="multiple"
        placeholder="选择清单"
        :fieldNames="{ label: 'title', value: 'nanoid' }"
        v-model:value="activeTask.listNanoid"
        :dropdownStyle="{ 'z-index': 99,backgroundColor: 'var(--secondary-bg)' }"
        :maxTagTextLength="5"
        :allowClear="true"
        :options="this.lists"
      >
        <template #dropdownRender="{ menuNode: menu }">
          <v-nodes :vnodes="menu" />
          <a-divider style="margin: 4px 0" />
          <div
            style="padding: 4px 8px; cursor: pointer; min-width: 100px"
            @mousedown="(e) => e.preventDefault()"
            @click="addList"
          >
            <plus-outlined />
            创建清单
          </div>
          <div
            style="padding: 4px 8px; cursor: pointer"
            @mousedown="(e) => e.preventDefault()"
            @click="activeTask.listNanoid = []"
          >
            <export-outlined />
            移出清单
          </div>
        </template>
      </a-select>
    </div>
  </div>
</template>

<script lang="ts">
import "@wangeditor/editor/dist/css/style.css"; // 引入 css
import { fileUpload, pathUpload } from '../../../../components/card/hooks/imageProcessing'
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { mapActions, mapWritableState } from "pinia";
import { taskStore } from "../stores/task";
import { configStore, listStore } from "../store";
import { MenuState } from "../consts";
import VueCustomScrollbars from "./VueScrollbar.vue";
import HorizontalPanel from "../../../../components/HorizontalPanel.vue";
import {
  AlertOutlined,
  AlignLeftOutlined,
  CalendarOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MoreOutlined,
  PicLeftOutlined,
  PlusOutlined,
  TeamOutlined,
  ToTopOutlined,
  UserOutlined,
  ExportOutlined,
  VerticalLeftOutlined,
  FormOutlined,
  BgColorsOutlined,
} from "@ant-design/icons-vue";
import dayjs from "dayjs";
import TimerSelector from "./TimerSelector.vue";

import { message } from "ant-design-vue";
import {onBeforeUnmount, ref, shallowRef, onMounted, getCurrentInstance} from "vue";
export default {
  name: "TaskDetail",
  data() {
    return {
      settings: {
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: false,
        wheelPropagation: false,
      },
      MenuState,
      showFormatConvert: false,
      navList: [
        {title: '纯文字',name: 'text'},
        {title: '图文',name: 'rich'}
      ],

    };
  },

  mounted() {
    // 编辑器实例，必须用 shallowRef
    // 内容 HTML
  },
  watch: {
    selectType: {
      deep: true,
      handler(val){
        this.activeTask.descriptionType = val
      }
    },
    'activeTask.descriptionType': {
      deep: true,
      handler(val){
        this.selectType = val
        this.valueHtml=this.activeTask.description
      }
    }
  },
  created() {},
  components: {
    VNodes: (_, { attrs }) => {
      return attrs.vnodes;
    },
    TimerSelector,
    VueCustomScrollbars,
    AlertOutlined,
    CalendarOutlined,
    UserOutlined,
    TeamOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    ToTopOutlined,
    MoreOutlined,
    PicLeftOutlined,
    AlignLeftOutlined,
    Editor,
    Toolbar,
    PlusOutlined,
    ExportOutlined,
    FormOutlined,
    VerticalLeftOutlined,
    HorizontalPanel
  },
  beforeUnmount() {},
  computed: {
    list() {
      return this.lists.find((list) => {
        return list.nanoid === this.activeTask.listNanoid;
      });
    },
    ...mapWritableState(taskStore, ["activeTask", "currentTasks", "tasks"]),
    ...mapWritableState(configStore, ["config"]),
    ...mapWritableState(listStore, ["activeList", "lists"]),
    time() {
      if (this.activeTask.deadTime) {
        if (dayjs.unix(this.activeTask.deadTime).year() === dayjs().year()) {
          return dayjs.unix(this.activeTask.deadTime).format("HH:mm,MM月DD日"); //同一年不显示年份
        } else {
          return dayjs
            .unix(this.activeTask.deadTime)
            .format("HH:mm,YY年MM月DD日");
        }
      } else {
        return "";
      }
    },
  },
  methods: {
    addList() {
      this.$emit("addList");
    },

    ...mapActions(configStore, ["toggleMenu"]),
    toggleTop() {
      this.activeTask.isTop = !this.activeTask.isTop;
    },
  },
  setup() {
    const editorRef = shallowRef();
    const editing=ref(false)
    const selectType=ref({title: '纯文字',name: 'text'})
    const mode = ref("default");
    // 内容 HTML
    const valueHtml = ref("");

    // 模拟 ajax 异步获取内容
    onMounted(() => {
      // setTimeout(() => {
      //   valueHtml.value = '<p>模拟 Ajax 异步设置内容</p>'
      // }, 1500)
    });

    const toolbarConfig = {
      toolbarKeys: [
        "bold",
        "italic",
        "through",
        "uploadImage",
        "|",
        "todo",
        "bulletedList",
        "numberedList",
        {
          key: "group-more-style",
          title: "更多",
          menuKeys: ["code", "emotion", "insertLink"],
        },
        "fullScreen",
      ],
    };
    const editorConfig = { placeholder: "请输入内容...", MENU_CONF: {} };

    // 组件销毁时，也及时销毁编辑器
    onBeforeUnmount(() => {
      const editor = editorRef.value;
      if (editor == null) return;
      editor.destroy();
    });

    const saveAndExit=()=>{
      editing.value = false;
      if(selectType.value.name==='rich'){
        console.log('从富文本退出',selectType.value)
        taskStore().activeTask.description=valueHtml.value
        console.log('新描述',valueHtml.value)
      }else{
      }

    }
    const handleCreated = (editor) => {
      editorRef.value = editor; // 记录 editor 实例，重要！
    };
    editorConfig.MENU_CONF["uploadImage"] = {
      maxFileSize: 10 * 1024 * 1024,

      // 最多可上传几个文件，默认为 10
      maxNumberOfFiles: 10,

      metaWithUrl: false,

      // 跨域是否传递 cookie ，默认为 false
      withCredentials: true,

      // 超时时间，默认为 10 秒
      timeout: 5 * 1000, // 5 秒

      async customUpload(file, insertFn) {
        let url;
        var formData = new FormData();
        formData.append("file", file);
        url=  await fileUpload(file)
        if (!url) {
          message.error("图片上传失败");
        } else {
          insertFn(url);
        }
      },
    };
    return {
      editorRef,
      valueHtml,
      mode: "default", // 或 'simple'
      toolbarConfig,
      editorConfig,
      editing,
      handleCreated,
      saveAndExit,
      selectType
    };
  },
};
</script>

<style scoped lang="scss">
.ant-input {
  &::placeholder {
  }
}

.extra-actions {
  display: flex;
  align-items: center;
}

.top-bar {
  height: 52px;
  line-height: 52px;
  padding-left: 12px;
  border-bottom: 1px solid var(--divider);
  display: flex;
  justify-content: space-between;
}

.action {
  cursor: pointer;
}
.bottom-item {
}
.btn-content{
  background: var(--mask-bg);
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  padding: 0 10px;
  border-radius: 8px;
  margin-right: 12px;
  min-width: 40px;
  color: var(--primary-text);
}
.btn-content:hover{
  opacity:0.8;
}
.detail-box{
  margin: 0;
  padding: 16px;
  flex:1;
  overflow: hidden;
  .btn-style{
    // background:red;
  }
}
.select-foot{
  position: absolute;
  bottom: 0;
  left: 16px;
  display: flex;
  align-items: center;
  color: var(--primary-text);
  .select{
    white-space: nowrap;
    background: var(--mask-bg);
    border-radius: 12px;
    color: var(--primary-text);
    font-size: 16px;
    border: 1px solid rgba(255,255,255,0.2);
    margin: 12px 0 12px;
    min-width:200px;
  }
}
</style>
<style></style>
