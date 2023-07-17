<template>
  <div
    class="group cursor-pointer flex items-center text-base relative h-12 rounded-xl pl-2 mb-2 mr-2"
    style="width: 212px"
    :class="{ 'xt-bg-2': selectTopicIndex === data.id }"
    @click="addIndex(data.id)"
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
import { mapWritableState } from "pinia";
import { aiStore } from "../../../../store/ai";
export default {
  computed: {
    ...mapWritableState(aiStore, ["topicList", "selectTopicIndex"]),
  },
  methods: {
    handleTop() {
      this.$emit("top");
      let id = this.data.id;
      this.topicList.filter((item) => {
        if (item.id == id) {
          console.log("item :>> ", item);
          item.top = !item.top;
        }
      });
    },
    handleDel() {
      let id = this.data.id;
      this.topicList = this.topicList.filter((item) => {
        if (item.id === id) {
          if (this.selectTopicIndex === id) {
            this.selectTopicIndex = -1;
          }
          return false;
        } else {
          return true;
        }
      });
      // this.selectTopicIndex = -1;
    },
    addIndex(id) {
      this.selectTopicIndex = id;
      console.log("this.selectTopicIndex :>> ", this.selectTopicIndex);
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
