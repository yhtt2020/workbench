
export const CPUOption = {
  title: {
    text: ''
  },
  backgroundColor:'transparent',
  legend: {
    data: ['normal'],
  },
  grid:{ // 让图表占满容器
    top:"0px",
    left:"0px",
    right:"0px",
    bottom:"0px"
  },
  xAxis: [
    {
      type: 'category',
      boundaryGap: false,
      data: []
    }
  ],
  yAxis: [
    {
      type: 'value',
      show:false
    },

  ],
  series: [
    {
      name: 'Email',
      type: 'line',
      stack: 'Total',
      emphasis: {
        focus: 'series'
      },
      data: [1,2,3],
      itemStyle : {
        normal : {
          color:'#1890FF'
        },

      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [  // 渐变颜色
            {
              offset: 0,
              color: '#404D61',
            },
            {
              offset: 1,
              color: '#404D61',
            },
          ],
          global: false,
        },
      },
    },
  ]
}
export const GPUOption = {
  title: {
    text: ''
  },
  backgroundColor:'transparent',
  legend: {
    data: ['normal'],
  },
  grid:{ // 让图表占满容器
    top:"0px",
    left:"0px",
    right:"0px",
    bottom:"0px"
  },
  xAxis: [
    {
      type: 'category',
      boundaryGap: false,
      data: []
    }
  ],
  yAxis: [
    {
      type: 'value',
      show:false
    },

  ],
  series: [
    {
      name: 'Email',
      type: 'line',
      stack: 'Total',
      emphasis: {
        focus: 'series'
      },
      data: [120, 120, 101, 120, 90, 90, 90],
      itemStyle : {
        normal : {
          color:'#1890FF'
        },

      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [  // 渐变颜色
            {
              offset: 0,
              color: '#404D61',
            },
            {
              offset: 1,
              color: '#404D61',
            },
          ],
          global: false,
        },
      },
    },
  ]
}
export const FPSOption = {
  title: {
    text: ''
  },
  backgroundColor:'transparent',
  legend: {
    data: ['normal'],
  },
  grid:{ // 让图表占满容器
    top:"0px",
    left:"0px",
    right:"0px",
    bottom:"0px"
  },
  xAxis: [
    {
      type: 'category',
      boundaryGap: false,
      data: []
    }
  ],
  yAxis: [
    {
      type: 'value',
      show:false
    },

  ],
  series: [
    {
      name: 'Email',
      type: 'line',
      stack: 'Total',
      emphasis: {
        focus: 'series'
      },
      data: [1,2,3],
      itemStyle : {
        normal : {
          color:'#1890FF'
        },

      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [  // 渐变颜色
            {
              offset: 0,
              color: '#404D61',
            },
            {
              offset: 1,
              color: '#404D61',
            },
          ],
          global: false,
        },
      },
    },
  ]
}
