<!-- 群聊创建下一步的弹窗页面 -->
<template>
  <xt-modal v-if="nextVisible" v-model="nextVisible" custom :index="1000">
    <div class="create-header flex items-center pt-4 px-4 justify-between mb-4">
      <!-- 返回按钮 -->
      <xt-button w="32" h="32" style="border-radius: 8px" @click="returnPrev">
        <div class="flex items-center justify-center">
          <xt-ify-icon
            icon="fluent:chevron-left-16-regular"
            size="20"
            class="xt-text"
          />
        </div>
      </xt-button>

      <span class="font-16 xt-text xt-font">创建群聊</span>

      <!-- 关闭按钮 -->
      <xt-button w="32" h="32" style="border-radius: 8px" @click="closeNext">
        <div class="flex items-center justify-center">
          <xt-ify-icon
            icon="fluent:dismiss-16-regular"
            size="20"
            class="xt-text"
          />
        </div>
      </xt-button>
    </div>
    <div class="create-container flex flex-col items-center">
      <!-- 替换成图标选择器 -->
      <div
        class="rounded-lg flex pointer items-center justify-center"
        style="width: 64px; height: 64px; position: relative"
        @click="data.modelValue = true"
      >
        <!-- 头像 -->
        <div class="overflow-hidden">
          <a-avatar
            :src="data.avatarUrl"
            style="height: 64px; width: 64px; border-radius: 0"
            :style="{
              filter: data.bgColor
                ? `drop-shadow(#${data.bgColor} 80px 0)`
                : '',
              transform: data.bgColor ? 'translateX(-80px)' : '',
            }"
          ></a-avatar>
        </div>
        <xt-ify-icon
          icon="fluent:camera-16-regular"
          style="
            position: absolute;
            bottom: 0;
            right: 0;
            border: 2px solid var(--active-text);
            background: var(--active-bg);
            border-radius: 50%;
          "
          size="20"
        />
        <xt-select-icon
          :menus="['icon', 'emoji']"
          v-model="data.modelValue"
          @getAvatar="getAvatar"
          isUpload="true"
          :maskIndex="1010"
        />
        <input
          type="file"
          id="groupFileID"
          style="display: none"
          @change="getFileInfo($event)"
        />
      </div>
      <!-- 群昵称 -->
      <a-input
        spellcheck="false"
        ref="inputRef"
        v-model:value="groupName"
        placeholder="群名称"
        style="
          margin-top: 16px;
          text-align: center;
          width: 320px;
          color: var(--primary-text);
          border-radius: 12px;
          height: 40px;
        "
      />
      <!-- 群ID -->
      <a-input
        :spellcheck="false"
        ref="inputRef"
        v-model:value="groupID"
        placeholder="群ID"
        style="
          margin-top: 16px;
          text-align: center;
          width: 320px;
          color: var(--primary-text);
          border-radius: 12px;
          height: 40px;
          margin-bottom: 16px;
        "
        :style="
          isPureChinese !== true
            ? { marginBottom: '16px' }
            : { marginBottom: '8px' }
        "
      />
      <div
        class="font-12"
        v-if="isPureChinese"
        :style="
          isPureChinese === true
            ? { marginBottom: '16px' }
            : { marginBottom: '0' }
        "
        style="color: var(--error)"
      >
        群ID不能为中文名称,重新输入群ID
      </div>
      <!-- 下拉选择群聊类型 公共、私密群、 临时-->
      <xt-select
        v-model="currentType"
        :zIndex="2001"
        style="width: 320px"
        :list="typeList"
      ></xt-select>
      <div
        class="font-14 font-400 xt-font xt-text-2"
        style="width: 320px; margin-top: 16px"
      >
        {{ typeDetail.detail }}
      </div>
    </div>
    <div class="create-footer flex items-center justify-center pb-4 px-4">
      <div class="flex items-center justify-end w-full">
        <xt-button
          w="100"
          h="40"
          style="border-radius: 8px; margin-right: 16px"
          @click="closeNext"
        >
          取消
        </xt-button>
        <xt-button
          w="100"
          h="40"
          style="border-radius: 8px"
          type="theme"
          @click="create"
        >
          确定
        </xt-button>
      </div>
    </div>
  </xt-modal>
</template>

<script setup>
import { computed, ref, toRefs } from "vue";
import { currentGroupType } from "../../hooks/groupType";
import { message } from "ant-design-vue";
import { TUIConversationService } from "@tencentcloud/chat-uikit-engine";
import { completeTask } from "../../../task/task";
import { useRouter } from "vue-router";

const chat = window.$chat.chat;
const router = useRouter();
const emit = defineEmits(["return", "close"]);

const props = defineProps({
  nextList: {
    type: Array,
    default: () => [],
  },
});
const { nextList } = toRefs(props);

const data = ref({
  avatarUrl: "https://web.sdk.qcloud.com/im/assets/images/Public.svg",
  bgColor: "",
  modelValue: false,
  innerHeight: 100,
});
// 群昵称
const groupName = ref("");
// 群ID
const groupID = ref("");
// 当前群类型
const typeList = ref(currentGroupType);
const currentType = ref(typeList.value[0].value);

// 根据群类型获取群类型详情
const typeDetail = computed(() => {
  return typeList.value.find((item) => item.value === currentType.value);
});
const isPureChinese = computed(() => {
  if (groupID.value !== "") {
    const chineseReg = /^[\u4e00-\u9fa5]+$/;
    return chineseReg.test(groupID.value);
  } else {
    return false;
  }
});

// 开启下一步弹窗
const nextVisible = ref(false);
const openNextCreateGroup = () => {
  nextVisible.value = true;
};

// 获取头像
const getAvatar = (avatar) => {
  if (avatar.indexOf("color=") >= 0) {
    let color = avatar.substr(avatar.indexOf("color=") + 7, 6);
    data.value.bgColor = color;
  } else {
    data.value.bgColor = "";
  }
  data.value.avatarUrl = avatar;
};
// 更新头像
const getFileInfo = async (evt) => {
  const files = evt.target.files[0];
  const res = await fileUpload(files);
  data.value.avatarUrl = res;
};

// 返回上一步
const returnPrev = () => {
  nextVisible.value = false;
  emit("return");
};
// 关闭弹窗
const closeNext = () => {
  nextVisible.value = false;
  emit("close");
};

// 创建群聊
const create = async () => {
  if (isPureChinese.value) {
    return;
  } else {
    if (groupID.value !== "" && groupName.value !== "") {
      const option = {
        type: currentType.value,
        groupID: groupID.value,
        memberList: nextList.value,
        name: groupName.value,
        avatar: data.value.avatarUrl,
      };
      const res = await chat.createGroup(option);
      if (res.code === 0) {
        message.success("群创建成功");
        const { group } = res.data;
        const conversationID = `GROUP${group.groupID}`;
        router.push({ name: "chatMain" });
        TUIConversationService.switchConversation(conversationID);
        completeTask("Z0601");
        closeNext();
      }
    } else {
      message.error("群ID和群名称不能为空");
    }
  }
};

defineExpose({
  openNextCreateGroup,
});
</script>

<style lang="scss" scoped>
.create {
  &-container {
    width: 684px;
    height: 450px;
  }
  &-header {
    width: 684px;
  }
  &-footer {
    width: 684px;
  }
}
:deep(.ant-select) {
  line-height: 40px !important;
}
:deep(.ant-select .ant-select-selector) {
  height: 40px !important;
}
:deep(
    .ant-select-single:not(.ant-select-customize-input)
      .ant-select-selector
      .ant-select-selection-search-input
  ) {
  height: 40px !important;
}

:deep(.ant-select-selection-item) {
  line-height: 40px !important;
}

:deep(.ant-input) {
  color: var(--secondary-text);
  background: var(--secondary-bg) !important;
  font-size: 1rem;
  &::placeholder {
    color: var(--secondary-text);
  }
}

:deep(.ant-select-arrow) {
  color: var(--secondary-text) !important;
}
</style>