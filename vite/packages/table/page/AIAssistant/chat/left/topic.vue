<template>
  <div
    class="group cursor-pointer flex items-center text-base relative h-12 rounded-xl pl-2 mb-2 mr-3"
    style="width: 212px"
    :class="{ 'xt-bg-2': selectTopicIndex === data.id }"
    @click="handleIndex(data.id)"
  >
    <Icon :icon="data.icon.name"></Icon>
    <div class="ml-2">{{ data.name }}</div>
    <Icon
      class="absolute top-1/2 -translate-y-1/2 cursor-pointer top-item xt-text-2 hidden"
      style="right: 40px"
      icon="shanchu"
      @click.stop.prevent="handleDel()"
    ></Icon>
    <Icon
      class="absolute top-1/2 -translate-y-1/2 cursor-pointer top-item xt-text-2"
      :class="[data.top ? 'block' : 'hidden']"
      style="right: 15px"
      icon="Pushpin"
      @click.stop.prevent="handleTop()"
    ></Icon>
  </div>
</template>

<script>
import { mapWritableState, mapActions } from "pinia";
import { aiStore } from "../../../../store/ai";

export default {
  computed: {
    ...mapWritableState(aiStore, ["topicList", "selectTopicIndex"]),
  },
  methods: {
    ...mapActions(aiStore, ["delTopic"]),
    handleTop() {
      this.$emit("top");
      let id = this.data.id;
      this.topicList.filter((item) => {
        if (item.id == id) {
          item.top = !item.top;
        }
      });
    },
    handleDel() {
      this.delTopic();
    },
    handleIndex(id) {
      this.selectTopicIndex = id;
    },
  },
  props: {
    data: {},
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
