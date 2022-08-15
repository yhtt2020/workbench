### 一、引入
#### 主进程中:
- 无需引入，直接使用`statsh.do()`调用记录
#### 渲染进程中：
- `require`的路径为`util/statsh/statsh.js`
- 使用`statsh.do()`调用记录

### 二、使用方法
###### 参数: 1、必填【action: String】埋点行为  包含增加和设置两种行为: 'increase' | 'set'
###### 参数: 2、必填【key: String】埋点数据的键名 
###### 参数: 3、必填【value: String | Boolean | Number】埋点数据的值
###### 返回: 无

```javascript
  //举例
  statsh.do({
    action: 'set',
    key: 'blockAds',
    value: 12
  })
```
