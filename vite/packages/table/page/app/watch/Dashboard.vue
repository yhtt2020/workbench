<template>
  <div class="p-3">
    <vue-custom-scrollbar :settings="outerSettings" style="position:relative;height:calc(100vh - 14em);  ">
   <div style="max-width: 900px;margin:auto">
     <div class="p-3" >
       <a-row class="mb-5" :gutter="[20,10]">
         <a-col :span="{md:5,sm:6}" >
           <img class="cover" :src="task.data.cover+'@320w_200h'">
         </a-col>
         <a-col :span="{lg:19,sm:18}">
           <div class="mb-2 text-lg">{{ task.data.title }}</div>
           <div  class="mb-2" style="color:#999">任务：{{ task.title }}</div>
           <div>
             <a-row class="text-l" :gutter="10">
               <a-col :span="4">
                 <Icon icon="bofang"></Icon>
                 {{ task.data.view || '-' }}
               </a-col>
               <a-col :span="4">
                 <Icon icon="dianzan"></Icon>
                 {{ task.data.like || '-' }}
               </a-col>
               <a-col :span="4">
                 <Icon icon="jinbi"></Icon>
                 {{ task.data.coin || '-' }}
               </a-col>
               <a-col :span="4">
                 <Icon icon="jinbi"></Icon>
                 {{ task.data.totalReply || '-' }}
               </a-col>
               <a-col :span="4">
                 <Icon icon="star"></Icon>
                 {{ task.data.dm || '-' }}
               </a-col>
               <a-col :span="4">
                 <Icon icon="jinbi"></Icon>
                 {{ task.data.collect || '-' }}
               </a-col>
             </a-row>
           </div>
         </a-col>
         <a-col :span="{sm:24,md:4}" style="text-align: right" >
           <a-row class="text-center" :gutter="10">
             <a-col :span="{sm:24,md:12}">
               <a-button type="primary">
                 <Icon class="mr-2"  icon="fenxiang"></Icon> 生成报告
               </a-button>
             </a-col>
             <a-col :span="{sm:24,md:12}">
               <a-button  >
                 <Icon class="mr-3" icon="zanting"></Icon> 暂停
               </a-button>
             </a-col>
           </a-row>


         </a-col>
       </a-row>
       <div class="mb-5">

         <a-row>
           <a-col :span="3">
             作品成就：
           </a-col>
           <a-col :span="21">
             <div  class="w-24 bg-indigo-500 px-1 py-1 text-white text-center font-extrabold rounded-full">播放破千</div>
           </a-col>
         </a-row>

       </div>
     </div>


     <div style="background: #2d2d2d;" class="p-4 rounded-md mb-5">
       <h3 class="mb-4">实时票房</h3>
       <a-row class="text-center mb-3">
         <a-col :span="3">
           <div>今日票房</div>
           <div>2301</div>
         </a-col>
         <a-col :span="3">
           <div>当前在看</div>
           <div>23</div>
         </a-col>
         <a-col :span="3">
           <div>今日预估</div>
           <div>1.2万</div>
         </a-col>
         <a-col :span="3">
           <div>点赞</div>
           <div>
             258 <span>3.2%</span>↓
           </div>
         </a-col>
         <a-col :span="3">
           <div>投币</div>
           <div>
             384 <span>3.2%</span> ↑
           </div>
         </a-col>
         <a-col :span="3">
           <div>
             收藏
           </div>
           <div>
             154 <span>2.2%</span>
           </div>
         </a-col>
         <a-col :span="3">
           <div>转发</div>
           <div>
             124 <span>3.2%</span>
           </div>


         </a-col>
         <a-col :span="3"></a-col>
       </a-row>
       <a-row class="text-center">
         <a-col :span="3">
           <div>累计票房</div>
           <div>2301</div>
         </a-col>
         <a-col :span="3">
           <div>首日票房</div>
           <div>23</div>
         </a-col>
         <a-col :span="3">
           <div>前3日票房</div>
           <div>1.2万</div>
         </a-col>
         <a-col :span="3">
           <div>点赞</div>
           <div>
             258 <span>3.2%</span>↓
           </div>
         </a-col>
         <a-col :span="3">
           <div>投币</div>
           <div>
             384 <span>3.2%</span> ↑
           </div>
         </a-col>
         <a-col :span="3">
           <div>
             收藏
           </div>
           <div>
             154 <span>2.2%</span>
           </div>
         </a-col>
         <a-col :span="3">
           <div>转发</div>
           <div>
             124 <span>3.2%</span>
           </div>


         </a-col>
         <a-col :span="3"></a-col>
       </a-row>
     </div>


     <div style="background: #2d2d2d;" class="p-4 rounded-md mb-5">
       <h3 class="mb-4">分时票房</h3>

     </div>

     <div style="background: #2d2d2d;" class="p-4 rounded-md mb-5">
       <a-row :gutter="40">
         <a-col :span="12">
           <h3 class="mb-4">实时预测总票房</h3>
           <a-row>
             <a-col :span="4">
               <div>总票房</div>
               <div>2301</div>
             </a-col>
             <a-col :span="4">
               <div>总点赞</div>
               <div>23</div>
             </a-col>
             <a-col :span="4">
               <div>总投币</div>
               <div>1.2万</div>
             </a-col>
             <a-col :span="4">
               <div>总收藏</div>
               <div>
                 258 <span>3.2%</span>↓
               </div>
             </a-col>
             <a-col :span="4">
               <div>总转发</div>
               <div>
                 384 <span>3.2%</span> ↑
               </div>
             </a-col>
           </a-row>
         </a-col>
         <a-col :span="12">
           <h3 class="mb-4">猜测流量池</h3>
           <a-row>
             <a-col :span="4">
               <div class="text-xl">S4</div>
             </a-col>
             <a-col :span="9">
               <div>
                 <div>
                   初级流量池：10-15万
                 </div>
                 <div>
                   预测阶段播放量：3000
                 </div>
               </div>
             </a-col>
             <a-col :span="9">
               <a-button type="primary" @click="visibleStages=true">查看参考</a-button>
               <a-drawer placement="right" v-model:visible="visibleStages">
              <pre>
1.初始流量池：200-500
2.千人流量池：3K-5K
3.万人流量池：1W-2W
4.初级流量池：10W-15W（会有人工审核介入）
5.中级流量池：30W-70W
6.高级流量池：100W-300W
7.热门流量池：500W-1200W
8.全站推荐
              </pre>
               </a-drawer>


             </a-col>

           </a-row>
         </a-col>

       </a-row>

     </div>

     <div style="background: #2d2d2d;" class="p-4 rounded-md mb-5">

       <a-row :gutter="40">
         <a-col :span="12">
           <h3 class="mb-4">作品评分</h3>
           <a-row class="text-center">
             <a-col :span="8">
               <div>作品质量度</div>
               <div class="text-xl">
                 5.6
               </div>
             </a-col>
             <a-col :span="8">
               <div>流量力度</div>
               <div class="text-xl">
                 5.6
               </div>
             </a-col>
             <a-col :span="8">
               <div>票房得分</div>
               <div class="text-xl">
                 5.6
               </div>
             </a-col>
           </a-row>
         </a-col>
         <a-col :span="12">
           <h3 class="mb-4">综合得分</h3>
           <a-row>
             <a-col :span="4">
               <div class="text-xl">5.3</div>
               <div class="text-xl">
                 c
               </div>
             </a-col>
             <a-col :span="20">
               <div>
                 <div>
                   · 点赞率低于4%，几乎没有爆款可能
                 </div>
                 <div>
                   · 首日达成播放过低， 流量池推进速度过慢
                 </div>
                 <div>
                   · 实时在看过低，需要再升级
                 </div>


               </div>
             </a-col>

           </a-row>
         </a-col>
       </a-row>

     </div>
   </div>

    </vue-custom-scrollbar>
  </div>



</template>

<script>
export default {
  name: 'Dashboard',
  data () {
    return {
      task: {
        data: {},
      },
      visibleStages:false,
      outerSettings: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
    }
  },
  mounted () {

    tableApi.watch.getTask({ nanoid: this.$route.params['nanoid'] }).then(task => {
      this.task = task
      console.log(task)
    })
  }
}
</script>

<style scoped>
.cover {
  width: 160px;
  height: 100px;
  border-radius: 6px;
}
</style>
