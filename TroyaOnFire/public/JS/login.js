const container = document.querySelector('.container');
const LoginLink = document.querySelector('.SignInLink');
const RegisterLink = document.querySelector('.SignUpLink');
const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');

RegisterLink.addEventListener('click', () => {
  container.classList.add('active');
});

LoginLink.addEventListener('click', () => {
  container.classList.remove('active');
});

// REGISTER
registerForm.addEventListener('submit', function(e) {
  e.preventDefault();

  const userData = {
    email: this.email.value,
    country: this.country.value,
    password: this.password.value
  };

  // Save to backend
  fetch('http://localhost:3000/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  })
  .then(res => {
    if (!res.ok) throw new Error('Failed to register');
    return res.text();
  })
  .then(msg => {
    alert(msg);

    // Send confirmation email with EmailJS
    return emailjs.sendForm('service_qw9wf4i', 'template_3gjyyze', registerForm);
  })
  .then(() => {
    alert('Email confirmation sent!');
    registerForm.reset();
    container.classList.remove('active'); // Switch to login
  })
  .catch(err => {
    console.error('Error:', err);
    alert('Registration failed.');
  });
});

// LOGIN
loginForm.addEventListener('submit', function(e) {
  e.preventDefault();

  const email = this.email.value;
  const password = this.password.value;

  fetch('http://localhost:3000/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  })
  .then(res => {
    if (!res.ok) throw new Error('Login failed');
    return res.text();
  })
  .then(msg => {
    alert(msg);
    localStorage.setItem("user", JSON.stringify({ email }));
    window.location.href = "../index.html"; 
  })
  .catch(err => {
    alert('Invalid credentials');
    console.error(err);
  });
});

