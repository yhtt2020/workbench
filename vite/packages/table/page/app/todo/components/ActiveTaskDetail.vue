<template>
  <div v-if="!activeTask.createTime" style="padding: 10px;background:none; height: calc(100vh)">
    <span
      class="title-action hover-action"
      @click="toggleMenu"
      style="cursor: pointer"
    >
      <span
        ><menu-fold-outlined
          v-if="config.menuState === MenuState.UN_FOLD" /><menu-unfold-outlined
          v-else
      /></span>
      <span v-if="config.menuState === MenuState.UN_FOLD">&nbsp;折叠</span
      ><span v-else>&nbsp;展开</span>
    </span>
    <a-empty
      style="margin-top: calc(100vh / 2 - 90px)"
      description="点击代办查看详情"
    >
    </a-empty>
  </div>
  <div
    v-else
    style="
      height: calc(100vh);
      padding: 10px;
      display: flex;
      flex-direction: column;
      word-break: break-all;
      white-space: break-spaces;
      background: none;
    "
    class="right-content"
  >
    <div style="position: relative; flex: 1">
      <div class="top-bar">
        <span class="title-action" style="cursor: pointer"
          ><span @click="toggleMenu"
            ><menu-fold-outlined
              v-if="
                config.menuState === MenuState.UN_FOLD
              " /><menu-unfold-outlined v-else /></span
        ></span>
        &nbsp;
        <a-checkbox v-model:checked="activeTask.completed"></a-checkbox>

        &nbsp;
        <span @click="selectTime">
          <template v-if="activeTask.deadTime"
            >{{ time }} <TimerSelector v-model="activeTask.deadTime"
          /></template>
          <template v-else>
            设置时间 <TimerSelector v-model="activeTask.deadTime" /> </template
        ></span>
        <span class="extra-actions">
          <span @click="toggleTop" v-if="activeTask.isTop" class="action"
            ><to-top-outlined style="transform: rotate(180deg)" />
            取消置顶</span
          >
          <span @click="toggleTop" v-else class="action"
            ><to-top-outlined /> 置顶</span
          >
          &nbsp;
          <span class="action"><more-outlined /></span>
        </span>
      </div>

      <a-divider style="margin-top: 10px; margin-bottom: 10px"></a-divider>

      <div style="position: relative">
        <a-row type="flex">
          <a-col> </a-col>
          <a-col>
            <a-input
              style="font-weight: bold; font-size: 14px"
              size="small"
              :bordered="false"
              v-model:value="activeTask.title"
            ></a-input>
          </a-col>
        </a-row>
        <div
          style="position: absolute; right: 0px; top: 0px"
          class="convert-editor"
        >
          <!--             :hidden="!showFormatConvert"-->

          <a-button
            type="primary"
            shape="circle"
            :bordered="false"
            v-if="!editing"
            @click="editing = !editing"
            size="small"
            ><form-outlined
          /></a-button>
          <a-button
            type="primary"
            v-if="editing"
            @click="editing = !editing"
            size="small"
            ><vertical-left-outlined /> 退出</a-button
          >
          &nbsp;

          <template v-if="editing">
            <a-radio-group
              buttonStyle="outline"
              size="small"
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
              <!--            <a-radio-button style="background: none" title="Markdown编辑器" value="markdown"><span class="icon-markdown">MD</span></a-radio-button>-->
            </a-radio-group>
          </template>
        </div>
        <VueCustomScrollbars
          :settings="settings"
          style="position: relative; height: calc(100vh - 120px)"
        >
          <div
            style="padding: 5px; word-break: break-all"
            v-html="activeTask.description || '点击【编辑图标】写描述'"
            v-if="!editing"
          ></div>
          <div v-else style="position: relative; padding: 10px">
            <template v-if="activeTask.descriptionType === 'text'">
              <a-textarea
                style="
                  height: calc(100vh - 129px);
                  min-height: 50px;
                  background: #2a2a2a;
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
            <div v-if="activeTask.descriptionType === 'rich'">
              <Toolbar
                style="border-bottom: 1px solid #ccc"
                :editor="editorRef"
                :defaultConfig="toolbarConfig"
                :mode="mode"
              />
              <Editor
                style="height: calc(100vh - 40px); overflow-y: hidden"
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
    <div style="flex: 0 0 auto">
      所属清单：
      <a-select
        mode="multiple"
        placeholder="选择清单"
        size="small"
        :fieldNames="{ label: 'title', value: 'nanoid' }"
        v-model:value="activeTask.listNanoid"
        :maxTagTextLength="5"
        :allowClear="true"
        style="
          min-width: 100px;
          max-width: calc(100% - 85px);
          white-space: nowrap;
          background-color: #555555;
        "
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
import api from "../model/api";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { mapActions, mapWritableState } from "pinia";
import { taskStore } from "../stores/task";
import { configStore, listStore } from "../store";
import { MenuState } from "../consts";
import VueCustomScrollbars from "./VueScrollbar.vue";
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
import { onBeforeUnmount, ref, shallowRef, onMounted } from "vue";
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
      editing: false,
      MenuState,
      showFormatConvert: false,
    };
  },

  mounted() {
    // 编辑器实例，必须用 shallowRef
    // 内容 HTML
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
        // JS 语法
        // file 即选中的文件
        // 自己实现上传，并得到图片 url alt href
        // 最后插入图片
        let url;
        var formData = new FormData();
        formData.append("file", file);

        await api.getCosUpload(formData, (err, data) => {
          if (!err) {
            message.error("图片上传失败");
          } else {
            url = "http://" + data.data.data;
            insertFn(url);
          }
        });
        // api.getCosUpload(formData).then((data) => {
        //   if (data.data.code === 1000) {
        //     url = 'http://' + data.data.data
        //     insertFn(url)
        //   } else {
        //     message.error('图片上传失败')
        //   }
        // })
      },
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
        // JS 语法
        // file 即选中的文件
        // 自己实现上传，并得到图片 url alt href
        // 最后插入图片
        let url;
        var formData = new FormData();
        formData.append("file", file);

        await api.getCosUpload(formData, (err, data) => {
          if (!err) {
            message.error("图片上传失败");
          } else {
            url = "http://" + data.data.data;
            insertFn(url);
          }
        });
      },
    };
    return {
      editorRef,
      valueHtml,
      mode: "default", // 或 'simple'
      toolbarConfig,
      editorConfig,
      handleCreated,
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
  float: right;
}

.top-bar {
  padding-bottom: 10px;
}

.action {
  cursor: pointer;
}
.bottom-item {
}
</style>
<style></style>
