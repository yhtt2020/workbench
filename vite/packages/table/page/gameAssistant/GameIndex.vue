<template>
  <div style="width: 60vw">
    <div ref="container" class="keen-slider">
      <div class="keen-slider__slide number-slide1">
        <img src="/img/test/2.jpg" class="w-full h-full object-cover"  alt="">
      </div>
      <div class="keen-slider__slide number-slide2">
        <video class="" playsinline="" autoplay="" muted="" loop="" >
          <source src="/img/test/video/video1.webm" type="video/mp4" id="bgVid">
        </video>
      </div>
      <div class="keen-slider__slide number-slide3">3</div>
      <div class="keen-slider__slide number-slide4">4</div>
      <div class="keen-slider__slide number-slide5">5</div>
      <div class="keen-slider__slide number-slide6">6</div>
    </div>
    <div>
      <div ref="thumbnail" class="keen-slider thumbnail">
        <button class="keen-slider__arrow keen-slider__arrow--left" @click="prev()">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M15.41 7.41L14 6l-6 6 6 6 1.411.41L10.83 12z"/></svg>
        </button>
        <div class="keen-slider__slide number-slide1">
          <img src="/img/test/2.jpg" class="w-full h-full  object-cover"  alt="">
        </div>
        <div class="keen-slider__slide number-slide2">
          <video class="" playsinline="" autoplay="" muted="" loop="" >
            <source src="/img/test/video/video1.webm" type="video/mp4" id="bgVid">
          </video>
        </div>
        <div class="keen-slider__slide number-slide3">3</div>
        <div class="keen-slider__slide number-slide4">4</div>
        <div class="keen-slider__slide number-slide5">5</div>
        <div class="keen-slider__slide number-slide6">6</div>
        <button class="keen-slider__arrow keen-slider__arrow--right" @click="next()">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/></svg>
        </button>
      </div>
    </div>

  </div>
  <div class="s-bg p-5 rounded-xl m-3" style="width: 95%;height: 100%">
    欢迎来到大型施工现场。本工地正在进行地基施工。请带好安全帽，注意脚下和头顶安全。
  </div>
</template>

<script>

import { useKeenSlider } from "keen-slider/vue.es"
import "keen-slider/keen-slider.min.css"

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
          main.value.moveToIdx(idx)
        })
      })
    }

    slider.on("created", () => {
      addActive(slider.track.details.rel)
      addClickEvents()
      main.value.on("animationStarted", () => {
        removeActive()
        const next = main.value.animator.targetIdx || 0
        addActive(main.value.track.absToRel(next))
        slider.moveToIdx(Math.min(slider.track.details.maxIdx, next))
      })
    })
  }
}

export default {
  setup() {
    const [container, slider] = useKeenSlider()
    const [thumbnail] = useKeenSlider(
      {
        initial: 0,
        slides: {
          perView: 4,
          spacing: 10,
        },
      },
      [ThumbnailPlugin(slider)]
    )
    function prev() {
      slider.value.prev();
    }

    function next() {
      slider.value.next();
    }

    return { container, thumbnail,prev, next, }
  },
}
</script>

<style scoped>
[class^="number-slide"],
[class*=" number-slide"] {
  background: grey;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 50px;
  color: #fff;
  font-weight: 500;
  height: 200px;
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
  font-size: 30px;
  margin-top: 10px;
  height: 100px;
}
.thumbnail .keen-slider__slide {
  cursor: pointer;
}
.thumbnail .keen-slider__slide.active {
  border: 2px dashed black;
}
.keen-slider__arrow {
  background-color: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  margin: 0;
}

.keen-slider__arrow--left {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  z-index: 999;
}

.keen-slider__arrow--right {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  z-index:999;
}
</style>
