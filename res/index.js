"use strict"
let [btnMenu, btnLogo, btnCall] = [...document.querySelectorAll('header > div')];
let imgMenu = document.querySelector('header img');
let mains = document.querySelectorAll('main > div:not(.main)');
let main = document.querySelector('.main');
let menu = document.querySelector('.menu');
let menuCall = document.getElementsByClassName('menu-call')[0];
let menuList = document.querySelectorAll('.menu-content div');
let content = document.getElementsByClassName('content')[0];
let closeSlider = document.querySelector('.close');
let dir = document.querySelector('.dir');
let msgOfLoad = document.querySelector('.load');
let slideShowImgs = ["View1.jpg","View3.jpg","bedroom2.1.jpg","bedroom2.3.jpg"];
let dirsImg = [
  ["b1.jpg","b2.jpg","k1.jpg","k2.jpg","k3.jpg","lr1.jpg","lr2.jpg"],
  ["bedroom2.1.jpg","bedroom2.3.jpg","bedroom2.4.jpg"],
  ["gostinaya1.jpg","gostinaya2.jpg","gostinaya3.jpg","gostinaya4.jpg"],
  ["View1.jpg","View3.jpg"]
];
let id, img = [];
let lastClickedEl;

//cacheImages("./res/photos/slideShow/", slideShowImgs);
window.onload = () => {
  hideMsgOfLoad();
  id = slideShowStart(slideShowImgs);
  initBtnsMenu();
  initBtnDirs();
  SliderInit();
//  initSwipeMenu();
};

function cacheImages(path, arr) {
  for (let i = 0; i < arr.length; i++) {
    img.push(document.createElement('img'));
    img[i].src = path+arr[i];
  };
};

function initBtnDirs() {
  let dirsBtn = document.querySelectorAll('.dirs div');
  let slider = document.querySelector('.slider');

  for (let i = 0; i < dirsBtn.length; i++) {
    dirsBtn[i].onclick = () => {
      createImgsInDiv(`./res/photos/dir${i+1}/`, dirsImg[i], dir);
      slider.classList.remove('hide');
    };
  };
};

function createImgsInDiv(path, arr, parent) {
  parent.innerHTML = null;
  parent.style.width = `${100*arr.length}%`;
  let img;

  for (let name of arr) {
    img = document.createElement('img');
    img.src = `${path+name}`;
    img.style.width = `${100/arr.length}%`;
    img.classList.add('animate');
    parent.appendChild(img);
  };
};

function SliderInit() {
  let slider = document.querySelector('.slider');
  dir.translateX = 0;
  dir.step = 1;
  dir.steps = () => dir.childElementCount;
  dir.rate = () => 100/dir.childElementCount;

  slider.next = () => {
    if ( dir.step !== dir.steps() ) {
      dir.translateX -= dir.rate();
      dir.style.transform = `translateX(${dir.translateX}%)`;
      dir.step++
    };
  };

  slider.back = () => {
    if (dir.step !== 1) {
      dir.translateX += dir.rate();
      dir.style.transform = `translateX(${dir.translateX}%)`;
      dir.step--;
    };
  };

  document.querySelector('#btnBack').onclick = slider.back;
  document.querySelector('#btnNext').onclick = slider.next;

  closeSlider.onclick = (e) => {
    dir.translateX = 0;
    dir.step = 1;
    slider.classList.add('hide');
    dir.style.transform = 'translateX(0)';
  };

  initSwapSlide(slider)
};

function initSwapSlide(slider) {
  let x, startX, requestID;

  dir.ontouchstart = (e) => {
    e.preventDefault();
    x = 0;
    startX = e.touches[0].clientX;
    dir.classList.remove('animate');

    (function step () {
// FIXME:
      if ( (x > 0 && dir.step == 1) || (x < 0 && dir.step == dir.steps) ) {
        requestID = requestAnimationFrame(step);
        return;
      }

      dir.style.transform = `translateX( calc(${x}px + ${dir.translateX}%) )`;
      requestID = requestAnimationFrame(step);
    })()
  };

  dir.ontouchmove = (e) => {
    e.preventDefault();
    x = Math.round(e.touches[0].clientX - startX);
  };

  dir.ontouchend = () => {
    window.cancelAnimationFrame(requestID);
    dir.classList.add('animate');

    if (x > 0) {
      slider.back();
    };
    if (x < 0) {
      slider.next();
    };
  };
};

function initBtnsMenu() {
  lastClickedEl = main;
// FIXME:
  for (let i = 0; i < menuList.length; i++) {
    menuList[i].onclick = () => {
      lastClickedEl.style.display = "none";
      lastClickedEl = mains[i];
      let btnDisplay = getComputedStyle(mains[i]).display;
      mains[i].style.display = btnDisplay == "none" ? "flex" : "none";
      hideMenuArea()
      clearInterval(id);
      menuList[i] == menuList[0] ? id = slideShowStart(slider) : null;
    };
  };
};

function initSwipeMenu() {
  let x, startX, requestID;

  window.addEventListener('touchstart', (e) => {
    x = 0;
    startX = e.touches[0].clientX;

    if (startX/innerWidth < 0.06 && menu.classList.contains('left-hide')) {
      menu.translateX = -innerWidth/3;
      menu.classList.remove('animate');

      (function step() {
        if (x < innerWidth/3) {
          menu.style.transform = `translateX(${x + menu.translateX}px)`;
          requestID = requestAnimationFrame(step);
        };
      })();
    };
  });
  menu.addEventListener('touchstart', (e) => {
    if (!menu.classList.contains('left-hide')) {
      menu.classList.remove('animate');

    };
  });

  window.addEventListener('touchmove', (e) => {
//    e.preventDefault();
    x = Math.round(e.touches[0].clientX - startX);
  });

  window.addEventListener('touchend', () => {
    cancelAnimationFrame(requestID);
    menu.style.removeProperty('transform');
    menu.classList.add('animate');
    if (x > startX) {
      menu.classList.remove('left-hide');
    };
  });
};

function slideShowStart (arr) {
  let imgs = document.querySelectorAll('.main div')
  let i = 1;
  let lastI = imgs[0];

  return setInterval( () => {
    lastI.classList.remove('show');
    imgs[i].classList.add('show');
    lastI = imgs[i];
    ++i == 4 ? i = 0 : null;
  }, 6000);
};

function hideMsgOfLoad() {
  msgOfLoad.style.opacity = 0;
  setTimeout(() => {
    msgOfLoad.style.display = "none";
  }, 1100)
}

function hideMenuArea() {
  btnMenu.classList.remove('btn-active');
  menu.classList.add('left-hide');
  imgMenu.src = './res/icons/menu.png';
};

btnMenu.onclick = () => {
  btnMenu.classList.toggle('btn-active');
  menu.classList.toggle('left-hide');
  if (imgMenu.getAttribute('src') == "./res/icons/menu.png") {
    imgMenu.src = './res/icons/close2.png';
  } else {
    imgMenu.src = './res/icons/menu.png';
  };
}

btnLogo.onclick = () => {
  lastClickedEl.style.display = "none";
  main.style.display = "flex";
  lastClickedEl = main;
  clearInterval(id);
  id = slideShowStart(slider);
};

btnCall.onclick = () => {
  btnCall.classList.toggle('btn-call-active');
  menuCall.classList.toggle('top-hide')
};

window.onclick = (e) => {
  let arr = Array.from(e.path)
  arr = arr.filter( el => el == menu )

  let isMenuArea = e.path.some( elem => {
    return elem == btnMenu || elem == menu;
  });
  if (!isMenuArea) hideMenuArea();
};
