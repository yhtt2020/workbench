const db = require('../../../js/util/database.js').db

const placesModel = {
  async getAllHistory() {
    return await db.places.orderBy('lastVisit').desc().toArray()
  },

  async getHistoryCount() {
    return await db.places.count()
  }
}

module.exports = placesModel
