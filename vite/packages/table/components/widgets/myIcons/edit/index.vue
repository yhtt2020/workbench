<template>
  <Teleport to="body">
    <div
      class="h-full w-full xt-mask fixed top-0 left-0 flex"
      style="z-index: 99990"
    >
      <div
        style="z-index: 999901"
        class="flex-grow flex justify-center items-center"
      >
        <MyIcon v-bind="edit"></MyIcon>
      </div>
      <div style="width: 500px; z-index: 999999" class="xt-modal flex flex-col">
        <div class="p-4 flex justify-between items-center">
          <div class="h-12 w-12 rounded-lg xt-btn no-drag" @click="close()">
            <Icon class="icon text-xl" icon="guanbi1"></Icon>
          </div>
          <div class="text-lg">设置</div>
          <div
            class="xt-active-btn h-12 w-12 rounded-lg no-drag"
            @click="save()"
          >
            保存
          </div>
        </div>
        <div
          style="width: 500px"
          class="px-4 flex-grow overflow-hidden overflow-y-auto scrollbar"
        >
          <Edit></Edit>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script>
import MyIcon from "../components/icon.vue";
import Edit from "./edit.vue";
import editMixins from "./hooks/mixins";

const { fs } = window.$models;
const { join } = require("path");
export default {
  mixins: [editMixins],
  props: {
    data: {},
  },
  components: {
    Edit,
    MyIcon,
  },
  methods: {
    close() {
      this.$emit("close");
    },
    save() {
      // let userPath = window.globalArgs["user-data-path"];
      // let temporaryIconPath = "temporaryIcon";
      // let fileDir = join(userPath, temporaryIconPath);
      // console.log("fileDir :>> ", fileDir);
      // // 应该做随机处理
      // const fileName = "newfile.png";
      // const filePath = join(fileDir, fileName);
      // fs.pathExists(fileDir, (err, exists) => {
      //   if (exists) {
      //     // 有文件夹
      //     console.log("Directory already exists.");

      //     fs.writeFile(filePath, this.edit.src, (err) => {
      //       if (err) {
      //         console.error("Error saving the image:", err);
      //       } else {
      //         console.log("Image saved successfully!");
      //         this.edit.src = filePath;
      //       }
      //     });
      //   } else {
      //     // 无文件夹
      //     // 目录不存在，使用 fs-extra 的 mkdirp 方法创建多级目录
      //     fs.mkdirp(fileDir, (err) => {
      //       console.log("Directory created successfully!");
      //     });
      //   }
      // });
      // return;

      // this.edit.linkValue = {
      //   type: "systemApp",
      //   event: "ai",
      // };
      // this.edit.open = {};
      this.$emit("save");
    },
  },
};
</script>

<style lang="scss" scoped>
.scrollbar::-webkit-scrollbar {
  width: 6px;
}

.scrollbar::-webkit-scrollbar-thumb {
  background-color: #888;
  border-radius: 3px;
}

.scrollbar::-webkit-scrollbar-track {
  background-color: #f1f1f1;
}
</style>
