/**
 * SIDEBAR TOGGLE FUNCTIONALITY
 */
const initializeSidebarToggle = () => {
  const menuToggle = document.getElementById("menuToggle")
  const sidebar = document.getElementById("sidebar")

  if (!menuToggle || !sidebar) {
    console.error("Sidebar toggle elements not found")
    return
  }

  menuToggle.addEventListener("click", function () {
    sidebar.classList.toggle("open")
    this.classList.toggle("active")

    if (!sidebar.classList.contains("open")) {
      const searchContainer = document.getElementById("searchContainer")
      searchContainer?.classList.remove("expanded")
    }
  })
}

/**
 * SEARCH BAR FUNCTIONALITY
 */
const initializeSearch = () => {
  const searchBtn = document.getElementById("searchBtn")
  const searchContainer = document.getElementById("searchContainer")
  const searchInput = document.getElementById("searchInput")

  if (!searchBtn || !searchContainer || !searchInput) {
    console.warn("Search elements not found")
    return
  }

  searchBtn.addEventListener("click", (e) => {
    e.stopPropagation()
    searchContainer.classList.toggle("expanded")

    if (searchContainer.classList.contains("expanded")) {
      setTimeout(() => searchInput.focus(), 10)
    } else {
      searchInput.value = ""
    }
  })

  document.addEventListener("click", (e) => {
    if (!searchContainer.contains(e.target) && !searchBtn.contains(e.target)) {
      searchContainer.classList.remove("expanded")
      searchInput.value = ""
    }
  })
}

/**
 * THEME TOGGLE FUNCTIONALITY
 */
const initializeThemeToggle = () => {
  const themeToggle = document.getElementById("themeToggle")
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)")

  if (!themeToggle) {
    console.warn("Theme toggle not found")
    return
  }

  themeToggle.checked = prefersDarkScheme.matches

  themeToggle.addEventListener("change", () => {
    document.body.classList.toggle("light")
    localStorage.setItem("themePreference", document.body.classList.contains("light") ? "light" : "dark")
  })

  prefersDarkScheme.addListener((e) => {
    themeToggle.checked = e.matches
    document.body.classList.toggle("light", !e.matches)
  })
}

/**
 * LIVE STATS FUNCTIONALITY
 */
const initializeLiveStats = () => {
  const stats = {
    activeMembers: 1247,
    activeAlerts: 23,
    safetyTips: 156,
    regionsCovered: 89,
  }

  const updateStats = () => {
    // Update Active Members (small random changes)
    stats.activeMembers += Math.floor(Math.random() * 3) - 1

    // Update Active Alerts (can go up or down)
    stats.activeAlerts = Math.max(0, stats.activeAlerts + Math.floor(Math.random() * 5) - 2)

    // Update Safety Tips (gradually increases)
    if (Math.random() > 0.7) {
      stats.safetyTips += Math.floor(Math.random() * 2)
    }

    // Update Regions Covered (slowly grows)
    if (Math.random() > 0.8 && stats.regionsCovered < 100) {
      stats.regionsCovered += 1
    }

    // Update the DOM with animation
    updateStatElement("activeMembers", stats.activeMembers.toLocaleString())
    updateStatElement("activeAlerts", stats.activeAlerts)
    updateStatElement("safetyTips", stats.safetyTips)
    updateStatElement("regionsCovered", stats.regionsCovered)
  }

  const updateStatElement = (id, value) => {
    const element = document.getElementById(id)
    if (element) {
      element.classList.add("updating")
      element.textContent = value

      setTimeout(() => {
        element.classList.remove("updating")
      }, 300)
    }
  }

  // Update stats every 5 seconds
  setInterval(updateStats, 5000)

  console.log("Live stats initialized")
}

/**
 * SIDEBAR LINK INTERACTIONS
 */
const enhanceSidebarLinks = () => {
  const navLinks = document.querySelectorAll(".sidebar ul li a")

  navLinks.forEach((link) => {
    link.addEventListener("mouseenter", () => {
      link.style.transform = "translateX(5px)"
    })

    link.addEventListener("mouseleave", () => {
      link.style.transform = ""
    })

    link.addEventListener("click", () => {
      navLinks.forEach((l) => l.classList.remove("active"))
      link.classList.add("active")
    })
  })
}

/**
 * FEATURE CARDS ANIMATION
 */
const initializeFeatureCards = () => {
  const cards = document.querySelectorAll(".feature-card")

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = "1"
            entry.target.style.transform = "translateY(0)"
          }, index * 100)

          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.1 },
  )

  cards.forEach((card) => {
    card.style.opacity = "0"
    card.style.transform = "translateY(20px)"
    card.style.transition = "opacity 0.5s ease, transform 0.5s ease"
    observer.observe(card)
  })
}

/**
 * INITIALIZE ALL COMPONENTS
 */
document.addEventListener("DOMContentLoaded", () => {
  initializeSidebarToggle()
  initializeSearch()
  initializeThemeToggle()
  initializeLiveStats()
  enhanceSidebarLinks()
  initializeFeatureCards()
  console.log("All components initialized")

  // Restore saved theme preference
  const savedTheme = localStorage.getItem("themePreference")
  if (savedTheme === "light") {
    document.body.classList.add("light")
    document.getElementById("themeToggle").checked = false
  }
})

/**
 * WINDOW RESIZE HANDLER
 */
window.addEventListener("resize", () => {
  const sidebar = document.getElementById("sidebar")
  if (window.innerWidth > 768 && sidebar.classList.contains("open")) {
    sidebar.classList.remove("open")
    document.getElementById("menuToggle").classList.remove("active")
  }
})
