const handleLogout = async function(event) {
    event.preventDefault();

    const passwordEl = document.querySelector('#password-input-logout');
    const usernameEl = document.querySelector('#username-input-logout');
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
        }).catch(err => console.error(err))
    })
}
// console.log(document.getElementById('logout'));
document.getElementById('logout').addEventListener('submit', handleLogout);