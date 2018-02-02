'use strict'

const Schema = use('Schema')

class PasswordResetSchema extends Schema {
  up () {
    this.create('password_resets', table => {
      table.increments()
      table.string('email')
      table.string('token')
      table.timestamps()
    })
  }

  down () {
    this.drop('password_resets')
  }
}

module.exports = PasswordResetSchema
