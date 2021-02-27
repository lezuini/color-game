const rgb = document.querySelector(".rgb");
const optionsNode = document.querySelectorAll(".option");
const result = document.querySelector(".result");
const streak = document.querySelector(".streak");
const body = document.getElementsByTagName("body");
const resetBtn = document.getElementById("reset");
const easyBtn = document.getElementById("easy");
const mediumBtn = document.getElementById("medium");
const hardBtn = document.getElementById("hard");
const clueBtn = document.getElementById("clue");
const panel = document.querySelector(".panel");
const difOptions = document.querySelector(".difficulty").children;
let time = document.querySelector(".time");
let color = [];
let fColor = "";
let variation = 30;
let allowClick = true;
let reset = true;
let pos = 0;
let diMode = "";
let hard = false;
let changingMode = false;
let timer = 0;

//Random Number Generator
function rng(amp) {
  let rn = Math.random();
  return Math.round(rn * amp);
}

//Generate random color
function getColor() {
  for (let i = 0; i < 3; i++) {
    color[i] = rng(255);
  }

  fColor = "rgb(" + color.join(", ") + ")";

  rgb.textContent = fColor;
}

function rag(num) {
  let v = [];
  for (let i = 0; i < 10; i++) {
    v[i] = num + num * i;
  }
  let rElement = Math.floor(Math.random() * v.length);

  return v[rElement];
}

function diff(color, variation) {
  let r = rag(variation);

  let sum = color + r;

  if (sum > 255) {
    let sub = sum - 255;
    sum = 255 - sub;
  }

  return sum;
}

function getSample() {
  let sample = [];

  for (let i = 0; i < 3; i++) {
    sample[i] = diff(color[i], variation);
  }
  return "rgb(" + sample + ")";
}

for (let i = 0; i < optionsNode.length; i++) {
  optionsNode[i].addEventListener("click", function () {
    if (!optionsNode[i].classList.contains("wrong")) {
      check(this);
    }
  });
}

function setColor(obj, color) {
  if (!color) {
    return obj.style.backgroundColor;
  }
  obj.style.backgroundColor = color;
}

function reload() {
  getColor();

  if (changingMode) {
    changingMode = false;
    setTimeout(() => {
      result.style.opacity = 0;
    }, 1000);
  } else {
    result.style.opacity = 0;
  }
  pos = rng(5);

  for (let i = 0; i < optionsNode.length; i++) {
    optionsNode[i].classList.remove("wrong");
    if (i !== pos) {
      setColor(optionsNode[i], getSample());
    } else {
      setColor(optionsNode[i], fColor);
    }
  }

  if (diMode === "hard") {
    if (hard) {
      hard = false;
      time.style.width = "0%";
      interval();
    }
  }
}

function setResult(text, val) {
  let value = streak.textContent;
  result.textContent = text;
  result.style.opacity = 1;
  if (val !== 0) {
    if (val === 1) {
      streak.classList.add("success");
    } else {
      streak.classList.add("clue");
    }
    streak.textContent = Number(value) + val;
  } else {
    streak.classList.add("failure");
    streak.textContent = 0;
  }
}

function timeOut() {
  streak.classList.remove("success");
  allowClick = true;
  setColor(body[0], "var(--body)");
  reload();
}

function showResult(num, text) {
  if (num === 1) {
    setResult("Correct!", num);

    allowClick = false;
    reset = true;

    for (let i = 0; i < optionsNode.length; i++) {
      setColor(optionsNode[i], fColor);
    }
    setColor(body[0], fColor);

    setTimeout(function () {
      timeOut();
    }, 1000);
  } else {
    if (text !== undefined) {
      setResult(text, num);
    } else {
      setResult("Incorrect!", num);
    }
    if (num === 0) {
      setTimeout(function () {
        streak.classList.remove("failure");
        if (allowClick) {
          result.style.opacity = 0;
        }
      }, 1000);
    } else {
      setTimeout(function () {
        streak.classList.remove("clue");
        result.style.opacity = 0;
      }, 1000);
    }
  }
}

function check(obj) {
  let bc = setColor(obj);

  if (allowClick) {
    if (bc == fColor) {
      showResult(1);
      if (diMode === "hard") {
        clearInterval(timer);
        timeCounter();
        hard = true;
      }
    } else {
      showResult(0);
      obj.classList.add("wrong");
    }
  }
}

function setDifficulty(obj, dif) {
  diMode = "";
  changingMode = true;
  variation = dif;
  for (let i = 0; i < difOptions.length; i++) {
    difOptions[i].classList.remove("modeC");
  }
  obj.classList.add("modeC");
  clearInterval(timer);
  timeCounter();
  showResult(0, "Difficulty changed");
}

easyBtn.addEventListener("click", function () {
  setDifficulty(this, 30);
  time.classList.remove("timeA");
  reload();
});
mediumBtn.addEventListener("click", function () {
  setDifficulty(this, 25);
  time.classList.remove("timeA");
  reload();
});

function timeCounter() {
  let tempTime = time.cloneNode(false);
  time.remove();
  time = tempTime;
  time.style.width = "100%";
  panel.insertBefore(time, panel.lastChild);
}

function interval() {
  timer = setInterval(function () {
    timeCounter();
    showResult(0, "Very slow");
    setTimeout(() => {
      time.style.width = "0%";
      reload();
      clearInterval(timer);
      interval();
    }, 1000);
  }, 8000);
}

hardBtn.addEventListener("click", function () {
  setDifficulty(this, 20);
  diMode = "hard";

  setTimeout(() => {
    time.style.width = "0%";
    interval();
  }, 1000);

  reload();
});

function rClue() {
  let i = rng(5);
  if (i !== pos) {
    return i;
  } else {
    return false;
  }
}

clueBtn.addEventListener("click", function () {
  let num = Number(streak.textContent);
  if (num > 0) {
    showResult(-1, "Clue");
    optionsNode[pos].classList.add("failure");
    setTimeout(() => {
      optionsNode[pos].classList.remove("failure");
    }, 1000);
  }
});

resetBtn.addEventListener("click", function () {
  if (reset) {
    reset = false;
    result.textContent = "Reseting";
    result.style.opacity = 1;
    setTimeout(() => {
      result.style.opacity = 0;
      reload();
    }, 500);
  }
});

window.onload = reload();
