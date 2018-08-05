"use strict"
window.onload = () => {
  cacheImages("./res/photos/slideShow/", slider);
  hideMsgOfLoad();
  id = slideShowStart(slider);
  initBtnsMenu();
  initBtnDirs();
};
let btnMenu = document.querySelector('.btn-area');
let imgMenu = document.querySelector('.btn-menu');
let btnCall = document.querySelectorAll('header > div')[2];
let logo = document.querySelectorAll('header img')[0];
let mains = document.querySelectorAll('main > div:not(.main)');
let main = document.querySelector('.main');
let menu = document.getElementsByClassName('menu')[0];
let menuCall = document.getElementsByClassName('menu-call')[0];
let menuList = document.querySelectorAll('.menu-content div');
let content = document.getElementsByClassName('content')[0];
let slideBtns = document.querySelectorAll('.slideBtns div');
let closeSlider = document.querySelector('.close');
let dirs = document.querySelectorAll('.dir');
let msgOfLoad = document.querySelector('.load');
let slider = ["View1.jpg","View3.jpg","bedroom2.1.jpg","bedroom2.3.jpg"];
let dirsImg = [
  ["b1.jpg","b2.jpg","k1.jpg","k2.jpg","k3.jpg","lr1.jpg","lr2.jpg"],
  ["bedroom2.1.jpg","bedroom2.3.jpg","bedroom2.4.jpg"],
  ["gostinaya1.jpg","gostinaya2.jpg","gostinaya3.jpg","gostinaya4.jpg"],
  ["View1.jpg","View3.jpg"]
];
let id, img = [];
let lastClickedEl;

function cacheImages(path, arr) {
  for (let i = 0; i < arr.length; i++) {
    img.push(document.createElement('img'));
    img[i].src = path+arr[i];
  };
};

function initBtnDirs() {
  let dirsBtn = document.querySelectorAll('.dirs div');
  let slider = document.querySelector('.slider');

  for (let i = 0; i < dirs.length; i++) {
    createImgsInDiv(`./res/photos/dir${i+1}/`, dirsImg[i], dirs[i]);
    let slide = slideInit(dirs[i].childNodes);

    dirsBtn[i].onclick = () => {
      for (let dir of dirs) {
        dir.classList.add('sliderHide');
      };
      slider.classList.toggle('sliderHide');
      dirs[i].classList.remove('sliderHide');

      slideBtns[0].onclick = slide.back;
      slideBtns[1].onclick = slide.next;
    };

  };

  closeSlider.onclick = () => {
    slider.classList.add('sliderHide');
  };
};

function createImgsInDiv(path, arr, parent) {
    let div;
    for (let name of arr) {
      div = document.createElement('div');
      div.style.backgroundImage = `url(${path+name})`;
      div.classList.add('slideImg', 'backSlide');
      parent.appendChild(div);
    };
    div.style.transform = 'translateX(0)';
};

function slideInit(dirImg) {
  let leftImgs = Array.from(dirImg);
  let visibleImg = leftImgs.pop();
  let rightImgs = [];
  let time = 0;
  return {
    next: () => {
      if (!leftImgs.length || new Date() - time < 600) return;
      visibleImg.style.transform = 'translateX(-100.1%)';
      rightImgs.push(visibleImg);
      visibleImg = leftImgs.pop();
      visibleImg.style.transform = 'translateX(0)';
      time = new Date();
    },
    back: () => {
      if (!rightImgs.length || new Date() - time < 600) return;
      visibleImg.style.transform = 'translateX(100.1%)';
      leftImgs.push(visibleImg);
      visibleImg = rightImgs.pop();
      visibleImg.style.transform = 'translateX(0)';
      time = new Date();
    },
  };
};

function initBtnsMenu() {
  lastClickedEl = main;
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
  imgMenu.classList.remove('btn-close');
  btnMenu.classList.remove('btn-active');
  menu.classList.add('menu-hide');
}

btnMenu.onclick = () => {
  imgMenu.classList.toggle('btn-close');
  btnMenu.classList.toggle('btn-active');
  menu.classList.toggle('menu-hide');
};

logo.onclick = () => {
  lastClickedEl.style.display = "none";
  main.style.display = "flex";
  lastClickedEl = main;
  clearInterval(id);
  id = slideShowStart(slider);
};

btnCall.onclick = () => {
  btnCall.classList.toggle('btn-active');
  menuCall.classList.toggle('menu-call-hide')
};

window.onclick = (e) => {
  let arr = Array.from(e.path)
  arr = arr.filter( el => el == menu )

  let isMenuArea = e.path.some( (elem) => {
    return elem == btnMenu || elem == menu
  });
  if (!isMenuArea) hideMenuArea();
}
