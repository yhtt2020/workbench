<template>


    <div class="common-panel s-bg " style="width: 100px">
      <div class="p-2 pt-2 p-3 truncate font-large text-center" style="font-size: 1.1em">#组名</div>
      <div class="text-center" v-for="user in userList">
        <a-avatar :size="50" :src="user.avatar"></a-avatar>
        <div class="p-2">{{ user.nickname }}</div>
      </div>
      <div class="text-center pb-2">
        <a-avatar :size="50">
          <PlusOutlined/>
        </a-avatar>
      </div>

    </div>
</template>

<script>
import {PlusOutlined} from '@ant-design/icons-vue'

const userList = [
  {
    nickname: '张三',
    avatar: 'https://tse1-mm.cn.bing.net/th/id/OIP-C.ml9T1565kAEF5L8SEzpEYwAAAA?w=218&h=218&c=7&r=0&o=5&dpr=1.1&pid=1.7'
  },
  {
    nickname: '李四',
    avatar: 'https://tse3-mm.cn.bing.net/th/id/OIP-C.o-n8oM8_wYLsQVmnly6fdQAAAA?w=218&h=218&c=7&r=0&o=5&dpr=1.1&pid=1.7'
  }
]
export default {
  name: "TeamPanel",
  components: {PlusOutlined},
  data() {
    return {
      userList
    }
  },

}
</script>

<style scoped>

</style>
