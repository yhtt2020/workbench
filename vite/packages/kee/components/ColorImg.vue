<template>
 <span :style="{width:width,height:height}"   class="img" style="overflow: hidden;position:relative;display: inline-block">
           <img :style="getStyle"
                :src="src" alt="">
</span>
</template>

<script>
export default {
  name: 'ColorImg',
  props: ['color', 'src', 'width', 'height'],
  computed:{
    getStyle(){
      let imgColor='black'
      if(this.color===''){
        imgColor= 'black'
      }else{
        imgColor=this.color
      }
      const style= `filter: drop-shadow(${this.width}px 0px 0px ${imgColor});left: -${this.width}px; width:${this.width}px; position:relative;`
      return style
    }
  }
}
</script>

<style scoped>
.img {

}
</style>
