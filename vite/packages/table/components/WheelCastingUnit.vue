<template>
  <div style="width: 50vw; margin:0 auto 12px auto;">
    <div ref="slider" class="keen-slider" style="height: 25.5em;">
      <div class="keen-slider__slide rounded-lg" v-for="item in wheelList">
        <video class="w-full h-full rounded-lg"  controls="controls"   controlslist="nodownload nofullscreen noremoteplayback noplaybackrate"
        disablePictureInPicture   playsinline="" autoplay="" muted="" loop="" v-if="item.mp4">
          <source :src="item.mp4.max" class="w-full rounded-lg" type="video/mp4" id="bgVid">
        </video>
        <img :src="item.path_full" class="w-full h-full rounded-lg object-cover"  alt="" v-else>
      </div>
    </div>
    <div class="flex mt-2">
      <button class="keen-slider__arrow mr-2 pointer rounded-md keen-slider__arrow--left s-bg" @click="prev()" style="border: none;">
         <Icon icon="xiangzuo" style="font-size: 1.5em;"></Icon>
      </button>
      <div ref="thumbnail" class="keen-slider thumbnail">
        <div class="keen-slider__slide" v-for="item in wheelList">
          <img :src="item.mp4 ? item.thumbnail : item.path_thumbnail" class="w-full h-full rounded-lg  object-cover" alt="">
        </div>
      </div>
      <button class="keen-slider__arrow ml-2  pointer rounded-md keen-slider__arrow--right s-bg" @click="next()" style="border: none;">
        <Icon icon="xiangyou" style="font-size: 1.5em;"></Icon>
      </button>
    </div>
  </div>
</template>

<script>
import "keen-slider/keen-slider.min.css"
import KeenSlider from "keen-slider"

function ThumbnailPlugin(main) {
  return (slider) => {
    function removeActive() {
      slider.slides.forEach((slide) => {
        slide.classList.remove("active")
      })
    }
    function addActive(idx) {
      slider.slides[idx].classList.add("active")
    }

    function addClickEvents() {
      slider.slides.forEach((slide, idx) => {
        slide.addEventListener("click", () => {
          main.moveToIdx(idx)
        })
      })
    }

    slider.on("created", () => {
      addActive(slider.track.details.rel)
      addClickEvents()
      main.on("animationStarted", (main) => {
        removeActive()
        const next = main.animator.targetIdx || 0
        addActive(main.track.absToRel(next))
        slider.moveToIdx(Math.min(slider.track.details.maxIdx, next))
      })
    })
  }
}

export default {
  name: "WheelCastingUnit",
  props:{
    screenshots:{
      type:Array,
      default:()=>[]
    },
    movies:{
      type:Array,
      default:()=>[]
    }
  },
  computed:{
    wheelList(){
      if(this.movies !== undefined && this.screenshots !== undefined){
        return this.screenshots.concat(this.movies)
      }
    }
  },
  mounted() {
    setTimeout(()=>{
      this.slider = new KeenSlider(this.$refs.slider)
      this.thumbnail = new KeenSlider(
       this.$refs.thumbnail,
       {
        initial: 0,
        slides: {
          perView: 4,
          spacing: 10,
        },
       },
       [ThumbnailPlugin(this.slider)]
      )
    },100)
  },
  methods:{
    prev() {
      this.slider.prev()
    },
    next(){
      this.slider.next()
    }
  },
  beforeDestroy() {
    if (this.slider) this.slider.destroy()
    if (this.thumbnail) this.thumbnail.destroy()
  },
}
</script>

<style>
[class^="number-slide"],
[class*=" number-slide"] {
  background: grey;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 50px;
  color: #fff;
  font-weight: 500;
}

.number-slide1 {
  background: rgb(64, 175, 255);
  background: linear-gradient(
    128deg,
    rgba(64, 175, 255, 1) 0%,
    rgba(63, 97, 255, 1) 100%
  );
}

.number-slide2 {
  background: rgb(255, 75, 64);
  background: linear-gradient(
    128deg,
    rgba(255, 154, 63, 1) 0%,
    rgba(255, 75, 64, 1) 100%
  );
}

.number-slide3 {
  background: rgb(182, 255, 64);
  background: linear-gradient(
    128deg,
    rgba(182, 255, 64, 1) 0%,
    rgba(63, 255, 71, 1) 100%
  );
  background: linear-gradient(
    128deg,
    rgba(189, 255, 83, 1) 0%,
    rgba(43, 250, 82, 1) 100%
  );
}

.number-slide4 {
  background: rgb(64, 255, 242);
  background: linear-gradient(
    128deg,
    rgba(64, 255, 242, 1) 0%,
    rgba(63, 188, 255, 1) 100%
  );
}

.number-slide5 {
  background: rgb(255, 64, 156);
  background: linear-gradient(
    128deg,
    rgba(255, 64, 156, 1) 0%,
    rgba(255, 63, 63, 1) 100%
  );
}

.number-slide6 {
  background: rgb(64, 76, 255);
  background: linear-gradient(
    128deg,
    rgba(64, 76, 255, 1) 0%,
    rgba(174, 63, 255, 1) 100%
  );
}

.thumbnail .keen-slider__slide {
  cursor: pointer;
}
</style>