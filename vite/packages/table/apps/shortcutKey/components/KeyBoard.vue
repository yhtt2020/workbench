<template>
  <div class="prompt-modal xt-mask">
    <div class="xt-modal box">
      <div class="box-head">
        <div class="title">选择需要的组合健</div>
        <div @click="onBack" class="head-icon xt-text">
          <Icon icon="guanbi" style="font-size: 1.5em;"></Icon>
        </div>
      </div>
      <div class="box-body">
        <div class="box-left">
          <div>
            <span class="title">修饰键1</span>
            <div class="key-box mt-6">
              <div v-for="(item, index) in modifierKeyOne"
                   :key="item"
                   :style="{backgroundColor:item.color}"
                   :class="[item.checked ? 'xt-active-btn':'', item.isGray ? 'text-gray':'']"
                   @click="onKeyDown(item, index, 'modifierKeyOne')"
                   class="key-item">
                {{ item.key }}
              </div>
            </div>
          </div>
          <div class="mt-10">
            <div class="box-foot action-panel"   >
              <div class="line-title text-center ">按键确认</div>
              <div class="active">

                <div v-for="(item, index) in keyContent.keyArr" class="flex items-center" :key="item">
                  <!-- :style="item.field === 'keyList[0]' || item.field === 'keyList[1]' ? 'width:44px' : 'padding:0 10px;'" -->
                  <div class="key-item" style="min-width:44px;padding:0 10px;">{{ item.key }}</div>
                  <span class="mx-3" v-if="keyContent.keyArr.length != (index + 1)">+</span>
                </div>
              </div>
              <div class="btn-box">
                <xt-button type="theme" style="width:100%"   @click="confirm">确定</xt-button>
              </div>
            </div>
          </div>
        </div>
        <div class="box-right">
          <div class="title mb-1">快捷键</div>
          <div class="key-box ">
            <div v-for="(item, index) in keyList[0]"
                 :key="item"
                 :class="item.checked ? 'xt-active-btn':'' "
                 @click="onKeyDown(item, index, 'keyList[0]')"
                 class="key-item w-11">
              {{ item.key }}
            </div>
          </div>
          <div class="title mb-1">字母</div>
          <div class="key-box ">
            <div v-for="(item, index) in keyList[1]"
                 :key="item"
                 :class="item.checked ? 'xt-active-btn':'' "
                 @click="onKeyDown(item, index, 'keyList[1]')"
                 class="key-item w-11">
              {{ item.key }}
            </div>
          </div>
          <div class="key-box">
            <div v-for="(item, index) in keyList[2]"
                 :key="item"
                 :class="item.checked ? 'xt-active-btn':'' "
                 @click="onKeyDown(item, index, 'keyList[2]')"
                 class="key-item px-3">
              {{ item.key }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { message } from 'ant-design-vue'
import XtButton from '../../../ui/libs/Button/index.vue'

export default {
  name: 'KeyBoard',
  components: { XtButton },
  props: {
    //需要修改的内容
    selectKey: {
      type: Object,
      defalut: () => {}
    },
    parentKeyList: {
      type: Array,
      defalut: () => []
    }
  },
  data () {
    return {
      modifierKeyOne: [
        {
          key: 'Ctrl',
          color:'rgb(255, 108, 97)',
          checked: false,
          isGray: false,
        },
        {
          key: 'Tab',
          color:'rgb(80, 139, 254)',
          checked: false,
          isGray: false,
        },
        {
          key: 'Shift',
          color:'rgb(251, 114, 153)',
          checked: false,
          isGray: false,
        },
        {
          key: 'Space',
          checked: false,
          isGray: false,
        },


        {
          key: 'Win',
          checked: false,
          isGray: false,
        },
        {
          key: 'Fn',
          checked: false,
          isGray: false,
        },
        {
          key: 'Alt',
          checked: false,
          isGray: false,
        }
      ],
      modifierKeyTwo: [
        {
          key: 'Ctrl',
          checked: false,
          color:'red',
          isGray: false,
        },
        {
          key: 'Alt',
          checked: false,
          color:'orange',
          isGray: false,
        },
        {
          color:'blue',
          key: 'Shift',
          checked: false,
          isGray: false,
        },

        {
          key: 'Space',
          checked: false,
          isGray: false,
        },

        {
          key: 'Tab',
          checked: false,
          isGray: false,
        },
        {
          key: 'Win',
          checked: false,
          isGray: false,
        },
        {
          key: 'Fn',
          checked: false,
          isGray: false,
        },

      ],
      keyList: [
        [
          {
            key: 'ESC',
            checked: false,
          },
          {
            key: 'F1',
            checked: false,
          },
          {
            key: 'F2',
            checked: false,
          },
          {
            key: 'F3',
            checked: false,
          },
          {
            key: 'F4',
            checked: false,
          },
          {
            key: 'F5',
            checked: false,
          },
          {
            key: 'F6',
            checked: false,
          },
          {
            key: 'F7',
            checked: false,
          },
          {
            key: 'F8',
            checked: false,
          },
          {
            key: 'F9',
            checked: false,
          },
          {
            key: 'F10',
            checked: false,
          },
          {
            key: 'F11',
            checked: false,
          },
          {
            key: 'F12',
            checked: false,
          },
          {
            key: '1',
            checked: false,
          },
          {
            key: '2',
            checked: false,
          }, {
          key: '3',
          checked: false,
        },
          {
            key: '4',
            checked: false,
          },
          {
            key: '5',
            checked: false,
          },
          {
            key: '6',
            checked: false,
          },
          {
            key: '7',
            checked: false,
          },
          {
            key: '8',
            checked: false,
          },
          {
            key: '9',
            checked: false,
          }, {
          key: '0',
          checked: false,
        },
          {
            key: 'Home',
            checked: false,
          },
          {
            key: 'End',
            checked: false,
          },
          {
            key: 'PgUp',
            checked: false,
          },
          {
            key: 'PgDn',
            checked: false,
          },
          {
            key: 'Pause',
            checked: false,
          },
          {
            key: 'Insert',
            checked: false,
          },
          {
            key: 'Del',
            checked: false,
          },
          {
            key: 'PrtSc',
            checked: false,
          },
          {
            key: 'NLock',
            checked: false,
          },
          {
            key: 'CLock',
            checked: false,
          },
          {
            key: 'Left',
            checked: false,
          },
          {
            key: 'Up',
            checked: false,
          },
          {
            key: 'Right',
            checked: false,
          },
          {
            key: 'Down',
            checked: false,
          },
          {
            key: 'Fn',
            checked: false,
          },
          {
            key: 'Back',
            checked: false,
          },
          {
            key: 'Enter',
            checked: false,
          }
        ],
        [
          {
            key: 'A',
            checked: false,
          },
          {
            key: 'B',
            checked: false,
          },
          {
            key: 'C',
            checked: false,
          },
          {
            key: 'D',
            checked: false,
          },
          {
            key: 'E',
            checked: false,
          },
          {
            key: 'F',
            checked: false,
          },
          {
            key: 'G',
            checked: false,
          },
          {
            key: 'H',
            checked: false,
          },
          {
            key: 'I',
            checked: false,
          },
          {
            key: 'J',
            checked: false,
          },
          {
            key: 'K',
            checked: false,
          },
          {
            key: 'L',
            checked: false,
          },
          {
            key: 'M',
            checked: false,
          },
          {
            key: 'N',
            checked: false,
          }, {
          key: 'O',
          checked: false,
        },
          {
            key: 'P',
            checked: false,
          },
          {
            key: 'Q',
            checked: false,
          },
          {
            key: 'R',
            checked: false,
          },
          {
            key: 'S',
            checked: false,
          },
          {
            key: 'T',
            checked: false,
          },
          {
            key: 'U',
            checked: false,
          }, {
          key: 'V',
          checked: false,
        },
          {
            key: 'W',
            checked: false,
          },
          {
            key: 'X',
            checked: false,
          },
          {
            key: 'Y',
            checked: false,
          },
          {
            key: 'Z',
            checked: false,
          },
        ],
        [

          {
            key: '[',
            checked: false,
          },
          {
            key: ']',
            checked: false,
          },
          {
            key: '\\',
            checked: false,
          },
          {
            key: ';',
            checked: false,
          },
          {
            key: '‘',
            checked: false,
          },
          {
            key: ',',
            checked: false,
          }, {
          key: '.',
          checked: false,
        },
          {
            key: '/',
            checked: false,
          },
          {
            key: '-',
            checked: false,
          },
          {
            key: '+',
            checked: false,
          },
          {
            key: '=',
            checked: false,
          },
        ],
        [
          {
            key: 'Up',
            checked: false,
          },
          {
            key: 'Down',
            checked: false,
          },
          {
            key: 'Left',
            checked: false,
          },
          {
            key: 'Right',
            checked: false,
          },
          {
            key: 'Back',
            checked: false,
          },
        ]
      ],
      //当前修改的键
      keyContent: {}
    }
  },
  mounted () {
    this.keyContent = this.deepClone(this.selectKey, this.keyContent)
    this.keyContent.keyArr.forEach(item => {
      this.isKeyChecked(item.field, item.index, true)
    })
  },
  methods: {
    //深拷贝
    deepClone (obj, newObj) {
      var newObj = newObj || {}
      for (let key in obj) {
        if (typeof obj[key] == 'object') {
          newObj[key] = (obj[key].constructor === Array) ? [] : {}
          this.deepClone(obj[key], newObj[key])
        } else {
          newObj[key] = obj[key]
        }
      }
      return newObj
    },
    // 取消
    onBack () {
      this.keyContent = []
      this.$emit('closeKeyBoard')
    },
    // 确定
    confirm () {
      // if(!this.keyContent.keyArr.length) return message.info('不能为空')
      if (!this.keyContent.keyArr.length) {
        this.keyContent.keyStr = '?'
        this.keyContent.keys.splice(0, this.keyContent.keys.length, '?')
        this.$emit('saveKey', this.keyContent)
        this.$emit('closeKeyBoard')
        return
      }
      let keys = []
      this.keyContent.keyArr.map(item => {
        keys.push(item.key)
      })

      this.keyContent.keys = keys
      this.keyContent.keyStr = keys.join(' + ')

      // 判断组合键是否重复
      let arr = this.keyContent.keys
      let retArr = this.parentKeyList.find(item => {
        return item.keys?.length === arr.length && item.keys?.slice().sort().toString() === arr.slice().sort().toString()
      })
      if (retArr && retArr.id !== this.keyContent.id && false) return message.info('组合键重复')//取消重复判断
      this.$emit('saveKey', this.keyContent)
      this.$emit('closeKeyBoard')

    },
    // 按键
    onKeyDown (item, index, field) {
      let flag = false // 阻止触发改变数据操作
      let isChecked = true

      //置灰不能点击
      if (item.isGray) {
        return
      }

      const hasKeyIndex = this.keyContent.keyArr.findIndex(data => {
        return item.key == data.key
      })

      //选择数不能大于三
      flag = this.keyContent.keyArr.length >= 4
      // 再次点击选择的【取消选择】
      if (hasKeyIndex != -1) {
        flag = false
      }

      if (flag) {
        message.info('最多选择4个快捷按钮')
        return
      }

      let keyItem = {
        field,
        index,
        key: item.key
      }
      // 移除已存在
      if (hasKeyIndex != -1) {
        isChecked = false
        this.isKeyChecked(
          this.keyContent.keyArr[hasKeyIndex].field,
          this.keyContent.keyArr[hasKeyIndex].index,
          isChecked
        )
        this.keyContent.keyArr.splice(hasKeyIndex, 1)
      } else {
        this.keyContent.keyArr.push(keyItem)
        isChecked = true
        this.isKeyChecked(field, index, isChecked)
      }
    },
    // 设置是否选中
    isKeyChecked (field, index, isChecked) {
      switch (field) {
        case 'modifierKeyOne':
          this.modifierKeyOne[index].checked = isChecked
          this.modifierKeyTwo[index].isGray = isChecked
          break
        case 'modifierKeyTwo':
          this.modifierKeyTwo[index].checked = isChecked
          this.modifierKeyOne[index].isGray = isChecked
          break
        case 'keyList[0]':
          this.keyList[0][index].checked = isChecked
          break
        case 'keyList[1]':
          this.keyList[1][index].checked = isChecked
          break
        case 'keyList[2]':
          this.keyList[2][index].checked = isChecked
          break
      }
    }
  },
}
</script>
<style lang="scss" scoped>
.prompt-modal {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 111;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.box {
  // width: 74%;
  width: 950px;
  height: 634px;
  overflow: auto;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

  .box-head {
    height: 85px;
    line-height: 50px;

    .head-icon {
      cursor: pointer;
      height: 48px;
      width: 48px;
      display: flex;
      align-items: center;
      border-radius: 12px;
      justify-content: center;
      margin-right: 12px;
      position: absolute;
      background: var(--secondary-bg);
      top: 12px;
      right: 18px;
    }
  }

  .box-body {
    width: 92%;
    display: flex;
    justify-content: space-between;

    .box-left {
      width: 30%;
    }

    .key-box {
      display: flex;
      flex-wrap: wrap;
      color: var(--primary-text);

      .key-item {
        background: var(--secondary-bg);
        border-radius: 8px;
        height: 44px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 12px 12px 0;
        padding: 0 10px;
        min-width: 44px;
      }

      .text-gray {
        opacity: 0.3;
      }
    }

    .box-right {
      width: 66%;
    }
  }

  .box-foot {
    width: 100%;
    font-size: 16px;
    margin: 12px 0;
    color: var(--primary-text);

    .active {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 48px;

      .key-item {
        background: var(--active-bg);
        color: var(--active-text);
        border-radius: 8px;
        height: 44px;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: justify;
        text-align-last: justify;
      }
    }

    .btn-box {
      display: flex;
      justify-content: center;
      margin-top: 24px;

      > div {
        background: var(--secondary-bg);
        border-radius: 12px;
        width: 120px;
        height: 48px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }

  .title {
    font-size: 16px;
    color: var(--primary-text);
  }
}

.box::-webkit-scrollbar {
  display: none;
}
.action-panel{
  padding:20px;
  border-radius: 8px;
  border:1px solid var(--active-bg);background-color:var(--secondary-bg)
}
</style>
