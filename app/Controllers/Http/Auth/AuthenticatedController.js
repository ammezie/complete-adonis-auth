'use strict'

class AuthenticatedController {
  async logout ({ auth, response }) {
    await auth.logout()

    return response.redirect('/login')
  }
}

module.exports = AuthenticatedController
