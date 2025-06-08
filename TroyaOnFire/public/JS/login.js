const container = document.querySelector(".container")
const LoginLink = document.querySelector(".SignInLink")
const RegisterLink = document.querySelector(".SignUpLink")
const registerForm = document.getElementById("register-form")
const loginForm = document.getElementById("login-form")
const emailjs = window.emailjs

// Check if user is already logged in when page loads
document.addEventListener("DOMContentLoaded", () => {
  checkExistingLogin()

  // Make sure the container starts in the non-active state
  container.classList.remove("active")

  const selects = document.querySelectorAll("select")
  selects.forEach((select) => {
    if (select.value) {
      select.classList.add("has-value")
    }

    select.addEventListener("change", function () {
      if (this.value) {
        this.classList.add("has-value")
      } else {
        this.classList.remove("has-value")
      }
    })
  })
})

// Function to check if user is already logged in
function checkExistingLogin() {
  const loginExpiry = localStorage.getItem("loginExpiry")
  const user = localStorage.getItem("user")

  if (loginExpiry && user) {
    const now = new Date().getTime()
    const expiryTime = Number.parseInt(loginExpiry)

    if (now < expiryTime) {
      // User is still logged in, redirect to homepage
      console.log("User already logged in, redirecting...")
      window.location.href = "../index.html"
      return true
    } else {
      // Login expired, clear stored data
      clearLoginData()
    }
  }
  return false
}

// Function to clear login data
function clearLoginData() {
  localStorage.removeItem("user")
  localStorage.removeItem("userCountry")
  localStorage.removeItem("userRole")
  localStorage.removeItem("loginExpiry")
}

// Function to set login with expiry
function setLoginWithExpiry(userData, rememberMe) {
  const now = new Date().getTime()
  const expiryTime = rememberMe ? now + 24 * 60 * 60 * 1000 : now + 2 * 60 * 60 * 1000 // 24 hours or 2 hours

  localStorage.setItem("user", JSON.stringify(userData))
  localStorage.setItem("userCountry", userData.region || userData.country)
  localStorage.setItem("userRole", userData.role)
  localStorage.setItem("loginExpiry", expiryTime.toString())
}

RegisterLink.addEventListener("click", () => {
  container.classList.add("active")
})

LoginLink.addEventListener("click", () => {
  container.classList.remove("active")
})

// REGISTER
registerForm.addEventListener("submit", function (e) {
  e.preventDefault()

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
      return emailjs.sendForm("service_qw9wf4i", "template_3gjyyze", registerForm)
    })
    .then(() => {
      alert("Email confirmation sent!")
      registerForm.reset()
      container.classList.remove("active")
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
  const rememberMe = this.rememberMe.checked

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

      // Save user data with expiry based on remember me checkbox
      setLoginWithExpiry(user, rememberMe)

      // Redirect to homepage
      window.location.href = "../index.html"
    })
    .catch((err) => {
      alert("Invalid credentials")
      console.error(err)
    })
})

// Real-time password confirmation validation
document.addEventListener("DOMContentLoaded", () => {
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

// Function to logout (call this from other pages if needed)
function logout() {
  clearLoginData()
  window.location.href = "login.html"
}

// Make logout function available globally
window.logout = logout
