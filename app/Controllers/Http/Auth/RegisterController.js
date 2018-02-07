'use strict'

const { validateAll } = use('Validator')
const User = use('App/Models/User')
const randomString = require('random-string')
const Mail = use('Mail')

class RegisterController {
  showRegisterForm ({ view }) {
    return view.render('auth.register')
  }

  async register ({ request, session, response }) {
    // validate form inputs
    const validation = await validateAll(request.all(), {
      username: 'required|unique:users,username',
      email: 'required|email|unique:users,email',
      password: 'required'
    })

    if (validation.fails()) {
      session.withErrors(validation.messages()).flashExcept(['password'])

      return response.redirect('back')
    }

    // create user
    const user = await User.create({
      username: request.input('username'),
      email: request.input('email'),
      password: request.input('password'),
      confirmation_token: randomString({ length: 40 })
    })

    // send confirmation email
    await Mail.send('auth.emails.confirm_email', user.toJSON(), message => {
      message
        .to(user.email)
        .from('hello@adonisjs.com')
        .subject('Please confirm your email address')
    })

    // display success message
    session.flash({
      notification: {
        type: 'success',
        message: 'Registration successful! A mail has been sent to your email address, please confirm your email address.'
      }
    })

    return response.redirect('back')
  }
}

module.exports = RegisterController
