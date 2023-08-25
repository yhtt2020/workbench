<template>
  <div style="width: 392px">
    <Dialog v-model:icon="icon" v-model:name="name"></Dialog>
    <div class="flex justify-center my-3">
      <XtButton @click="close()">取消</XtButton>
      <XtButton class="ml-3" type="theme" @click="add()">确认</XtButton>
    </div>
  </div>
</template>

<script>
import Dialog from "../components/Dialog.vue";
import { mapWritableState } from "pinia";
import { aiStore } from "../../../../store/ai";
export default {
  computed: {
    ...mapWritableState(aiStore, [
      "defaultData",
      "topicList",
      "selectTopicIndex",
    ]),
  },
  components: {
    Dialog,
  },
  data() {
    return {
      icon: "",
      name: "",
    };
  },
  methods: {
    close() {
      this.$emit("close");
    },
    add() {
      let obj = { ...this.defaultData };
      obj.id = Date.now();
      obj.time = Date.now();
      obj.name = this.name;
      obj.icon = { ...this.icon };
      this.selectTopicIndex = obj.id;
      this.topicList[obj.id] = obj;
      this.close();
    },
  },
};
</script>

<style lang="scss" scoped></style>
