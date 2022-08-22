
let xy = [];
let elements = []
var vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
var vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
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
    var y = []
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
  var trs = document.getElementsByTagName("tr")
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
var time=0
function next() {
  if (toggle == 0) {
    return;
  }
  time+=1
  if(time%(100-document.getElementById("speedr").value)==0){
    time=0
  }
  else{
    return;
  }
  var tempxy = []
  for (i = 0; i < wcnt + 2; i++) {
    var y = []
    for (j = 0; j < hcnt + 2; j++) {
      y.push(0)
    }
    tempxy.push(y)
  }
  for (i = 1; i < wcnt + 1; i++) {
    for (j = 1; j < hcnt + 1; j++) {
      var around = xy[i - 1][j - 1] + xy[i][j - 1] + xy[i + 1][j - 1] + xy[i - 1][j] + xy[i + 1][j] + xy[i - 1][j + 1] + xy[i][j + 1] + xy[i + 1][j + 1]
      if (xy[i][j] == 1) {
        if ((around < 2 || around > 3)) {
          tempxy[i][j] = 0
        }
        else {
          tempxy[i][j] = 1
        }
      }
      else {
        if (around == 3) {
          tempxy[i][j] = 1
        }
        else {
          tempxy[i][j] = 0
        }
      }
    }
  }
  xy = tempxy
  display()
}
var toggle = 0
setInterval(next, 1);
function togglebtn() {
  toggle = !toggle
  document.getElementById("toggle").innerHTML = toggle ? "-- ON --" : "- OFF -"
}