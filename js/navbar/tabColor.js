var webviews = require('webviews.js')
var settings = require('util/settings/settings.js')

const colorExtractorImage = document.createElement('img')
const colorExtractorCanvas = document.createElement('canvas')
const colorExtractorContext = colorExtractorCanvas.getContext('2d')

const textColorNN = require('ext/textColor/textColor.js')

const defaultColors = {
  private: ['rgb(58, 44, 99)', 'white'],
  lightMode: ['rgb(255, 255, 255)', 'black'],
  darkMode: ['rgb(32, 32, 32)', 'white']
}

function getHours () {
  const date = new Date()
  return date.getHours() + (date.getMinutes() / 60)
}

let hours = getHours()

// we cache the hours so we don't have to query every time we change the color
setInterval(function () {
  hours = getHours()
}, 5 * 60 * 1000)

function getColorFromImage (image) {
  const w = colorExtractorImage.width
  const h = colorExtractorImage.height
  colorExtractorCanvas.width = w
  colorExtractorCanvas.height = h

  const offset = Math.max(1, Math.round(0.00032 * w * h))

  colorExtractorContext.drawImage(colorExtractorImage, 0, 0, w, h)

  const data = colorExtractorContext.getImageData(0, 0, w, h).data

  const pixels = {}

  let d, add, sum

  for (let i = 0; i < data.length; i += 4 * offset) {
    d = Math.round(data[i] / 5) * 5 + ',' + Math.round(data[i + 1] / 5) * 5 + ',' + Math.round(data[i + 2] / 5) * 5

    add = 1
    sum = data[i] + data[i + 1] + data[i + 2]

    // very dark or light pixels shouldn't be counted as heavily
    if (sum < 310) {
      add = 0.35
    }

    if (sum < 50) {
      add = 0.01
    }

    if (data[i] > 210 || data[i + 1] > 210 || data[i + 2] > 210) {
      add = 0.5 - (0.0001 * sum)
    }

    if (pixels[d]) {
      pixels[d] = pixels[d] + add
    } else {
      pixels[d] = add
    }
  }

  // find the largest pixel set
  let largestPixelSet = null
  let ct = 0

  for (const k in pixels) {
    if (k === '255,255,255' || k === '0,0,0') {
      pixels[k] *= 0.05
    }
    if (pixels[k] > ct) {
      largestPixelSet = k
      ct = pixels[k]
    }
  }

  const res = largestPixelSet.split(',')

  for (let i = 0; i < res.length; i++) {
    res[i] = parseInt(res[i])
  }

  return res
}

function getColorFromString (str) {
  colorExtractorContext.clearRect(0, 0, 1, 1)
  colorExtractorContext.fillStyle = str
  colorExtractorContext.fillRect(0, 0, 1, 1)
  const rgb = Array.from(colorExtractorContext.getImageData(0, 0, 1, 1).data).slice(0, 3)

  return rgb
}

function getRGBString (c) {
  return 'rgb(' + c[0] + ',' + c[1] + ',' + c[2] + ')'
}

function getTextColor (bgColor) {
  const obj = {
    r: bgColor[0] / 255,
    g: bgColor[1] / 255,
    b: bgColor[2] / 255
  }
  const output = textColorNN(obj)
  if (output.black > 0.5) {
    return 'black'
  }
  return 'white'
}

function isLowContrast (color) {
  // is this a color that won't change very much when lightened or darkened?
  // TODO is lowContrast the best name for this?
  return color.filter(i => (i > 235 || i < 15)).length === 3
}

function adjustColorForTheme (color) {
  // dim the colors late at night or early in the morning if automatic dark mode is enabled
  const darkMode = settings.get('darkMode')
  const isAuto = ( darkMode === true || darkMode >= 0) //去除undefined

  let colorChange = 1
  if (isAuto) {
    if (hours > 20) {
      colorChange = 1.01 / (1 + 0.9 * Math.pow(Math.E, 1.5 * (hours - 22.75)))
    } else if (hours < 6.5) {
      colorChange = 1.04 / (1 + 0.9 * Math.pow(Math.E, -2 * (hours - 5)))
    }
  }

  if (window.isDarkMode) {
    colorChange = Math.min(colorChange, 0.6)
  }

  return [
    Math.round(color[0] * colorChange),
    Math.round(color[1] * colorChange),
    Math.round(color[2] * colorChange)
  ]
}

// https://stackoverflow.com/a/596243
function getLuminance (c) {
  return 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]
}

function setColor (bg, fg, isLowContrast) {
  const backgroundElements = document.getElementsByClassName('theme-background-color')
  const textElements = document.getElementsByClassName('theme-text-color')
  for (let i = 0; i < backgroundElements.length; i++) {
    backgroundElements[i].style.backgroundColor = bg
  }

  for (let i = 0; i < textElements.length; i++) {
    if(textElements[i].id==='layout-button' ){
      textElements[i].children[0].children[0].setAttribute('fill',fg)
    }
    if(textElements[i].id==='switch-task-button'){
      textElements[i].innerHTML=` <svg width="18px" height="18px" viewBox="0 0 104 104" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <g id="控件" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g id="切换任务">
              <g id="编组" fill="$color" fill-rule="nonzero">
                <path d="M4.64285714,39 C7.20710714,39 9.28571429,36.9212768 9.28571429,34.3571429 L9.28571429,22.2857143 C9.28571429,15.106 15.1061161,9.28571429 22.2857143,9.28571429 L34.3571429,9.28571429 C36.9213929,9.28571429 39,7.20699107 39,4.64285714 C39,2.07860714 36.9213929,0 34.3571429,0 L22.2857143,0 C9.97761607,0 0,9.97761607 0,22.2857143 L0,34.3571429 C0,36.9212768 2.07860714,39 4.64285714,39 Z M81.7142857,0 L69.6428571,0 C67.0786071,0 65,2.07860714 65,4.64285714 C65,7.20699107 67.0786071,9.28571429 69.6428571,9.28571429 L81.7142857,9.28571429 C88.8938839,9.28571429 94.7142857,15.106 94.7142857,22.2857143 L94.7142857,34.3571429 C94.7142857,36.9212768 96.7928929,39 99.3571429,39 C101.921393,39 104,36.9212768 104,34.3571429 L104,22.2857143 C104,9.97761607 94.0223839,0 81.7142857,0 Z M34.3571429,94.7142857 L22.2857143,94.7142857 C15.1061161,94.7142857 9.28571429,88.8938839 9.28571429,81.7142857 L9.28571429,69.6428571 C9.28571429,67.0786071 7.20710714,65 4.64285714,65 C2.07860714,65 0,67.0786071 0,69.6428571 L0,81.7142857 C0,94.0222679 9.97761607,104 22.2857143,104 L34.3571429,104 C36.9213929,104 39,101.921277 39,99.3571429 C39,96.7928929 36.9213929,94.7142857 34.3571429,94.7142857 Z M99.3571429,65 C96.7928929,65 94.7142857,67.0786071 94.7142857,69.6428571 L94.7142857,81.7142857 C94.7142857,88.8938839 88.8938839,94.7142857 81.7142857,94.7142857 L69.6428571,94.7142857 C67.0786071,94.7142857 65,96.7928929 65,99.3571429 C65,101.921277 67.0786071,104 69.6428571,104 L81.7142857,104 C94.0223839,104 104,94.0222679 104,81.7142857 L104,69.6428571 C104,67.0786071 101.921393,65 99.3571429,65 Z" id="形状"></path>
              </g>
              <line x1="36.8333333" y1="51.8333333" x2="67.1666667" y2="51.8333333" id="直线" stroke="$color" stroke-width="10" stroke-linecap="round"></line>
              <line x1="36.8333333" y1="51.8333333" x2="67.1666667" y2="51.8333333" id="直线" stroke="$color" stroke-width="10" stroke-linecap="round" transform="translate(52.000000, 51.833333) rotate(90.000000) translate(-52.000000, -51.833333) "></line>
            </g>
          </g>
        </svg>`.replaceAll('$color',fg)
    }
    textElements[i].style.color = fg
  }

  if (fg === 'white') {
    document.body.classList.add('dark-theme')
  } else {
    document.body.classList.remove('dark-theme')
  }
  if (isLowContrast) {
    document.body.classList.add('theme-background-low-contrast')
  } else {
    document.body.classList.remove('theme-background-low-contrast')
  }
}

const tabColor = {
  useSiteTheme: true,
  initialize: function () {
    webviews.bindEvent('page-favicon-updated', function (tabId, favicons) {
      tabColor.updateFromImage(favicons, tabId, function () {
        if (tabId === tabs.getSelected()) {
          tabColor.updateColors()
        }
      })
    })

    webviews.bindEvent('did-change-theme-color', function (tabId, color) {
      tabColor.updateFromThemeColor(color, tabId)
      if (tabId === tabs.getSelected()) {
        tabColor.updateColors()
      }
    })

    /*
    Reset the icon color when the page changes, so that if the new page has no icon it won't inherit the old one
    But don't actually render anything here because the new icon won't have been received yet
    and we want to go from old color > new color, rather than old color > default > new color
     */
    webviews.bindEvent('did-start-navigation', function (tabId, url, isInPlace, isMainFrame, frameProcessId, frameRoutingId) {
      if (isMainFrame) {
        tabs.update(tabId, {
          backgroundColor: {
            color: "#DFDFE3",
            isLowContrast: false,
            textColor: "black"
          },
          favicon: null
        })
      }
    })

    /*
    Always rerender once the page has finished loading
    this is needed to go back to default colors in case this page doesn't specify one
     */
    webviews.bindEvent('did-finish-load', function (tabId) {
      //tabColor.updateColors()
    })

    // theme changes can affect the tab colors
    window.addEventListener('themechange', function (e) {
      tabColor.updateColors()
    })

    settings.listen('siteTheme', function (value) {
      if (value !== undefined) {
        tabColor.useSiteTheme = value
      }
      if(tabColor.useSiteTheme){
        document.body.classList.add('use-theme')
      }else{
        document.body.classList.remove('use-theme')
      }
    })

    tasks.on('tab-selected', this.updateColors)
  },
  updateFromThemeColor: function (color, tabId) {
    if (!color) {
      tabs.update(tabId, {
        themeColor: null
      })
      return
    }

    const rgb = getColorFromString(color)
    const rgbAdjusted = adjustColorForTheme(rgb)

    tabs.update(tabId, {
      themeColor: {
        color: getRGBString(rgbAdjusted),
        textColor: getTextColor(rgbAdjusted),
        isLowContrast: isLowContrast(rgbAdjusted)
      }
    })
  },
  updateFromImage: function (favicons, tabId, callback) {
    // private tabs always use a special color, we don't need to get the icon
    if (tabs.get(tabId).private === true) {
      return
    }
    requestIdleCallback(function () {
      colorExtractorImage.onload = function (e) {
        const backgroundColor = getColorFromImage(colorExtractorImage)
        const backgroundColorAdjusted = adjustColorForTheme(backgroundColor)

        tabs.update(tabId, {
          backgroundColor: {
            color: getRGBString(backgroundColorAdjusted),
            textColor: getTextColor(backgroundColorAdjusted),
            isLowContrast: isLowContrast(backgroundColorAdjusted)
          },
          favicon: {
            url: favicons[0],
            luminance: getLuminance(backgroundColor)
          }
        })

        if (callback) {
          callback()
        }
      }
      colorExtractorImage.src = favicons[0]
    }, {
      timeout: 1000
    })
  },
  updateColors: function () {
    const tab = tabs.get(tabs.getSelected())

    // private tabs have their own color scheme
    if (tab.private) {
      return setColor(defaultColors.private[0], defaultColors.private[1])
    }

    if (tabColor.useSiteTheme) {
      // use the theme color
      if (tab.themeColor && tab.themeColor.color) {
        return setColor(tab.themeColor.color, tab.themeColor.textColor, tab.themeColor.isLowContrast)
      }

      // use the colors extracted from the page icon
      if (tab.backgroundColor && tab.backgroundColor.color) {
        return setColor(tab.backgroundColor.color, tab.backgroundColor.textColor, tab.backgroundColor.isLowContrast)
      }
    }

    // otherwise use the default colors
    if (window.isDarkMode) {
      return setColor(defaultColors.darkMode[0], defaultColors.darkMode[1])
    }
    return setColor(defaultColors.lightMode[0], defaultColors.lightMode[1])
  }
}

module.exports = tabColor
