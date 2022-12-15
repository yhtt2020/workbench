# group-cache-nodejs

简单的内存缓存实现，实现 group 概念，
/\*\*

-
- 简单的内存缓存实现，实现 group 概念，
- 一个 group 里面是个有序的集合，
- 集合支持 key-value expire 弥补 redis list 的不足
- 支持语言:JavaScript、Node.js
- Java 版:https://github.com/newpanjing/group-cache
- 调用说明:
- 所有的方法都是同步方法,在 nodejs 使用也一样。
-
- node.js 调用:
- var factory = require("../core/GroupCacheFactory");
-
- 浏览器端 js 调用:
- 直接在页面中引入 GroupCacheFactory.js 即可,
- 需要去掉 GroupCacheFactory.js 中最后一行 exports.group=group;
  \*/

var factory = require("../core/GroupCacheFactory");

var group = factory.group("abc");

//缓存 key,并且设置过期时间
group.push("a", "asdsad", 10);

//缓存一个对象,永久有效
group.push("b", {
a: "张三",
b: "李四",
area: "china"
});

//缓存一个 int 类型的值,过期时间为 20 秒
group.push("c", 123, 20);

//获取所有的 key
console.log(group.getKeys());

//获取所有的 value
console.log(group.getValues());

//通过 key 获取 value
console.log(group.getValue("b"));

group.push("d", "231");
//删除 key
group.delete("d");

//查看 key 剩余时间
console.log("a 的剩余时间:" + group.ttl("a"));

//取出一个对象
//group.poll(); 先进先出原则

//取出并放置末尾
//group.rPoll();

//获取第一项元素的值
console.log("第一项元素的值:" + group.peek());

//设置指定对象的失效时间,把 a 的时间重设为 15 秒
group.expire("a", 15);

//查看 key 是否存在
console.log("b 是否存在:" + group.exist("b"));

//判断 group 是否为空
console.log("group 为空吗? " + group.isEmpty());

//获取 group 的大小
console.log("group 数量:" + group.size())

//查看 key 剩余时间
setInterval(function () {
console.log("a 剩余时间:" + group.ttl("a"));
console.log("b 剩余时间:" + group.ttl("b"));
console.log(group.getKeys());
}, 1000,1);# group-cache-nodejs
简单的内存缓存实现，实现 group 概念，
/\*\*

-
- 简单的内存缓存实现，实现 group 概念，
- 一个 group 里面是个有序的集合，
- 集合支持 key-value expire 弥补 redis list 的不足
- 支持语言:JavaScript、Node.js
- Java 版:https://github.com/newpanjing/group-cache
- 调用说明:
- 所有的方法都是同步方法,在 nodejs 使用也一样。
-
- node.js 调用:
- var factory = require("../core/GroupCacheFactory");
-
- 浏览器端 js 调用:
- 直接在页面中引入 GroupCacheFactory.js 即可,
- 需要去掉 GroupCacheFactory.js 中最后一行 exports.group=group;
  \*/

var factory = require("../core/GroupCacheFactory");

var group = factory.group("abc");

//缓存 key,并且设置过期时间
group.push("a", "asdsad", 10);

//缓存一个对象,永久有效
group.push("b", {
a: "张三",
b: "李四",
area: "china"
});

//缓存一个 int 类型的值,过期时间为 20 秒
group.push("c", 123, 20);

//获取所有的 key
console.log(group.getKeys());

//获取所有的 value
console.log(group.getValues());

//通过 key 获取 value
console.log(group.getValue("b"));

group.push("d", "231");
//删除 key
group.delete("d");

//查看 key 剩余时间
console.log("a 的剩余时间:" + group.ttl("a"));

//取出一个对象
//group.poll(); 先进先出原则

//取出并放置末尾
//group.rPoll();

//获取第一项元素的值
console.log("第一项元素的值:" + group.peek());

//设置指定对象的失效时间,把 a 的时间重设为 15 秒
group.expire("a", 15);

//查看 key 是否存在
console.log("b 是否存在:" + group.exist("b"));

//判断 group 是否为空
console.log("group 为空吗? " + group.isEmpty());

//获取 group 的大小
console.log("group 数量:" + group.size())

//查看 key 剩余时间
setInterval(function () {
console.log("a 剩余时间:" + group.ttl("a"));
console.log("b 剩余时间:" + group.ttl("b"));
console.log(group.getKeys());
}, 1000,1);
