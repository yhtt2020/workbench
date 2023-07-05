<template>
  <Classification
    :navClassify="navClassify"
    v-if="editFlag"
    v-model:show="editFlag"
    @clickLeftList="clickItem"
  >
    <div v-show="nowClassify !== 'localApp'" class="h-full">
      <a-input
        v-model:value="selectContent"
        class="no-drag h-10 rounded-lg"
        placeholder="搜索"
      >
        <template #prefix>
          <Icon icon="sousuo" class="text-gray-600"></Icon>
        </template>
      </a-input>
      <vue-custom-scrollbar
        key="scrollbar"
        :settings="rightScrollbarSettings"
        class="relative"
        style="height: calc(100% - 40px); padding: 5px 0"
      >
        <listItem
          v-for="(item, index) in filterList"
          :item="item"
          class="rounded-lg right-scroll-list xt-text"
          @click="clickRightListItem(item, index)"
        ></listItem>
      </vue-custom-scrollbar>
    </div>
  </Classification>
</template>

<script>
import Classification from "../../../comp/Classification.vue";
import navigationData from "../../../../js/data/tableData";
import listItem from "../../../bottomPanel/listItem.vue";
const { appModel } = window.$models;
export default {
  components: { Classification, listItem },
  data() {
    return {
      navClassify: [
        { name: "systemApp", cname: "系统应用" },
        { name: "coolApp", cname: "酷应用" },
        { name: "tableApp", cname: "Windows应用" },
        { name: "lightApp", cname: "轻应用" },
      ],
      ClassifyData: [
        ...navigationData.coolAppList,
        ...navigationData.systemAppList,
      ],
      nowClassify: "systemApp",
      selectContent: "",
      rightScrollbarSettings: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true,
      },
      editFlag: false,
      activeRightItem: 0,
      dropList: [],
    };
  },
  methods: {
    clickItem(item) {
      this.activeRightItem = 0;
      this.nowClassify = item.name;
    },
    async drop(e) {
      let files = e.dataTransfer.files;
      let filesArr = [];
      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          filesArr.push(files[i].path);
        }
      }
      this.dropFiles = await ipc.sendSync("getFilesIcon", {
        files: JSON.parse(JSON.stringify(filesArr)),
      });
      this.dropList.push(...this.dropFiles);
    },
    deleteDropList(index) {
      this.dropList.splice(index, 1);
    },
    showFastNav() {
      this.editFlag = true;
    },
    clickRightListItem(item, index) {
      this.activeRightItem = index;
      this.editFlag = false;
      if (item instanceof Array) {
        this.$emit("returnApp", item[0]);
        this.dropList = [];
      } else this.$emit("returnApp", item);
    },
    async loadDeskIconApps() {
      const lightApps = await appModel.getAllApps();
      for (let i = 0; i < lightApps.length; i++) {
        lightApps[i].icon = lightApps[i].logo;
        lightApps[i].type = "lightApp";
      }
      const desktopApps = await ipc.sendSync("getDeskApps");
      for (let i = 0; i < desktopApps.length; i++) {
        desktopApps[i].type = "tableApp";
      }
      this.ClassifyData.push(...desktopApps, ...lightApps);
    },
  },
  created() {
    this.loadDeskIconApps();
  },
  computed: {
    filterList() {
      return this.ClassifyData.filter((i) => {
        return (
          i.type === this.nowClassify && i.name.includes(this.selectContent)
        );
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
