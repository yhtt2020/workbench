<template>
  <ChatView :data="chatList">
    <!-- <template #chat>
        <ChatList :chatList="chatList"></ChatList>
      </template>
  -->
    <template #text>
      <Text @onSearch="onSearch" :isSearch="isSearch"></Text>
    </template>
  </ChatView>
</template>

<script setup>
import { ref, reactive } from "vue";
import Text from "./Text.vue";
//   import ChatList from "./ChatList.vue"
import ChatView from "./view.vue";
//   import ChatGPT from "./ChatGPT.vue"
//   import { marked } from "marked"
//   import { getMd } from "./api/test"
const markdown = ref("");

//   const getMdData = async () => {
//     let res = await getMd()
//     markdown.value = res.data.data
//   }
//   getMdData()
const chatList = reactive([]);
const isSearch = ref(true);

//   const onSearch = (serach) => {
//     let user = {
//       content: marked.parse(serach),
//       type: "user",
//       time: Date.now()
//     }

//     chatList.push(user)
//     isSearch.value = false

//     let gpt = {
//       content: "",
//       type: "gpt",
//       time: Date.now()
//     }

//     chatList.push(gpt)

//     let index = 0
//     let timeId = setInterval(() => {
//       if (index >= markdown.value.length) {
//         clearInterval(timeId)
//         isSearch.value = true
//         return
//       }
//       chatList[chatList.length - 1].content += markdown.value[index++] // 获取数组最后的对象并逐步添加数据到其 content 属性
//     }, 0)
//   }
</script>

<style lang="scss" scoped></style>
