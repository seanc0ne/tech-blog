const { json } = require("sequelize/types");

const handleSignup = (event) => {
    event.preventDefault();

    const passwordEl = document.querySelector('#password-input-signup');
    const usernameEl = document.querySelector('#username-input-signup');
    fetch('/users/register', {
        method: 'POST',
        body: JSON.stringify({
            username: usernameEl.value,
            password: passwordEl.value
        }),
        headers: {
            'content-type': 'application/JSON'
        }.then(() => {
            document.location.replace('/dashboard')
        }).catch(err => {
            console.error(err)
        })
    })
}

document.querySelector('#signup-form').addEventListener('submit', handleSignup);