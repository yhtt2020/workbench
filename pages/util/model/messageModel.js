const db = require('../../../js/util/database.js').db

const messageModel = {
  async allList() {
    return await db.messages.orderBy('timestamp').desc().toArray()
  },

  /**
   * 根据消息类型查询此类型的所有消息
   * @param {String} type 查询的消息类型
   */
  async findListByType(type) {
    const result = await db.messages.where('messageType').equals(type).orderBy('timestamp').desc().toArray()
    return result
  },

  /**
   * 添加消息，支持批量添加
   * @param {(object| object[])} message 消息对象，或消息对象组成的数组
   */
  async add(message) {
    if(toString.call(message) === '[object Array]') {
      await db.messages.bulkAdd(message)
    } else {
      await db.messages.put(message)
    }
  },

  /**
   * 根据id删除单个消息
   * @param {number} id 消息id
   */
  async deleteById(id) {
    await db.messages.delete(id)
  },

  /**
   * 根据消息类型批量删除
   * @param {string} type 删除的消息类型
   */
  async deleteByType(type) {
    await db.messages.where('messageType').equals(type).delete()
  }
}


module.exports = messageModel
