const handleLogin = async function(event) {
    event.preventDefault();

    const passwordEl = document.querySelector('#password-input-login');
    const usernameEl = document.querySelector('#username-input-login');
    fetch('/users/register', {
        method: 'POST',
        body: JSON.stringify({
            username: usernameEl.value,
            password: passwordEl.value
        }),
        headers: {
            'content-type': 'application/JSON'
        }.then(function() {
            document.location.replace('/dashboard')
        }).catch(err => {
            console.error(err)
        })
    })
}

document.querySelector('#login-form').addEventListener('submit', handleLogin);