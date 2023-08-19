<template>
  <div>
    <xt-title>输入框</xt-title>
    <xt-input class="h-12" style="height: 48px"></xt-input>
    <xt-title>文本域</xt-title>
    <xt-textarea style="height: 100px"></xt-textarea>
    <xt-title>按钮</xt-title>
    <xt-button>按钮</xt-button>
    <xt-title>图标按钮</xt-title>
    <xt-icon icon="shezhi1"></xt-icon>
    <xt-title>颜色</xt-title>
    <xt-color></xt-color>
    <xt-title>右键菜单</xt-title>
    <xt-menu :menus="menus">
      <div>右键菜单触发的区域</div>
    </xt-menu>
    <xt-title>弹窗</xt-title>
    <xt-view type="popup" title="标题" v-model="viewVisible">
      <div style="width: 400px; height: 400px">默认内容</div>
    </xt-view>
    <xt-button @click="viewVisible = !viewVisible">viewVisible</xt-button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      viewVisible: false,
      menus: [
        { label: "更新", callBack: this.callBack, icon: "shezhi1" },
        { label: "更新", callBack: this.callBack, icon: "shezhi1" },
        { label: "更新", callBack: this.callBack, icon: "shezhi1" },
      ],
    };
  },
};
</script>
