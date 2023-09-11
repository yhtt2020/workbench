<script lang="ts">
import {defineComponent} from 'vue'
import * as OV from 'online-3d-viewer'
export default defineComponent({
  name: "modelFile",
  props:['data'],
  mounted() {
    console.error(this.data)
    OV.SetExternalLibLocation ('../libs');

    // get the parent element of the viewer
    let parentDiv = document.getElementById ('viewer'+'_'+this.data.message.ID);

    // initialize the viewer with the parent element and some parameters
    let viewer = new OV.EmbeddedViewer (parentDiv, {
      backgroundColor:new OV.RGBAColor (0, 0, 0, 5)
    });


    viewer.LoadModelFromUrlList ([
     this.data.url
    ]);
  },
  methods:{

  }
})
</script>

<template>

  <div class="model-preview">
    <div @contextmenu.stop :id="'viewer'+'_'+data.message.ID" class="online_3d_viewer "
         style="width: 300px; height: 300px;border-radius: 4px"
         model="/model/model.stl">
    </div>
</div>

</template>

<style scoped lang="scss">
.model-preview{
  width: 300px;
  height: 300px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 10px;
}
</style>
