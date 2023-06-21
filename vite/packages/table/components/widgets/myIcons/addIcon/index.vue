<template>
  <div class="pop-container">
    <div class="box">
      <div class="title xt-text">
        批量导入图标
        <div class="box-btn xt-bg">
          <div class="text" style="color: #fff">· · ·</div>
        </div>
      </div>
      <div class="main-box">
        <div class="left">
          <div
            v-for="item in navList"
            class="item xt-text"
            @click="navName = item.name"
            :class="{ 'xt-bg': item.name == navName }"
          >
            {{ item.name }}
          </div>
        </div>
        <div class="right">123

            <div @click="loadDeskIconApps">loadDeskIconApps</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      navList: [{ name: "网址导航" }, { name: "我的应用" }],
      navName: "网址导航",
    };
  },
};
</script>

<style lang="scss" scoped>
.box {
  width: 727px;
  height: 654px;
  background: var(--modal-bg);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 10px;
  border-radius: 12px;

  .title {
    font-family: PingFangSC-Medium;
    font-size: 18px;
    width: 100%;
    height: 68px;
    font-weight: 500;
    text-align: center;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    .box-btn {
      position: absolute;
      width: 48px;
      height: 48px;
      color: var(--primary-text);
      background-color: var(--secondary-bg);
      right: 6px;
      top: 10px;
      z-index: 999999;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 12px;
      font-size: 12px;
      cursor: pointer;
    }
  }

  .main-box {
    display: flex;
    .left {
      margin-left: 8px;
      .item {
        width: 120px;
        height: 56px;
        line-height: 56px;
        text-align: center;
        border-radius: 12px;
        font-family: PingFangSC-Medium;
        font-size: 16px;
        font-weight: 500;
        margin-bottom: 10px;
      }
    }
  }
}

.pop-container {
  z-index: 99999;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
</style>
