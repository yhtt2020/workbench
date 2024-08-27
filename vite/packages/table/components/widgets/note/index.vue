<template>
  <xt-container
    @leftClick="enterNote"
    @delete="removeNote"
    v-model:customSize="customData.customSize"
    :header="header"
    :body="bodyOptions"
    :customData="customData"
    :customIndex="customIndex"
    :options="noteOptions"
    :menuList="menuList"
    ref="homelSlotRef"
    :desk="desk"
    style="background: #191919 !important"
    :delete="deleteCard"
  >
    <teleport to="body">
      <xt-msg
        title="确定删除小组件"
        text="默认仅删除小组件，备忘录数据不会清除。"
        :modelValue="removeValue"
        @no="no"
        @ok="ok"
      >
        <template #checkbox>
          <div
            class="mr-4 font-14"
            style="color: var(--secondary-text) !important"
          >
            <a-checkbox class="xt-text-2" v-model:checked="isRemove"
              >同时删除便签数据</a-checkbox
            >
          </div>
        </template>
      </xt-msg>
    </teleport>

    <template #title-text>
      <a-input
        style="
          border: none;
          box-shadow: none !important;
          position: relative;
          left: -15px;
          top: 1px;
          font-size: 16px;
          padding: 0;
        "
        :maxlength="15"
        v-model:value="this.tmpTitle"
        spellcheck="false"
        @blur="changeNoteTitle"
      ></a-input>
    </template>

    <Markdown
      ref="mdEditor"
      :customData="customData"
      :customIndex="customIndex"
      :desk="desk"
      :disableEdit="options?.disableEdit"
    ></Markdown>
  </xt-container>

  <xt-modal
    v-if="settingVisible"
    v-model="settingVisible"
    title="「桌面便签」设置"
    :mask="false"
    @close="settingVisible = false"
  >
    <div style="width: 500px; height: 466px">
      <CardSettingExplain v-if="communityAuth(desk?.communityNo)" />

      <div class="w-full h-full p-4 rounded-lg xt-bg-2 flex flex-col">
        <span class="xt-text font-16 xt-font"> 小组件尺寸</span>
        <span class="xt-text-2 font-14 xt-font">
          支持选择上述推荐尺寸，或按住小组件右下角拖拽图标，自定义大小尺寸。
        </span>

        <a-divider
          style="
            height: 1px;
            background-color: var(--divider-text);
            margin: 16px 0;
          "
        />

        <span class="xt-text font-16 xt-font"> 便签主题色 </span>

        <div>
          <div class="mt-4 item-box">
            <div
              class="flex items-center justify-center mr-4 item"
              :key="item"
              :style="{ background: color[`${'color' + item}`] }"
              v-for="(item, index) in 6"
              @click="updateBackground(color[`${'color' + item}`], item)"
            >
              <Icon
                v-show="colorIndex == item"
                icon="ri:checkbox-circle-fill"
                width="20"
                height="20"
              />
            </div>
          </div>
        </div>

        <a-divider
          style="
            height: 1px;
            background-color: var(--divider-text);
            margin: 16px 0;
          "
        />

        <div class="flex" style="justify-content: space-between">
          <div class="xt-text xt-font font-16">仅在标题处显示主题色</div>
          <a-switch
            v-model:checked="showColor"
            @change="changeShowColor"
          ></a-switch>
        </div>

        <div class="xt-text-2 xt-font font-14">
          开启后小组件背景使用默认的编辑器颜色，标题部分使用上方选择的主题色。
        </div>
      </div>
    </div>
  </xt-modal>

  <teleport to="body">
    <xt-print
      v-if="modelValue"
      v-model="modelValue"
      :content="content"
    ></xt-print>
  </teleport>
</template>

<script>
import Widget from "../../card/Widget.vue";
import cardSizeHook from "../../card/hooks/cardSizeHook";
import { message } from "ant-design-vue";
import { Icon } from "@iconify/vue";
import notepad12Regular from "@iconify-icons/fluent/notepad-12-regular";
import Markdown from "./markdown.vue";
import { mapActions, mapState, mapWritableState } from "pinia";
import { noteStore } from "../../../apps/note/store";
import Modal from "../../Modal.vue";
import { DTPWeb, LPA_JobNames } from "dtpweb";
import RadioTab from "../../../components/RadioTab.vue";
import { communityNavStore } from "../../bottomPanel/store/communityNavStore";
import CardSettingExplain from "../../CardSettingExplain.vue";
import { communityAuth } from "../../../apps/communityDesk/hooks/deskCreateMethod";
import { saveData } from "../../../save/saveData";
import { loadData } from "../../../save/loadData";
import { useAppModal } from "../../../hooks";

export default {
  name: "便签",
  components: {
    Modal,
    Widget,
    Icon,
    Markdown,
    RadioTab,
    CardSettingExplain,
  },
  mixins: [
    // cardDragHook,
    cardSizeHook,
  ],
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
    },
    editing: {
      type: Boolean,
    },
    openWay: {
      type: String,
      default: "desk",
    },
  },
  directives: {
    // reSize,
  },
  computed: {
    ...mapWritableState(noteStore, ["selNoteText", "initFlag"]),

    content() {
      return this.customData.text;
    },
    bodyOptions(){
      return  {
        bg:this.showColor ? 'var(--main-bg)' : ''
      }
    },
    header() {
      return {
        title: this.customData.title,
        // ifyIcon: 'fluent:notepad-16-regular',
        showIcon: "/logo/memorandum.svg",
        leftHover: true,
        leftHoverName: "打开应用",
        leftHoverIcon: "fluent:open-16-regular",
      };
    },
    noteOptions() {
      return {
        ...this.options,
        bg: this.customData.background,
        title: this.customData.title,
        resize: this.options.disableEdit ? false : true,
        customDel: this.customDel,
      };
    },
    options() {
      return {
        customDel: this.openWay === "nav" ? true : false,
        disableEdit: this.isCommunityDesktop(this.desk),
        cardName: '便签'
      };
    },
  },
  emit: ["delete"],
  data() {
    return {
      api: {},
      // 是否删除数据
      isRemove: false,
      removeValue: false,
      modelValue: false,
      fontColors: ["white", "black", "red", "green", "blue"],
      fontColor: "white",
      tmpTitle: "桌面标签",
      settingVisible: false,
      showColor: false,
      menuList: [
        {
          newIcon: "fluent:copy-20-regular",
          title: "复制内容",
          fn: () => {
            let content = this.$refs.mdEditor.getContent();
            require("electron").clipboard.writeHTML(content);
            // require('electron').clipboard.writeText(content)
            message.success("复制内容成功");
            console.log(content, "md内容");
          },
        },
        {
          newIcon: "fluent:markdown-20-regular",
          title: "复制MD文本",
          fn: () => {
            let content = this.$refs.mdEditor.getMarkdown();
            require("electron").clipboard.writeText(content);
            message.success("复制内容成功");
            console.log(content, "md内容");
          },
        },
        {
          newIcon: "fluent:clipboard-code-24-regular",
          title: "复制HTML代码",
          fn: () => {
            let content = this.$refs.mdEditor.getContent();
            require("electron").clipboard.writeText(content);
            message.success("复制内容成功");
            console.log(content, "md内容");
          },
        },
        {
          newIcon: "fluent:print-20-regular",
          title: "打印",
          fn: () => {
            this.api = DTPWeb.getInstance();
            this.modelValue = true;
          },
        },
        {
          icon: "shezhi1",
          title: "设置",
          fn: () => {
            this.$refs.homelSlotRef.visible = false;
            this.settingVisible = true;
          },
        },
        {
          newIcon: "fluent:open-20-filled",
          title: "跳转便签",
          fn: () => {
            const { openApp } = useAppModal("note");
            openApp({
              customIndex: this.customIndex,
            });
            // this.$router.push({
            //   name: 'note',
            //   params: {
            //     customIndex: this.customIndex
            //   }
            // })
          },
        },
      ],
      color: {
        color1: "#57BF60",
        color2: "#815BD0",
        color3: "#C8BF55",
        color4: "#DE5D5D",
        color5: "#5898CB",
        color6: "#DE5DB2",
      },
      text: "",
      background: "",
      icons: {
        notepad12Regular,
      },
      cardSize: { name: "2x2", title: "2x2" },
      sizeType: [
        { name: "2x2", title: "2x2" },
        { name: "2x4", title: "2x4" },
        { name: "4x4", title: "4x4" },
        { name: "4x6", title: "4x6" },
      ],
      cardSize1: { name: "2x2", value: "2x2" },
      sizeType1: [
        { name: "2x2", value: "2x2" },
        { name: "2x4", value: "2x4" },
        { name: "4x4", value: "4x4" },
        { name: "4x6", value: "4x6" },
      ],
      colorIndex: 1,
      customDel: true,
    };
  },
  created() {
    let setData = {};
    if (!this.customData.background) {
      setData.background = this.color.color1;
    }
    if (!this.customData.customSize) {
      setData.customSize = "2x2";
    }
    if (!this.customData.text) {
      setData.text = "";
    }
    if (!this.customData.color) {
      setData.colors = "#ffffff";
    }
    if (this.customData.fontColor) {
      this.fontColor = this.customData.fontColor;
    }
    if (Object.keys(setData)) {
      this.updateCustomData(this.customIndex, setData, this.desk);
    }
  },
  mounted() {
    this.text = this.customData.text;
    this.colorIndex = this.customData.colorIndex;
    this.showColor = this.customData.showColor ? true : false;
    this.tmpTitle = this.customData.title;
    this.background = this.customData.background;
    this.colors = this.customData.color;
    if (!this.customData.fontColor) {
      this.fontColor = "white";
    }

    if (this.options.disableEdit) {
      this.menuList = [
        {
          newIcon: "fluent:copy-20-regular",
          title: "复制内容",
          fn: () => {
            let content = this.$refs.mdEditor.getContent();
            require("electron").clipboard.writeHTML(content);
            // require('electron').clipboard.writeText(content)
            message.success("复制内容成功");
            console.log(content, "md内容");
          },
        },
        {
          newIcon: "fluent:markdown-20-regular",
          title: "复制MD文本",
          fn: () => {
            let content = this.$refs.mdEditor.getMarkdown();
            require("electron").clipboard.writeText(content);
            message.success("复制内容成功");
            console.log(content, "md内容");
          },
        },
        {
          newIcon: "fluent:clipboard-code-24-regular",
          title: "复制HTML代码",
          fn: () => {
            let content = this.$refs.mdEditor.getContent();
            require("electron").clipboard.writeText(content);
            message.success("复制内容成功");
            console.log(content, "md内容");
          },
        },
        {
          newIcon: "fluent:print-20-regular",
          title: "打印",
          fn: () => {
            this.api = DTPWeb.getInstance();
            this.modelValue = true;
          },
        },
      ];
    } else {
      this.menuList = [
        {
          newIcon: "fluent:copy-20-regular",
          title: "复制内容",
          fn: () => {
            let content = this.$refs.mdEditor.getContent();
            require("electron").clipboard.writeHTML(content);
            // require('electron').clipboard.writeText(content)
            message.success("复制内容成功");
            console.log(content, "md内容");
          },
        },
        {
          newIcon: "fluent:markdown-20-regular",
          title: "复制MD文本",
          fn: () => {
            let content = this.$refs.mdEditor.getMarkdown();
            require("electron").clipboard.writeText(content);
            message.success("复制内容成功");
            console.log(content, "md内容");
          },
        },
        {
          newIcon: "fluent:clipboard-code-24-regular",
          title: "复制HTML代码",
          fn: () => {
            let content = this.$refs.mdEditor.getContent();
            require("electron").clipboard.writeText(content);
            message.success("复制内容成功");
            console.log(content, "md内容");
          },
        },
        {
          newIcon: "fluent:print-20-regular",
          title: "打印",
          fn: () => {
            this.api = DTPWeb.getInstance();
            this.modelValue = true;
          },
        },
        {
          icon: "shezhi1",
          title: "设置",
          fn: () => {
            this.$refs.homelSlotRef.visible = false;
            this.settingVisible = true;
          },
        },
        {
          newIcon: "fluent:open-20-filled",
          title: "跳转便签",
          disabled: !window.$usePlat('client'),
          fn: () => {
            const { openApp } = useAppModal("note");
            openApp({
              customIndex: this.customIndex,
            });
            // this.$router.push({
            //   name: 'note',
            //   params: {
            //     customIndex: this.customIndex
            //   }
            // })
          },
        },
      ];
    }
  },

  methods: {
    ...mapActions(noteStore, ["changeDeskBg", "saveDeskTitle"]),
    ...mapActions(communityNavStore, ["isCommunityDesktop"]),
    communityAuth,
    // 自定义删除卡片
    deleteCard() {
      this.$emit("deleteCard");
    },
    removeNote() {
      this.removeValue = true;
      this.isRemove = false;
    },
    // 替换原有删除逻辑
    no() {
      this.removeValue = false;
    },
    async ok() {
      // 在触发删除前，设置可以删除卡片
      this.customDel = false;
      // 保存变化前的是否保留数据
      let temp = this.isRemove;
      this.$nextTick(() => {
        // 触发组件的删除函数
        this.$refs.homelSlotRef.removeCard();
        this.removeValue = false;
        this.isRemove = temp;
      });
      if(this.$usePlat()){
        // 删除便签时需要清除db数据
        let getDb = await tsbApi.db.find({
          selector: {
            _id: "note:" + this.customIndex,
          },
        });
        if (this.isRemove && getDb.docs.length) {
          await tsbApi.db.put({
            ...getDb.docs[0],
            isDelete: true,
            deskId: "",
            deskName: "",
          });
        } else {
          await tsbApi.db.put({
            ...getDb.docs[0],
            deskId: "",
            deskName: "",
          });
        }
      }
    },

    enterNote() {
      this.$router.push({
        name: "note",
        params: {
          customIndex: this.customIndex,
        },
      });
    },

    updateBackground(backgroundColor, n) {
      this.colorIndex = n;

      message.success({
        content: "设置卡片背景成功",
        key: "bg",
      });
      this.updateCustomData(
        this.customIndex,
        {
          background: backgroundColor,
          colorIndex: n,
        },
        this.desk
      );
      // 如果用户没有初始化过不加载
      if (this.initFlag) {
        this.changeDeskBg(this.customIndex, backgroundColor);
      }

      this.background = backgroundColor;
      if (
        backgroundColor ==
        "linear-gradient(-45deg, #545454 0%, #F9F8F9 0%, #F2F1F2 100%)"
      ) {
        this.updateCustomData(
          this.customIndex,
          {
            color: "#000000",
          },
          this.desk
        );
        this.colors = "#000000";
      } else {
        this.updateCustomData(
          this.customIndex,
          {
            color: "#ffffff",
          },
          this.desk
        );
        this.colors = "#ffffff";
      }
    },
    updateFontColor(color) {
      message.success({
        content: "设置字体颜色成功",
        key: "color",
      });
      this.updateCustomData(
        this.customIndex,
        {
          fontColor: color,
        },
        this.desk
      );
      this.fontColor = color;
    },
    // 修改便签标题
    changeNoteTitle() {
      // 数据发生变动开始保存
      if (this.tmpTitle != this.customData.title) {
        this.updateCustomData(
          this.customIndex,
          {
            title: this.tmpTitle,
          },
          this.desk
        );
        this.saveDeskTitle(this.customIndex, this.tmpTitle);
      }
    },
    // 修改桌面便签的主题色
    changeShowColor() {
      this.updateCustomData(
        this.customIndex,
        {
          showColor: this.showColor,
        },
        this.desk
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.box {
  width: 100%;
  height: 100%;
  background-color: rgba(165, 42, 42, 0);
  border: 0px;
  resize: none;
  border-radius: 8px;
  overflow: hidden;
  box-sizing: border-box;
  // padding: 12px;
  font-size: 16px;
  // border: 1PX solid RED;
  position: relative;
  top: -11px;
}

.box::-webkit-scrollbar {
  width: 0;
}

.box:focus {
  outline: none;
}

.item-box {
  display: flex;
  flex-wrap: wrap;
  box-sizing: border-box;
  margin-left: 2px;
}

.item {
  width: 40px;
  height: 40px;
  // opacity: 0.65;
  border-radius: 10px;
  cursor: pointer;
}

.drag-boxs {
  display: flex;
  margin-top: -24px;
  width: 100%;
  height: 20px;
  justify-content: end;
}

::-webkit-input-placeholder {
  color: var(--primary-text);
}
</style>
<style>
.printers .ant-select-selector {
  &:active {
    outline: none;
  }
  border: none !important;
  outline: none;
}
</style>
