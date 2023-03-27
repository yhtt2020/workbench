<template>
  <viewer :images="list">
    <a-row :gutter="[20,20]" id="bingImages" style="margin-right: 1em">
      <a-col class="image-wrapper " v-for="img in list" :span="6" style="">
        <img  class="image-item pointer" :src="img.src" style="position: relative">
        <div style="position: absolute;right: 0;top: -10px ;padding: 10px">
          <div @click.stop="addToMy(img)" class="bottom-actions pointer" :style="{background:isInMyPapers(img)?'#009d00a8':''}">
            <Icon v-if="!isInMyPapers(img)" icon="tianjia1"></Icon>
            <Icon v-else style="" icon="yiwancheng"></Icon>
          </div>
        </div>
      </a-col>
    </a-row>
  </viewer>
</template>

<script>
import { mapActions,mapState  } from 'pinia'
import { appStore} from '../../store'
import { paperStore } from '../../store/paper'

export default {
  name: 'PaperList',
  props:['list'],

  mounted () {
  },
  methods:{
    ...mapActions(paperStore,['removeToMyPaper']),
    addToMy(img){
      this.removeToMyPaper(img)
    },
    isInMyPapers(image){
      return this.myPapers.findIndex(img=>{
        return image.src===img.src
      })>-1
    }
  },
  computed:{
    ...mapState(paperStore,['myPapers']),

    // ...mapState(appStore,[
    //   {
    //     'papers':'appData.wallpapers.myPapers'
    //   }
    // ])
  }
}
</script>

<style  lang="scss">
.bottom-actions {
  color: rgb(234, 234, 234);
  font-size: 1.2em;
  width: 2em;

  height: 2em;
  line-height: 2em;
  background: rgba(0, 0, 0, 0.42);
  border-radius: 0px 6px 0px 6px;
}
.image-item {
  object-fit: cover;
  width: 100%;
  border-radius: 6px;
}
.viewer-toolbar > ul{
li{
  margin-right: 10px;
  margin-left: 10px;
}
zoom: 1.6;
}

</style>
