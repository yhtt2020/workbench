<!-- 群基础信息修改弹窗页 -->
<template>
  <teleport to="body">
    <a-drawer
      v-model:visible="manageNameVisible"
      width="500"
      :closable="false"
      @close="closeNameDrawer"
      :zIndex="1600"
    >
      <template #title>
        <div class="w-full flex items-center">
          <xt-button
            w="40"
            h="40"
            @click="closeNameDrawer"
            style="margin-right: 12px; border-radius: 8px"
          >
            <div class="flex items-center justify-center">
              <xt-ify-icon
                icon="fluent:chevron-left-16-filled"
                class="xt-text-2"
                size="30"
              />
            </div>
          </xt-button>
          <span class="xt-text-2 xt-font font-16">群信息</span>
        </div>
      </template>

      <div
        class="flex items-center flex-col"
        style="color: var(--primary-text)"
      >
        <template v-if="data.isManager">
          <div
            class="flex items-center flex-col justify-center"
            style="position: relative"
          >
            <div
              class="flex items-center flex-col justify-center"
              style="margin-bottom: 16px"
            >
              <!-- 替换成图标选择器 -->
              <div
                class="rounded-lg flex pointer items-center justify-center"
                style="width: 64px; height: 64px; position: relative"
                @click="data.modelValue = true"
              >
                <!-- 头像 -->
                <div class="overflow-hidden">
                  <a-avatar
                    :src="data.avatar"
                    :size="64"
                    shape="square"
                    :style="{
                      filter: data.bgColor
                        ? `drop-shadow(#${data.bgColor} 80px 0)`
                        : '',
                      transform: data.bgColor ? 'translateX(-80px)' : '',
                    }"
                  ></a-avatar>
                </div>
                <xt-ify-icon
                  icon="fluent:camera-16-filled"
                  size="24"
                  class="absolute xt-active-text"
                  style="
                    position: absolute;
                    bottom: -3px;
                    right: -3px;
                    border: 2px solid #ffffff;
                    background: var(--active-bg);
                    border-radius: 50%;
                  "
                />
              </div>
              <xt-select-icon
                :menus="['icon', 'emoji']"
                v-model="data.modelValue"
                @getAvatar="getAvatar"
                :maskIndex="2000"
                :zIndex="2001"
                isUpload="true"
              />
              <input
                type="file"
                id="groupFileID"
                style="display: none"
                @change="getFileInfo($event)"
              />
            </div>
          </div>
          <a-input
            v-model:value="data.groupName"
            ref="groupRef"
            :spellcheck="false"
            style="
              color: var(--primary-text);
              text-align: center;
              border-radius: 12px !important;
              margin-bottom: 16px;
            "
          />
          <xt-button
            @click="saveGroupName"
            type="theme"
            style="border-radius: 12px !important"
            w="452"
            h="48"
          >
            保存
          </xt-button>
        </template>
        <template v-else>
          <div class="flex flex-col w-full items-center justify-center">
            <a-avatar shape="square" :size="64" :src="data.avatar"></a-avatar>
            <a-input
              v-model:value="data.groupName"
              :spellcheck="false"
              :disabled="true"
              style="
                margin-top: 12px;
                color: var(--primary-text);
                border-radius: 12px !important;
                text-align: center;
              "
            />
          </div>
        </template>
      </div>
    </a-drawer>
  </teleport>
</template>

<script setup>
import { emit } from "process";
import { computed, nextTick, ref, toRefs } from "vue";
import { fileUpload } from "../../../../components/card/hooks/imageProcessing";
import { TUIStore, StoreName } from "@tencentcloud/chat-uikit-engine";

const emits = defineEmits(["closeName"]);
const props = defineProps({
  info: {
    type: Object,
    required: true,
  },
});
const { info } = toRefs(props);

const chat = window.$chat;

// ref定义数据
const data = ref({
  avatar: "",
  modelValue: false,
  innerHeight: 100,
  bgColor: "",
  isCustom: true,
  groupName: "",
  // 当前群聊是否具备群管理权限
  isManager: "",
});
const groupRef = ref(null);

// 开启修改群名称抽屉弹窗
const manageNameVisible = ref(false);
const openNameDrawer = () => {
  manageNameVisible.value = true;
  nextTick(() => {
    TUIStore.watch(StoreName.CONV, {
      currentConversation: (currentData) => {
        const { groupProfile } = currentData;
        data.value.avatar = groupProfile?.avatar;
        data.value.groupName = groupProfile?.name;
        data.value.isManager = groupProfile?.selfInfo?.role !== "Member";
      },
    });
    groupRef.value?.focus();
    groupRef.value?.select();
  });
};
// 关闭修改群名称抽屉弹窗
const closeNameDrawer = () => {
  manageNameVisible.value = false;
  emits("closeName");
};

// 暂时用不到
// const onShowSelect = () => {
//   console.log("点击了头像");
//   data.value.modelValue = true;
//   data.value.innerHeight = window.innerHeight;
// };

// 获取头像
const getAvatar = (avatar) => {
  if (avatar.indexOf("color=") >= 0) {
    let color = avatar.substr(avatar.indexOf("color=") + 7, 6);
    data.value.bgColor = color;
  } else {
    data.value.bgColor = "";
  }
  data.value.avatar = avatar;
};

// 更换头像
const updateGroupAvatar = async () => {
  document.querySelector("#groupFileID").click();
};
const getFileInfo = async (evt) => {
  const files = evt.target.files[0];
  const res = await fileUpload(files);
  data.value.avatar = res;
};

// 保存群名称修改
const saveGroupName = async () => {
  const option = {
    groupID: info.value.groupID,
    name: data.value.groupName,
    avatar: data.value.avatar,
  };
  // console.log("排查参数是否正确", option, chat);
  const res =  await chat.updateGroupProfile(option)
  if(res.code === 0){
    manageNameVisible.value = false;
  }
};

defineExpose({
  openNameDrawer,
});
</script>

<style lang="scss" scoped>
:deep(.float-icon) {
  top: 72px !important;
}
</style>
