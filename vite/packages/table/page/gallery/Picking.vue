<template>
<div class="flex w-full justify-between items-center" style="margin-bottom: 16px;">
  <div class="w-96 h-12 flex items-center">
    <div class="w-80 h-12 bg-white bg-opacity-10 rounded-lg flex items-center ">
        <div class="w-20 h-12 flex items-center justify-center" style="border-right: 1px solid rgba(255, 255, 255, 0.1);">壁纸源</div>
        <a-select class="w-full" :bordered="false" v-model:value="pickFilterValue" @change="pickFilterChange($event)">
            <a-select-option value="/timeline/v2">拾光</a-select-option>
            <a-select-option value="/glutton/journal">贪食鬼</a-select-option>
            <a-select-option value="/wallhaven/v2">wallhaven</a-select-option>
        </a-select>
    </div>
  </div>
  <div class="w-48 h-12 flex items-center">
       <div class="w-2/5 h-12 flex items-center rounded-lg cursor-pointer justify-center bg-white bg-opacity-10" @click="openFilter">
         <Icon icon="filter" style="font-size: 1.715em;"></Icon>
         <span style="font-size: 1.15em;">筛选</span>
       </div>
       <div class="w-12 h-12 flex items-center rounded-lg cursor-pointer justify-center bg-white bg-opacity-10" @click="openInfo" style="margin-left: 12px;">
         <InfoCircleOutlined style="font-size: 1.715em;"/>
       </div>
  </div>
</div>

<vue-custom-scrollbar  id="pick-wrapper" :settings="settingsScroller" style="height: 80vh">
   <div id="pick-images">
   <a-row :gutter="[20,20]" id="bingImages" style="margin-right: 1em">
    <a-col class="image-wrapper " v-for="img in pickImageData" :span="6" style="">
       <img :src="img.thumburl" alt="" style="width:100px;height:100px;">
    </a-col>
   </a-row>
    
   </div>
</vue-custom-scrollbar>

<a-drawer v-model:visible="pickFilterShow" title="筛选" style="text-align: center !important;" class="no-drag">
  <div class="w-full h-12  flex rounded-lg" style="border:1px solid rgba(255, 255, 255, 0.1);margin-bottom:1.714289em;">
     <div class="w-1/3 h-100 flex items-center justify-center filter-item" :class="filterIndex === item.index ? 'active':''"  v-for="item in filterOption" @click="filterOptionClick(item)" style="border-right:1px solid rgba(255, 255, 255, 0.1);">
        {{ item.title }}
     </div>
  </div>
  <div class="w-full h-12  flex items-center justify-between" style="margin-bottom:1.714289em;">
    <span>分类</span>
    <div class="w-60  bg-white bg-opacity-10 rounded-lg flex items-center ">
        <a-select class="w-full" :bordered="false" v-model:value="classValue" @change="filterClassValue($event)">
            <a-select-option v-for="item in classOption" :value="item.id">
              {{ item.name }}
            </a-select-option>
        </a-select>
    </div>
  </div>
  <div class="w-full h-12  flex items-center justify-between" style="margin-bottom:1.714289em;">
   <span>筛选选</span>
   <a-switch v-model:checked="pickChecked" />
  </div>
  <div class="w-full flex items-center justify-center">
   <div  @click="restFilter" class="w-28 h-12  flex items-center justify-center  rounded-lg cursor-pointer  bg-white bg-opacity-10">
    <span>重置筛选</span>
   </div>
  </div>
</a-drawer>

<a-drawer v-model:visible="pickInfoShow" title="信息" style="text-align: center !important;" class="no-drag">
    <div class="flex w-full   justify-center items-center flex-col">
        <div class="w-60" style="margin: 50%;">
          <div class="flex" style="margin-bottom: 12px;">
            <span style="margin-right: 16px;">壁纸源</span>
            <span>ONE ? 一个</span>
          </div>
          <div class="flex" style="margin-bottom: 12px;">
            <span style="margin-right: 30px;">简介</span>
            <span>复杂的世界里，一个就够了</span>
          </div>
          <div class="flex items-center">
            <span style="margin-right: 30px;">官网</span>
            <span class="w-40 h-12 flex items-center rounded-lg cursor-pointer justify-center bg-white bg-opacity-10" @click="toOfficialWebsite">
              访问官网
            </span>
          </div>
        </div>
    </div>
    <template #footer>
      <span>「拾光壁纸」提供技术支持</span>
    </template>
</a-drawer>

</template>

<script>
import { defineComponent,ref } from 'vue';
import {InfoCircleOutlined} from '@ant-design/icons-vue'
import axios from 'axios';
export default defineComponent({
  name:'Picking',
  components:{
    InfoCircleOutlined
  },
  data(){
    return{
      isLoading:false,
      pickChecked:false,
      classOption:[],
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
      pickImageData:[]
    }
  },
  mounted() {
    $("#pick-wrapper").scroll(()=>{
      if ($("#pick-wrapper").scrollTop() +  $("#pick-wrapper").height() + 20 >= $("#pick-images").prop("scrollHeight") && this.isLoading === false) {
        // console.log($("#pick-wrapper").height());
         this.getPickingData($("#pick-wrapper").height())
      }
    })
    this.getPickingData($("#pick-wrapper").height())
    this.getClassOption()
  },
  methods:{
    // 获取拾光壁纸数据
    getPickingData(v){
      const apiUrl = `https://api.nguaduot.cn/${this.pickFilterValue}`
      const newTime = new Date()
      const dateTime =  this.formatDateTime(newTime)
      console.log(dateTime);
      const params = {
        order:`${this.filterValue}`,
        no:`${v}`,
        date:'',
        score:`${v}`,
      }
      axios.get(apiUrl).then(res=>{
         this.pickImageData = res.data.data
      })

      // const pickHeight = document.querySelector('#pick-wrapper')
      // console.log(pickHeight);
      
     
      // // console.log(params);
      
      
    },
    // 获取拾光壁纸分类
    getClassOption(){
       const apiUrl = 'https://api.nguaduot.cn/timeline/cate'
       axios.get(apiUrl).then(res=>{
          this.classOption = res.data.data
       })
    },
    pickFilterChange(e){
      this.pickFilterValue = e
    },
    // 重置筛选
    restFilter(){

    },

   formatDateTime (date) {
     var y = date.getFullYear();
     var m = date.getMonth() + 1;
     m = m < 10 ? ('0' + m) : m;
     var d = date.getDate();
     d = d < 10 ? ('0' + d) : d;
     var h = date.getHours();
     var minute = date.getMinutes();
     minute = minute < 10 ? ('0' + minute) : minute;
     // return y + '-' + m + '-' + d+' '+h+':'+minute;
     return y + '-' + m + '-' + d
   }

  },

  setup() {
    const pickFilterValue = ref('/timeline/v2')
    const pickInfoShow = ref(false)
    const pickFilterShow = ref(false)
    const classValue = ref('landscape')
    const filterOption = ref([
        {
          index:'D',
          title:'最新',
          value:'date'
        },
        {
          index:'S',
          title:'趋势',
          value:'score'
        },
        {
          index:'R',
          title:'随机',
          value:'random'
        }
    ])
    const filterIndex = ref('D') 
    const filterValue = ref('date')
    // 右侧打开拾光壁纸官网信息
    const openInfo = () =>{
      pickInfoShow.value = true
    }
    // 点击筛选
    const openFilter = () =>{
      pickFilterShow.value = true
    }

    const filterOptionClick = (item) =>{
      filterIndex.value = item.index
      filterValue.value = item.value
    }

    // 跳转至拾光壁纸官网
    const toOfficialWebsite = () =>{
      ipc.send('addTab',{url:'https://app.nguaduot.cn/timeline'})
    }
    // 获取分类参数
    const filterClassValue = (e) =>{
      classValue.value = e
    }
    return{
      pickFilterValue,
      pickInfoShow,
      pickFilterShow,
      filterValue,
      classValue,
      filterOption,
      filterIndex,
      openInfo,
      toOfficialWebsite,
      openFilter,
      filterClassValue,
      filterOptionClick
    }
  }
})
</script>

<style lang="scss" scoped>
.filter-item:nth-of-type(3){
  border: none !important;
}
.active{
  background: rgba(77, 77, 77, 1);
  &:nth-of-type(1){
    border-top-left-radius: 0.5em;
    border-bottom-left-radius: 0.5em;
  }
  &:nth-of-type(3){
    border-top-right-radius: 0.5em;
    border-bottom-right-radius: 0.5em;
  }
}
</style>