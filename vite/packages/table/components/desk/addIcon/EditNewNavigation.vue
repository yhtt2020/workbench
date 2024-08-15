<template>
  <xt-modal
    v-model="editVisible"
    :footer="false"
    boxClass=""
    :mask="0"
    :header="false"
  >
    <div
      class="flex overflow-hidden rounded-xl"
      style="height: 75vh; width: 63.6vw"
    >
      <xt-button
        class="absolute right-3 top-3"
        @click="closeNav"
        icon="fluent:dismiss-16-regular"
        w="32"
        h="32"
        radius="8"
        iconSize="16"
      >
      </xt-button>
      <!-- 起始页 -->
      <StartPage
        @choose="chooseItem"
        v-if="isStart"
        :communityRole="communityRole"
      ></StartPage>
      <!-- 左侧导航栏 -->
      <!-- communityRole ? newLeftMenu.length - 1 : 6 -->
      <!--  last="6"
        end="1"  -->
      <xt-left-menu
        v-else
        :list="newLeftMenu"
        model="id"
        v-model:index="index"
        leftMargin="mr-0 py-3"
        w="64"
        leftClass="xt-main-bg"
        class="w-full"
      >
        <!-- 右侧功能区 -->
        <div
          v-if="iconIndex === 'Browser'"
          class="h-full max-w-[250px] flex-shrink-0"
          style="overflow: hidden"
          @wheel.stop
        >
          <LeftMenu
            @changeFolder="changeFolder"
            @refresh="refresh"
            :isNav="true"
          ></LeftMenu>
        </div>
        <div class="flex flex-col w-full h-full p-3 xt-modal">
          <!-- 头部 -->
          <div class="flex items-center justify-between w-full mb-3">
            <!-- 输入框 -->
            <a-input
              placeholder="搜索"
              style="
                width: 244px;
                height: 32px;
                border-radius: 10px;
                background: var(--main-bg);
              "
              v-model:value="inputValue"
            >
              <template #suffix>
                <xt-new-icon
                  icon="fluent:search-16-regular"
                  size="20"
                  class="xt-text-2"
                />
              </template>
            </a-input>

            <!-- 下拉框 -->
            <div class="flex mr-12" v-if="!isFolder">
              <div class="mt-1 ml-3 text-base xt-text-2">添加到：</div>
              <DropDown
                :list="dropArr"
                v-model:defaultTitle="defaultTitle"
                @change="changeTitle"
              >
              </DropDown>
            </div>
          </div>
          <xt-scrollbar
            class="flex-1 w-full overflow-hidden"
            :x="false"
            :y="true"
            :key="iconIndex"
          >
            <!-- 桌面应用 -->
            <Windows
              v-if="iconIndex === 'Windows'"
              v-model:value="inputValue"
              @addIcon="addIcon"
            ></Windows>
            <!-- 团队应用 -->
            <Team
              v-if="iconIndex === 'Team'"
              v-model:value="inputValue"
              @addIcon="addIcon"
            ></Team>
            <!-- 系统应用 -->
            <System
              v-if="iconIndex === 'System'"
              v-model:value="inputValue"
              @addIcon="addIcon"
            ></System>
            <!-- 网址应用 -->
            <WebSite
              v-if="iconIndex === 'WebSite'"
              v-model:value="inputValue"
              @addIcon="addIcon"
            ></WebSite>
            <!-- 收藏夹 -->
            <Browser
              v-if="iconIndex === 'Browser'"
              :nav="navMap"
              v-model:value="inputValue"
              @addIcon="addIcon"
              :menus="menus"
            ></Browser>
            <!-- 酷应用 -->
            <CoolApp
              v-if="iconIndex === 'CoolApp'"
              v-model:value="inputValue"
              @addIcon="addIcon"
            ></CoolApp>
            <!-- 轻应用 -->
            <LightApp
              v-if="iconIndex === 'LightApp'"
              v-model:value="inputValue"
              @addIcon="addIcon"
            ></LightApp>
            <!-- 自定义 -->
            <teleport to="body">
              <CustomIcon
                v-if="iconIndex === 'CustomIcon'"
                @addIcon="addIcon" @close="customClose"
              ></CustomIcon>
              <!-- 以文件夹形式添加,预览 -->
              <xt-preview
                v-if="previewFlag"
                v-model="previewFlag"
                @ok="addFolderIcon"
                :list="multipleList"
                :isFavorite="true"
              >
              </xt-preview>
              <!-- 添加到桌面 -->
              <AddDesk
                v-if="deskFlag"
                :list="multipleList"
                @close="deskFlag = false"
              ></AddDesk>
            </teleport>
          </xt-scrollbar>
        </div>
      </xt-left-menu>
      <!-- 多图标下显示添加图标个数 -->
      <transition
        name="animate__animated animate__bounce animate__delay-0.5s"
        enter-active-class="animate__fadeInUp"
        leave-active-class="animate__fadeOutDown"
      >
        <xt-button
          @click="addMultiple"
          v-if="isMultiple && iconIndex !== 'Browser'"
          w="135"
          h="40"
          radius="20"
          type="theme"
          class="absolute left-1/2 bottom-4"
        >
          共添加{{ multipleList.length }}个图标
        </xt-button>
      </transition>

      <!-- 右下角选择控制单选多选组件 -->
      <Labor :menus="menus" :checkFlag="isMultiple" @changeCheck="changeState">
      </Labor>
    </div>
  </xt-modal>
</template>

<script setup lang='ts'>
import {
  ref,
  watch,
  defineAsyncComponent,
  onBeforeUnmount,
  onMounted,
  computed,
  getCurrentInstance,
} from "vue";
import { message } from "ant-design-vue";
import "animate.css";
import { storeToRefs } from "pinia";
import { position } from "./hook/defaultData";
import { completeTask } from "../../../apps/task/task";
import _ from "lodash-es";
import {
  useFileConversionIcon,
  mergeData,
} from "../../../ui/hooks/useDataConversion";
import { nanoid } from "nanoid";

import AddDesk from "./components/AddDesk.vue";
import DropDown from "./components/DropDown.vue";
import LeftMenu from "../../../apps/favorites/components/LeftMenu.vue";

import { useNavigationStore } from "../navigationBar/navigationStore";
import { navStore } from "../../../store/nav";
import { cardStore } from "../../../store/card";
import { homeStore } from "../../../store/home";
import { useIconStore } from "./store";
import { favoStore } from "../../../apps/favorites/store";

const { proxy } = getCurrentInstance() as any;

// 获取到当前多选的图标
const iconStore = useIconStore();
const { multipleList, isMultiple } = storeToRefs(iconStore);

// 导航栏选择
const useNavStore = useNavigationStore();
const { selectNav } = storeToRefs(useNavStore);

// 导航栏
const useNav = navStore();
const {
  copyFootNav,
  sideNavigationList,
  rightNavigationList,
  navigationToggle,
} = storeToRefs(useNav);

// 桌面
const useCard = cardStore();
const { desks } = storeToRefs(useCard);

// 当前桌面id
const useHome = homeStore();
const { currentDeskId } = storeToRefs(useHome);

// 收藏夹
const useFavoStore = favoStore();
const { folderIcons, allList, folderIndex } = storeToRefs(useFavoStore);

// 组件动态引入
const StartPage = defineAsyncComponent(
  () => import("./components/Start/StartPage.vue")
);
const Windows = defineAsyncComponent(
  () => import("./components/Windows/Windows.vue")
);
const Team = defineAsyncComponent(() => import("./components/Team/Team.vue"));
const System = defineAsyncComponent(
  () => import("./components/System/System.vue")
);
const WebSite = defineAsyncComponent(
  () => import("./components/WebSite/WebSite.vue")
);
const Browser = defineAsyncComponent(
  () => import("./components/Browser/Browser.vue")
);
const CoolApp = defineAsyncComponent(
  () => import("./components/CoolApp/CoolApp.vue")
);
const LightApp = defineAsyncComponent(
  () => import("./components/LightApp/LightApp.vue")
);
const CustomIcon = defineAsyncComponent(
  () => import("./components/CustomIcon/CustomIcon.vue")
);
const Labor = defineAsyncComponent(() => import("./components/Labor.vue"));

// 限制message提示框最大显示数量
message.config({
  maxCount: 1,
});
export interface EditType {
  isFolder: boolean;
  communityRole: boolean;
}

const props = withDefaults(defineProps<EditType>(), {
  isFolder: false,
  communityRole: false,
});

// 常量
const iconIndex = ref("Windows"); // 默认显示的组件
// 'Windows'
const editVisible = ref(true); // 是否显示
const inputValue = ref(""); // 输入框的值
const previewFlag = ref(false); // 是否显示预览
const deskFlag = ref(false); // 是否显示添加到桌面
const isStart = ref(true); // 是否显示开始页
const defaultTitle = ref({}); // 下拉框默认值
const index = ref(0);

// 禁止添加到桌面以及文件夹中的图标
const disabledAdd = ref([
  // 'commun',
  // 'control',
  "效率助手",
  "控制中心",
  "社区中心",
]);

// 导航栏数据
const navMap = ref({
  foot: copyFootNav.value,
  left: sideNavigationList.value,
  right: rightNavigationList.value,
});

// 判断是否开启导航栏
const nav = computed(() => {
  return {
    foot: navigationToggle.value[2],
    left: navigationToggle.value[0],
    right: navigationToggle.value[1],
    desktop: true, // 兼容老版本桌面选择
    "": true, // 未传值情况
  };
});
// 提示是否开启导航栏
const obj = computed(() => {
  return {
    foot: () => {
      navigationToggle.value[2] = true;
    },
    left: () => {
      navigationToggle.value[0] = true;
    },
    right: () => {
      navigationToggle.value[1] = true;
    },
  };
});

// 关闭回调事件
const emit = defineEmits(["setQuick", "addIcon"]);

// 右下角添加的菜单
const menus = ref([
  {
    label: "添加到桌面",
    newIcon: "fluent:desktop-16-regular",
    callBack: async () => {
      if (iconIndex.value === "Browser" && isMultiple.value) {
        filterCheck();
      }
      deskFlag.value = true;
      unCheck();
    },
  },
  {
    label: "添加到分组",
    newIcon: "fluent:app-folder-16-regular",
    callBack: () => {
      if (iconIndex.value === "Browser" && isMultiple.value) {
        filterCheck();
      }
      previewFlag.value = true;
      folderIcons.value = multipleList.value;
      unCheck();
    },
  },
  {
    label: "添加到导航栏",
    newIcon: "fluent:tablet-16-regular",
    children: [
      {
        label: "主导航",
        newIcon: "fluent:tablet-16-regular",
        callBack: () => {
          addMoreIcon("foot", "主导航");
        },
      },
      {
        label: "左侧导航栏",
        newIcon: "fluent:panel-left-contract-16-regular",
        callBack: () => {
          addMoreIcon("left", "左侧导航栏");
        },
      },
      {
        label: "右侧导航栏",
        newIcon: "fluent:panel-right-contract-16-regular",
        callBack: () => {
          addMoreIcon("right", "右侧导航栏");
        },
      },
    ],
  },
]);

// 用于在多选情况下收藏夹内容，兼容 ---- 只用于收藏夹
const filterCheck = () => {
  const list = allList.value.filter((item) => item.check);
  list.forEach((item) => {
    item.type = "default";
    item.value = item.url;
    item = mergeData(item);
  });
  multipleList.value = [...list];
};

// 添加成功后，取消选中状态 --- 只用于收藏夹
const unCheck = () => {
  allList.value.forEach((item) => {
    if (item.check) {
      item.check = false;
    }
  });
};

// 收藏夹刷新 --- 只用于收藏夹
const refresh = () => {
  proxy.$bus.emit("refreshBrowser");
};

// 右键菜单导航栏添加图标
const addMoreIcon = (bar: String, tip: String) => {
  const _addIcon = () => {
    // 兼容收藏夹
    if (iconIndex.value === "Browser" && isMultiple.value) {
      filterCheck();
    }
    multipleList.value.forEach((item) => {
      navMap.value[bar].unshift(item);
    });
    message.success("成功添加图标至桌面末尾");
    isMultiple.value = false;
    multipleList.value = [];
    // 兼容收藏夹
    unCheck();
  };
  if (!nav.value[bar]) {
    window.$ui.confirm(`当前${tip}没有开启，是否选择开启导航栏`, "", {
      ok: () => {
        obj.value[bar]();
        _addIcon();
      },
      no: () => {
        multipleList.value = [];
      },
    });
  } else {
    _addIcon();
  }
};

// 修改多选状态
const changeState = () => {
  isMultiple.value = !isMultiple.value;
};

// 关闭
const closeNav = () => {
  emit("setQuick");
};

// 自定义关闭后自动跳转到系统设置
const customClose = () => {
  index.value = 1
  iconIndex.value = 'System'
}

// 左侧导航栏数组类型格式
type LeftMenuType = {
  newIcon: string; // 新版图标
  callBack: (item: any) => void; // 回调
  component: string; // 加载的组件
  id: number; //
  name?: string; // 名称
};
// 左侧导航栏
const leftMenu = ref<LeftMenuType[]>([
  {
    newIcon: "mingcute:windows-line",
    callBack: (item) => {
      chooseItem(item);
    },
    component: "Windows",
    id: 0,
    name: "Win",
  },
  // 功能暂未开发,暂时隐藏
  // {
  //   newIcon: 'fluent:people-community-16-regular',
  //   callBack: (item) => { chooseItem(item) },
  //   component: 'Team'
  // },
  {
    newIcon: "fluent:settings-16-regular",
    callBack: (item) => {
      chooseItem(item);
    },
    component: "System",
    id: 1,
    name: "系统",
  },
  {
    newIcon: "fluent:globe-16-regular",
    callBack: (item) => {
      chooseItem(item);
    },
    component: "WebSite",
    id: 2,
    name: "网址",
  },
  {
    newIcon: "fluent:star-16-regular",
    callBack: (item) => {
      chooseItem(item);
    },
    component: "Browser",
    id: 3,
    name: "收藏夹",
  },
  {
    newIcon: "fluent:grid-16-regular",
    callBack: (item) => {
      chooseItem(item);
    },
    component: "CoolApp",
    id: 4,
    name: "酷应用",
  },
  {
    newIcon: "fluent:window-multiple-16-regular",
    callBack: (item) => {
      chooseItem(item);
    },
    component: "LightApp",
    id: 5,
    name: "轻应用",
  },
  {
    newIcon: "fluent:add-16-regular",
    callBack: (item) => {
      chooseItem(item);
    },
    component: "CustomIcon",
    id: 6,
  },
]);
if(!$usePlat('client')){
  leftMenu.value.splice(0,1)
}

// 选择左侧导航栏
const chooseItem = (item: any, i?: any) => {
  if (item.component === "Team") {
    if (props.communityRole) {
      isStart.value = false;
      index.value = 1;
      iconIndex.value = "System";
    } else {
      isStart.value = false;
      index.value = 0;
      iconIndex.value = "Windows";
    }
  } else {
    isStart.value = false;
    iconIndex.value = item.component;
    const found: any = leftMenu.value.find((find) => {
      return String(find.component) === String(item.component);
    });
    index.value = found?.id;
  }
};

// 添加图标
const addIcon = (item: object | undefined) => {
  const tag = selectNav.value;
  if (navMap.value.hasOwnProperty(tag)) {
    let check = checkNav(tag, item);
    if (check) {
      // 在导航栏添加图标，完成任务
      completeTask("m0105");
      navMap.value[tag].unshift(item);
      message.success("成功添加图标至桌面末尾");
    }
  } else {
    // 图标禁止被添加到桌面
    if (disabledAdd.value.includes(item.name)) {
      message.error(`${item.name} 已被禁止添加到桌面`);
      return;
    }
    completeTask("m0102");
    if (currentDeskId.value === defaultTitle.value.id) {
      emit("addIcon", item);

    } else {
      // 添加图标到其他桌面
      const target = desks.value.find((i) => i.id === defaultTitle.value.id);
      if (target) {
        const card = _.cloneDeep(item);
        const i = useFileConversionIcon(card);
        // console.log(i,'<<<<<<<<')
        const id = nanoid(6);
        target.cards.push({
          name: "myIcons",
          customData: {
            iconList: [{ ...i }],
          },
          id,
        });
      }
    }

    message.success("成功添加图标至桌面末尾");
  }

  setTimeout(() => {
    // 社群桌面同步云端数据回调
    if (props.communityRole) {
      proxy.$bus.emit("updateSync");
    }
  }, 800);
};

// 检查导航栏图标是否重复添加
const checkNav = (nav, item) => {
  const index = navMap.value[nav].findIndex((i) => i.value === item.value);
  if (index !== -1) {
    message.error("图标已添加，请勿重复添加");
    return false;
  }
  return true;
};

// 预览
const addMultiple = () => {
  previewFlag.value = true;
  folderIcons.value = multipleList.value;
};

// 预览后
const addFolderIcon = () => {
  previewFlag.value = false;
  isMultiple.value = false;
};

// 收藏夹切换文件夹
const changeFolder = (index) => {
  folderIndex.value = index;
};

// 下拉框
onMounted(() => {
  let tag = selectNav.value === "" ? "desktop" : selectNav.value;
  if (tag === "desktop") {
    let target = desks.value.find((item) => item.id === currentDeskId.value);
    defaultTitle.value = target;
  } else {
    const target = position.find((item) => item.value === tag);
    defaultTitle.value = target;
  }
  // 如果收藏夹未创建，则进行刷新
  if (allList.value.length === 0) {
    proxy.$bus.emit("refreshBrowser");
  }
});

// 下拉框改变标题
const changeTitle = (item) => {
  defaultTitle.value = item;
  selectNav.value = item.value;
};

// 下拉框数据切换
const dropArr = computed(() => {
  if (selectNav.value === "desktop" || selectNav.value === "") {
    return desks.value.map((item, index) => {
      return {
        name: item.name,
        id: item.id,
        nid: item.nanoid,
        mdi: item.marketId,
        value: "desktop",
      };
    });
  } else {
    return position;
  }
});

// 左侧导航栏进行切换时，多选图标数据清空
watch(
  () => iconIndex.value,
  (newVal, oldVal) => {
    multipleList.value = [];
  }
);

// 切换选择导航栏时，如果没有开启，提示是否开启
watch(
  () => selectNav.value,
  (newVal, oldVal) => {
    if (!nav.value[newVal]) {
      window.$ui.confirm(
        `当前${defaultTitle.value.name}没有开启，是否选择开启导航栏`,
        "",
        {
          ok: () => {
            obj.value[newVal]();
          },
          no: () => {
            selectNav.value = oldVal;
            defaultTitle.value = position.find((item) => item.value === oldVal);
          },
        }
      );
    }
  }
);

// 防止退出后再次打开，还是多选状态
onBeforeUnmount(() => {
  isMultiple.value = false; // 关闭多选
  selectNav.value = ""; // 重置导航栏，防止后续再次打开添加到错误位置
  multipleList.value = []; // 重置多选数据
});

// 优化根据社群桌面进行处理
const newLeftMenu = computed(() => {
  // web端隐藏收藏夹选项
  if(window.$usePlat()) leftMenu.value = leftMenu.value.filter((menu: any) => {
    return menu.name !== "收藏夹"
  });
  if (props.communityRole) {
    const filterMenu = leftMenu.value.filter((menu: any) => {
      return menu.name !== "Win" && menu.id !== 0;
    });
    return filterMenu;
  } else {
    return leftMenu.value;
  }
});
</script>
<style lang='scss' scoped></style>
