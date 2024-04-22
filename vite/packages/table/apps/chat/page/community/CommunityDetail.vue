<!--非官方社群详情页 -->
<template>
  <template v-if="currentPageExist">
    <a-row class="w-full h-full">
      <a-col
        class="flex flex-col h-full find-left"
        v-if="floatVisible === false"
        style="border-right: 1px solid var(--divider)"
      >
        <CategoryFloat :no="currentNo" />
      </a-col>
      <a-col flex=" 1 1 200px" v-if="currentItem" class="flex flex-col h-full">
        <CommunityHeader :headerContent="currentItem" />
        <RightDetailMain v-if="currentItem !== null" :currentItem="currentItem" />
      </a-col>
    </a-row>
  </template>

  <template v-else>
    <PageDoesNotExist />
  </template>
</template>

<script setup>
import { ref,computed,getCurrentInstance,onMounted } from "vue";
import { useRouter,useRoute } from "vue-router";
import { CommunityAPI } from "../../api/communityAPI";
import { storeToRefs } from "pinia";
import browser from "../../../../js/common/browser";
import _ from "lodash-es";
import { checkGroupShip } from "../../../../js/common/sns";
import { TUIConversationService } from "@tencentcloud/chat-uikit-engine";
import { message } from "ant-design-vue";
import { chatCommunityStore } from "../../store/chatCommunity";

import CategoryFloat from "../../components/suspendMode/CategoryFloat.vue";
import PageDoesNotExist from "../empty/PageDoesNotExist.vue";
import RightDetailMain from "./RightDetailMain.vue";
import CommunityHeader from "../../components/suspendMode/CommunityHeader.vue";

/*调用API***/
const currentAPI = new CommunityAPI();
const { proxy } = getCurrentInstance();

/**store缓存数据**/
const chatCommunity = chatCommunityStore();
const { currentCommunityNo, setting } = storeToRefs(chatCommunity);


/**用于判断当前的社群是否存在**/
const currentPageExist = ref(true);
/**当前选中的数据**/ 
const currentItem = ref(null);

/**根据路由变化查询当前社群是否存在**/
const router = useRouter();
const route = useRoute();
router.beforeEach((to) => {
  const no = to.params?.no;
  if (no) {
    /**查询社群是否存在**/ 
    currentAPI.getByNoDetail({ no: no }).then((res) => {
      if (res?.status === 1) {
        currentPageExist.value = true;
        chatCommunity.setCurrentCommunityNo(to.params?.no);
        chatCommunity.loadCurrentCommunity(to.params?.no);
      } else if (res?.code === 404) {
        currentPageExist.value = false;
      }
    });
  }
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

/**触发当前左侧点击事件**/ 
const handleCurrentItem = async (data) => {
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
      }
      /**当前群聊为公开群**/ 
      else {
        const res = await window.$chat?.chat?.searchGroupByID(
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
  proxy.$bus.on("handleCurrentCommunity", (item) => {
    handleCurrentItem(item);
  });
  proxy.$bus.on("cancelJoin",()=>{
    currentItem.value = null;
  })
});
</script>

<style lang="scss" scoped>
</style>