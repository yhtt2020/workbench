<script setup lang="ts">
import {ref, watch, onMounted, reactive} from 'vue';
import {debounce} from "lodash-es";
import {apiPost} from "../../js/axios/request";
import {message} from "ant-design-vue";
const filterOption =(input: string, option: any) => {
  return true//option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
}
const fetching=ref(false)
const handleChange = (value: string[]) => {
  console.log(`selected ${value}`);
}
const fetch=debounce(async (val) => {
  fetching.value = true
  list.value=[]
  console.log('执行搜索', val)
  let rs = await apiPost('/app/com/thread/searchFromPortal', {keyword: val})
  if(rs.code===200){
    console.log('rs.data',rs.data)
      list.value.push(...rs.data.map(item=>{
        return {
          label:item.title||item.summary.substring(0,20),
          value:item.id
        }
      }))
    fetching.value = false;
  }else{
    message.error('网络错误')
  }

},300)
const value=ref([])
const list = ref([])
const emits = defineEmits(["update:value", "cb"]);

watch(value, () => {
  emits("update:value", value.value);
  emits("cb", value.value);
});
onMounted(()=>{
  list.value = list.value.map((item)=>{
    return {
      value:item.value,
      label:item.label,
    }
  })
})

</script>

<template>
  <a-select
    placeholder="请输入帖子id或者帖子标题进行查找"
    :zIndex="( 9999999 + 10 )"
    v-model:value="value"
    mode="multiple"
    show-search
    style="width: 100%; padding: 0 !important"
    class="rounded-xl"
    :options="list"
    :filter-option="filterOption"
    :not-found-content="fetching ? undefined : null"
    @search="fetch"
    :dropdownStyle="{zIndex: 9999999 + 10}">
    <template v-if="fetching" #notFoundContent>
      <a-spin size="small" />
    </template>
  </a-select>
</template>

<style scoped lang="scss">
:deep(.ant-select-selection-item) {
  background: var(--secondary-bg) !important;
  background: none;
  width: 96px;
  height: 28px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-radius: 8px !important;
}

/* anticon-close */
:deep(.anticon) {
  font-size: 16px;
  color: var(--secondary-text);
}

:deep(.ant-select-selector) {
  padding-bottom: 0 !important;
  background: var(--secondary-transp-bg) !important;
  border-radius: 8px !important;
  min-height: 40px;
}
</style>
