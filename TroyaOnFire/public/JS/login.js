const container = document.querySelector(".container")
const LoginLink = document.querySelector(".SignInLink")
const RegisterLink = document.querySelector(".SignUpLink")
const registerForm = document.getElementById("register-form")
const loginForm = document.getElementById("login-form")
const emailjs = window.emailjs // Declare the emailjs variable

RegisterLink.addEventListener("click", () => {
  container.classList.add("active")
})

LoginLink.addEventListener("click", () => {
  container.classList.remove("active")
})

// REGISTER
registerForm.addEventListener("submit", function (e) {
  e.preventDefault()

  // Get form data
  const formData = new FormData(this)
  const userData = {
    firstName: formData.get("firstname"),
    lastName: formData.get("lastname"),
    email: formData.get("email"),
    region: formData.get("region"),
    role: formData.get("role"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    agreeToTerms: formData.get("agreeToTerms"),
  }

  // Validation
  if (userData.password !== userData.confirmPassword) {
    alert("Passwords do not match!")
    return
  }

  if (!userData.agreeToTerms) {
    alert("Please agree to the Terms of Service and Privacy Policy")
    return
  }

  if (userData.password.length < 6) {
    alert("Password must be at least 6 characters long")
    return
  }

  // Save to backend
  fetch("http://localhost:3000/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to register")
      return res.text()
    })
    .then((msg) => {
      alert(msg)

      // Send confirmation email with EmailJS
      return emailjs.sendForm("service_qw9wf4i", "template_3gjyyze", registerForm)
    })
    .then(() => {
      alert("Email confirmation sent!")
      registerForm.reset()
      container.classList.remove("active") // Switch to login
    })
    .catch((err) => {
      console.error("Error:", err)
      alert("Registration failed: " + err.message)
    })
})

// LOGIN
loginForm.addEventListener("submit", function (e) {
  e.preventDefault()

  const email = this.email.value
  const password = this.password.value

  fetch("http://localhost:3000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Login failed")
      return res.json()
    })
    .then((user) => {
      alert("Login successful!")

      // Save user data to localStorage
      localStorage.setItem("user", JSON.stringify(user))
      localStorage.setItem("userCountry", user.region)
      localStorage.setItem("userRole", user.role)

      // Redirect to homepage
      window.location.href = "../index.html"
    })
    .catch((err) => {
      alert("Invalid credentials")
      console.error(err)
    })
})

// Enhanced form interactions
document.addEventListener("DOMContentLoaded", () => {
  // Handle select dropdowns
  const selects = document.querySelectorAll("select")
  selects.forEach((select) => {
    select.addEventListener("change", function () {
      if (this.value) {
        this.classList.add("has-value")
      } else {
        this.classList.remove("has-value")
      }
    })
  })

  // Real-time password confirmation validation
  const passwordInput = document.getElementById("register-password")
  const confirmPasswordInput = document.getElementById("register-confirm-password")

  function validatePasswordMatch() {
    if (confirmPasswordInput.value && passwordInput.value !== confirmPasswordInput.value) {
      confirmPasswordInput.setCustomValidity("Passwords do not match")
      confirmPasswordInput.style.borderBottomColor = "#ff4444"
    } else {
      confirmPasswordInput.setCustomValidity("")
      confirmPasswordInput.style.borderBottomColor = ""
    }
  }

  if (passwordInput && confirmPasswordInput) {
    passwordInput.addEventListener("input", validatePasswordMatch)
    confirmPasswordInput.addEventListener("input", validatePasswordMatch)
  }
})
