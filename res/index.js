"use strict"
let [btnMenu, btnLogo, btnCall] = [...document.querySelectorAll('header > div')];
let imgMenu = document.querySelector('header img');
let mains = document.querySelectorAll('main > div:not(.main)');
let main = document.querySelector('.main');
let menu = document.getElementsByClassName('menu')[0];
let menuCall = document.getElementsByClassName('menu-call')[0];
let menuList = document.querySelectorAll('.menu-content div');
let content = document.getElementsByClassName('content')[0];
let slideBtns = document.querySelectorAll('.slideBtns div');
let closeSlider = document.querySelector('.close');
let dir = document.querySelector('.dir');
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

cacheImages("./res/photos/slideShow/", slider);
window.onload = () => {
  hideMsgOfLoad();
  id = slideShowStart(slider);
  initBtnsMenu();
  initBtnDirs();
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
      slider.classList.toggle('hide');

      let slide = new Slide(dir.childNodes);
      initTouchSlider(slide);

      slideBtns[0].onclick = slide.back;
      slideBtns[1].onclick = slide.next;
    };
  }

  closeSlider.onclick = (e) => {
    slider.classList.add('hide');
  };
};

function createImgsInDiv(path, arr, parent) {
  dir.innerHTML = null;
  let img;

  for (let name of arr) {
    img = document.createElement('img');
    img.src = `${path+name}`;
    img.classList.add('slideImg', 'animate');
    parent.appendChild(img);
  };

  img.style.transform = 'translateX(0)';
  img.style.position = 'relative';
};

function Slide(dirImg) {
  this.rightImgs = Array.from(dirImg);
  this.visibleImg = this.rightImgs.pop();
  this.leftImgs = [];
  this.time = 0;

  this.next = () => {
    if (!this.rightImgs.length || (Date.now() - this.time) < 600) return;
    this.visibleImg.style.position = 'absolute';
    this.visibleImg.style.transform = 'translateX(-100.1%)';
    this.leftImgs.push(this.visibleImg);

    this.visibleImg = this.rightImgs.pop();
    this.visibleImg.style.position = 'relative';
    this.visibleImg.style.transform = 'translateX(0)';
    this.time = Date.now();
  };

  this.back = () => {
    if (!this.leftImgs.length || (Date.now() - this.time) < 600) return;
    this.visibleImg.style.transform = 'translateX(100.1%)';
    this.visibleImg.style.position = 'absolute';
    this.rightImgs.push(this.visibleImg);

    this.visibleImg = this.leftImgs.pop();
    this.visibleImg.style.position = 'relative';
    this.visibleImg.style.transform = 'translateX(0)';
    this.time = Date.now();
  };
};

function initTouchSlider(slide) {
  let x = 0, startX, widthContent,
      lastItmR, lastItmL,
      requestID, intervalID;

  dir.ontouchstart = (e) => {
    widthContent = parseInt( getComputedStyle(dir).width );
    lastItmR = slide.rightImgs.length - 1;
    lastItmL = slide.leftImgs.length - 1;
    startX = e.touches[0].clientX;
    console.log(slide.leftImgs.length);

    slide.visibleImg.classList.remove('animate');;

    intervalID = setInterval( () => {
      if (x < 0 && slide.rightImgs.length) {
        slide.visibleImg.style.position = 'absolute';
        slide.rightImgs[lastItmR].classList.remove('animate');
        slide.rightImgs[lastItmR].style.position = 'relative';
      };
      if (x > 0 && slide.leftImgs.length) {
        if (slide.rightImgs.length) slide.rightImgs[lastItmR].style.position = 'absolute';
        slide.visibleImg.style.position = 'absolute';

        slide.leftImgs[lastItmL].classList.remove('animate');
        slide.leftImgs[lastItmL].style.position = 'relative';
      };
    }, 200);

    (function step () {
      if (x < 0 && slide.rightImgs.length) {
        slide.visibleImg.style.transform = `translateX(${x}px)`;
        slide.rightImgs[lastItmR].style.transform = `translateX(${widthContent + x}px)`;
      };
      if (x > 0 && slide.leftImgs.length) {
        slide.visibleImg.style.transform = `translateX(${x}px)`;
        slide.leftImgs[lastItmL].style.transform = `translateX(${-widthContent + x}px)`;
      };

      requestID = requestAnimationFrame(step);
    })()
  };

  dir.ontouchmove = (e) => {
    e.preventDefault();
    x = Math.round(e.touches[0].clientX - startX);
  };

  dir.ontouchend = () => {
    window.cancelAnimationFrame(requestID);
    window.clearInterval(intervalID);

    slide.visibleImg.classList.add('animate');
    if ( (x/widthContent <= -0.25) && slide.rightImgs.length ) {
      slide.rightImgs[lastItmR].classList.add('animate');
      slide.next();
    };
    if ( (x/widthContent >= 0.25) && slide.leftImgs.length ) {
      slide.leftImgs[lastItmL].classList.add('animate');
      slide.back();
    };
  };
}

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
  btnMenu.classList.remove('btn-active');
  menu.classList.add('menu-hide');
  imgMenu.src = './res/icons/menu.png';
};

btnMenu.onclick = () => {
  btnMenu.classList.toggle('btn-active');
  menu.classList.toggle('menu-hide');
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
