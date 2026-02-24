"use strict";

let xy = [];
let elements = [];
let changexy = [];

const CELL_SIZE = 11;
let vw = 0;
let vh = 0;
let wcnt = 0;
let hcnt = 0;
let generation = 0;
let toggle = 0;
let isDrawing = false;
let drawValue = 1;

const speedSlider = () => document.getElementById("speedr");
const soundSwitch = () => document.getElementById("soundswitch");
const generationEl = () => document.getElementById("generation");
const liveCountEl = () => document.getElementById("live-count");
const boardWrap = () => document.getElementById("board-wrap");

const AudioCtx = window.AudioContext || window.webkitAudioContext;
const myAudioContext = AudioCtx ? new AudioCtx() : null;

function getDelayMs() {
  return 1000 - Number(speedSlider().value);
}

function initBoardSize() {
  vw = Math.max(boardWrap().clientWidth || 0, window.innerWidth || 0);
  vh = Math.max(boardWrap().clientHeight || 0, window.innerHeight || 0);
  wcnt = Math.max(12, Math.floor(vw / CELL_SIZE));
  hcnt = Math.max(12, Math.floor(vh / CELL_SIZE));
}

function buildGridArrays() {
  xy = [];
  for (let i = 0; i < wcnt + 2; i += 1) {
    xy.push(Array(hcnt + 2).fill(0));
  }
}

function load() {
  initBoardSize();
  buildGridArrays();

  const table = document.createElement("table");
  table.width = "100%";
  table.height = "100%";
  table.style.borderCollapse = "collapse";
  table.style.tableLayout = "fixed";
  table.style.margin = "0 auto";
  table.style.border = "0";

  for (let y = 0; y < hcnt; y += 1) {
    const tr = document.createElement("tr");
    let td = "";
    for (let x = 0; x < wcnt; x += 1) {
      const bg = (x % 2) !== (y % 2) ? "#EEEEEE" : "#DDDDDD";
      td += `<td bgcolor="${bg}" width="10" height="10" data-x="${x}" data-y="${y}" style="padding:0"></td>`;
    }
    tr.innerHTML = td;
    table.appendChild(tr);
  }

  boardWrap().innerHTML = "";
  boardWrap().appendChild(table);

  const trs = document.getElementsByTagName("tr");
  elements = [];
  for (let i = 0; i < trs.length; i += 1) {
    elements[i] = trs[i].getElementsByTagName("td");
  }

  bindUI();
  bindPaintEvents();
  seedInitialPattern();
  display();
  updateStatus();
  next();
}

function bindUI() {
  document.getElementById("clear-btn").addEventListener("click", () => {
    for (let x = 1; x < wcnt + 1; x += 1) {
      for (let y = 1; y < hcnt + 1; y += 1) {
        xy[x][y] = 0;
      }
    }
    generation = 0;
    updateStatus();
    display();
  });

  document.getElementById("random-btn").addEventListener("click", () => {
    for (let x = 1; x < wcnt + 1; x += 1) {
      for (let y = 1; y < hcnt + 1; y += 1) {
        xy[x][y] = 0;
      }
    }

    const halfW = Math.max(5, Math.floor(wcnt * 0.12));
    const halfH = Math.max(5, Math.floor(hcnt * 0.12));
    const centerX = Math.floor(wcnt / 2) + 1;
    const centerY = Math.floor(hcnt / 2) + 1;

    for (let x = Math.max(1, centerX - halfW); x <= Math.min(wcnt, centerX + halfW); x += 1) {
      for (let y = Math.max(1, centerY - halfH); y <= Math.min(hcnt, centerY + halfH); y += 1) {
        xy[x][y] = Math.random() > 0.68 ? 1 : 0;
      }
    }

    generation = 0;
    updateStatus();
    display();
  });
}

function setCell(x, y, value) {
  xy[x + 1][y + 1] = value;
}

function xyclick(x, y) {
  setCell(x, y, xy[x + 1][y + 1] ? 0 : 1);
  display();
  updateStatus();
}

function bindPaintEvents() {
  for (let y = 0; y < hcnt; y += 1) {
    for (let x = 0; x < wcnt; x += 1) {
      const cell = elements[y][x];
      cell.addEventListener("mousedown", (event) => {
        event.preventDefault();
        isDrawing = true;
        drawValue = xy[x + 1][y + 1] ? 0 : 1;
        setCell(x, y, drawValue);
        display();
        updateStatus();
      });
      cell.addEventListener("mouseenter", () => {
        if (!isDrawing) return;
        setCell(x, y, drawValue);
        display();
        updateStatus();
      });
      cell.addEventListener("click", (event) => {
        event.preventDefault();
      });
    }
  }

  document.addEventListener("mouseup", () => {
    isDrawing = false;
  });
  boardWrap().addEventListener("mouseleave", () => {
    isDrawing = false;
  });
}

function seedInitialPattern() {
  // R-pentomino: a well-known long-lived (methuselah) Life pattern.
  const centerX = Math.floor(wcnt / 2) + 1;
  const centerY = Math.floor(hcnt / 2) + 1;
  const offsets = [
    [0, -1],
    [1, -1],
    [-1, 0],
    [0, 0],
    [0, 1]
  ];

  for (let i = 0; i < offsets.length; i += 1) {
    const x = centerX + offsets[i][0];
    const y = centerY + offsets[i][1];
    if (x >= 1 && x <= wcnt && y >= 1 && y <= hcnt) {
      xy[x][y] = 1;
    }
  }
}

function display() {
  for (let x = 0; x < wcnt; x += 1) {
    for (let y = 0; y < hcnt; y += 1) {
      const isAlt = (x % 2) !== (y % 2);
      const alive = xy[x + 1][y + 1] === 1;
      if (!alive) {
        elements[y][x].bgColor = isAlt ? "#EEEEEE" : "#DDDDDD";
      } else {
        elements[y][x].bgColor = isAlt ? "#222222" : "#000000";
      }
    }
  }
}

function countLiveCells() {
  let live = 0;
  for (let x = 1; x < wcnt + 1; x += 1) {
    for (let y = 1; y < hcnt + 1; y += 1) {
      live += xy[x][y];
    }
  }
  return live;
}

function updateStatus() {
  generationEl().textContent = String(generation);
  liveCountEl().textContent = String(countLiveCells());
}

function next() {
  if (toggle === 0) {
    setTimeout(next, getDelayMs());
    return;
  }

  const tempxy = [];
  changexy = [];
  for (let i = 0; i < wcnt + 2; i += 1) {
    tempxy.push(Array(hcnt + 2).fill(0));
    changexy.push(Array(hcnt + 2).fill(0));
  }

  for (let x = 1; x < wcnt + 1; x += 1) {
    for (let y = 1; y < hcnt + 1; y += 1) {
      const around =
        xy[x - 1][y - 1] +
        xy[x][y - 1] +
        xy[x + 1][y - 1] +
        xy[x - 1][y] +
        xy[x + 1][y] +
        xy[x - 1][y + 1] +
        xy[x][y + 1] +
        xy[x + 1][y + 1];

      if (xy[x][y] === 1) {
        if (around < 2 || around > 3) {
          tempxy[x][y] = 0;
          changexy[x][y] = 1;
        } else {
          tempxy[x][y] = 1;
        }
      } else if (around === 3) {
        tempxy[x][y] = 1;
        changexy[x][y] = 1;
      }
    }
  }

  xy = tempxy;
  generation += 1;
  display();
  updateStatus();

  if (soundSwitch().checked) {
    makesound();
  }

  setTimeout(next, getDelayMs());
}

function makegroup() {
  const group = [];
  const colors = Array(wcnt + 2).fill(0).map(() => Array(hcnt + 2).fill(0));

  for (let i = 1; i < wcnt + 1; i += 1) {
    for (let j = 1; j < hcnt + 1; j += 1) {
      if (xy[i][j] === 1 && colors[i][j] === 0) {
        const color = group.length + 1;
        floodFill(i, j, color);
        group.push(getColoredCells(color));
      }
    }
  }

  return group;

  function floodFill(x, y, color) {
    if (x < 0 || x >= wcnt + 2 || y < 0 || y >= hcnt + 2) return;
    if (xy[x][y] !== 1 || colors[x][y] !== 0) return;
    colors[x][y] = color;
    floodFill(x - 2, y, color);
    floodFill(x + 2, y, color);
    floodFill(x, y - 2, color);
    floodFill(x, y + 2, color);
    floodFill(x - 1, y, color);
    floodFill(x + 1, y, color);
    floodFill(x, y - 1, color);
    floodFill(x, y + 1, color);
    floodFill(x - 1, y + 1, color);
    floodFill(x + 1, y - 1, color);
    floodFill(x - 1, y - 1, color);
    floodFill(x + 1, y + 1, color);
  }

  function getColoredCells(color) {
    const cells = [];
    for (let i = 1; i < wcnt + 1; i += 1) {
      for (let j = 1; j < hcnt + 1; j += 1) {
        if (colors[i][j] === color) {
          cells.push({ x: i, y: j });
        }
      }
    }
    return cells;
  }
}

function makesound() {
  const groups = makegroup();
  let gonnabeep = Array(15).fill(0);

  for (let i = 0; i < groups.length; i += 1) {
    const groupdoremi = groups[i].length % 15;
    gonnabeep[groupdoremi] += groups[i].length;

    const color = [
      "#3333AA", "#33AAAA", "#DD4444", "#DD7744", "#DDDD44",
      "#7777FF", "#77FFFF", "#FF7777", "#FFAA77", "#FFFF77",
      "#CCCCFF", "#CCFFFF", "#FFCCCC", "#FFDFCC", "#FFFFCC"
    ];

    for (let j = 0; j < groups[i].length; j += 1) {
      const cell = groups[i][j];
      elements[cell.y - 1][cell.x - 1].bgColor = color[groupdoremi];
    }
  }

  setTimeout(display, (getDelayMs() * 2) / 3);

  let volsum = 0;
  gonnabeep.forEach((x) => { volsum += x; });
  if (volsum !== 0) {
    gonnabeep = gonnabeep.map((x) => Math.round((x / volsum) * 50));
  }

  const freq = [
    391.9954 / 4, 440.0 / 4, 261.6256 / 2, 293.6648 / 2, 329.6276 / 2,
    391.9954 / 2, 440.0 / 2, 261.6256, 293.6648, 329.6276,
    391.9954, 440.0, 261.6256 * 2, 293.6648 * 2, 329.6276 * 2
  ];

  for (let i = 0; i < 15; i += 1) {
    if (gonnabeep[i] !== 0) {
      beep(getDelayMs(), freq[i], gonnabeep[i]);
    }
  }
}

function beep(duration, frequency, volume) {
  if (!myAudioContext) return;

  if (myAudioContext.state === "suspended") {
    myAudioContext.resume().catch(() => {});
  }

  const oscillatorNode = myAudioContext.createOscillator();
  const gainNode = myAudioContext.createGain();
  oscillatorNode.connect(gainNode);

  oscillatorNode.frequency.value = frequency;
  oscillatorNode.type = "sine";
  gainNode.connect(myAudioContext.destination);

  gainNode.gain.value = 0;
  gainNode.gain.linearRampToValueAtTime((volume || 50) * 0.01, myAudioContext.currentTime + 0.001);
  gainNode.gain.linearRampToValueAtTime(0, myAudioContext.currentTime + (duration + 400) * 0.001);

  oscillatorNode.start(myAudioContext.currentTime);
  oscillatorNode.stop(myAudioContext.currentTime + (duration + 400) * 0.001);
}

function togglebtn() {
  toggle = toggle ? 0 : 1;
  const button = document.getElementById("toggle");
  button.textContent = toggle ? "Pause" : "Start";
}

window.load = load;
window.togglebtn = togglebtn;
