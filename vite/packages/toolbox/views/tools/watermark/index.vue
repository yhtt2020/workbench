<script lang="ts">
import {defineComponent} from 'vue'
import {main} from "../../../store/main";
import {mapWritableState} from "pinia";
export default defineComponent({
  name: "index",
  data(){
    return {
      originBounds:{}
    }
  },
  computed:{
    ...mapWritableState(main, ["autoHide"])
  },
  async mounted() {
    this.moveCenter()
    this.autoHide=false
  },
  async unmounted() {
    this.autoHide=true
    await tsbApi.window.setBounds({...this.originBounds})
  },
  methods:{
    async moveCenter(){
      const bounds = await tsbApi.window.getBounds()
      this.originBounds = bounds
      const newBounds={x:0,y:0,width:0,height:0}
      newBounds.width=1400
      newBounds.height=900
      newBounds.x= +(this.originBounds.x-(newBounds.width-this.originBounds.width)/2).toFixed(0)
      newBounds.y= +(this.originBounds.y-(newBounds.height-this.originBounds.height)/2).toFixed(0)

      tsbApi.window.setBounds(newBounds)
    }
  }
})
</script>

<template>
<iframe src="http://a.apps.vip/com.thisky.watermark/" style="width:100%;height:100%;border:none;border-radius: 6px;" >

</iframe>
</template>

<style scoped lang="scss">

</style>
