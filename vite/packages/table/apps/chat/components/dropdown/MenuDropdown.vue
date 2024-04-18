<!-- 右键下拉菜单 -->
<template>
  <xt-menu
    name="name"
    :menus="menus"
    @contextmenu="currentMenu.revID = item"
    class="w-full"
  >
    <div
      class="flex items-center rounded-lg px-3.5 py-2.5 pointer"
      @click="handleCurrentMenu"
    >
      <div class="flex items-center">
        <div class="flex items-center">
          <template v-if="item.type === 'group'">
            <xt-ify-icon icon="fluent-emoji-flat:thought-balloon" size="20" />
          </template>
          <template v-if="item.type === 'link'">
            <xt-ify-icon
              icon="fluent-emoji-flat:globe-with-meridians"
              size="20"
            />
          </template>
          <template v-if="item.type === 'forum'">
            <xt-ify-icon icon="fluent-emoji-flat:placard" size="20" />
          </template>
          <span class="font-16 ml-2 truncate xt-text mr-1.5">
            {{ item.name || item.title }}
          </span>
          <xt-ify-icon
            icon="fluent:open-16-regular"
            size="20"
            class="xt-text-2"
            v-if="item.type === 'link' && item.name !== 'Roadmap'"
          />
        </div>
      </div>
    </div>
  </xt-menu>

  <ChannelUpdateLink ref="updateLinkRef" :currentLink="currentMenu.revID" />
</template>

<script setup>
import { ref, reactive, computed, nextTick, toRefs, watch } from "vue";
import { storeToRefs } from "pinia";
import { message } from "ant-design-vue";
import { chatCommunityStore } from "../../store/chatCommunity";

/**子频道链接修改设置**/
import ChannelUpdateLink from "../link/ChannelUpdateLink.vue";

const emit = defineEmits(["currentClick"]);
const chatCommunity = chatCommunityStore();

const props = defineProps({
  // 当前社群数据
  item: {
    type: Object,
    default: () => ({}),
  },
  // 权限角色
  role: {
    type: String,
    required: true,
  },
  // 社群编号
  no: {
    type: String,
    required: true,
  },
});
const { item, role, no } = toRefs(props);

/**ref定义区域**/
const updateLinkRef = ref(null);
const currentMenu = ref({
  revID: null,
});
const linkMenu = ref([
  {
    name: "链接设置",
    newIcon: "fluent:settings-16-regular",
    callBack: () => {
      // console.log("更新", currentMenu.value.revID);
      updateLinkRef.value.openUpdateLink();
    },
  },
  {
    name: "删除应用",
    newIcon: "akar-icons:trash-can",
    color: "var(--error)",
    callBack: () => {
      window.$ui.confirm(
        "删除分类操作不可撤销，分类被删除后，子应用将被移动到顶层。是否确定删除？",
        "",
        {
          ok: async () => {
            const res = chatCommunity.deleteChannel(
              currentMenu.value.revID.id,
              no.value
            );
            if (res.status === 1) {
              message.success(`${res.info}`);
            }
          },
          type: "warning",
          noText: "取消",
        }
      );
    },
  },
]);
const otherMenu = ref([
  // {
  //   name: "应用设置",
  //   newIcon: "fluent:settings-16-regular",
  //   callBack: () => {},
  // },
  {
    name: "删除应用",
    newIcon: "akar-icons:trash-can",
    color: "var(--error)",
    callBack: () => {
      window.$ui.confirm(
        "删除分类操作不可撤销，分类被删除后，子应用将被移动到顶层。是否确定删除？",
        "",
        {
          ok: async () => {
            const res = chatCommunity.deleteChannel(
              currentMenu.value.revID.id,
              no.value
            );
            if (res.status === 1) {
              message.success(`${res.info}`);
            }
          },
          type: "warning",
          noText: "取消",
        }
      );
    },
  },
]);

/**计算属性**/
const menus = computed(() => {
  if (role.value !== "member") {
    if (item.value.type === "link") {
      return linkMenu.value;
    } else {
      return otherMenu.value;
    }
  } else {
    return [];
  }
});

/**事件**/
const handleCurrentMenu = () => {
  emit("currentClick", item);
};

// export default {
//   setup(props,ctx){
//     const community = communityStore()
//     const chat = chatStore()

//     const unread = computed(()=>{
//       const jsonProp = props.item.props;
//       if(jsonProp.hasOwnProperty('unread')){
//         return jsonProp.unread > 99 ? 99 : jsonProp.unread;
//       }else{
//         return 0;
//       }
//     })

//     return{
//       linkRef,menus,linkMenus,menuList,unread,
//       ...toRefs(data),
//     }
//   }
// };
</script>

<style lang="scss" scoped>
</style>