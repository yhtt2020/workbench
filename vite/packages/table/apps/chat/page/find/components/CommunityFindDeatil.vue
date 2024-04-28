<template>
  <div class="content-list">
    <template v-for="item in detailList">
      <div
        class="xt-bg-2 pointer content-item rounded-xl pb-4 mb-4"
        style="position: relative"
        @click="enterCommunity(item)"
      >
        <div style="height: 150px; margin-bottom: 30px">
          <img
            class="w-full h-full rounded-t-xl object-cover"
            src="https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/Yzzj-zana-AI6F-jnTG"
          />
        </div>
        <div
          class="flex mb-4"
          style="position: absolute; left: 16px; top: 120px"
        >
          <a-avatar :size="48" shape="square" :src="item.icon"></a-avatar>
        </div>
        <div class="px-4 flex flex-col">
          <div class="category-18-500 mb-3" style="color: var(--primary-text)">
            {{ item.name }}
          </div>

          <div class="flex mb-3">
            <div
              class="category-12-400 px-2 rounded-md flex items-center justify-center"
              style="
                color: var(--active-bg);
                background: var(--active-secondary-bg);
              "
            >
              社群号:{{ item.no }}
            </div>
            <div
              class="category-12-400 px-1 rounded-md mx-2 flex items-center justify-center"
              style="color: var(--warning); background: rgba(250, 173, 20, 0.2)"
            >
              {{ item.level }}级
            </div>
          </div>
          <div
            class="category-14-400 mb-4"
            style="color: var(--primary-text); max-width: 248px"
          >
            <!-- 《荒野大镖客》是一款由Rockstar Games开发和发行的动作冒险游戏。 -->
          </div>
          <div class="flex justify-between">
            <span class="category-12-400" style="color: var(--secondary-text)"
              >{{ item.memberNum }}人</span
            >
            <span class="category-12-400" style="color: var(--secondary-text)">
              {{ item.joinOption === "freeAccess" ? "公开加入" : "" }}
            </span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { toRefs } from "vue";
import { storeToRefs } from "pinia";
import { chatCommunityStore } from "../../../store/chatCommunity";
import _ from "lodash-es";
import { useRouter } from "vue-router";
import { useNavigationStore } from "../../../../../components/desk/navigationBar/navigationStore";

const props = defineProps({
  detailList: {
    type: Array,
    default: () => [],
  },
});
const { detailList } = toRefs(props);

const router = useRouter();

/**解构store数据**/
const chatCommunity = chatCommunityStore();
const { myCommunity } = storeToRefs(chatCommunity);
const useNavigation = useNavigationStore();
const { communityNavVisible } = storeToRefs(useNavigation);

// 进入相对应社群
const enterCommunity = (data) => {
  const no = data.no;
  const index = _.findIndex(myCommunity.value, (item) => {
    return Number(item.route?.params?.no) === Number(no);
  });
  if(index > -1){
    if (!communityNavVisible.value){
      
    }
    // addCommunity(no)
  }
  else {}
};

// const addCommunity = (no) => {
  
// };
</script>

<style lang="scss" scoped>
.content-item {
  margin-right: 16px !important;
  aspect-ratio: 231 / 200;
  max-width: 280px;
}
:deep(.ant-avatar-square) {
  border-radius: 8px !important;
}
@media screen and (max-width: 964px) {
  .content-list {
    width: 100%;
    display: grid !important;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 16px;
  }
  .content-item {
    width: calc(100% / 1);
  }
}

@media screen and (min-width: 965px) {
  .content-list {
    width: 100%;
    display: grid !important;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 16px;
  }
  .content-item {
    width: calc(100% / 1);
  }
}
</style>