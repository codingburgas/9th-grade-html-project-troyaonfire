// Add this script to your other pages (like index.html) to check if user is logged in

function checkAuthStatus() {
  const loginExpiry = localStorage.getItem("loginExpiry")
  const user = localStorage.getItem("user")

  if (!loginExpiry || !user) {
    // No login data, redirect to login
    window.location.href = "login.html"
    return false
  }

  const now = new Date().getTime()
  const expiryTime = Number.parseInt(loginExpiry)

  if (now >= expiryTime) {
    // Login expired, clear data and redirect
    localStorage.removeItem("user")
    localStorage.removeItem("userCountry")
    localStorage.removeItem("userRole")
    localStorage.removeItem("loginExpiry")

    alert("Your session has expired. Please log in again.")
    window.location.href = "login.html"
    return false
  }

  // User is still logged in
  return true
}

// Function to get current user data
function getCurrentUser() {
  const user = localStorage.getItem("user")
  return user ? JSON.parse(user) : null
}

// Function to logout
function logout() {
  localStorage.removeItem("user")
  localStorage.removeItem("userCountry")
  localStorage.removeItem("userRole")
  localStorage.removeItem("loginExpiry")
  window.location.href = "login.html"
}

// Check auth status when page loads
document.addEventListener("DOMContentLoaded", () => {
  checkAuthStatus()
})
