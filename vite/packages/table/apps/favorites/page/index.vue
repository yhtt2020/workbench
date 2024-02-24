<template>
  <teleport to='body' >
    <xt-modal custom  boxClass="rounded-xl" :mask="true" v-model="isFavorites" v-if="isFavorites" >
        <div class="xt-modal flex rounded-xl relative" style="width: 1000px; height: 720px;" >
          <!-- 左侧列表 -->
          <LeftMenu @changeFolder="changeFolder"></LeftMenu>
          <div class="w-full flex-1">
            <Search></Search>
            
            <!-- <div @click="test">1453456</div> -->
            <WebList :showList="showList"></WebList>
          </div>

          <Labor></Labor>


          

          
        </div>
    </xt-modal>
  </teleport>
</template>

<script> 
import { Icon } from '@iconify/vue';
import { mapActions, mapState, mapWritableState } from 'pinia'
import { favoStore } from '../store'
import LeftMenu from '../components/LeftMenu.vue'
import Search from '../components/Search.vue'
import Labor from '../components/Labor.vue'
import WebList from '../components/WebList.vue'
import { message } from 'ant-design-vue'


export default {
  name: 'favorites',
  data() {
    return {
      showList: [],
      
    }
  },
  async mounted(){
  },
  components: { 
    Icon,
    LeftMenu,
    Search,
    WebList,
    Labor,
  },

  computed:{
    ...mapWritableState(favoStore, ['isFavorites', 'allList', 'folderList', 'folderIndex', 'urlIndex']),
  },
  methods: {
    async test(){
      await tsbApi.system.getBrowserBookmark(['chrome', 'edge'], (data)=>{
      // await tsbApi.system.getBrowserBookmark(['edge', 'chrome'], (data)=>{
        console.log(data)
        this.folderList = []
        this.allList = []
        if(data.result){
          data.result.chrome.children.forEach(item => {
          // data.result.edge.children.forEach(item => {
            // 文件夹的情况下存文件夹
            if(item.type == 'folder'){
              let num = 0;
              item.children.forEach(i=>{
                this.allList.push({
                  ...i,
                  parent: item.guid,
                  icon: null,
                })
                num++
              })
              this.folderList.push({
                ...item,
                browser: 'chrome',
                // browser: 'edge',
                num: num,
              })
            }else{
              this.allList.push({
                ...item,
                parent: null,
                icon: null,
              })
            }
          });
          console.log('this.allList', this.allList)
          console.log('this.folderList', this.folderList)
        }else{
          message.error('浏览器收藏夹读取失败！')
        }
      })
      // await tsbApi.system.getBrowserBookmark('chrome', (data)=>{
      //   console.log(data)
      // })
      // await tsbApi.system.getBrowserBookmark('edge', (data)=>{
      //   console.log(data)
      // })
      // const arr1 = [
      //   { guid: 'guid1', name: 'John' },
      //   { guid: 'guid2', name: 'Jane' }
      // ];

      // const arr2 = [
      //   { guid: 'guid1', age: 25 },
      //   { guid: 'guid3', age: 30 }
      // ];
      // const filteredArray = this.mergeUniqueArrays(arr1, arr2);
      // console.log('filteredArray', filteredArray);
    },

    // 切换文件夹列表
    changeFolder(index){
      // console.log('index', index)
      this.folderIndex = index
      this.urlIndex = null
      if (index>=0) {
        // console.log('this.folderList[index]', this.folderList[index])
        // console.log('this.allList', this.allList)
        this.showList = this.allList.filter(item => {
          return item.parent == this.folderList[index].guid
        })
        
      }

    },

    // 数组去重
    mergeUniqueArrays(arr1, arr2) {
      let guidSet = new Set(arr1.map(item => item.guid));
      let mergedArray = arr1.slice();
      for (let item of arr2) {
          if (!guidSet.has(item.guid)) {
              mergedArray.push(item);
              guidSet.add(item.guid);
          }
      }
      return mergedArray;
    }
  },

}
</script>

<style scoped lang="scss">
</style>
