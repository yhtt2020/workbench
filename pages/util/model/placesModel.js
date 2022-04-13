const db = require('../../../js/util/database.js').db

const placesModel = {
  async getAllHistory() {
    return await db.places.orderBy('lastVisit').desc().toArray()
  }
}

module.exports = placesModel
