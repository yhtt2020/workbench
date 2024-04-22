<script setup lang="ts">
import {onMounted, ref} from "vue";
import {message} from "ant-design-vue";
import {prettyDisplayBytes} from "../../../../js/action/supervisory";

const allStorageSize= ref([])
const totalUsed=ref('')
function getUseSize() {
  var size = 0;
  let top10=[]
  allStorageSize.vlaue=[]
  for(var item  in window.localStorage) {
    if(window.localStorage.hasOwnProperty(item)) {
      let used=window.localStorage.getItem(item).length;
      allStorageSize.value.push({
        name:item,
        size:used,
        prettySize:prettyDisplayBytes(used)
      })
      size += used
    }
  }
  allStorageSize.value.sort((a,b)=>{
    return (a.size-b.size)>0?-1:1
  })
  console.log(allStorageSize,'排名')
  totalUsed.value= ( (size / 1024).toFixed(2) + 'KB')
}
onMounted(()=>{
  getUseSize()
})
const showData=(item)=>{
  message.success('已经输出到控制台，请打开控制台查看')
  console.log(localStorage.getItem(item.name))
}
</script>

<template>
存储统计
  <div>
总共使用LocalStorage空间：{{totalUsed}}
    <div>
      <ul >
        <li @click="showData(item)" v-for="item in allStorageSize">{{item.name}}-{{item.prettySize}}</li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
