const canvas = document.getElementById('lineCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

var buttons = Array.from(document.querySelectorAll('.runawayButton'));
var popupBubbles = buttons.map(() => {
  const bubble = document.createElement('div');
  bubble.classList.add('popup');
  document.body.appendChild(bubble);
  return bubble;
});
var isButtonMovedFirstTime = [false];
let vx = [0];
let vy = [0];
const friction = 0.95;
const threshold = 200;
let hue = 0;

function getDistance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function updatePopupBubblePosition() {
  for (let i = 0; i < buttons.length; i++) {
    const buttonRect = buttons[i].getBoundingClientRect();
    const popupRect = popupBubbles[i].getBoundingClientRect();
    const bubblePadding = 10;

    let bubbleX = buttonRect.left + buttonRect.width / 2 - popupRect.width / 2;
    let bubbleY = buttonRect.top - popupRect.height - bubblePadding;

    if (bubbleX < 0) {
      bubbleX = 0;
    } else if (bubbleX + popupRect.width > window.innerWidth) {
      bubbleX = window.innerWidth - popupRect.width;
    }

    if (bubbleY < 0) {
      bubbleY = buttonRect.bottom + bubblePadding;
    } else if (bubbleY + popupRect.height > window.innerHeight) {
      bubbleY = buttonRect.top - popupRect.height - bubblePadding;
    }

    popupBubbles[i].style.left = `${bubbleX}px`;
    popupBubbles[i].style.top = `${bubbleY}px`;

    popupBubbles[i].style.left = `${bubbleX}px`;
    popupBubbles[i].style.top = `${bubbleY}px`;

    // Update the triangle direction based on the position of the popup bubble
    if (buttonRect.top - popupRect.height - bubblePadding > 0) {
      popupBubbles[i].classList.add('popup-top');
      popupBubbles[i].classList.remove('popup-bottom');
    } else {
      popupBubbles[i].classList.add('popup-bottom');
      popupBubbles[i].classList.remove('popup-top');
    }
  }
}

function showPopupBubble(buttonIndex) {
  popupBubbles[buttonIndex].innerText = "What's the issue? Just click me!";
  popupBubbles[buttonIndex].classList.add('show-popup');
}

function showPopupBubble2(buttonIndex) {
  popupBubbles[buttonIndex].innerText = 'Could you do it if there were more of me?';
  popupBubbles[buttonIndex].classList.add('show-popup');
}

function showPopupBubble3(buttonIndex) {
  popupBubbles[buttonIndex].innerText = 'Please for the love of god, just click me!';
  popupBubbles[buttonIndex].classList.add('show-popup');
}

function hidePopupBubble(buttonIndex) {
  popupBubbles[buttonIndex].classList.remove('show-popup');
}


function moveButton() {
  const maxX = window.innerWidth - buttons[0].clientWidth;
  const maxY = window.innerHeight - buttons[0].clientHeight;
  for (let i = 0; i < buttons.length; i++) {
    let newX = buttons[i].offsetLeft + vx[i];
    let newY = buttons[i].offsetTop + vy[i];
    ctx.beginPath();
    ctx.moveTo(buttons[i].offsetLeft + buttons[i].clientWidth / 2, buttons[i].offsetTop + buttons[i].clientHeight / 2);
    ctx.lineTo(newX + buttons[i].clientWidth / 2, newY + buttons[i].clientHeight / 2);
    ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
    ctx.lineWidth = 2; 
    ctx.stroke();

    hue = (hue + 1) % 360;

    if (newX < 0) {
      newX = maxX;
    } else if (newX > maxX) {
      newX = 0;
    }

    if (newY < 0) {
      newY = maxY;
    } else if (newY > maxY) {
      newY = 0;
    }

    buttons[i].style.position = 'absolute';
    buttons[i].style.left = `${newX}px`;
    buttons[i].style.top = `${newY}px`;

    vx[i] *= friction;
    vy[i] *= friction;

    updatePopupBubblePosition();
  }
  requestAnimationFrame(moveButton);
}

let isButtonMoving = [];

document.addEventListener('mousemove', (event) => {
  for (let i = 0; i < buttons.length; i++) {
    const buttonRect = buttons[i].getBoundingClientRect();
    const buttonCenterX = buttonRect.left + buttonRect.width / 2;
    const buttonCenterY = buttonRect.top + buttonRect.height / 2;
    const distance = getDistance(event.clientX, event.clientY, buttonCenterX, buttonCenterY);

    const buttonSizeThreshold = Math.max(buttons[i].clientWidth, buttons[i].clientHeight);
    const dynamicThreshold = threshold + buttonSizeThreshold / 2;

    if (distance < dynamicThreshold) {
      const angle = Math.atan2(event.clientY - buttonCenterY, event.clientX - buttonCenterX);
      const speedFactor = 1 - distance / dynamicThreshold;
      const speed = 5 * speedFactor;

      vx[i] -= Math.cos(angle) * speed;
      vy[i] -= Math.sin(angle) * speed;

      isButtonMoving[i] = true;
    } else {
      isButtonMoving[i] = false;
    }

    if (isButtonMoving[i]) {
      ctx.beginPath();
      ctx.moveTo(event.clientX, event.clientY);
      ctx.lineTo(buttonCenterX, buttonCenterY);
      ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
      ctx.lineWidth = 2;
      ctx.stroke();
      updatePopupBubblePosition();

      if (!isButtonMovedFirstTime[i]) {
        let svg = document.getElementById('svg');
        svg.style.display = 'block'
        console.log("HERE:", i)
        isButtonMovedFirstTime[i] = true;
        setTimeout(() => showPopupBubble(i), 5000);
        setTimeout(() => hidePopupBubble(i), 7500);
        setTimeout(() => {
          showPopupBubble2(i);
          addRandomButtons();
        }, 10000);
        setTimeout(() => hidePopupBubble(i), 12500);
        setTimeout(() => showPopupBubble3(i), 15000);
      }

      hue = (hue + 1) % 360;
    }
  }
});

function addRandomButtons() {
  const numButtons = Math.floor(Math.random() * 3) + 2;
  for (let i = 0; i < numButtons; i++) {
    const newButton = document.createElement('button');
    newButton.classList.add('runawayButton');
    newButton.textContent = 'Click to Begin';
    newButton.onclick = refreshPage;
    newButton.style.left = `${Math.random() * (window.innerWidth - newButton.clientWidth)}px`;
    newButton.style.top = `${Math.random() * (window.innerHeight - newButton.clientHeight)}px`;
    document.body.appendChild(newButton);
    buttons.push(newButton);
    popupBubbles.push(createPopupBubble());
    isButtonMovedFirstTime.push(false);
    vx.push(0);
    vy.push(0);
  }
}

function createPopupBubble() {
  const bubble = document.createElement('div');
  bubble.classList.add('popup');
  document.body.appendChild(bubble);
  return bubble;
}

function refreshPage() {
  const currentUrl = new URL(window.location.href);
  currentUrl.searchParams.set('nocache', Date.now());
  window.location.href = currentUrl.toString();
}

moveButton();





