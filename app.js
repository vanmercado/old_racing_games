const score = document.querySelector(".score");
const startScreen = document.querySelector(".startScreen");
const gameArea = document.querySelector(".gameArea");

startScreen.addEventListener("click", start);

let player = { speed: 6, score: 0 };

// For Key function
let keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
};

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

function keyDown(e) {
  e.preventDefault();
  keys[e.key] = true;
}

function keyUp(e) {
  e.preventDefault();
  keys[e.key] = false;
}

// For Collide car
// a = your car
// b = enemy car
function isCollide(a, b) {
  aRect = a.getBoundingClientRect();
  bRect = b.getBoundingClientRect();

  return !(
    aRect.top > bRect.bottom ||
    aRect.bottom < bRect.top ||
    aRect.right < bRect.left ||
    aRect.left > bRect.right
  );
}

// For road lines - moving effect  // 700 = the height of the screen
function moveLines() {
  let lines = document.querySelectorAll(".lines");

  lines.forEach(function (item) {
    if (item.y >= 3050) {
      item.y -= 3050;
    }

    item.y += player.speed;
    item.style.top = item.y + "px";
  });
}

// For move Enemy car
function moveEnemy(car) {
  let enemy = document.querySelectorAll(".enemy");

  enemy.forEach(function (item) {
    if (isCollide(car, item)) {
      endGame();
    }

    if (item.y >= 3240) {
      item.y = -355; //for enemy car seperation
      item.style.left = Math.floor(Math.random() * 350) + "px";
    }

    item.y += player.speed;
    item.style.top = item.y + "px";
  });
}

// for the racing game
function gamePlay() {
  let car = document.querySelector(".car");
  let road = gameArea.getBoundingClientRect();

  // For Player Controller
  if (player.start) {
    moveLines();
    moveEnemy(car);

    if (keys.ArrowUp && player.y > road.top + 70) {
      player.y -= player.speed;
    }

    if (keys.ArrowDown && player.y < road.bottom - 70) {
      player.y += player.speed;
    }

    if (keys.ArrowLeft && player.x > 0) {
      player.x -= player.speed;
    }

    if (keys.ArrowRight && player.x < road.width - 65) {
      player.x += player.speed;
    }

    car.style.top = player.y + "px";
    car.style.left = player.x + "px";

    // console.log("Hey im clicked");
    window.requestAnimationFrame(gamePlay);

    // For player score
    player.score++;
    let ps = player.score - 1; // to have accurate score display (minus 1)
    score.innerText = "Score: " + ps;
  }
}

// For Start Game
function start() {
  // gameArea.classList.remove("hide");
  startScreen.classList.add("hide");
  gameArea.innerHTML = ""; // for all append JS div will hide

  player.start = true;
  player.score = 0;
  window.requestAnimationFrame(gamePlay); //continuous animation number of loop

  // For Road Lines
  for (x = 0; x < 20; x++) {
    let roadLine = document.createElement("div");
    roadLine.setAttribute("class", "lines");
    roadLine.y = x * 153; // for road lines function moving
    gameArea.appendChild(roadLine);
  }

  // For Player Car
  let car = document.createElement("div");
  car.setAttribute("class", "car");
  gameArea.appendChild(car);

  player.x = car.offsetLeft;
  player.y = car.offsetTop;

  // For Enemy Car
  for (x = 0; x < 21; x++) {
    let enemyCar = document.createElement("div");
    enemyCar.setAttribute("class", "enemy");
    enemyCar.y = (x + 1) * 350 * -1;
    enemyCar.style.top = enemyCar.y + "px";
    enemyCar.style.backgroundColor = randomColor();
    enemyCar.style.left = Math.floor(Math.random() * 350) + "px";
    gameArea.appendChild(enemyCar);
  }
}
// For Colors
// 256 = for Hex number
function randomColor() {
  function c() {
    let hex = Math.floor(Math.random() * 256).toString(16);
    return ("0" + String(hex)).substr(-2);
  }
  return "#" + c() + c() + c();
}

// For Endgame
function endGame() {
  player.start = false;
  startScreen.classList.remove("hide");
  startScreen.innerHTML =
    "<b> Game Over <br> Your final score is:  " +
    player.score +
    "<br> Press here to restart the Game </b>";
}
