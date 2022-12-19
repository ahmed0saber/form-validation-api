const express = require("express")
const app = express()
var cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(cors())
app.use(require('body-parser').urlencoded({ extended: false }))

app.listen(process.env.PORT, () =>
    console.log(`Example app listening on port ${process.env.PORT}!`),
)

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/projects', (req, res) => {
    res.render('projects')
})

app.post('/validate', (req, res) => {
    const usernameErrors = getUsernameErrors(req.body.username)
    const emailErrors = getEmailErrors(req.body.email)
    const passwordErrors = getPasswordErrors(req.body.password)
    const passwordConfirmationErrors = getPasswordConfirmationErrors(req.body.password, req.body.password_confirmation)
    const currentMessage = (usernameErrors.length + emailErrors.length + passwordErrors.length + passwordConfirmationErrors.length) === 0 ? "Data is valid" : "Data is not valid"

    const currentResponse = {
        message: currentMessage,
        errors: {
            username: usernameErrors,
            email: emailErrors,
            password: passwordErrors,
            password_confirmation: passwordConfirmationErrors
        }
    }

    return res.json(currentResponse)
})

function getUsernameErrors(username = "") {
    const errors = [], USERNAME_REGEX_PATTERN = /^([a-z]|[A-Z])\w{4,14}$/
    if(username.trim().length === 0) {
        errors.push("Username can't be empty")
    }
    if(username.length < 5) {
        errors.push("Username can't be less than 5 characters")
    }
    if(username.length > 15) {
        errors.push("Username can't be more than 15 characters")
    }
    if(!USERNAME_REGEX_PATTERN.test(username)){
        errors.push("Username must consist of letters, numbers and _, starting with a letter")
    }

    return errors
}

function getEmailErrors(email = "") {
    const errors = [], EMAIL_REGEX_PATTERN = /^[a-z]\w{2,}@\w{2,}\.\w{2,}$/
    if(email.trim().length === 0) {
        errors.push("Email can't be empty")
    }
    if(!EMAIL_REGEX_PATTERN.test(email)){
        errors.push("Email must be valid")
    }

    return errors
}

function getPasswordErrors(password = "") {
    const errors = [], PASSWORD_REGEX_PATTERN = /^\S{8,16}$/
    if(password.trim().length === 0) {
        errors.push("Password can't be empty")
    }
    if(password.length < 8) {
        errors.push("Password can't be less than 8 characters")
    }
    if(password.length > 16) {
        errors.push("Password can't be more than 16 characters")
    }
    if(!PASSWORD_REGEX_PATTERN.test(password)){
        errors.push("Password must consist of non-space characters")
    }

    return errors
}

function getPasswordConfirmationErrors(password = "", passwordConfirmation = "") {
    const errors = []
    if(password !== passwordConfirmation) {
        errors.push("Passwords don't match")
    }

    return errors
}