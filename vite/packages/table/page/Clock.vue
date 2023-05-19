<template>
  <div class="box">
    <component :is="clock" class="b" />
    <div
      class="flex flex-row absolute bottom-4 justify-center"
      style="width: 543px"
    >
      <div class="item-icon flex justify-center items-center pointer mr-4">
        <Icon class="icon" icon="caret-left"></Icon>
      </div>
      <div class="item-icon flex justify-center items-center pointer mr-4">
        <Icon class="icon" icon="caret-right"></Icon>
      </div>
      <div class="item-icon flex justify-center items-center pointer mr-4">
        <Icon
          class="icon"
          :class="randomFlag ? 'replace-it' : ''"
          icon="reload"
        ></Icon>
      </div>

      <div class="item-icon flex justify-center items-center pointer">
        <Icon class="icon" icon="desktop"></Icon>
      </div>
    </div>
  </div>
</template>

<script>
import clock3 from "../components/homeWidgets/clock/clock3/clock3.vue";
import clock1 from "../components/homeWidgets/clock/clock1/clock1.vue";
import clock2 from "../components/homeWidgets/clock/clock2/clock2.vue";
import clock4 from "../components/homeWidgets/clock/clock4/clock4.vue";

export default {
  components: {
    clock1,
    clock2,
    clock3,
    clock4,
  },
  data() {
    return {
      clock: "clock1",
    };
  },
  created() {
    this.clock = this.$route.query.clock;
  },
};
</script>

<style lang="scss" scoped>
.box {
  border: 1px solid red;
  width: 93%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .b {
    margin-top: -100px;
  }
}
</style>
