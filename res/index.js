"use strict"
let [btnMenu, btnLogo, btnCall] = [...document.querySelectorAll('header > div')];
let imgMenu = document.querySelector('header img');
let menu = document.querySelector('.menu');

(function preLoad() {
  initBtnsMenu();
  initlazyImgs();
})();

window.onload = () => {
  hideMsgOfLoad();
  slideShowStart();
  initBtnDirs();
  SliderInit();
};

function cacheImages(path, arr) {
  for (let i = 0; i < arr.length; i++) {
    img.push(document.createElement('img'));
    img[i].src = path+arr[i];
  };
};

function initlazyImgs() {
  let imgs = document.querySelectorAll('img[data-src]');
  for (let img of imgs) {
    img.src = img.getAttribute('data-src');
    img.onload = () => {
      img.removeAttribute('data-src');
    };
  };
};

function initBtnsMenu() {
  let main = document.querySelector('.main');
  let lastClickedEl = main;

  let mains = document.querySelectorAll('main > div:not(.main)');
  let menuList = document.querySelectorAll('.menu-content div');

  for (let i = 0; i < menuList.length; i++) {
    menuList[i].onclick = () => {
      lastClickedEl.classList.remove('visible');
      lastClickedEl = mains[i];
      mains[i].classList.toggle('visible');
      hideMenu();
    };
  };

  btnLogo.onclick = () => {
    lastClickedEl.classList.remove('visible');
    main.classList.add('visible');
    lastClickedEl = main;
    hideMenu();
  };
};

function hideMsgOfLoad() {
  let msgOfLoad = document.querySelector('.load');
  msgOfLoad.style.opacity = 0;

  setTimeout(() => {
//    msgOfLoad.style.display = "none";
    document.body.removeChild(msgOfLoad);
  }, 1100);
};

function hideMenu() {
  btnMenu.classList.remove('btn-active');
  menu.classList.add('left-hide');
  imgMenu.src = './res/icons/menu.png';
  document.getElementById('close').classList.add('none');
};

btnMenu.onclick = () => {
  btnMenu.classList.toggle('btn-active');
  menu.classList.toggle('left-hide');
  if (imgMenu.getAttribute('src') == "./res/icons/menu.png") {
    imgMenu.src = './res/icons/close2.png';
  } else {
    imgMenu.src = './res/icons/menu.png';
  };
  document.getElementById('close').classList.toggle('none');
}

btnCall.onclick = () => {
  let menuCall = document.querySelector('.menu-call');
  menuCall.classList.toggle('top-hide')
  btnCall.classList.toggle('btn-call-active');
  hideMenu();
};
