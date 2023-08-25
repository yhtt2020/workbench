import { message } from "ant-design-vue";
export const copyMixins = {
  props: {
    copy: {
      type: String,
      default: "",
    },
  },
  methods: {
    copyToClipboard() {
      if (!this.copy) return;

      if (navigator.clipboard) {
        try {
          navigator.clipboard.writeText(this.copy);
          message.success("已成功复制到剪切板");
        } catch (error) {
          message.error("无法复制文本到剪切板:", error);
        }
      } else {
        if (this.copyStr(this.copy)) {
          message.success("已成功复制到剪切板");
        } else {
          message.error("复制到剪切板失败");
        }
      }
    },

    copyStr(text) {
      const textarea = document.createElement("textarea");
      textarea.value = text;

      // 将 textarea 元素添加到 DOM 树中，以便可以执行复制操作
      document.body.appendChild(textarea);

      // 选择文本并执行复制操作
      textarea.select();
      const copySuccessful = document.execCommand("copy");

      // 清理创建的 textarea 元素
      document.body.removeChild(textarea);
      return copySuccessful;
    },
  },
};
