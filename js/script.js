const navLinks = document.querySelectorAll(".nav-menu .nav-link");
const menuOpenButton = document.querySelector("#menu-open-button");
const menuCloseButton = document.querySelector("#menu-close-button");

menuOpenButton.addEventListener("click", () => {
    // 모바일 메뉴 가시성 전환 
    document.body.classList.toggle("show-mobile-menu");
});

// 메뉴창에 있는 닫기버튼 클릭시 창이 닫힘
menuCloseButton.addEventListener("click", () => menuOpenButton.click());

//네비게이션 바 클릭시 메뉴창이 닫힘
navLinks.forEach(link => {
    link.addEventListener("click", () => menuOpenButton.click());
});

//Swiper 적용하기
const swiper = new Swiper('.slider-wrapper', {
    loop: true,
    grabCursor: true,
    spaceBetween: 25,
  
    // If we need pagination
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      dynamicBullets: true,
    },
  
    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },

    //Responsive Breakpoints
    breakpoints: {
        0: {
            slidesPerView: 1
        },
        768: {
            slidesPerView: 2
        },
        1024: {
            slidesPerView: 3
        }
    }
  });