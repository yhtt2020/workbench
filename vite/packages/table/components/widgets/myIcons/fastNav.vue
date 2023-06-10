<template>
    <Classification :navClassify="navClassify" v-if="editFlag" @clickLeftList="clickItem">
        <a-input v-model:value="selectContent" class="no-drag h-10 rounded-lg" placeholder="搜索"
            style="background: rgba(42, 42, 42, 0.6)">
            <template #prefix>
                <Icon icon="sousuo" class="text-gray-600"></Icon>
            </template>
        </a-input>
        <vue-custom-scrollbar key="scrollbar" :settings="rightScrollbarSettings" class="relative"
            style="height: calc(100% - 40px); padding: 5px 0">
            <listItem v-for="(item, index) in filterList" :item="item" class="rounded-lg right-scroll-list"
                @click="clickRightListItem(item, index)"></listItem>
        </vue-custom-scrollbar>

        <div v-show="nowClassify === 'localApp'" class="flex flex-col items-start text-zinc-500 h-full">
            <div>1. 点击选择需要添加的应用快捷方式</div>
            <div>2. 拖动应用快捷方式拖放到下方</div>
            <div>3. 支持持批量添加</div>
            <div class="border-dashed w-full h-1/2 mt-2.5 rounded-lg flex flex-row justify-center items-center"
                @dragover.prevent="" @drop.prevent="drop">
                <Icon icon="tianjia2" style="width: 18px; height: 18px" class="mr-2"></Icon>
                添加快捷方式
            </div>
            <ScrolX :height="66">
                <div class="flex flex-row w-full justify-start mt-4 -ml-8 pt-4 pl-4">
                    <div v-for="(item, index) in dropList" class="flex ml-4">
                        <a-badge>
                            <template #count>
                                <Icon icon="guanbi2" style="height: 24px; width: 24px; color: crimson"
                                    @click="deleteDropList(index)" class="pointer"></Icon>
                            </template>
                            <a-avatar :size="40" shape="square" :src="item.icon">
                            </a-avatar>
                        </a-badge>
                    </div>
                </div>
            </ScrolX>
            <div @click="clickRightListItem(dropList)"
                class="pointer flex justify-center items-center mt-2 w-24 h-12 rounded-lg"
                style="background: rgb(42, 42, 42); color: rgba(255, 255, 255, 0.85)">
                确定添加
            </div>
        </div>
    </Classification>
</template>

<script>
import Classification from '../../comp/Classification.vue'
import navigationData from "../../../js/data/tableData";
import listItem from '../../bottomPanel/listItem.vue';
const { appModel } = window.$models;
export default {
    components: { Classification, listItem },
    data() {
        return {
            navClassify: [...navigationData.navigationClassify], // 导航数据
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
            editFlag: true,
            activeRightItem: 0,
            dropList: [],
        }
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
        showAppNav() {
            this.editFlag = true;
        },
        clickRightListItem(item, index) {
            this.activeRightItem = index;
            this.editFlag = false;
            if (item instanceof Array) {
                this.$emit("returnApp", item[0])
                this.dropList = [];
            } else this.$emit("returnApp", item)
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
        openApp() {
            if (typeof this.myData.link === "object" && this.myData.link.type) {
                switch (this.myData.link.type) {
                    case "systemApp":
                        if (this.myData.link.event === "fullscreen") {
                            if (this.full) {
                                this.full = false;
                                tsbApi.window.setFullScreen(false);
                            } else {
                                this.full = true;
                                tsbApi.window.setFullScreen(true);
                            }
                        } else if (this.myData.link.event === "/status") {
                            if (this.$route.path === "/status") {
                                this.$router.go(-1);
                            } else {
                                this.$router.push({ path: "/status" });
                            }
                        } else if (this.myData.link.data) {
                            this.$router.push({
                                name: "app",
                                params: this.myData.link.data,
                            });
                        } else {
                            this.$router.push({ name: this.myData.link.event });
                        }
                        break;
                    case "coolApp":
                        this.$router.push({
                            name: "app",
                            params: this.myData.link.data,
                        });
                        break;
                    case "localApp":
                        require("electron").shell.openPath(this.myData.link.path);
                        break;
                    case "lightApp":
                        ipc.send("executeAppByPackage", {
                            package: this.myData.link.package,
                        });
                        break;
                    default:
                        require("electron").shell.openPath(this.myData.link.path);
                }
            } else if (this.myData.link) {
                this.myData.link.path
                    ? require("electron").shell.openPath(this.myData.link.path)
                    : require("electron").shell.openPath(
                        require("path").normalize(this.myData.link)
                    );
            }
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

    }
}
</script>

<style lang="scss" scoped></style>