let dir = document.querySelector('.dir');

function initBtnDirs() {
  let dirsBtn = document.querySelectorAll('.dirs img');
  let slider = document.querySelector('.slider');
  let dirs = createImgsOfDirs();

  for (let i = 0; i < dirsBtn.length; i++) {
    dirsBtn[i].onclick = () => {
      dir.innerHTML = null;
      dir.innerHTML = dirs[i];
      dir.style.width = `${dir.childNodes.length*100}%`;
      slider.classList.remove('hide');
    };
  };
};

function createImgsOfDirs() {
  let img;
  let dirs = {
    dir1: ["b1.jpg","b2.jpg","k1.jpg","k2.jpg","k3.jpg","lr1.jpg","lr2.jpg"],
    dir2: ["bedroom2.1.jpg","bedroom2.3.jpg","bedroom2.4.jpg"],
    dir3: ["gostinaya1.jpg","gostinaya2.jpg","gostinaya3.jpg","gostinaya4.jpg"],
    dir4: ["View1.jpg","View3.jpg"]
  };

  for (let dir in dirs) {
    dirs[dir].forEach( (name, key) => {
      img = document.createElement('img');
      img.src = `./res/photos/${dir}/${name}`;
      img.style.width = `${100/dirs[dir].length}%`;
      img.classList.add('animate');
      img = img.outerHTML;
      dirs[dir].splice(key, 1, img);
    });
    dirs[dir] = dirs[dir].join('');
  };
  return Object.values(dirs);
};

function SliderInit() {
  let slider = document.querySelector('.slider');

  dir.translateX = 0;
  dir.step = 1;
  dir.getRate = () => 100/dir.childElementCount;

  slider.next = () => {
    if ( dir.step < dir.childElementCount ) {
      dir.translateX -= dir.getRate();
      dir.style.transform = `translateX(${dir.translateX}%)`;
      dir.step++
    };
  };

  slider.back = () => {
    if (dir.step > 1) {
      dir.translateX += dir.getRate();
      dir.style.transform = `translateX(${dir.translateX}%)`;
      dir.step--;
    };
  };

  document.querySelector('#btnBack').onclick = slider.back;
  document.querySelector('#btnNext').onclick = slider.next;

  let closeSlider = document.querySelector('.close');
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
    x = 0;
    startX = e.touches[0].clientX;
    dir.classList.remove('animate');

    (function step () {
      dir.style.transform = `translateX( calc(${x}px + ${dir.translateX}%) )`;
      requestID = requestAnimationFrame(step);
    })();
  };

  dir.ontouchmove = (e) => {
    e.preventDefault();
    x = Math.round(e.touches[0].clientX - startX);
  };

  dir.ontouchend = () => {
    window.cancelAnimationFrame(requestID);
    dir.classList.add('animate');

    if (x > 0 && dir.step == 1 || x < 0 && dir.step == dir.childElementCount) {
      dir.style.transform = `translateX(${dir.translateX}%)`;
      return
    };

    if (x > 0) {
      slider.back();
    };
    if (x < 0) {
      slider.next();
    };
  };
};
