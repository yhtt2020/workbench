<template>
  <xt-left-menu :list="test" last="2" end="2">
    <template #test> 123 </template>
    <template #test1> test1 </template>
    <template v-for="item in test2" #[item.float]>{{ item }}</template>
    <xt-button @click="a = !a"></xt-button>
  </xt-left-menu>
</template>

<script>
export default {
  computed: {
    test() {
      return [
        {
          icon: "message",
          float: "a",
          id: 1,
        },
        {
          icon: "message",
          float: "b",
          id: 2,
        },
        {
          icon: "message",
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
          flag: true,
          icon: "tianjia2",
        },
        {
          full: true,
        },
        {
          icon: "message",
          children: [
            {
              icon: "message",
              name: "test",
            },
          ],
        },
      ];
    },
    test2() {
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
