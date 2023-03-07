<template>
  <div class="title" style="height: 6em; width: 12em">
    <Icon
      style="
        width: 5em;
        height: 5em;
        margin-right: 10px;
        vertical-align: middle;
      "
      icon="fanqie"
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
      v-for="item in CardList"
      :key="item.name"
      @click="AddAssembly(item)"
    >
      <Icon
        style="
          width: 5em;
          height: 5em;
          margin-right: 10px;
          vertical-align: middle;
        "
        icon="fanqie"
      ></Icon>
      {{ item.cname }}
    </div>
  </div>
</template>

<script>
export default {
  name: "XtAddCard",

  data() {
    return {
      CardList: [
        { name: "Calendar", cname: "日历" },
        { name: "CountdownDay", cname: "倒数日" },
        { name: "Clock", cname: "闹钟" },
      ],
    };
  },

  mounted() {},

  methods: {
    AddAssembly(item) {
      switch (item.name) {
        case "Calendar":
          this.$router.push({
            name: "home",
            params: {
              name: item.name,
              cname: item.cname,
            },
          });
          break;
        case "CountdownDay":
          this.$router.push({
            name: "addCardSetting",
            params: {
              name: item.name,
              cname: item.cname,
            },
          });
          break;
        case "Clock":
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
