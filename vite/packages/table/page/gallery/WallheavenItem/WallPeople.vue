<template>
  <vue-custom-scrollbar  id="wall-container-paper" :settings="settingsScroller" style="height: 80vh">
    <viewer :images="list">
      <a-row :gutter="[20,20]" id="wallImages">
        <a-col :span="6" v-for="img  in list" style="margin:16px;  width:301px;height: 170px;cursor: pointer;position: relative;">
          <img :src="img.src" alt="" style="border-radius: 12px;height: 100%;width:301px;object-fit: cover;" data-animation="my-rotate">
          <div class="favorite-button" @click.stop="addToMy(img)" :style="{background:isInMyPapers(img)?'#009d00a8':''}">
            <Icon v-if="!isInMyPapers(img)" icon="tianjia1" style="font-size: 20px;"></Icon>
            <Icon v-else style="font-size: 20px;" icon="yiwancheng"></Icon>
          </div>
        </a-col>
      </a-row> 
     </viewer>
  </vue-custom-scrollbar>
</template>

<script>
import { defineComponent,ref } from 'vue';
import axios from 'axios';
import { mapActions,mapState  } from 'pinia'
import { paperStore } from '../../../store/paper'
import justifiedGallery from 'justifiedGallery'

export default defineComponent({
   name:'WallPeople',
   data(){
    return{
      search: {
        categories: '001',
        purity: ['SFW'],
        sorting: "date_added",
      },
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
      page:1,
      isLoading:false,
      list: [],
    }
   },
   computed:{
    ...mapState(paperStore,['myPapers']),
  },
   mounted(){
    justifiedGallery()
    $('#wall-img-container').justifiedGallery({
      captions: false,
      lastRow: 'hide',
      rowHeight: 180,
      margins: 5
    })
    $('#wall-container-paper').scroll(()=>{
      if($('#wall-container-paper').scrollTop() + $('#wall-container-paper').height() + 20 >= $('#wallImages').prop('scrollHeight') && this.isLoading === false){
        this.page = this.page + 1
        this.getPeopleList(this.page)
      }
    })
    this.getPeopleList(this.page)
   },
   methods:{
    ...mapActions(paperStore,['addToMyPaper']),
    getPeopleList(page){
      let url = `https://wallhaven.cc/api/v1/search?&categories=${this.search.categories}&purity=${this.search.purity == 'SFW' ? '100' :'010'}&sorting=${this.search.sorting}&page=${page}`
      // console.log(url);
      if(!this.isLoading){
       this.isLoading = true
       axios.get(url,{timeout:5000}).then((res)=>{
        if(res.status === 200){
          // console.log(res.data.data);
          let wallImg  = res.data.data
          let animations = ['ani-gray', 'bowen', 'ani-rotate']
          if(wallImg){
            wallImg.forEach(img => {
             let randomIndex = Math.floor((Math.random() * animations.length))
             console.log();
             let image = {
              title:false,
              src:img.thumbs.large,
              animations:animations[randomIndex]
             }
             this.list.push(image)
            });
            this.$nextTick(()=>{
              this.isLoading = false
            })
          }
        }
       }).catch(err=>{
        if(err.code === '403'){
          console.log(err);
        }
        })
      }
    },
    // 添加收藏
    addToMy(img){
      this.addToMyPaper(img)
    },
    isInMyPapers(image){
      return this.myPapers.findIndex(img=>{
      return image.src===img.src
      })>-1
    }
   }
})
</script>

<style lang="scss" scoped>
.favorite-button{
  width: 40px;
  height: 40px;
  background: rgba(33, 33, 33, 0.65);
  position: absolute;
  top: 0;
  right:-25px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top-right-radius: 12px;
  border-bottom-left-radius: 6px;
  cursor: pointer;
}
</style>