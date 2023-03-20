<template>
  <vue-custom-scrollbar id="wall-container-paper" :settings="settingsScroller" style="height: 80vh">
    <a-row :gutter="[20,20]" id="wallImages" style="display: flex; align-items: center;">
      <a-col :span="6" v-for="img  in list" style="margin:16px;  width:301px;height: 170px;cursor: pointer;">
        <img :src="img.src" alt="" style="border-radius: 12px;height: 100%;width:301px;object-fit: cover;" data-animation="my-rotate">
      </a-col>
    </a-row>
  </vue-custom-scrollbar>
</template>

<script>
import { defineComponent, ref } from "vue";
import axios from 'axios'
import justifiedGallery from 'justifiedGallery'
export default defineComponent({
  name: "WallAcg",
  data() {
    return {
      search: {
        categories: "010",
        purity: ["SFW"],
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
    };
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
        this.getAnimeList(this.page)
      }
    })
    this.getAnimeList(this.page)
  },
  methods:{
    // 动漫数据加载
    getAnimeList(page){
      // console.log(page);
      let url = `https://wallhaven.cc/api/v1/search?&categories=${this.search.categories}&purity=${this.search.purity == 'SFW' ? '100' :'010'}&sorting=${this.search.sorting}&page=${page}`
      console.log(url);
      if(!this.isLoading){
          this.isLoading = true
          // 数据请求业务
          axios.get(url).then((res)=>{
            if(res.status === 200){
              console.log(res.data.data);
              let wallImg  = res.data.data
              let animations = ['ani-gray', 'bowen', 'ani-rotate']
              if(wallImg){
                 wallImg.forEach(img => {
                  let randomIndex = Math.floor((Math.random() * animations.length))
                  let image = {
                    title:false,
                    src:img.path,
                    animations:animations[randomIndex]
                  }
                  this.list.push(image)
                 });
                 this.$nextTick(()=>{
                    this.isLoading = false
                 })
              }
            }
          })

      }
    }
  }
});
</script>

<style lang="scss" scoped>
</style>