<template>
  <div class="wallheaven-header">
    <a-row justify="center">
      <a-col class="wallheaven-item" :span="4" v-for="item in wallTitle" :class="wallStatus === item.id ? 'wallheaven-active':''" @click="wallTitleClick(item)"> 
        {{ item.name }}
      </a-col>
    </a-row>
  </div>
  <div class="wallheaven-tab">
    <a-radio-group v-model:value="purity" style="margin-right: 16px;">
      <a-radio-button value="SFW" style="border:none !important;background:rgba(255, 255, 255, 0.1) !important;border-top-left-radius: 8px;border-bottom-left-radius: 8px;">SFW</a-radio-button>
      <a-radio-button value="Sketchy" style="border:none !important;background:rgba(255, 255, 255, 0.1) !important;border-top-right-radius: 8px;border-bottom-right-radius: 8px;">Sketchy</a-radio-button>
    </a-radio-group>
    <a-select ref="select" v-model:value="wallTypeValue"  style="width:200px;margin-right: 16px;" @change="wallSelectChange($event)" >
      <a-select-option value="date_added">最新</a-select-option>
      <a-select-option value="hot">最热</a-select-option>
      <a-select-option value="random">随机</a-select-option>
      <a-select-option value="toplist">热门列表</a-select-option>
      <a-select-option value="favorites">更多收藏</a-select-option>
    </a-select>
    <a-select ref="select" v-model:value="wallSizeValue" style="width:200px;margin-right: 16px;"  @change="getWallSelectValue($event)">
     <a-select-option value>不限</a-select-option>
     <a-select-option value="1920x1080">1080p+</a-select-option>
     <a-select-option value="2560x1080">2k+</a-select-option>
     <a-select-option value="3840x2160">4k+</a-select-option>
     <a-select-option value="7680x4320">8k+</a-select-option>
    </a-select>
    <a-input v-model:value="searchName" placeholder="搜索" style="border:none !important;">
      <template #prefix>
        <SearchOutlined style="cursor: pointer;color: rgba(255, 255, 255, 0.4);"/>
      </template>
    </a-input>
    <a-button type="ghost" class="search-button" @click="wallSearch">搜索</a-button>
  </div>
  <WallHot v-if="wallStatus === 0" />
  <WallAcg v-if="wallStatus === 1"/>
  <WallPeople v-if="wallStatus === 2"/>
</template>

<script>
import { defineComponent,ref } from 'vue'
import { SearchOutlined } from '@ant-design/icons-vue';
import WallHot from './WallheavenItem/WallHot.vue';
import WallAcg from './WallheavenItem/WallAcg.vue';
import WallPeople from './WallheavenItem/WallPeople.vue'
import { mapActions,mapState  } from 'pinia'
import { wallStore } from '../../store/wallheaven'
export default defineComponent({
  name: 'Wallheaven',
  components:{
    SearchOutlined,
    WallHot,
    WallAcg,
    WallPeople
  },

  data(){
    return{
      wallTitle:[
       {
        id:0,
        name:'热门推荐',
        categories:'111',
       },
       {
        id:1,
        name:'动漫精选',
        categories:'010',
       },
       {
        id:2,
        name:'人物精选',
        categories:'001',
       }
      ],
      wallStatus:0,
      purity: 'SFW',
      searchName:'',
      wallTypeValue:'hot',
      wallSizeValue:'',
      categories:'111'
    }
  },
  mounted(){
     
  },
  methods:{
    ...mapActions(wallStore,['getWallPaperSearch']),
    // wallheaven壁纸分类标题
    wallTitleClick(item){
      this.wallStatus = item.id
      this.categories = item.categories
      if(this.wallStatus == 0){
        this.wallTypeValue = 'hot'
      }else if(this.wallStatus == 1){
        this.wallTypeValue = 'date_added'
      }else if(this.wallStatus == 2){
        this.wallTypeValue = 'date_added'
      }
    },
    // 搜索功能
    wallSearch(){
      // &categories=111&purity=100&sorting=random&q=11
      let searchObj = {
        categories:`${this.categories}`,
        purity:`${this.purity}`,
        sorting:`${this.wallTypeValue}`,
        atleast:`${this.wallSizeValue}`,
        q:`${this.searchName}`,
      }
      this.getWallPaperSearch(searchObj)
    },
    wallSelectChange(e){
      this.wallTypeValue = e
    },
    getWallSelectValue(e){
      if(e !== ''){
        this.wallSizeValue = e 
      }
    },
  },
  
})
</script>

<style lang="scss" scoped>
.wallheaven-header{
width:auto;
padding-bottom: 32px;
.wallheaven-item{
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  user-select: none;
  padding: 11.87px 28px 11px 28px;
  margin-right: 16px;
}
.wallheaven-active{
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
}
}
.wallheaven-tab{
width: auto;
display: flex;
align-items: center;
margin-bottom: 24px;
.ant-cascader{
  width: 200px !important;
  margin-right: 16px !important;
  background: rgba(255, 255, 255, 0.1) !important;
}
.ant-input-affix-wrapper{
  width: 200px !important;
  background: rgba(255, 255, 255, 0.15) !important;
}
::v-deep .ant-select-selector{
  background: rgba(255, 255, 255, 0.15) !important;
  border: none !important;
  border-radius: 8px !important;
}
::v-deep .ant-select-item{
  background-color: rgba(255, 255, 255, 0.15) !important;
}
.ant-input-affix-wrapper{
  border: none !important;
  border-radius: 8px !important;
}
.search-button{
  margin-left: 16px;
  padding:6px 22px 7px 21px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ant-btn-ghost:hover, .ant-btn-ghost:focus{
  color: rgba(255, 255, 255, 0.85) !important;
  border: 1px solid rgba(255, 255, 255, 0.15) !important;
}
.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled)::before{
  display: none !important;
}
.ant-radio-button-wrapper:not(:first-child)::before{
  background-color: transparent !important;
}
.ant-radio-button-wrapper:focus-within{
  box-shadow: none !important;
  background: rgba(255, 255, 255, 0.4) !important;
}
}
#wallImages{
img{
  width: 301px;
  height: 170px;
}
}
</style>
