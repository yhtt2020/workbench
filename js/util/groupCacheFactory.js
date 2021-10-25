/**
 * Created by sun on 16/8/8.
 */

/**
 * 所有的方法皆为同步
 */

/**
 * 组对象
 * @returns {Group}
 * @constructor
 */
function Group() {

    var queue = new Array();

    /**
     * 缓存一个对象
     * @param key
     * @param object
     * @param second 默认为 0 永久有效
     */
    this.push = function (key, object, second) {
        second = second || 0;
        queue.unshift({
            key: key,
            value: object,
            timestamp: new Date().getTime(),
            seconds: second,
            group: this,
            isExpire: function () {
                if (this.seconds == 0) {
                    return true;
                }
                if (this.getTime() > this.seconds) {
                    // 失效了就移除
                    this.group.delete(key);
                    return false;
                }
                return true;
            },
            getTime: function () {
                if (this.seconds == 0) {
                    return this.seconds;
                }
                var current = new Date().getTime();
                var value = current - this.timestamp;
                return parseInt((value / 1000) + 1);
            },
            ttl: function () {
                if (this.seconds == 0) {
                    return this.seconds;
                }
                if (this.isExpire()) {
                    return this.seconds - this.getTime();
                }
                return -1;
            }
        });
    }

    /**
     * 获取一个对象,先进先出
     * @returns {*}
     */
    this.poll = function () {
        var cache = queue.pop();
        if (cache && cache.isExpire()) {
            return cache.value;
        }

        return null;
    }

    /**
     * 获取一个对象,并放到末尾,先进先出
     * @returns {*}
     */
    this.rPoll = function () {
        var cache = queue.pop();
        if (cache && cache.isExpire()) {
            var value = cache.value;
            queue.unshift(value);
            return value;
        }

        return null;
    }

    /**
     * 删除一个key
     * @param key
     */
    this.delete = function (key) {
        var index = find(key);
        if (index != -1) {
            queue.splice(index, 1);
        }
    }

    /**
     * 寻找指定项的索引
     * @param key
     * @returns {*}
     */
    var find = function (key) {
        for (var i in queue) {
            var item = queue[i];
            if (item.key == key) {
                return i;
            }
        }
        return -1;
    }


    /**
     * 通过key获取
     * @param key
     * @returns {*}
     */
    this.getValue = function (key) {

        var index = find(key);
        if (index != -1) {
            var cache = queue[index];
            if (cache != null && cache.isExpire()) {
                return cache.value;
            }

        }
        return null;
    }

    /**
     * 获取所有有效的cache
     * @returns {Array}
     */
    var getCacheEntitys = function () {
        var entitys = [];
        for (var i in queue) {
            var item = queue[i];
            if (item.isExpire()) {
                entitys.push(item);
            }
        }
        return entitys;
    }

    /**
     * 获取key
     */
    this.getKeys = function () {
        var keys = [];
        var caches = getCacheEntitys();
        for (var i in caches) {
            var item = caches[i];
            keys.push(item.key);
        }
        return keys;
    }

    /**
     * 获取值
     */
    this.getValues = function () {
        var values = [];
        var caches = getCacheEntitys();
        for (var i in caches) {
            var item = caches[i];
            values.push(item.value);
        }
        return values;
    }

    /**
     * 获取元素剩余时间
     * @param key
     */
    this.ttl = function (key) {
        var index = find(key);

        if (index != -1) {
            var cache = queue[index];
            return cache.ttl();
        }

        return -1;
    }

    /**
     * 获取第一项的值
     * @returns {null}
     */
    this.peek = function () {
        var values = this.getValues();
        if (values.length > 0) {
            return values[0];
        }
        return null;
    }

    /**
     * 设置元素失效时间
     * @param key
     * @param second
     */
    this.expire = function (key, second) {
        var index = find(key);
        if (index != -1) {
            var cache = queue[index];
            cache.timestamp = new Date().getTime();
            cache.seconds = second;
            queue[index] = cache;
        }
    }

    /**
     * 检测元素是否存在
     * @param key
     */
    this.exist = function (key) {
        return find(key) != -1;
    }

    /**
     * 判断group是否为空
     * @returns {boolean}
     */
    this.isEmpty = function () {
        return this.getKeys().length == 0;
    }

    /**
     * 获取group有效元素的大小
     * @returns {*}
     */
    this.size = function () {
        return this.getKeys().length;
    }

    return this;
}

var container = {};
/**
 * 获取一个组,如果组不存在就创建
 * @param key
 */
var group = function (key) {

    var group = container[key];
    if (!group) {
        group = new Group();
    }
    return group;
}

//如果是浏览器端JavaScript去掉这一句
exports.group=group;