<!-- 社群顶部背景图以及社群名称详情-->
<template>
  <div class="flex w-full flex-col">
    <!-- 背景图 -->
    <img
      :src="placeholderData.bgURL"
      class="w-full h-full object-cover"
      :class="sildVisible ? 'rounded-t-xl' : ''"
    />

    <!-- 返回按钮 -->
    <div class="absolute" v-if="!hasRole" style="top: 12px; left: 12px">
      <xt-button w="32" h="32" style="border-radius: 8px" @click="prevPage">
        <div class="flex items-center justify-center">
          <xt-ify-icon
            icon="fluent:chevron-left-16-filled"
            size="20"
            class="xt-text-2"
          />
        </div>
      </xt-button>
    </div>

    <!-- 底部名称以及下拉菜单 -->
    <template v-if="hasRole">
      <div class="h-11 community-name pb-1.5 w-full com-line-bg">
        <div
          class="px-3 m-1.5 items-center rounded-lg drop-hover flex justify-between h-8"
        >
          <CategoryDropdown
            :newIcon="'fluent:line-horizontal-3-20-filled'"
            class="w-full"
            :title="communityName"
            :list="cateList"
          />
        </div>
      </div>
    </template>

    <template v-else>
      <div class="h-11 community-name w-full com-line-bg">
        <div
          class="px-3 drop-hover flex items-center justify-start rounded-lg m-1.5 h-8"
        >
          <span class="xt-text font-14 xt-font">{{ communityName }}</span>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { toRefs, ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { chatCommunityStore } from "../../../store/chatCommunity";
import _ from "lodash-es";
import { useRouter } from "vue-router";

import CategoryDropdown from "../../dropdown/Dropdown.vue";

const emit = defineEmits(["currentApp"]);
const router = useRouter();

const props = defineProps({
  no: {
    type: String,
    required: true,
  },
  sideVisible: {
    type: Boolean,
    default: false,
  },
});
const { no, sideVisible } = toRefs(props);

/**解构store存储数据**/
const chatCommunity = chatCommunityStore();
const { myCommunity } = storeToRefs(chatCommunity);

/**默认图片占位,后期需要替换成动态的图片背景**/
const placeholderData = ref({
  bgURL:
    "https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/Yzzj-zana-AI6F-jnTG",
});

/**根据权限显示下拉菜单**/
const adminList = ref([
  {
    newIcon: "fluent:text-indent-decrease-16-filled",
    title: "收起边栏",
    callBack: () => {},
  },
  {
    newIcon: "fluent:apps-list-detail-24-regular",
    title: "切换双/单列",
    callBack: () => {
      chatCommunity.setColumnMode();
    },
  },
  {
    newIcon: "fluent:arrow-exit-20-filled",
    title: "退出社群",
    callBack: () => {},
  },
]);

/**开启悬浮模式下拉菜单**/
const hideList = ref([
  {
    newIcon: "fluent:apps-add-in-20-filled",
    title: "添加新应用",
    callBack: () => {
      emit("currentApp", "newApp");
    },
  },
  {
    newIcon: "fluent:add-16-filled",
    title: "添加新分组",
    callBack: () => {
      emit("currentApp", "newCategory");
    },
  },
  {
    newIcon: "fluent:text-indent-decrease-16-filled",
    title: "展开边栏",
    callBack: () => {
      chatCommunity.setSuspendVisible({
        enable: false,
        no: no.value,
      });
    },
  },
  {
    newIcon: "fluent:settings-16-regular",
    title: "社群设置",
    type: "manage",
    callBack: () => {},
  },
  // {
  //   newIcon: "fluent:people-add-16-regular",
  //   title: "邀请其他人",
  //   callBack: () => {},
  // },
  // {
  //   newIcon: "ant-design:team-outlined",
  //   title: "成员管理",
  //   type: "manage",
  //   callBack: () => {},
  // },
]);
/**关闭悬浮模式下拉菜单**/
const showList = ref([
  {
    newIcon: "fluent:apps-add-in-20-filled",
    title: "添加新应用",
    callBack: () => {
      emit("currentApp", "newApp");
    },
  },
  {
    newIcon: "fluent:add-16-filled",
    title: "添加新分组",
    callBack: () => {
      emit("currentApp", "newCategory");
    },
  },
  {
    newIcon: "fluent:text-indent-decrease-16-filled",
    title: "收起边栏",
    callBack: () => {
      chatCommunity.setSuspendVisible({
        enable: true,
        no: no.value,
      });
    },
  },
  {
    newIcon: "fluent:apps-list-detail-24-regular",
    title: "切换双/单列",
    callBack: () => {
      chatCommunity.setColumnMode();
    },
  },
  // {
  //   newIcon: "fluent:people-add-16-regular",
  //   title: "邀请其他人",
  //   callBack: () => {},
  // },
  {
    newIcon: "fluent:settings-16-regular",
    title: "社群设置",
    type: "manage",
    callBack: () => {},
  },
  // {
  //   newIcon: "ant-design:team-outlined",
  //   title: "成员管理",
  //   type: "manage",
  //   callBack: () => {},
  // },
]);

/**判断有没有加入群聊通过社群中role**/
const hasRole = computed(() => {
  const currentFind = _.find(myCommunity.value, (item) => {
    return Number(item?.route?.params?.no) === Number(no.value);
  });
  if (currentFind && currentFind.role) {
    return true;
  } else {
    return false;
  }
});

/**如果当前社群用户没有添加的意向,就点击返回按钮返回上一个页面**/
const prevPage = () => {
  const index = _.findIndex(myCommunity.value, (item) => {
    return Number(item?.route?.params?.no) === Number(no.value);
  });
  if(index > -1){
    myCommunity.value.splice(index, 1);
    router.go(-1);
  }
};

/**获取社群名称**/
const communityName = computed(() => {
  const currentFind = _.find(myCommunity.value, (item) => {
    return Number(item?.route?.params?.no) === Number(no.value);
  });
  chatCommunity.getCommunityTree(no.value);
  return currentFind?.communityInfo?.name;
});

/**根据当前角色权限进行下拉菜单区分**/
const isOwner = computed(() => {
  if (hasRole) {
    const currentFind = _.find(myCommunity.value, (item) => {
      return Number(item?.route?.params?.no) === Number(no.value);
    });
    return currentFind?.role;
  }
});

/**下拉菜单列表**/
const cateList = computed(() => {
  /**社群权限**/
  if (isOwner.value !== "member") {
    /**开启悬浮模式并且社群ID一致**/
    if (sildVisible.value) {
      return hideList.value;
    } else {
      return showList.value;
    }
  } else {
    return adminList.value;
  }
});
</script>

<style lang="scss" scoped>
.com-line-bg {
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.7) 100%
  );
}
.community-name {
  position: absolute;
  bottom: 0;
}
.drop-hover {
  &:hover {
    background: var(--primary-bg);
  }
}
</style>