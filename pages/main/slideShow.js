function slideShowStart () {
  let imgs = document.querySelectorAll('.main img');
  let i = 1;
  let lastI = imgs[0];

  setInterval( () => {
    lastI.classList.remove('show');
    imgs[i].classList.add('show');
    lastI = imgs[i];
    ++i == 4 ? i = 0 : null;
  }, 6000);
};
