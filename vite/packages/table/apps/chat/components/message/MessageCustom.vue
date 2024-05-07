<!-- 用于接收游戏转发的消息 -->
<template>
  <div class="w-full flex flex-col">
    <div
      style="
        border-radius: 5px;
        width: 250px;
        cursor: pointer !important;
        position: relative;
        pointer-events: auto;
      "
      class="rounded-lg"
      @click="goGameDetail(content?.appid)"
    >
      <img
        :src="content?.header"
        class="w-full h-full object-cover rounded-lg"
        alt=""
      />
    </div>
    <div class="mt-2" style="margin-top: 10px">
      <div
        class="truncate"
        style="max-width: 160px; float: left; margin-right: 10px"
      >
        <a-avatar
          :size="30"
          shape="square"
          :src="content?.icon || '/emoji/game.png'"
        />
        <strong class="ml-3">{{ content?.chineseName }}</strong>
      </div>
      <div style="float: right">
        <xt-button
          :w="80"
          :h="35"
          size="mini"
          type="theme"
          @click="goGameDetail(content?.appid)"
        >
          <div class="flex items-center justify-center">
            <xt-ify-icon
              icon="fluent:share-android-24-filled"
              size="20"
              class="mr-3 xt-text"
            />
            查看
          </div>
        </xt-button>
      </div>
      <div style="clear: both"></div>
    </div>
  </div>
</template>

<script setup>
import { toRefs } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
  content: {
    type: Object,
    default: () => {},
  },
});
const { content } = toRefs(props);

const router = useRouter();

/**查看详情**/
const goGameDetail = (id) => {
  router.push({
    name: "GameDiscountDetail",
    params: {
      id: id,
    },
  });
};
</script>

<style lang="scss" scoped>
</style>
