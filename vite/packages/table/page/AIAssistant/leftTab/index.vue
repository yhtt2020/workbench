<template>
  <xt-left-menu :list="menuList" last="2" end="2">
    <!-- 插槽用法 -->
    <template #test>
      <setting-filled />
    </template>
  </xt-left-menu>

  <!-- 新建对话 -->
  <xt-view
    v-model="createChatVisible"
    type="popup"
    title="新建模板"
    :showFull="false"
  >
    <xt-button w="300"> new Caht View </xt-button>
  </xt-view>
</template>

<script>
import { SettingFilled } from "@ant-design/icons-vue";
export default {
  components: {
    SettingFilled,
  },
  data() {
    return {
      menuList: [
        // 携带子菜单
        {
          icon: "message",
          children: [
            {
              icon: "message",
              name: "message",
              callBack: () => {
                console.log("子菜单点击事件触发 :>> ");
              },
            },
            {
              icon: "message",
              name: "message",
              callBack: () => {
                console.log("子菜单点击事件触发 :>> ");
              },
            },
          ],
        },
        // iconfont
        {
          icon: "message",
        },
        // 图片
        {
          img: "/icons/bg.png",
        },
        // 插槽
        {
          slot: "test",
          callBack: () => {
            this.createChatVisible = true;
          },
        },
        {
          icon: "message",
        },
        // 图片
        {
          img: "/icons/bg.png",
        },
        // 插槽
        {
          slot: "test",
          callBack: () => {
            this.createChatVisible = true;
          },
        },
        {
          icon: "message",
        },
        // 图片
        {
          img: "/icons/bg.png",
        },
        // 插槽
        {
          slot: "test",
          callBack: () => {
            this.createChatVisible = true;
          },
        },
        {
          icon: "message",
        },
        // 图片
        {
          img: "/icons/bg.png",
        },
        // 插槽
        {
          slot: "test",
          callBack: () => {
            this.createChatVisible = true;
          },
        },
        // 回调事件
        {
          flag: true,
          icon: "tianjia2",
          callBack: () => {
            this.createChatVisible = true;
          },
        },
        {
          flag: true,
          icon: "setting",
        },
      ],
      createChatVisible: false,
    };
  },
};
</script>

<style lang="scss" scoped></style>
