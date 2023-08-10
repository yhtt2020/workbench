<template>
  <div id="app" v-cloak>
    <div class="box">
  		<div class="prize-list" ref="prizeWrap" :style="bgColor">
  			<div class="prize-item" v-for="(item, index) in prizeList" :style="prizeStyle(index)">
  				<p>{{ item.name }}</p>
  			</div>
  		</div>
      <div class="box-btn" style="z-index:9;" @click="start">GO</div>
    </div>
	</div>
</template>

<script>
import { createApp, onMounted, onUnmounted, ref, reactive, toRefs, computed, nextTick } from 'vue';
export default {
  setup () {
	  		const state = reactive({
		      prizeList: [
	        	{ name: '手机'},
	        	{ name: '手表' },
	        	{ name: '苹果'},
	        	{ name: '棒棒糖' },
	        	{ name: '娃娃'},
	        	{ name: '木马'},
	        	{ name: '德芙'},
	        	{ name: '玫瑰'}
	        ], // 后台配置的奖品数据
	        isRunning: false, // 是否正在抽奖
	        baseRunAngle: 360 * 5, // 总共转动角度 至少5圈
	        prizeId: 0, // 中奖id
	  		})
        const prizeWrap = ref(null)


        // 平均每个奖品角度
        const rotateAngle = computed(() => {
          const _degree = 360 / state.prizeList.length
          return _degree
        })

        // 要执行总角度数
        const totalRunAngle = computed(() => {
        	return state.baseRunAngle + 360 - state.prizeId * rotateAngle.value - rotateAngle.value / 2
        })

        // 计算绘制转盘背景
        const bgColor = computed(() => {
          const _len = state.prizeList.length
          const colorList = ['#5352b3', '#363589']
          let colorVal = ''
          for (let i = 0; i < _len; i++) {
            colorVal += `${colorList[i % 2]} ${rotateAngle.value * i}deg ${rotateAngle.value * (i + 1)}deg,`
          }
          return `
            background: conic-gradient(${colorVal.slice(0, -1)});
          `
        })
        // 每个奖品布局
        const prizeStyle = computed(() => {
          const _degree = rotateAngle.value
          return (i) => {
            return `
              width: ${2 * 130 * Math.sin(_degree / 2 * Math.PI / 180)}px;
              height: 130px;
              transform: rotate(${_degree * i + _degree / 2}deg);
              transform-origin: 50% 100%;
            `
          }
        })

        onMounted(() => {
          prizeWrap.value.style = `${bgColor.value} transform: rotate(-${rotateAngle.value / 2}deg)`
        })

        onUnmounted(() => {
          prizeWrap.value?.removeEventListener('transitionend', stopRun)
        })

        // 获取随机数
        const getRandomNum = () => {
        	const num = Math.floor(Math.random() * state.prizeList.length)
      		return num    		
        }

        const start = () => {
        	if (!state.isRunning) {
        		state.isRunning = true

        		// 请求返回的奖品编号 这里使用随机数
        		const prizeId = getRandomNum()
        		// console.log('选中', prizeId, state.prizeList[prizeId])
        		state.prizeId = prizeId
        		startRun()
        	}
        }

        const startRun = () => {
          // console.log(state.isRunning, totalRunAngle.value)
          // 设置动效
          prizeWrap.value.style = `
            ${bgColor.value}
            transform: rotate(${totalRunAngle.value}deg);
            transition: all 4s ease;
          `
          // 监听transition动效停止事件
          prizeWrap.value.addEventListener('transitionend', stopRun)
        }

        const stopRun = (e) => {
          console.log(e)
          state.isRunning = false
        	prizeWrap.value.style = `
            ${bgColor.value}
            transform: rotate(${totalRunAngle.value - state.baseRunAngle}deg);
          `
        }

        return {
        	...toRefs(state),
          bgColor,
          prizeStyle,
          prizeWrap,
        	start
        }
	  	}
}
</script>
<style scoped lang="scss">
		* {  margin: 0; padding: 0; box-sizing: border-box; }
		[v-cloak] {
			display: none;
		}
		.box {
      margin: 50px auto 0;
			width: 240px;
			height: 240px;
      position: relative;
		}
    .prize-list {
      width: 100%;
      height: 100%;
      border-radius: 50%;
			// border: 10px solid #98d3fc;
      overflow: hidden;
    }
		.prize-item {
			/*border: 2px solid red;*/
			position: absolute;
      left: 0;
      right: 0;
      top: -10px;
      margin: auto;
      color: var(--primary-text);
      font-size: 14px;
		}
		.prize-item img {
			width: 30%;
			height: 20%;
      margin: 40px auto 10px;
      display: block;
		}
		.prize-item p {
			color: #fff;
			text-align: center;
			line-height: 20px;
      margin: 35px 0;
      letter-spacing: 2px;
      transform:rotate(-90deg);
		}
    .box-btn {
      width: 50px;
      height: 50px;
      line-height: 50px;
      border-radius: 50%;
      background:var(--active-bg);
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
      cursor: pointer;
      font-size: 20px;
      color: var(--primary-text);
      text-align: center;
      font-weight: 700;
    }
    .box-btn::before{
      content: "";
      position: absolute;
      left: 16px;
      right: 0;
      top: -20px;
      width: 0;
      height: 0;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-bottom: 24px solid var(--active-bg);
    }
	</style>