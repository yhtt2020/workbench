<!--非官方社群详情页 -->
<template>
  <!-- 页面不存在 -->
  <template v-if="currentPageExist">
    <PageDoesNotExist />
  </template>

  <!-- 页面存在 -->
  <template v-else>
    <a-row class="w-full h-full">
      <a-col
        class="flex flex-col h-full find-left"
        v-if="floatVisible === false"
        style="border-right: 1px solid var(--divider)"
      >
        <CategoryFloat :no="currentNo" />
      </a-col>

      <template v-if="!childrenEmpty">
        <a-col
          flex=" 1 1 200px"
          v-if="currentItem"
          class="flex flex-col h-full"
        >
          <!-- <CommunityHeader :headerContent="currentItem" /> -->
          <RightDetailMain :currentItem="currentItem" />
        </a-col>
        <a-col flex=" 1 1 200px" v-else class="flex flex-col h-full">
          <CommunityDetailEmpty :no="currentNo" />
        </a-col>
      </template>

      <!-- 空状态，取文章 -->
      <template v-else>
        <a-col flex=" 1 1 200px" class="flex flex-col h-full">
          <div
            class="h-full w-full community-article flex items-center justify-center"
          >
            <Article :artName="artName"></Article>
          </div>
        </a-col>
      </template>
    </a-row>
  </template>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  getCurrentInstance,
  onMounted,
  ComponentPublicInstance,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import { CommunityAPI } from "../../api/communityAPI";
import { storeToRefs } from "pinia";
import browser from "../../../../js/common/browser";
import _ from "lodash-es";
import { checkGroupShip } from "../../../../js/common/sns";
import { TUIConversationService } from "@tencentcloud/chat-uikit-engine";
import { message } from "ant-design-vue";
import { chatCommunityStore } from "../../store/chatCommunity";
import { useNavigationStore } from "../../../../components/desk/navigationBar/navigationStore";

import CategoryFloat from "../../components/suspendMode/CategoryFloat.vue";
import PageDoesNotExist from "../empty/PageDoesNotExist.vue";
import RightDetailMain from "./RightDetailMain.vue";
/**后期需要使用时再开放**/ 
// import CommunityHeader from "../../components/suspendMode/CommunityHeader.vue";
import Article from "../../../../components/Article.vue";
import CommunityDetailEmpty from "../empty/CommunityDetailEmpty.vue";

/*调用API***/
const currentAPI: any = new CommunityAPI();
const { proxy } = getCurrentInstance();

/**路由**/
const router = useRouter();
const route = useRoute();

/**store缓存数据**/
const chatCommunity: any = chatCommunityStore();
const { currentCommunityNo, setting, communityTreeList, myCommunity } =
  storeToRefs(chatCommunity);
const useNavigation = useNavigationStore();
const { communityNavVisible } = storeToRefs(useNavigation);

/**用于判断当前的社群是否存在**/
const currentPageExist = ref(false);
/**当前选中的数据**/
const currentItem = ref(null);
const artName = ref("community_after_created_empty");

/** defineExpose暴露出来的方法，接口实现 **/
interface IInstance extends ComponentPublicInstance {
  getCommunityByNo(no: any): void;
}

/**监听路由进入的方法**/
defineOptions({
  name: "CommunityDetail",
  beforeRouteEnter(_to: any, _from: any, next) {
    const no = _to?.params?.no;
    next((vm) => {
      const instance = vm as IInstance;
      instance.getCommunityByNo(no); // 刷新列表数据（不缓存）
    });
  },
});

/**检测社群是否存在的方法**/
const getCommunityByNo = (no: any) => {
  /**对当前社群编号进行容错处理**/
  if (!no) return;

  /**工作台在线模式**/
  if ((window as any).$currentEnv() === "online") {
    /**调用社群排查是否存在的接口**/
    currentAPI.getByNoDetail({ no: no }).then(async (res: any) => {
      /**当前社群不存在逻辑**/
      if (res.status === 0 && res.code === 404) {
        return (currentPageExist.value = true);
      } else {
        /**当前社群存在逻辑**/
        currentPageExist.value = false;
        /**获取老的我的社群列表进行排查是否存在**/
        const oldIndex = _.findIndex(myCommunity.value, (item: any) => {
          return Number(item?.cno) === Number(no);
        });
        /**不存在添加当前社群模拟添加,并且显示社群加入入口**/
        if (oldIndex === -1) {
          const data = res?.data;
          /**添加的参数**/
          const option = {
            id: data.id,
            cno: data.no,
            float: "",
            img: data.icon,
            menuVisible: true,
            noBg: true,
            route: { name: "myCommunity", params: { no: data.no } },
            tab: `community_${data.no}`,
            type: `community${data.no}`,
            communityInfo: data,
          };
          // console.log('在线状态',option);
          chatCommunity.loadCurrentCommunity(option)
          // myCommunity.value.push(option);
          return;
        } else {
          chatCommunity.setCurrentCommunityNo(no);
          chatCommunity.loadCurrentCommunity(no);
        }
      }
    });
  } 
  
  else {
    /**工作台离线模式或者是其他模式  这里走的是不想要token情况下的接口**/
    currentAPI.getApiPostByNo({ no: no }).then((rs: any) => {
      /**当前社群不存在逻辑**/
      if (rs.status === 0 && rs.code === 404) {
        currentPageExist.value = true;
        return;
      } else {
        /**当前社群存在逻辑**/
        currentPageExist.value = false;
        const myIndex = _.findIndex(myCommunity.value, (item: any) => {
          return Number(item?.communityInfo?.no) === Number(no);
        });
        if (myIndex === -1) {
          const data = rs?.data;
          /**添加的参数**/
          const option = {
            id: data.id,
            cno: data.no,
            float: "",
            img: data.icon,
            menuVisible: true,
            noBg: true,
            route: { name: "myCommunity", params: { no: data.no } },
            tab: `community_${data.no}`,
            type: `community${data.no}`,
            communityInfo: data,
          };
          // console.log('离线状态',option);
          chatCommunity.loadCurrentCommunity(option)
          // myCommunity.value.push(option);
        }
      }
    });
  }
};

/**监听路由更新过程**/
router.beforeEach((to, from, next) => {
  const no = to?.params?.no;
  getCommunityByNo(no);
  next();
});

/**通过计算属性获取当前社群编号**/
const currentNo = computed(() => {
  // 初始值是否为null,并且判断no是否与路由的no相同
  if (
    currentCommunityNo.value === route.params.no &&
    currentCommunityNo.value
  ) {
    return currentCommunityNo.value;
  } else {
    return route.params.no;
  }
});

/**获取是否收起侧边栏**/
const floatVisible = computed(() => {
  return (
    setting.value.suspendVisible.enable &&
    setting.value.suspendVisible.no !== null &&
    Number(setting.value.suspendVisible.no) === Number(currentNo.value)
  );
});

/**判断社群频道是否为空**/
const childrenEmpty = computed(() => {
  return (
    communityTreeList.value.firstChannel.length === 0 &&
    communityTreeList.value.secondaryChannel.length === 0
  );
});

/**触发当前左侧点击事件**/
const handleCurrentItem = async (data: any) => {
  const currentData = data.value ? data.value : data;
  /**其他**/
  currentItem.value = currentData;
  const type = currentData.type;
  /**链接**/
  if (type === "link") {
    if (currentData.name !== "Roadmap") {
      const url = currentData.props.url;
      switch (currentData.props?.openMethod) {
        case "userSelect":
          /**工作台内置**/
          browser.openInTable(url);
          break;
        case "systemSelect":
          /**系统浏览器打开**/
          browser.openInSystem(url);
          break;
        case "thisky":
          /**想天浏览器**/
          browser.openInInner(url);
          break;
        case "mob":
          /**手机模式**/
          browser.openInMobMod(url, {
            partition: "persist:webcontent",
            newName: "手机模式",
          });
          break;
      }
    }
  }
  /**群聊**/
  if (type === "group") {
    const groupList =
      window.$TUIKit?.TUIStore?.storeMap?.group?.store?.groupList;
    const groupProps = currentData.props[0]
      ? currentData.props[0]
      : currentData.props;
    const index = _.findIndex(groupList, (findItem) => {
      return String(findItem.groupID) === String(groupProps.groupID);
    });
    /**当前群聊是否已经创建**/
    if (index > -1) {
      /**当前群聊为私有群**/
      const type = groupList[index]?.type;
      if (type === "Private") {
        const enableGroup = await checkGroupShip([`${groupProps.groupID}`]); // 有没有添加群聊
        currentData.value.isChat = enableGroup[0];
        const isDisable = groupList[index]?.joinOption === "DisableApply";
        if (enableGroup[0] === "yes") {
          const name = `GROUP${groupProps.groupID}`;
          TUIConversationService.switchConversation(name);
        } else {
          if (isDisable) {
            currentData.value.group = groups[index];
          } else {
            message.warn("该群禁止加入");
          }
        }
      } else {
        /**当前群聊为公开群**/
        const res = await window.$chat?.searchGroupByID(
          groupProps.groupID
        );
        const isDisable = res.data.group.joinOption !== "DisableApply";
        /**有没有添加群聊**/
        const enableGroup = await checkGroupShip([`${groupProps.groupID}`]);
        /**判断有没有加入社群, yes表示已经加入, not表示没有加入**/
        if (enableGroup[0] === "yes") {
          const name = `GROUP${groupProps.groupID}`;
          TUIConversationService.switchConversation(name);
        } else {
          /**isDisable判断群聊是否禁止加入**/
          if (isDisable) {
            currentData.value.group = res.data.group;
          } else {
            message.warn("该群禁止加入");
          }
        }
      }
    }
  }
};

onMounted(() => {
  proxy.$bus.on("handleCurrentCommunity", (item: any) => {
    handleCurrentItem(item);
  });
  proxy.$bus.on("cancelJoin", () => {
    currentItem.value = null;
  });
});

defineExpose({
  getCommunityByNo,
});
</script>

<style lang="scss" scoped>
.community-article {
  padding: 20px;
  font-size: 16px;
  line-height: 1.5;

  img {
    border-radius: 8px !important;
  }
}
</style>