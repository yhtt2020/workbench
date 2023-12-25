<template>
  <!--
    last="2" 头部展示数量=2
    end="2" 底部展示数量=2
  -->
  <xt-left-menu model="id" :list="test" last="1" end="1">
    <template v-for="item in getFloatSlot" #[item.float]>{{ item }}</template>
    <div>可带入全屏区域</div>
  </xt-left-menu>
</template>

<script>
export default {
  computed: {
    test() {
      return [
        {
          /**
           * 圆角信息
           * 第一个为位置 tr br
           * 第二个为颜色
           * 第三个可选 圆角信息
           */
          info: [
            "tl",
            "",
            {
              icon: "fluent:checkmark-circle-16-filled",
            },
          ],
          // 新版本图标
          newIcon: "fluent:checkmark-circle-16-filled",
          // 名称
          name: "XXXX",
          // 悬浮提示信息
          title: "123",
          // 设置背景
          bg: "pink",
        },
        {
          // 旧版本图标
          icon: "message",
          // 开启浮动插槽
          float: "float",
          name: "122333",
          // 开启后无法显示选中边框
          flag: true,

          info: ["tr", "red", "1"],
        },
        {
          icon: "message",
          info: ["br", "warn"],
          name: "点击展开",
          info: [
            "bl",
            "",
            {
              icon: "fluent:checkmark-circle-16-filled",
            },
          ],
          // 点击展开二级菜单
          children: [
            {
              icon: "message",
              name: "test1",
            },
            {
              icon: "message",
              name: "test2",
            },
            {
              icon: "message",
              name: "test3",
            },
          ],
        },
        {
          info: ["tl", "red"],
          newIcon: "fluent:checkmark-circle-16-filled",
          name: "XXXX",
          bg: "pink",
        },
        {
          info: ["br", "red"],
          newIcon: "fluent:checkmark-circle-16-filled",
          name: "XXXX",
          bg: "pink",
        },
        {
          // 开启可全屏按钮
          full: true,
        },
      ];
    },
    getFloatSlot() {
      let arr = [];
      this.test.forEach((item) => {
        if (item.float) {
          arr.push({
            float: item.float,
            id: item.id,
          });
        }
      });
      return arr;
    },
  },
  data() {
    return {
      a: true,
    };
  },
};
</script>
<style lang="scss" scoped></style>
