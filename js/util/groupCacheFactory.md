# group-cache-nodejs
简单的内存缓存实现，实现group概念，
/**
 *
 * 简单的内存缓存实现，实现group概念，
 * 一个group里面是个有序的集合，
 * 集合支持key-value expire弥补redis list的不足
 * 支持语言:JavaScript、Node.js
 * Java版:https://github.com/newpanjing/group-cache
 * 调用说明:
 *  所有的方法都是同步方法,在nodejs使用也一样。
 *
 *  node.js调用:
 *  var factory = require("../core/GroupCacheFactory");
 *
 *  浏览器端js调用:
 *  直接在页面中引入GroupCacheFactory.js 即可,
 *  需要去掉GroupCacheFactory.js中最后一行 exports.group=group;
 */

var factory = require("../core/GroupCacheFactory");

var group = factory.group("abc");

//缓存key,并且设置过期时间
group.push("a", "asdsad", 10);

//缓存一个对象,永久有效
group.push("b", {
    a: "张三",
    b: "李四",
    area: "china"
});

//缓存一个int类型的值,过期时间为20秒
group.push("c", 123, 20);

//获取所有的key
console.log(group.getKeys());

//获取所有的value
console.log(group.getValues());

//通过key获取value
console.log(group.getValue("b"));

group.push("d", "231");
//删除key
group.delete("d");

//查看key剩余时间
console.log("a的剩余时间:" + group.ttl("a"));

//取出一个对象
//group.poll(); 先进先出原则

//取出并放置末尾
//group.rPoll();


//获取第一项元素的值
console.log("第一项元素的值:" + group.peek());

//设置指定对象的失效时间,把a的时间重设为15秒
group.expire("a", 15);

//查看key是否存在
console.log("b是否存在:" + group.exist("b"));

//判断group是否为空
console.log("group为空吗? " + group.isEmpty());

//获取group的大小
console.log("group 数量:" + group.size())

//查看key剩余时间
setInterval(function () {
    console.log("a剩余时间:" + group.ttl("a"));
    console.log("b剩余时间:" + group.ttl("b"));
    console.log(group.getKeys());
}, 1000,1);# group-cache-nodejs
简单的内存缓存实现，实现group概念，
/**
 *
 * 简单的内存缓存实现，实现group概念，
 * 一个group里面是个有序的集合，
 * 集合支持key-value expire弥补redis list的不足
 * 支持语言:JavaScript、Node.js
 * Java版:https://github.com/newpanjing/group-cache
 * 调用说明:
 *  所有的方法都是同步方法,在nodejs使用也一样。
 *
 *  node.js调用:
 *  var factory = require("../core/GroupCacheFactory");
 *
 *  浏览器端js调用:
 *  直接在页面中引入GroupCacheFactory.js 即可,
 *  需要去掉GroupCacheFactory.js中最后一行 exports.group=group;
 */

var factory = require("../core/GroupCacheFactory");

var group = factory.group("abc");

//缓存key,并且设置过期时间
group.push("a", "asdsad", 10);

//缓存一个对象,永久有效
group.push("b", {
    a: "张三",
    b: "李四",
    area: "china"
});

//缓存一个int类型的值,过期时间为20秒
group.push("c", 123, 20);

//获取所有的key
console.log(group.getKeys());

//获取所有的value
console.log(group.getValues());

//通过key获取value
console.log(group.getValue("b"));

group.push("d", "231");
//删除key
group.delete("d");

//查看key剩余时间
console.log("a的剩余时间:" + group.ttl("a"));

//取出一个对象
//group.poll(); 先进先出原则

//取出并放置末尾
//group.rPoll();


//获取第一项元素的值
console.log("第一项元素的值:" + group.peek());

//设置指定对象的失效时间,把a的时间重设为15秒
group.expire("a", 15);

//查看key是否存在
console.log("b是否存在:" + group.exist("b"));

//判断group是否为空
console.log("group为空吗? " + group.isEmpty());

//获取group的大小
console.log("group 数量:" + group.size())

//查看key剩余时间
setInterval(function () {
    console.log("a剩余时间:" + group.ttl("a"));
    console.log("b剩余时间:" + group.ttl("b"));
    console.log(group.getKeys());
}, 1000,1);