<template>
  <div class="card small" style="" >
    <a-row>
      <a-col>
        <Icon
          style="
            width: 5em;
            height: 5em;
            margin-right: 10px;
            vertical-align: middle;
          "
          icon="fanqie"
        ></Icon>
      </a-col>
      <a-col style="text-align: center">
        <div style="font-size: 1.5em; font-weight: bold">番茄钟</div>
        <div style="font-size: 1.5em">今日番茄：0</div>
      </a-col>
    </a-row>
    <a-row style="margin-top: 0.5em; text-align: center">
      <div
        class="btn"
        @click="start"
        style="
          font-size: 1.3em;
          font-weight: bold;
          margin-top: 0.4em;
          width: 12em;
        "
      >
        开始一个番茄
      </div>
    </a-row>
  </div>
</template>

<script>
export default {
  name: "Timer",
  methods: {
    start() {
      this.$router.push("/tomatoStart");
    },
  },
};
</script>

<style scoped lang="scss">
.btn {
  margin: auto;
  &:hover {
    background: #676767;
    font-weight: bold;
    cursor: pointer;
  }
  border-radius: 6px;
  padding: 1em;
  display: inline-block;
  border: 1px solid #363636;
  background: #494949;
}
.card{
  max-height:30em;
  border-radius: 8px;
  vertical-align: text-top;

  width: 20em;
  min-width: 20em;
  display: inline-block;
  height: 420px;
  padding: 3em 13px .5em 13px ;
  margin-right: 14px;
  position: relative;
  &.small{
    height: 203px;
    margin-bottom: 14px;
  }
}
</style>
