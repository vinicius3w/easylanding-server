'use strict'

const Database = use('Database')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Property extends Model {
  static scopeNearBy(query, latitude, longitude, distance) {
    /**  cálculo naval de distância através de latitude e longitude conhecido
     * como Haversine. Esse valor é multiplicado por 6371 que o transforma em
     * quilômetros.
     */
    const haversine = `(6371 * acos(cos(radians(${latitude}))
    * cos(radians(latitude))
    * cos(radians(longitude)
    - radians(${longitude}))
    + sin(radians(${latitude}))
    * sin(radians(latitude))))`

    return query
      .select('*', Database.raw(`${haversine} as distance`))
      .whereRaw(`${haversine} < ${distance}`)
  }

  user() {
    return this.belongsTo('App/Models/User')
  }

  images() {
    return this.hasMany('App/Models/Image')
  }
}

module.exports = Property
