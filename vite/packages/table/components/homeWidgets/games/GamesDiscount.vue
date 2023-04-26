<template>
  <HomeComponentSlot :options="options" :confirmCCData="confirmCCData" :customIndex="customIndex" :customData="customData" :formulaBar="gameBare" ref="gameSlot">
      <template v-if="gameShow ===false">
        <div class="discount-item flex flex-col" style="margin-top: 1em;">
          <div class="flex flex-col ">
           <div  class="w-full flex cursor-pointer rounded-md" @click="enterDetail(item,customData.id)"  v-for="item in randomList" style="position:relative;height:65px; margin-bottom: 12px;overflow: hidden">
             <img :src="item.header_image" alt="" class=" rounded-md" style="width:140px;height:65px; object-fit: cover;">
             <div class="flex  discount-content flex-col" style="margin-left: 10px; width: 104px;">
              <div class="name truncate" style="width: 100%; margin-bottom: 10px;">{{item.name}}</div>
              <span class="line-through text-white text-opacity-60" style="font-size: 10px;">
                {{currencyFormat(item.original_price,item.currency)}}
              </span>
              <div class="flex w-full justify-between ">
                <span style="color:rgba(255, 77, 79, 1); line-height: 21px; font-size: 14px;font-weight: 500;">
                 {{ currencyFormat(item.final_price,item.currency) }}
                </span>

              </div>
               <div style="position: absolute;top:0;left:0;background-color: rgba(255, 77, 79,0.5);backdrop-filter: blur(8px);border-bottom-right-radius: 9px;">
                 <span style=" padding: 3px 10px;font-size: 12px;">
                   -{{item.discount_percent}}%
                  </span>
               </div>
             </div>

           </div>
          </div>
          <div class="bg-black change bg-opacity-10 flex rounded-lg cursor-pointer" @click="discountChange" style="padding:13px 80px;">
           <Icon icon="reload" class="animate-spin" style="font-size: 1.429em;color: rgba(255, 255, 255, 0.85);" v-if="reloadShow === true"></Icon>
           <Icon icon="reload" style="font-size: 1.429em;color: rgba(255, 255, 255, 0.85);" v-else></Icon>
           <span style="margin-left: 1em;color: rgba(255, 255, 255, 0.85);">换一换</span>
          </div>
        </div>
      </template>
      <template v-if="gameShow === true">
        <a-spin v-if="isLoading === true" style="display: flex; justify-content: center; align-items:center;margin-top: 60%"></a-spin>
        <div class="flex flex-grow flex-col" style="margin-top: 14px;" v-else>
          <div class="detail-image rounded-lg" style="margin-bottom: 14px;">
             <img class="rounded-lg" :src="detailList.header_image" alt="">
          </div>
          <div class="truncate" style="margin-bottom: 6px; font-size: 18px;font-weight: 500;">{{detailList.name}}</div>
          <span class="content-introduction text-white text-opacity-60">{{detailList.short_description}}</span>
          <div class="flex" style="margin-bottom: 10px;">
            <span class="discount-description rounded-md bg-white bg-opacity-20 "  v-for="item in detailList.genres">{{item.description}}</span>
          </div>
          <span class="line-through text-white text-opacity-60" style="font-size: 12px;">
            {{ detailList.price_overview.initial_formatted }}
          </span>
          <div class="flex w-full justify-between " style="margin-bottom: 16px;">
            <span style="color:rgba(255, 77, 79, 1); line-height: 21px; font-size: 16px;font-weight: 500; padding-right: 2.41em;">
             {{ detailList.price_overview.final_formatted }}
            </span>
            <div class="flex justify-end">
              <span class="rounded-md" style="background:rgba(255, 77, 79, 1); padding: 3px 10.23px;font-size: 12px;">
               -{{detailList.price_overview.discount_percent}}%
              </span>
            </div>
          </div>
          <div class="flex items-center justify-around">
            <div @click="discountBack()" class="bg-black change cursor-pointer bg-opacity-10 rounded-lg w-12 h-12 flex items-center justify-center">
              <Icon icon="xiangzuo" style="font-size: 1.715em;color: rgba(255, 255, 255, 0.85);"></Icon>
            </div>
            <div class="bg-black change flex items-center justify-center  rounded-lg  h-12 cursor-pointer bg-opacity-10" @click="openSteam(detailList.steam_appid)" style="width:196px;color: rgba(255, 255, 255, 0.85);">打开steam</div>
          </div>
        </div>
      </template>
  </HomeComponentSlot>

  <a-drawer :width="500" title="设置" style="text-align: center;" :bodyStyle="{textAlign:'left'}"  placement="right" :visible="gameVisible" @close="onClose">
    <div class="flex flex-col justify-start">
     <span style="margin-bottom: 14px;">默认地区</span>
     <a-select style="width: 452px" @change="getRegion($event)" v-model:value="defaultRegion">
       <a-select-option v-for="item in region" :value="item.id">{{item.name}}</a-select-option>
     </a-select>
    </div>
  </a-drawer>
</template>

<script>
import HomeComponentSlot from "../HomeComponentSlot.vue";
import {randomData,sendRequest,currencyFormat,compareTime} from '../../../js/axios/api'
import { mapWritableState,mapActions ,mapState} from 'pinia'
import {steamStore} from '../../../store/steam'
import { cardStore } from "../../../store/card";
export default {
  name:'GamesDiscount',
  props:{
    customIndex:{
      type:Number,
      default:0
    },
    customData:{
      type:Object,
      default:()=>{}
    },
    confirmCCData:{
      type:Function,
      default:()=>{}
    }
  },
  components:{
    HomeComponentSlot
  },
  data(){
    return{
      options:{
        className:'card',
        title:'Steam折扣推荐',
        icon:'steam',
        type:'games',
        epicShow:false
      },
      region:[
        {
          id:'us',
          name:'美国'
        },
        {
          id:'ca',
          name:'加拿大'
        },
        {
          id:'gb',
          name:'英国'
        },{
          id:'fr',
          name:'法国'
        },{
          id:'de',
          name:'德国'
        },{
          id:'it',
          name:'意大利'
        },{
          id:'jp',
          name:'日本',
        },{
          id:'cn',
          name:'国区',
        },{
          id:'br',
          name:'巴西',
        },{
          id:'in',
          name:'印度',
        },{
          id:'ru',
          name:'俄罗斯',
        },{
          id:'au',
          name:'澳大利亚',
        },
        {
          id:'hk',
          name:'香港',
        },
        {
          id:'ar',
          name:'阿根廷',
        }

      ],
      defaultRegion:'cn',
      list:[],
      randomList:[],
      reloadShow:false,
      gameVisible:false,
      detailList:{},
      gameShow:false,
      isLoading:false,
      gameBare:[{icon:"shezhi1",title:'设置',fn:()=>{this.gameVisible = true;this.$refs.gameSlot.visible = false}}]
    }
  },
  computed:{
     ...mapWritableState(steamStore,["data","dataDetail"]),
     ...mapWritableState(cardStore,["customComponents"])
  },

  watch:{
    data:{
      handler(newVal,oldVal){
       if(Object.keys(newVal).length !== 0){
          this.getData()
       }
      },
      deep:true,
      immediate:true
    }
  },

  methods:{
    ...mapActions(steamStore,["setGameDetail","updateGameData","setGameData"]),
    ...mapActions(cardStore,["updateCustomComponents"]),
    currencyFormat,

    getData(){
      if(Object.keys(this.customData).length === 0  && this.defaultRegion == "cn"){
          if(this.data.length !== 0){
            const defaultIndex = this.data.filter(el=>{
              return el.cc === 'cn'
            })
            console.log(defaultIndex[0]);
            // const discountList = defaultIndex
            this.list = discountList.list
            this.getRandomList()
          }else{
            return
          }
      }else{
          const dataIndex = this.data.find(el=>{  // 根据地区卡片的区服将数据取出
            return this.customData.id === el.cc
          })
          if(dataIndex){
            const discountList = this.data[this.data.indexOf(dataIndex)]
            if(!compareTime(discountList.expiresDate)){   // 将对象里面的时间进行判断是否大于12小时
              this.list = discountList.list
              this.getRandomList()
            }else{
              sendRequest(`https://store.steampowered.com/api/featuredcategories/?cc=${this.customData.id}&l=${this.customData.id}`,3).then(res=>{
                const date = new Date(res.headers.expires)
                const requestObj = {
                  cc:this.customData.id,
                  expiresDate:date,
                  list:res.data.specials.items
                }
                this.updateGameData(requestObj)
              })
            }
          }
      }
    },

    getRandomList(){
      const randomArr = randomData(this.list,4)
      this.randomList = randomArr
    },

    // 点击切换
    discountChange(){
      this.reloadShow = true
      setTimeout(()=>{
        this.getRandomList()
        this.reloadShow = false
      },800)
    },
    // 点击进入详情
    enterDetail(item,cc){
      this.gameShow = true
      if(!this.isLoading){
        this.isLoading = true
        if(Object.keys(this.customData).length !== 0){
          setTimeout(()=>{
           sendRequest(`https://store.steampowered.com/api/appdetails?appids=${item.id}&cc=${cc}&l=${cc}`,3).then(res=>{
            const resData = res.data[item.id]
            if(resData.success === true){
              const detailData = resData.data
              this.detailList = detailData
            }else{
              return
            }
           })
           this.$nextTick(()=>{
            this.isLoading = false
           })
          },500)
        }else{
          setTimeout(()=>{
          sendRequest(`https://store.steampowered.com/api/appdetails?appids=${item.id}&cc=cn&l=cn`,3).then(res=>{
            const resData = res.data[item.id]
            if(resData.success === true){
              const detailData = resData.data
              this.detailList = detailData
            }else{
              return
            }
          })
          this.$nextTick(()=>{
            this.isLoading = false
          })
        },500)
        }
      }
    },
     discountBack(){
      this.gameShow = false
      window.localStorage.removeItem('detail')
     },
     openSteam(id){
      window.ipc.send('addTab',{url:`https://store.steampowered.com/app/${id}`})
     },

    onClose() {
      this.gameVisible = false
      localStorage.removeItem("detail")
    },
    getRegion(e){
      this.defaultRegion = e
       // 获取国家地区名称参数
      const findIndex =  this.region.find(el=>{
        if(el.id === this.defaultRegion){
          return  el
        }
      })
      // 将获取国家地区名称参数缓存到customComponents里面
      this.updateCustomComponents(this.customIndex,findIndex)
      sendRequest(`https://store.steampowered.com/api/featuredcategories/?cc=${this.defaultRegion}&l=${this.defaultRegion}`,3)
      .then(res=>{
        const date = Date.parse(res.headers.expires)
        const resObj = {
          cc:this.defaultRegion,
          expiresDate:date,
          list:res.data.specials.items
        }
        this.setGameData(resObj)
      })
      this.getData()
    }
  }
}
</script>

<style  lang="scss" scoped>
.discount-item{

  .discount-content{
     .name{
      max-width: 104px;
     }
  }
}
.change:active{
  filter: brightness(0.8);
  background:rgba(42, 42, 42, 0.25);
}

.detail-image{
  width: 100%;
  height: 118px;
  img{
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
.discount-description{
  line-height: 20px;
  margin-right:4px;
  padding:1px 6px;
  color:rgba(255, 255, 255, 0.6);
}
.change:active{
  filter: brightness(0.8);
  background:rgba(42, 42, 42, 0.25);
}
.content-introduction{
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: pre-wrap;
  margin-bottom: 5px;
}
.animate-spin{
  animation: spin 0.8s linear infinite !important;
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
}
</style>
