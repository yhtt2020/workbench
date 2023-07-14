<template>
  <div class="h-full pr-3" style="border-right: 1px solid red">
    <div class="text-sm xt-text-2 my-2 ml-2">置顶</div>
    <div>这里是被置顶上来的内容</div>
    <div
      class="group flex items-center text-base relative h-12 xt-bg-2 rounded-xl pl-2"
      style="width: 212px"
      v-for="(item, index) in chatList"
    >
      <Icon :icon="item.icon"></Icon>
      <div class="ml-2">{{ item.name }}</div>
      <Icon
        class="absolute top-1/2 -translate-y-1/2 cursor-pointer top-item xt-text-2"
        :class="[item.top ? 'block' : 'hidden']"
        style="right: 20px"
        icon="Pushpin"
        @click="chatList[index].top = !item.top"
      ></Icon>
    </div>
    <div class="text-sm xt-text-2 my-2 ml-2">今天</div>
    <div>这里是被置顶上来的内容</div>
    <div class="text-sm xt-text-2 my-2 ml-2">上周</div>
    <div>这里是被置顶上来的内容</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      chatList: [
        {
          icon: "message",
          time: "",
          name: "AI助手",
          top: true,
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.group {
  &:hover .top-item {
    display: block;
  }
}
</style>
