<script lang="ts" setup>
import {onMounted, ref} from 'vue'
import HorizontalPanel from "../../components/HorizontalPanel.vue";
import shareHelper from "../../js/lib/shareHelper";
import {formatTimestamp, timeStamp} from "../../util";
import {usePlat} from "../../permission/usePlat";
import {Server} from "../../consts";
import browser from "../../js/common/browser";
import {message} from "ant-design-vue";
const defaultRecord=ref('desk')
const recordType=[
  {
    title:'桌面分享',
    name:'desk'
  }
]
const page=ref(1)
const limit=ref(10)
const list=ref([])
onMounted(()=>{
  shareHelper.my(page.value,limit.value).then(data=>{
    if(data.status){
      list.value=data.data.list
      for(const li of list.value){
        li.date= formatTimestamp(li.createTime)
        li.expireTimeStr=li.expireTime!=='0'?formatTimestamp(+li.expireTime):''
        li.hasPwd=li.password?"有":"无"
        let baseUrl=window.location.origin
        if(usePlat('client')){
          baseUrl=Server.webUrl
        }
        li.link=`${baseUrl}/s/${li.code}`
      }
    }
    console.log(list.value,'活的到的数据')
  })
})

const columns=[
  {
    title: '查看链接',
    dataIndex: 'link',
    key:'link',
    width: '20%',
  },
  {
    title: '日期',
    dataIndex: 'date',
    width: '20%',
  },
  {
    title: '标题',
    dataIndex: 'title',
    width: '20%',
  },
  {
    title: '口令',
    dataIndex: 'alias',
    width: '20%',
  },
  {
    title: '过期时间',
    dataIndex: 'expireTimeStr',
    width: '15%',
  },
  {
    title:'是否有密码',
    dataIndex:'hasPwd',
    key:'hasPwd',
    width: '20%',
  },
  {
    title: '查看',
    dataIndex: 'btn',
    key:'btn',
    width: '20%',
  },
]

const openUrl=(url)=>{
  browser.openInSystem(url)
}
const remove=(code)=>{
  window.$ui.confirm(
    '删除确认',
    "确定删除此记录，删除后，分享链接将彻底失效。此操作不可撤销！",
    {
      noText:'立即删除',
      okText:'取消',
      no:()=>{
        shareHelper.remove(code).then(data=>{
          if(data.status){
            let index=list.value.findIndex(li=>{
              return li.code===code
            })
            list.value.splice(index,1)
            message.success('删除成功')

          }else{
            message.error('删除失败')
          }
        })
      },
      okButtonWidth:'95',
      noButtonWidth:'95',
    })
}
</script>

<template>
  <div class="ml-4 flex h-full flex-col">
    <div style="width: 328px;" class="mb-3">
      <HorizontalPanel :navList="recordType" v-model:selectType="defaultRecord"></HorizontalPanel>
    </div>
    <div class="flex-1 h-0">
      <xt-scrollbar :y="true" style="height: 100%">
        <a-table :pagination="false"  :dataSource="list" :columns="columns"

        >
          <template #bodyCell="{ column,record }">
            <template v-if="column.key === 'btn'">
              <div class="text-center truncate">
                <xt-button :w="60" :h="40" @click="openUrl(record.link)" type="theme">查看</xt-button>&nbsp;
                <xt-button  :w="60" :h="40"  @click="remove(record.code)" type="error">删除</xt-button>&nbsp;
              </div>
            </template>
          </template>
        </a-table>
      </xt-scrollbar>

    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
