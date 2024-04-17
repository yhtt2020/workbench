<!-- 选择社群一级频道目录的分类 -->
<template>
  <xt-modal v-if="classVisible" v-model="classVisible" custom>
    <div class="flex flex-col p-4" style="width: 500px">
      <div class="w-full flex items-center justify-between mb-4">
        <xt-button
          w="32"
          h="32"
          @click="returnPreviousStep"
          style="border-radius: 8px"
        >
          <div class="flex items-center justify-center">
            <xt-ify-icon
              icon="fluent:chevron-left-16-filled"
              size="20"
              class="xt-text"
            />
          </div>
        </xt-button>
        <span class="xt-text xt-font font-16">选择分组</span>
        <xt-button
          w="32"
          h="32"
          style="border-radius: 8px"
          @click="classVisible = false"
        >
          <div class="flex items-center justify-center">
            <xt-ify-icon
              icon="fluent:dismiss-16-filled"
              class="xt-text"
              size="20"
            />
          </div>
        </xt-button>
      </div>

      <div class="px-2 flex flex-col">
        <xt-scrollbar :y="true" style="height: 350px">
          <div
            class="xt-text-2 xt-bg-2 px-4 py-3 flex items-center rounded-lg justify-center font-14 font-400 xt-font"
          >
            不选择分类默认会将频道添加在最外层第一个位置；支持拖拽排序。
          </div>

          <xt-button
            class="my-4"
            style="
              width: 100%;
              border: 1px dashed var(--disable-text);
              background: transparent !important;
            "
            @click="addClassItem"
          >
            <div class="flex items-center justify-center">
              <xt-ify-icon
                icon="fluent:add-16-filled"
                size="20"
                class="xt-text-2"
              />
              <span class="font-16 xt-font ml-2 xt-text"> 添加新分组 </span>
            </div>
          </xt-button>

          <div class="flex flex-col classSortTab" ref="classSortTab">
            <template v-for="(item, index) in categoryList">
              <div
                class="flex pointer xt-bg-2 rounded-lg items-center px-5 py-4 mb-4"
                :class="{ 'select-bg': currentParams.statusIndex === index }"
                @click.stop="listClick(item, index)"
              >
                <template
                  v-if="
                    currentParams.isEditing && currentParams.editIndex === index
                  "
                >
                  <div class="flex w-full justify-between items-center">
                    <a-input
                      style="padding: 0"
                      ref="classInputRef"
                      spellcheck="false"
                      v-model:value="item.name"
                      :bordered="false"
                      @pressEnter.stop="createCategory(item)"
                      class="edit-input"
                    >
                      <template #suffix>
                        <div class="flex">
                          <xt-ify-icon
                            icon="fluent:checkmark-16-filled"
                            class="pointer"
                            size="20"
                            @click.stop="saveEdit(item)"
                          />
                          <xt-ify-icon
                            icon="fluent:dismiss-16-filled"
                            class="ml-4 pointer"
                            size="20"
                            @click.stop="exitEdit"
                          />
                        </div>
                      </template>
                    </a-input>
                  </div>
                </template>

                <template v-else>
                  <div class="flex w-full justify-between">
                    <span class="font-16 xt-font xt-text">{{ item.name }}</span>
                    <div class="flex">
                      <xt-ify-icon
                        icon="akar-icons:edit"
                        class="pointer xt-text-2"
                        size="20"
                        @click.stop="edit(index)"
                      />
                      <xt-ify-icon
                        icon="akar-icons:trash-can"
                        class="ml-4 pointer xt-text-2"
                        size="20"
                        @click.stop="deleted(item)"
                      />
                    </div>
                  </div>
                </template>
              </div>
            </template>
          </div>
        </xt-scrollbar>
      </div>

      <div class="flex items-center px-6 justify-end mt-4">
        <xt-button
          w="64"
          h="40"
          class="category-button mr-3"
          @click="classVisible = false"
        >
          取消
        </xt-button>
        <xt-button
          w="64"
          h="40"
          type="theme"
          class="category-button"
          @click="createUltimateStep"
        >
          确定
        </xt-button>
      </div>
    </div>
  </xt-modal>
</template>

<script setup>
import { nextTick, onMounted, ref, toRefs } from "vue";
import { chatCommunityStore } from "../../../store/chatCommunity";
import { storeToRefs } from "pinia";
import Sortable from "sortablejs";
import { CommunityAPI } from "../../../api/communityAPI";
import { useRoute } from "vue-router";
import { message } from "ant-design-vue";
import { channelClass } from "../../../../../js/chat/createChannelClass";

const comAPI = new CommunityAPI();
const chatCommunity = chatCommunityStore();
const { categoryList } = storeToRefs(chatCommunity);

const route = useRoute();
const emit = defineEmits(["prev"]);

const props = defineProps({
  currentItem: {
    type: Object,
    default: () => ({}),
  },
});
const { currentItem } = toRefs(props);

const classSortTab = ref(null);
const classInputRef = ref(null);
const currentParams = ref({
  classItem: "", // 接收选中的分组名称
  statusIndex: -1, // 点击选中下标
  isHover: false, // 判断是否悬浮
  isEditing: false, // 是否这种编辑
  hoverIndex: -1,
  editIndex: -1,
});

const classVisible = ref(false);
const openClassModal = () => {
  classVisible.value = true;
  nextTick(() => {
    // 获取分类数据
    if (Number(route.params.no) !== 1 && route.params.no) {
      chatCommunity.getCategoryList(route.params.no);
    }
    const el = document.querySelector(".classSortTab");
    new Sortable(el, {
      group: "sortableGroup",
      onEnd: onSortEnd, // 拖拽结束时触发的回调函数
    });
  });
};

// 返回上一步
const returnPreviousStep = () => {
  classVisible.value = false;
  emit("prev");
};
// 添加分类
const addClassItem = () => {
  categoryList.value.unshift({ name: "分类名称" });
  edit(0);
};
// 编辑分类中
const edit = (index) => {
  currentParams.value.isEditing = true;
  currentParams.value.editIndex = index;
  nextTick(() => {
    if (currentParams.value.isEditing) {
      const el = classInputRef.value[0];
      el.focus();
      el.select();
    }
  });
};
// 创建频道
const createCategory = async (item) => {
  const option = {
    name: item.name,
    communityNo: route.params.no,
    type: "category",
    role: "category",
  };
  const res = await comAPI.createCommunityChannel(option, route.params.no);
  if (res.status === 1) {
    message.success(`${res.info}`);
    // 更新频道数据
    chatCommunity.getCategoryList(route.params.no);
    chatCommunity.getCommunityTree(route.params.no);
    // 取消编辑状态
    currentParams.value.isEditing = false;
  }
};
// 退出编辑
const exitEdit = () => {
  currentParams.value.isEditing = false;
  currentParams.value.editIndex = -1;
};
// 保存频道编辑
const saveEdit = async (item) => {
  // 当前频道目录通过id判断是否存在
  if (item.id) {
    const option = item;
    const res = await comAPI.updateCommunityChannel(option);
    if (res.status === 1) {
      message.success(`${res.info}`);
      // 更新频道数据
      chatCommunity.getCategoryList(route.params.no);
      chatCommunity.getCommunityTree(route.params.no);
      // 取消编辑状态
      currentParams.value.isEditing = false;
    }
  } else {
    createCategory(item);
  }
};
// 排序方法
const onSortEnd = (evt) => {
  let element = document.querySelector(".classSortTab");
  let newIndex = evt.newIndex,
    oldIndex = evt.oldIndex;
  let newItem = element.children[newIndex];
  let oldItem = element.children[oldIndex];
  element.removeChild(newItem);
  if (newIndex > oldIndex) {
    element.insertBefore(newItem, oldItem);
  } else {
    element.insertBefore(newItem, oldItem.nextSibling);
  }
  let cloneTemp = [...categoryList.value]; // 将原数据进行复制
  let temp = cloneTemp[evt.oldIndex]; // 获取旧的下标
  cloneTemp.splice(evt.oldIndex, 1); // 移除旧的下标
  cloneTemp.splice(evt.newIndex, 0, temp); // 将旧的下标进行替换
  // 将原有列表进行更新
  chatCommunity.sortUpdateList(cloneTemp);
};
// 选择当前频道目录
const listClick = (item, index) => {
  // 选中当前频道目录分类
  if (currentParams.value.statusIndex === index) {
    currentParams.value.statusIndex = -1;
    currentParams.value.classItem = "";
  } else {
    currentParams.value.statusIndex = index;
    currentParams.value.classItem = item;
  }
};
// 删除分组
const deleted = (item) => {
  if (item.id) {
    window.$ui.confirm(
      "删除分类操作不可撤销，分类被删除后，子应用将被移动到顶层。是否确定删除？",
      "",
      {
        ok: async () => {
          const res = chatCommunity.deleteChannel(item.id, route.params.no);
          if (res.status === 1) {
            message.success(`${res.info}`);
            chatCommunity.getCategoryList(route.params.no);
            chatCommunity.getCommunityTree(route.params.no);
          }
        },
        type: "warning",
        noText: "取消",
        index: `${1000000000 + 2}`,
      }
    );
  } else {
    const index = categoryList.value.findIndex((findItem) => {
      return findItem.name === item.name;
    });
    categoryList.value.splice(index, 1);
  }
};

// 创建最后一步
const createUltimateStep = async () => {
  console.log("测试", currentParams.value.classItem);
  console.log("数据", currentItem.value);

  switch (currentItem.value?.type) {
    case "link":
      break;
    case "forum":
      const res= await channelClass.secondaryChannel({
        parentID: currentParams.value.classItem?.id
          ? currentParams.value.classItem?.id
          : 0,
        item: currentItem.value,
        communityNo: route.params.no,
      });
      if (res.status === 1) {
        message.success(`${res.info}`);
        chatCommunity.getCommunityTree(route.params.no);
        classVisible.value = false;
      }
      break;
    case "chat":
      

      break;
  }
};

defineExpose({
  openClassModal,
});
</script>

<style lang="scss" scoped>
.select-bg {
  background: var(--active-secondary-bg) !important;
  border: 1px solid var(--active-bg) !important;
}
:deep(.ant-input) {
  font-size: 16px !important;
}
</style>