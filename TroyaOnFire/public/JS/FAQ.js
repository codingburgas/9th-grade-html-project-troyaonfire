AOS.init({
  duration: 2000,
  once: false,
  mirror: true
});

const text = "Frequently Asked Questions";
const title = document.getElementById("type-title");
let i = 0;

function typeEffect() {
  if (i < text.length) {
    title.innerHTML += text.charAt(i);
    i++;
    setTimeout(typeEffect, 100);
  }
}

document.addEventListener("DOMContentLoaded", typeEffect);

document.querySelectorAll('.faq-item').forEach(item => {
  item.addEventListener('click', () => {
    item.classList.toggle('active');
  });
});
