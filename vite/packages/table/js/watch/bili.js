const bili={
  guessStage (view) {
    /**
     * 1.初始流量池：200-500
     * 2.千人流量池：3K-5K
     * 3.万人流量池：1W-2W
     * 4.初级流量池：10W-15W（会有人工审核介入）
     * 5.中级流量池：30W-70W
     * 6.高级流量池：100W-300W
     * 7.热门流量池：500W-1200W
     * 8.全站推荐
     */

    const stages = [
      {
        name: '初始',
        show: [200, 500],
        bg:'grey'

      }, {
        name: '千人',
        show: [3000, 5000],
        bg:'#2a32c7'
      },
      {
        name: '万人',
        show: [10000, 20000],
        bg:'#23b92f'
      }, {
        name: '初级',
        show: [100000, 150000],
        bg:'#ffad34'
      },
      {
        name: '中级',
        show: [300000, 700000],
        bg:'#ef7f24'
      },
      {
        name: '高级',
        show: [1000000, 3000000],
        bg:'#a22e13'
      },
      {
        name: '热门',
        show: [5000000, 12000000],
        bg:'#c73737'
      }, {
        name: '全站推荐',
        show: [13000000, 250000000],
        bg:'#fc1818'
      }
    ]
    let currentStage = stages[0]
    for (let i = 0; i < stages.length; i++) {
      // {
      //   name: '初始',
      //     show: [200, 500]
      // },
      let stage = stages[i]
      stage.view= ((stage.show[0]+stage.show[1])/2*0.1).toFixed(0) //(最小+最大)/2*5%
      if (view *10> stage.show[1]) {
        //疑似进入下一个池子，可继续循环
        continue
      } else if (view *10< stage.show[0]) {
        //还未到达这个池子最小的要求，认为还在此池子
        currentStage = {no:i+1,data: stage, condition: 'pre' }
        break
      } else {
        currentStage = { no:i+1,data:stage, condition: 'in' }
        break
      }
    }
    return currentStage
  },
  formatWan(num){
    let str=String(num)
    if(str.endsWith('0000')){
      return str.substring(0,str.length-4)+'万'
    }else{
      return Number(str).toLocaleString()
    }
  }
}

export default bili
