<template>
  <teleport to='body' >
    <xt-modal custom  boxClass="rounded-xl" :mask="false" v-model="isFavorites" v-if="isFavorites" >
      <div class="relative flex overflow-hidden xt-modal rounded-xl" style="width: 1000px; height: 720px;" >
        <!-- 左侧列表 -->
        <LeftMenu @changeFolder="changeFolder" @refresh="refresh"></LeftMenu>
        <div class="flex-1 w-full">
          <Search></Search>
          <WebList @refresh="refresh" @changeIcon="changeIcon" @countFavo="countFavo" @showRenameModal="showRenameModal" :checkFlag="checkFlag" :showList="showList" :menus="menus" :rightMenu="rightMenu"></WebList>
        </div>

        <Labor @changeIcon="changeIcon" :menus="menus" :checkFlag="checkFlag" @changeCheck="changeCheck" @countFavo="countFavo"></Labor>
        <xt-preview v-if="previewFlag" v-model="previewFlag" @ok="addFolderIcon"></xt-preview>
        
      </div>
    </xt-modal>
    <!-- 修改网址名称 -->
    <xt-modal title="编辑名称" :maskIndex="1001" :index="1002" boxClass="rounded-xl p-4" :mask="true" :header="true" :footer="true" v-model="renameFlag" v-if="renameFlag" @ok="changeName" >
      <div class="relative flex items-center xt-modal rounded-xl" style="width: 466px; height: 50px;" >
        <!-- <xt-input style="height: 40px;width: 400px;" v-model="rename" placeholder="请输入网站名称" class="h-10 ml-2 rounded-lg xt-text xt-main-bg"></xt-input> -->
        <a-input
          class="w-full h-10 xt-mask xt-text"
          style="border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;"
          placeholder="请输入网站名称"
          allow-clear
          v-model:value="rename">
        </a-input>
        <xt-button @click="rename = tmpName" :radius="10" :w="40" :h="40" class="ml-3 xt-main-bg">
            <xt-new-icon icon="fluent:arrow-clockwise-16-regular" size="20" />
        </xt-button>
      </div>
    </xt-modal>
    <!-- 添加到桌面 -->
    <xt-modal title="添加到桌面" :maskIndex="1001" :index="1002" boxClass="rounded-xl p-4" :mask="true" :header="true" :footer="true" v-model="deskFlag" v-if="deskFlag" @ok="addDeskIcon" >
      <div class="relative flex xt-modal rounded-xl" style="width: 466px; height: 50px;" >
        <!-- <xt-input style="height: 40px;width: 400px;" v-model="rename" placeholder="请输入网站名称" class="h-10 ml-2 rounded-lg xt-text xt-main-bg"></xt-input> -->
        <xt-select v-model="deskIndex" :zIndex="1200" style="width: 100%;" :list="deskList" :bordered="false"></xt-select>
      </div>
    </xt-modal>
  </teleport>
</template>

<script> 
import { Icon } from '@iconify/vue';
import { mapActions, mapState, mapWritableState } from 'pinia'
import { favoStore } from '../store'
import { useWidgetStore } from '../../../components/card/store'; 
import LeftMenu from '../components/LeftMenu.vue'
import Search from '../components/Search.vue'
import Labor from '../components/Labor.vue'
import WebList from '../components/WebList.vue'
import { message } from 'ant-design-vue'
import _ from 'lodash-es'
import {cardStore} from '../../../store/card';
import { nanoid } from 'nanoid'


export default {
  name: 'favorites',
  data() {
    return {
      renameFlag: false,
      tmpName: '',
      tmpGuid: '',
      rename: '',
      checkFlag: false,
      previewFlag: false,
      deskFlag: false,
      resTmp: [],
      deskIndex: {},
      // 临时存放数据
      itemTmp: {},
      menus: [
        {
          label: '添加到桌面',
          newIcon:'fluent:desktop-16-regular',
          callBack: async () => {
            this.deskFlag = true
          }
        },
        {
          label: '添加到分组',
          newIcon: 'fluent:app-folder-16-regular',
          callBack: () => {

            this.previewFlag = true
            this.edit = true
          },
        },
      ],
      rightMenu: [
        {
          label: '复制网址',
          newIcon:'fluent:copy-20-regular',
          callBack: async () => {
            require('electron').clipboard.writeText(this.itemTmp.url)
            message.success('复制内容成功')
          }
        },
        {
          label: '添加到桌面',
          newIcon:'fluent:desktop-16-regular',
          callBack: async () => {
            this.deskFlag = true
          }
        },
        {
          label: '添加到分组',
          newIcon: 'fluent:app-folder-16-regular',
          callBack: () => {
            this.previewFlag = true
            this.edit = true
          },
        },
        
      ],
      deskIcons: [],
      // 文件夹默认数据
      defaultFolderIcon: {
        attributeEdit: true,
        bg: '',
        iconShape: "square",
        iconState: "cover",
        iconType: "",
        isBg: false,
        isName: true,
        isRadius: false,
        lastUseTime: '',
        mode: "link",
        radius: 5,
        size: "1x1",
        summary: "",
        type: '',
        useCount: '',
        name: "",
        value: '',
        icon: null,
      },
      // 桌面图标数据
      defaultDeskIcon: {
        customData:{
          customSize: '1x1',
          groupTitle: '分组',
          iconList: [
            {
              open: {
                type: 'default',
                value: null,
              },
              src: null,
              titleValue: '',
            }
          ],
          size:{
            h: "204px",
            w: "280px"
          },
          zoom: {
            state: true,
            value: ""
          },
        },
        id: null,
        name: "myIcons"
      },

    }
  },
  components: { 
    Icon,
    LeftMenu,
    Search,
    WebList,
    Labor,
  },

  computed:{
    ...mapWritableState(favoStore, ['isFavorites', 'allList', 'folderList', 'folderIndex', 'browserList', 'updateTime', 'searchValue', 'folderIcons']),
    ...mapWritableState(useWidgetStore, ['edit']),
    ...mapWritableState(cardStore, ['desks', 'addCard']),
    // 过滤出制定数组
    showList(){
      const folder = this.folderList[this.folderIndex]
      if(folder?.type == 'all'){
        let nn = []
        nn = this.allList.reduce((acc, item) => {
          if (item.browser === folder.browser && (name?.indexOf(this.searchValue) > -1 || item.url?.indexOf(this.searchValue) > -1)) {
            acc.push(item);
          }
          return acc;
        }, []);
        return nn

      }else if(folder?.type == 'folder'){
        return this.allList.reduce((acc, item) => {
          if (item.parent == folder.guid && (name?.indexOf(this.searchValue) > -1 || item.url?.indexOf(this.searchValue) > -1)) {
            acc.push(item);
          }
          return acc;
        }, []);
      }else if(folder?.type == 'favo'){
        return this.allList.reduce((acc, item) => {
          if (item.favo && (name?.indexOf(this.searchValue) > -1 || item.url?.indexOf(this.searchValue) > -1)) {
            acc.push(item);
          }
          return this.sortByFavoTime(acc);
        }, []);
      }else if(folder?.type == 'recent'){
        return this.allList.reduce((acc, item) => {
          if (item.browser === folder.browser && item.recent && (name?.indexOf(this.searchValue) > -1 || item.url?.indexOf(this.searchValue) > -1)) {
            acc.push(item);
          }
          return acc;
        }, []);
      }
    },
    deskList(){
      let arr = []
      this.desks.forEach((item, index)=>{
        arr.push({name: item.name, value: index})
      })
      if(arr.length){
        this.deskIndex = 0
      }
      return arr
    
    },
  },

  watch:{
    // 监听是否刷新
    isFavorites:{
      handler(newVal, oldVal) {
        if(newVal == true){
          this.refresh()
        }
      },
      immediate:true
    },
  },
  mounted(){
  },
  methods: {
    // 添加到桌面
    addDeskIcon(){
      this.deskIcons.forEach(item=>{
        this.addCard(item, this.desks[this.deskIndex])
      })
      this.clearCheck()
    },
    // 添加到文件夹
    addFolderIcon(){
      this.clearCheck()
    },
    // 修改名字
    changeName(){
      if(this.rename == ''){
        message.error('名称不能为空！')
      }else{
        this.allList.forEach((i, index)=>{
          if(i.guid == this.tmpGuid){
            i.rename = this.rename
            message.success('修改名称成功！')
          }
        })
      }
    },
    // 修改名称弹窗
    showRenameModal(item){
      this.renameFlag = true
      this.tmpName = item.name
      this.tmpGuid = item.guid
      this.rename = item.rename?item.rename:item.name
    },
    async refresh(){
      // this.allList = []
      let arrTmp = []
      for(let n in this.browserList){
        arrTmp.push(n)
      }

      await tsbApi.system.getBrowserBookmark(arrTmp, (data)=>{
        this.updateTime = new Date().getTime()
        this.folderList = []
        // this.allList = []
        let res = []
        if(data.result){
          for (let browser in data.result){
            this.resTmp = []
            res.push(...this.flattenChildrenArray(data.result[browser], browser, 0))
            this.folderList.unshift({
              name: '最近添加',
              type: 'recent',
              browser: browser,
              // num: allNum,
              rename: null,
              time: new Date().getTime()
            })
            this.folderList.unshift({
              name: '全部',
              type: 'all',
              browser: browser,
              // num: allNum,
              rename: null,
            })
          }
          this.folderList.unshift({
            name: '我的收藏',
            type: 'favo',
            // num: 0,
            rename: null,
            unRead: false,
          })
          this.allList = this.mergeArraysByGuid(this.allList, res)

        }else{
          message.error('浏览器收藏夹读取失败！')
        }
      })
      // const filteredArray = this.mergeUniqueArrays(arr1, arr2);
    },

    // 将数据进行拆分
    flattenChildrenArray(obj, browser, level, parent) {
      let num = 0
      const time = new Date().getTime()
      obj.children?.forEach(item => {
          if(item.type != 'folder') {
            this.resTmp.push({
              ...item,
              browser: browser,
              parent: parent,
              icon: null,
              rename: null,
              favo: false,
              check: false,
              time: time,
            });
            num++
          }
          if (item.children) {
            this.flattenChildrenArray(item, browser, level+1, level==0?item.guid:parent);
          }
      });
      if(level == 1){
        this.folderList.push({
          ...obj,
          browser: browser,
          num: num,
          rename: null,
          type: 'folder',
          time: time,
          unRead: false,
        })
      }
      return this.resTmp;
    },

    // 改变图标类型
    changeIcon(arr){
      if (arr.length == 1) this.itemTmp = arr[0]
      let newFolder = []
      let newIcon = []
      arr.forEach(item=>{
        newIcon.push({
          ...this.defaultDeskIcon,
          customData: {
            ...this.defaultDeskIcon.customData,
            iconList: [
              {
                open: {
                  type: 'default',
                  value: item.url,
                },
                src: item.icon,
                titleValue: item.name,
              }
            ],
          },
          id: nanoid(6),
        })
        newFolder.push({
          ...this.defaultFolderIcon,
          ...item, 
        })
      })
      this.deskIcons = newIcon
      this.folderIcons = newFolder
    },

    // 排序算法
    sortByFavoTime(arr) {
      return arr.sort((a, b) => b.favoTime - a.favoTime);
    },
    // 切换文件夹列表
    changeFolder(index){
      this.folderIndex = index
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
    },

    // 统计收藏数量
    countFavo(){
      let num = 0;
      this.allList.forEach(item=>{
        if(item.favo) num++
      })
      this.folderList[0].num = num
    },

    // 切换编辑状态
    changeCheck(){
      this.checkFlag = !this.checkFlag
      if(!this.checkFlag){
        this.clearCheck()
      }
    },

    // 清楚数据的选中状态
    clearCheck(){
      this.allList.forEach(item=>{
        if(item.check) item.check = false
      })
    },
    
    // 清楚数据的最近添加状态
    clearRecent(){
      this.allList.forEach(item=>{
        if(item.recent) item.recent = false
      })
    },

    mergeArraysByGuid(arr1, arr2) {
      const existingGuids = new Set(arr1.map(obj => obj.guid));
      const newObjects = arr2.filter(obj => !existingGuids.has(obj.guid));
      // 这部分是新建的网址 需要添加到最近更新
      if(newObjects.length > 0){
        this.clearRecent()
        newObjects.forEach(item=>{
          item.recent = true          
          item.unRead = true
          this.folderList.forEach(folder=>{
            if(folder.guid == item.parent && item.parent){
              folder.unRead = true
            }
          })
        })
      }
      const content = newObjects.length?`浏览器收藏夹数据刷新成功。本次更新${newObjects.length}条新网址`:'浏览器收藏夹数据刷新成功。'
      message.success(content)
      const mergedArray = [...arr1, ...newObjects];
      return mergedArray;
    },
  },

}
</script>

<style scoped lang="scss">

  // :deep(.)
</style>
