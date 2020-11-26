module.exports.validateRegisterInput = (
    username,
    email,
    password,
    confirmPassword
) => {
    const errors = {}
    if( username.trim() === '') {
        errors.username = 'username must not be empty'
    }
    if( email.trim() === '') {
        errors.email = 'email must not be empty'
    }
    console.log(password, confirmPassword)
    if( password === '') {
        errors.password = 'password must not be empty'
    } else if ( password !== confirmPassword) {
        errors.password = 'password must match'
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1
    }

}