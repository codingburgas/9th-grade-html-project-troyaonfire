const container = document.querySelector('.container');
const LoginLink = document.querySelector('.SignInLink');
const RegisterLink = document.querySelector('.SignUpLink');
const registerForm = document.getElementById('register-form');

RegisterLink.addEventListener('click', () => {
  container.classList.add('active');
});
LoginLink.addEventListener('click', () => {
  container.classList.remove('active');
});

registerForm.addEventListener('submit', function(e) {
  e.preventDefault();

  emailjs.sendForm('service_qw9wf4i', 'template_3gjyyze', this)
    .then(() => {
      alert('✅ Registration sent successfully!');
      registerForm.reset();
      container.classList.remove('active');
    }, (error) => {
      console.error('❌ EmailJS error:', error);
      alert('⚠️ Failed to send. Try again later.');
    });
});

