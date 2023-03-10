<template>
  <div class="title" style="height: 6em; width: 12em">
    <Icon
      style="
        width: 5em;
        height: 5em;
        margin-right: 10px;
        vertical-align: middle;
      "
      icon="shezhi1"
    ></Icon>
    <span>添加小卡片</span>
  </div>
  <div class="content">
    <div
      class="card item"
      style="
        height: 12em;
        width: 12em;
        margin-bottom: 1em;
        padding: 1em;
        margin: 1em;
      "
      v-for="item in cardList"
      :key="item.name"
      @click="addAssembly(item)"
    >
      <Icon
        style="
          width: 5em;
          height: 5em;

          vertical-align: middle;
        "
        :icon="item.icon"
      ></Icon>
      {{ item.cname }}
    </div>
  </div>
</template>

<script>
import { mapActions } from "pinia";
import { tableStore } from "../../../store";
export default {
  name: "AddCard",

  data() {
    return {
      cardList: [
        { name: "calendar", cname: "日历", icon: "rili3" },
        { name: "countdownDay", cname: "倒数日", icon: "rili2" },
        { name: "clock", cname: "闹钟", icon: "naozhong" },
      ],
    };
  },

  mounted() {},

  methods: {
    ...mapActions(tableStore, ["addCustomComponents"]),
    addAssembly(item) {
      switch (item.name) {
        case "calendar":
          this.addCustomComponents(item.name);
          this.$router.push({
            name: "home",
            params: {
              name: item.name,
              cname: item.cname,
            },
          });
          break;
        case "countdownDay":
          this.$router.push({
            name: "addCardSetting",
            params: {
              name: item.name,
              cname: item.cname,
            },
          });
          break;
        case "clock":
          this.$router.push({
            name: "addCardSetting",
            params: {
              name: item.name,
              cname: item.cname,
            },
          });
          break;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.title {
  font-size: 20px;
}
.content {
  display: flex;
  flex-direction: row;
}
.item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
