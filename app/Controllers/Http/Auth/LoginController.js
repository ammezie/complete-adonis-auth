'use strict'

const User = use('App/Models/User')
const Hash = use('Hash')

class LoginController {
  showLoginForm ({ view }) {
    return view.render('auth.login')
  }

  async login ({ request, auth, session, response }) {
    // get form data
    const { email, password, remember } = request.all()

    // retrieve user base on the form data
    const user = await User.query()
      .where('email', email)
      .where('is_active', true)
      .first()

    if (user) {
      // verify password
      const passwordVerified = await Hash.verify(password, user.password)

      if (passwordVerified) {
        // login user
        await auth.remember(!!remember).login(user)

        return response.route('home')
      }
    }

    // display error message
    session.flash({
      notification: {
        type: 'danger',
        message: `We couldn't verify your credentials. Make sure you've confirmed your email address.`
      }
    })

    return response.redirect('back')
  }
}

module.exports = LoginController
