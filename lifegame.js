
let xy = []
let elements = []
let groupxy = []
let changexy = []
let vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
let vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
let wcnt = Math.floor(vw / 11)
let hcnt = Math.floor(vh / 11)
function load() {
  let table = document.createElement('table');
  table.width = "100vw"
  table.height = "100vh"
  table.style.borderCollapse = "collapse"
  table.style.tableLayout = "fixed"
  table.style.borderWidth = "0px"
  table.style.margin = "0 auto"
  table.style.border = "1px solid black"

  for (i = 0; i < wcnt + 2; i++) {
    let y = []
    for (j = 0; j < hcnt + 2; j++) {
      y.push(0)
    }
    xy.push(y)
  }
  for (i = 0; i < hcnt; i++) {
    let tr = document.createElement('tr');
    let td = ""
    for (j = 0; j < wcnt; j++) {
      td += `<td bgcolor="${(i % 2) != (j % 2) ? "#EEEEEE" : "#DDDDDD"}" width="10px" height="10px" onclick="xyclick(${j},${i})" style="padding: 0px;"></td>`
    }
    tr.innerHTML = td;
    table.appendChild(tr);
  }
  document.getElementById('body').appendChild(table);
  let trs = document.getElementsByTagName("tr")
  for (i = 0; i < trs.length; i++) {
    elements[i] = trs[i].getElementsByTagName("td")
  }
}
function xyclick(x, y) {
  xy[x + 1][y + 1] = !xy[x + 1][y + 1]
  display()
}
function display() {
  for (i = 0; i < wcnt; i++) {
    for (j = 0; j < hcnt; j++) {
      if ((i % 2) != (j % 2)) {
        if (xy[i + 1][j + 1] == 0) {
          elements[j][i].bgColor = "#EEEEEE"
        }
        else {
          elements[j][i].bgColor = "#222222"
        }
      }
      else {
        if (xy[i + 1][j + 1] == 0) {
          elements[j][i].bgColor = "#DDDDDD"
        }
        else {
          elements[j][i].bgColor = "#000000"
        }
      }
    }
  }
}
let time = 0
function next() {
  if (toggle == 0) {
    return;
  }
  time += 1
  if (time % (100 - document.getElementById("speedr").value) == 0) {
    time = 0
  }
  else {
    return;
  }
  let tempxy = []
  for (i = 0; i < wcnt + 2; i++) {
    let y = []
    for (j = 0; j < hcnt + 2; j++) {
      y.push(0)
    }
    tempxy.push(y)
  }
  for (i = 0; i < wcnt + 2; i++) {
    let y = []
    for (j = 0; j < hcnt + 2; j++) {
      y.push(0)
    }
    changexy.push(y)
  }
  for (i = 1; i < wcnt + 1; i++) {
    for (j = 1; j < hcnt + 1; j++) {
      let around = xy[i - 1][j - 1] + xy[i][j - 1] + xy[i + 1][j - 1] + xy[i - 1][j] + xy[i + 1][j] + xy[i - 1][j + 1] + xy[i][j + 1] + xy[i + 1][j + 1]
      if (xy[i][j] == 1) {
        if ((around < 2 || around > 3)) {
          tempxy[i][j] = 0
          changexy[i][j] = 1
        }
        else {
          tempxy[i][j] = 1
        }
      }
      else {
        if (around == 3) {
          tempxy[i][j] = 1
          changexy[i][j] = 1
        }
        else {
          tempxy[i][j] = 0
        }
      }
    }
  }
  xy = tempxy
  display()
  if(document.getElementById("soundswitch").checked==1){
    makesound()
  }
}

function makegroup() {
  groupxy = JSON.parse(JSON.stringify(xy))
  for (i = 1; i < wcnt + 1; i++) {
    for (j = 1; j < hcnt + 1; j++) {
      if (xy[i][j] == 1) {
        groupxy[i - 2][j - 2] += 0.5
        groupxy[i - 2][j - 1] += 0.5
        groupxy[i - 2][j - 0] += 0.5
        groupxy[i - 2][j + 1] += 0.5
        groupxy[i - 2][j + 2] += 0.5
        groupxy[i - 1][j - 2] += 0.5
        groupxy[i - 1][j - 1] += 0.5
        groupxy[i - 1][j - 0] += 0.5
        groupxy[i - 1][j + 1] += 0.5
        groupxy[i - 1][j + 2] += 0.5
        groupxy[i - 0][j - 2] += 0.5
        groupxy[i - 0][j - 1] += 0.5
        groupxy[i - 0][j + 1] += 0.5
        groupxy[i - 0][j + 2] += 0.5
        groupxy[i + 1][j - 2] += 0.5
        groupxy[i + 1][j - 1] += 0.5
        groupxy[i + 1][j - 0] += 0.5
        groupxy[i + 1][j + 1] += 0.5
        groupxy[i + 1][j + 2] += 0.5
        groupxy[i + 2][j - 2] += 0.5
        groupxy[i + 2][j - 1] += 0.5
        groupxy[i + 2][j - 0] += 0.5
        groupxy[i + 2][j + 1] += 0.5
        groupxy[i + 2][j + 2] += 0.5
      }
    }
  }
  for (i = 0; i < wcnt + 2; i++) {
    for (j = 0; j < hcnt + 2; j++) {
      if (groupxy[i][j] >= 1) {
        groupxy[i][j] = 1
      }
      else {
        groupxy[i][j] = 0
      }
    }
  }
  let groupcount = 0
  let group = []
  function dfs(x, y) {
    if (x == 0 || x == wcnt + 1 || y == 0 || y == hcnt + 1) {
      return
    }
    if (groupxy[x][y] == 1) {
      group[groupcount].push({ x: x, y: y })
      groupxy[x][y] = 0
      dfs(x - 1, y)
      dfs(x + 1, y)
      dfs(x, y - 1)
      dfs(x, y + 1)
    }
  }
  for (i = 1; i < wcnt + 1; i++) {
    for (j = 1; j < hcnt + 1; j++) {
      if (groupxy[i][j] == 1) {
        group.push([])
        dfs(i, j)
        groupcount += 1
      }
    }
  }
  return group
}

function makesound() {
  let groups = makegroup()
  for (i = 0; i < groups.length; i++) {
    let groupdoremi = 0 //0~4 도레미솔라
    let groupcount = 0
    let leftup = { x: 10000, y: 10000 }
    let isthegroupmoved = 0
    for (j = 0; j < groups[i].length; j++) {
      if (changexy[groups[i][j].x][groups[i][j].y] == 1)
        isthegroupmoved = 1
      leftup.x = Math.min(leftup.x, groups[i][j].x)
      leftup.x = Math.min(leftup.y, groups[i][j].y)
    }
    if (isthegroupmoved == 0) {continue;}

    for (j = 0; j < groups[i].length; j++) {
      if (xy[groups[i][j].x][groups[i][j].y] == 1) {
        groupcount += 1
        groupdoremi += ((groups[i][j].x - leftup.x) % 2) * 2 + ((groups[i][j].y - leftup.y) % 2) + 1 //1 to 4
      }

    }
    groupdoremi %= 5 //0~4 도레미솔라
    //groupcount/=groups.length
    var freq = [261.6, 293.6, 329.6, 392.0, 440.0]
    beep(100, freq[groupdoremi], 50)

    var color = ["#FF7777","#FFAA77","#FFFF77","#77FFFF","#7777FF"]
    var coloroff = ["#FFCCCC","#FFDFCC","#FFFFCC","#CCFFFF","#CCCCFF"]
    for (j = 0; j < groups[i].length; j++) {
      if (xy[groups[i][j].x][groups[i][j].y] == 1) {
        elements[groups[i][j].y - 1][groups[i][j].x - 1].bgColor = color[groupdoremi]
        setTimeout(() => { display() }, 5)
      }
      else{
        elements[groups[i][j].y - 1][groups[i][j].x - 1].bgColor = coloroff[groupdoremi]
        setTimeout(() => { display() }, 5)
      }
    }
  }
}

const myAudioContext = new AudioContext();
function beep(duration, frequency, volume) {
  duration = duration
  frequency = frequency
  volume = volume || 50;
  let oscillatorNode = myAudioContext.createOscillator();
  let gainNode = myAudioContext.createGain();
  oscillatorNode.connect(gainNode);

  oscillatorNode.frequency.value = frequency;
  oscillatorNode.type = "sine";
  gainNode.connect(myAudioContext.destination);
  gainNode.gain.value = volume * 0.01;
  oscillatorNode.start(myAudioContext.currentTime);
  oscillatorNode.stop(myAudioContext.currentTime + duration * 0.001);

}

let toggle = 0
setInterval(next, 2);
function togglebtn() {
  toggle = !toggle
  document.getElementById("toggle").innerHTML = toggle ? "-- ON --" : "- OFF -"
}