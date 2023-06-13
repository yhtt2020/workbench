<template>
  <div class="flex-row flex items-center  pointer h-16 p-3 w-full mb-2">
    <div class="h-10 w-10 rounded-lg flex justify-center items-center xt-bg xt-text" style="color"
      v-if="item.type === 'systemApp'">
      <Icon :icon="item.icon" class="h-10 w-10"></Icon>
    </div>
    <a-avatar :size="40" shape="square" :src="item.icon" v-else></a-avatar>

    <div class="m-3 flex flex-col items-start w-10/12">
      <div class="font-medium xt-text">{{ item.name }}</div>
      <div class="text-xs  text-more text-left  xt-text" style="width: calc(100%)" v-if="item.summary !== ''">{{ item.summary }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "listItem",
  props: {
    item: {
      type: Object,
      default: () => { }
    }
  }
}
</script>

<style scoped></style>
