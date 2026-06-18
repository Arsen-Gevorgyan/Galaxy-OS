let currentScreen = 'wel';
let username = '';

function showScreen(screen) {
    document.getElementById('wel').style.display = 'none';
    document.getElementById('lod').style.display = 'none';
    document.getElementById('bot').style.display = 'none';
    document.getElementById('reg').style.display = 'none';
    document.getElementById(screen).style.display = 'flex';
    currentScreen = screen;
}

setTimeout(function() {
    showScreen('lod');
    startLoading();
}, 3000);

function startLoading() {
    let progress = 0;
    let step = 0;
    let interval = setInterval(function() {
        step++;
        progress = Math.min(100, (step / 80) * 100);
        document.getElementById('prfil').style.width = progress + '%';
        
        let dots = '';
        for (let i = 0; i < Math.floor(step / 10) % 4; i++) {
            dots += '.';
        }
        document.getElementById('lodtxt').textContent = 'Loading' + dots;
        
        if (progress >= 100) {
            clearInterval(interval);
            document.getElementById('lodtxt').textContent = 'Loading complete!';
            setTimeout(function() { showScreen('bot'); }, 600);
        }
    }, 50);
}

document.addEventListener('keydown', function(e) {
    if (currentScreen === 'bot') showScreen('reg');
});

document.getElementById('bot').addEventListener('click', function() {
    if (currentScreen === 'bot') showScreen('reg');
});

let input = document.getElementById('usin');
let joinBtn = document.getElementById('enbut');
let errMsg = document.getElementById('errm');

input.addEventListener('input', function() {
    let val = input.value.trim();
    if (val.length === 0) {
        errMsg.style.display = 'none';
        joinBtn.disabled = true;
        return;
    }
    
    let isValid = /^[a-zA-Z]+$/.test(val) && val.length >= 4 && val.length <= 10;
    if (isValid) {
        errMsg.style.display = 'none';
        joinBtn.disabled = false;
    } else {
        errMsg.style.display = 'block';
        joinBtn.disabled = true;
    }
});

joinBtn.addEventListener('click', function() {
    let name = input.value.trim();
    if (/^[a-zA-Z]+$/.test(name) && name.length >= 4 && name.length <= 10) {
        username = name;
        enterDesktop(name);
    }
});

input.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !joinBtn.disabled) joinBtn.click();
});

function enterDesktop(name) {
    document.getElementById('desk').style.display = 'block';
    document.getElementById('welu').textContent = 'Welcome, ' + name;
    document.getElementById('setuser').textContent = name;
    
    document.getElementById('wel').style.display = 'none';
    document.getElementById('lod').style.display = 'none';
    document.getElementById('bot').style.display = 'none';
    document.getElementById('reg').style.display = 'none';
    
    startClock();
    loadSettings();
}

let clockTimer;

function startClock() {
    if (clockTimer) clearInterval(clockTimer);
    updateClock();
    clockTimer = setInterval(updateClock, 1000);
}

function updateClock() {
    let now = new Date();
    let use24 = document.getElementById('set24h').checked;
    let showSecs = document.getElementById('setsecs').checked;
    
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();
    
    if (!use24) {
        let ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;
        let timeStr = hours + ':' + minutes + (showSecs ? ':' + seconds : '') + ' ' + ampm;
        let dateStr = (now.getMonth()+1) + '/' + now.getDate() + '/' + now.getFullYear();
        document.getElementById('clk').textContent = dateStr + ' ' + timeStr;
    } else {
        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;
        let timeStr = hours + ':' + minutes + (showSecs ? ':' + seconds : '');
        let dateStr = (now.getMonth()+1) + '/' + now.getDate() + '/' + now.getFullYear();
        document.getElementById('clk').textContent = dateStr + ' ' + timeStr;
    }
}

showScreen('wel');
joinBtn.disabled = true;

let highestZ = 500;

function bringToFront(el) {
    highestZ++;
    el.style.zIndex = highestZ;
}

function openWin(id) {
    let win = document.getElementById(id);
    if (win) {
        win.style.display = 'flex';
        if (!win.style.top || win.style.top === '') {
            win.style.top = '100px';
            win.style.left = '100px';
        }
        bringToFront(win);
    }
}

document.querySelectorAll('.icon').forEach(function(icon) {
    icon.addEventListener('click', function() {
        openWin(this.dataset.window);
    });
});

document.querySelectorAll('.clsbtn').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        let win = this.closest('.win');
        if (win) win.style.display = 'none';
    });
});

document.querySelectorAll('.maxbtn').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        let win = this.closest('.win');
        if (!win) return;
        
        if (win.style.width === '100vw') {
            win.style.width = '';
            win.style.height = '';
            win.style.top = '100px';
            win.style.left = '100px';
        } else {
            win.style.width = '100vw';
            win.style.height = '100vh';
            win.style.top = '0';
            win.style.left = '0';
        }
    });
});

// Fix window dragging
document.querySelectorAll('.win').forEach(function(win) {
    let header = win.querySelector('.winh');
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    
    header.onmousedown = function(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = function() {
            document.onmouseup = null;
            document.onmousemove = null;
        };
        document.onmousemove = function(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            win.style.top = (win.offsetTop - pos2) + "px";
            win.style.left = (win.offsetLeft - pos1) + "px";
        };
        bringToFront(win);
    };
    
    win.addEventListener('mousedown', function() {
        bringToFront(this);
    });
});

// Tic Tac Toe
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameEnded = false;

function handleTTTClick(i) {
    if (gameEnded || board[i] != '') return;
    
    board[i] = currentPlayer;
    let cell = document.querySelector('.tttcell[data-index="' + i + '"]');
    cell.textContent = currentPlayer;
    
    let win = checkWin();
    if (win) {
        document.getElementById('tttstatus').textContent = win + ' wins!';
        gameEnded = true;
        return;
    }
    
    let empty = false;
    for (let i = 0; i < board.length; i++) {
        if (board[i] == '') empty = true;
    }
    if (!empty) {
        document.getElementById('tttstatus').textContent = "It's a draw!";
        gameEnded = true;
        return;
    }
    
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    document.getElementById('tttstatus').textContent = "Player " + (currentPlayer === 'X' ? '1' : '2') + "'s turn (" + currentPlayer + ")";
}

function checkWin() {
    if (board[0] != '' && board[0] == board[1] && board[0] == board[2]) return board[0];
    if (board[3] != '' && board[3] == board[4] && board[3] == board[5]) return board[3];
    if (board[6] != '' && board[6] == board[7] && board[6] == board[8]) return board[6];
    if (board[0] != '' && board[0] == board[3] && board[0] == board[6]) return board[0];
    if (board[1] != '' && board[1] == board[4] && board[1] == board[7]) return board[1];
    if (board[2] != '' && board[2] == board[5] && board[2] == board[8]) return board[2];
    if (board[0] != '' && board[0] == board[4] && board[0] == board[8]) return board[0];
    if (board[2] != '' && board[2] == board[4] && board[2] == board[6]) return board[2];
    return null;
}

document.querySelectorAll('.tttcell').forEach(function(cell) {
    cell.addEventListener('click', function() {
        handleTTTClick(parseInt(this.dataset.index));
    });
});

document.getElementById('tttreset').addEventListener('click', function() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameEnded = false;
    document.querySelectorAll('.tttcell').forEach(function(c) {
        c.textContent = '';
    });
    document.getElementById('tttstatus').textContent = "Player 1's turn (X)";
});

// Calendar
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

function renderCalendar() {
    let months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    document.getElementById('calmonth').textContent = months[currentMonth] + ' ' + currentYear;
    
    let first = new Date(currentYear, currentMonth, 1).getDay();
    let daysThisMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    let daysPrev = new Date(currentYear, currentMonth, 0).getDate();
    
    let today = new Date();
    let html = '';
    
    for (let i = first - 1; i >= 0; i--) {
        html += '<div class="calday other">' + (daysPrev - i) + '</div>';
    }
    
    for (let d = 1; d <= daysThisMonth; d++) {
        let isToday = (d === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear());
        html += '<div class="calday' + (isToday ? ' today' : '') + '">' + d + '</div>';
    }
    
    document.getElementById('caldays').innerHTML = html;
}

document.getElementById('calprev').addEventListener('click', function() {
    currentMonth--;
    if (currentMonth < 0) { currentMonth = 11; currentYear--; }
    renderCalendar();
});

document.getElementById('calnext').addEventListener('click', function() {
    currentMonth++;
    if (currentMonth > 11) { currentMonth = 0; currentYear++; }
    renderCalendar();
});

renderCalendar();

// Calculator
let calcExpression = '';
let display = document.getElementById('calcdisp');

document.querySelectorAll('.calcbtn').forEach(function(b) {
    b.addEventListener('click', function() {
        let v = this.dataset.val;
        
        if (v === 'C') {
            calcExpression = '';
            display.value = '';
            return;
        }
        
        if (v === '=') {
            try {
                calcExpression = eval(calcExpression) + '';
                display.value = calcExpression;
            } catch(e) {
                display.value = 'Error';
                calcExpression = '';
            }
            return;
        }
        
        calcExpression += v;
        display.value = calcExpression;
    });
});

// Translator
function caesar(str, shift, encode) {
    let s = encode ? shift : -shift;
    let result = '';
    for (let i = 0; i < str.length; i++) {
        let char = str[i];
        if (char >= 'a' && char <= 'z') {
            let code = ((char.charCodeAt(0) - 97 + s + 26) % 26) + 97;
            result += String.fromCharCode(code);
        } else if (char >= 'A' && char <= 'Z') {
            let code = ((char.charCodeAt(0) - 65 + s + 26) % 26) + 65;
            result += String.fromCharCode(code);
        } else {
            result += char;
        }
    }
    return result;
}

document.getElementById('transenc').addEventListener('click', function() {
    let input = document.getElementById('transin').value;
    let shift = parseInt(document.getElementById('transshift').value) || 2;
    document.getElementById('transout').textContent = caesar(input, shift, true);
});

document.getElementById('transdec').addEventListener('click', function() {
    let input = document.getElementById('transin').value;
    let shift = parseInt(document.getElementById('transshift').value) || 2;
    document.getElementById('transout').textContent = caesar(input, shift, false);
});

document.getElementById('transcopy').addEventListener('click', function() {
    let text = document.getElementById('transout').textContent;
    if (text) {
        navigator.clipboard.writeText(text);
        let orig = this.textContent;
        this.textContent = 'Copied!';
        setTimeout(function() { this.textContent = orig; }.bind(this), 1400);
    }
});

document.getElementById('transclear').addEventListener('click', function() {
    document.getElementById('transin').value = '';
    document.getElementById('transout').textContent = '';
});

// Theme
let darkMode = true;

document.getElementById('themebtn').addEventListener('click', function() {
    darkMode = !darkMode;
    if (!darkMode) {
        document.body.classList.add('light');
        this.textContent = 'Light';
    } else {
        document.body.classList.remove('light');
        this.textContent = 'Dark';
    }
    saveSettings();
});

function loadSettings() {
    let saved = localStorage.getItem('galaxyos');
    if (!saved) return;
    
    let s = JSON.parse(saved);
    
    if (s.theme === 'light') {
        darkMode = false;
        document.body.classList.add('light');
        document.getElementById('themebtn').textContent = 'Light';
    }
    
    if (s.bg) applyBackground(s.bg);
    
    if (s.secs !== undefined) document.getElementById('setsecs').checked = s.secs;
    if (s.h24 !== undefined) document.getElementById('set24h').checked = s.h24;
}

function saveSettings() {
    let settings = {
        theme: darkMode ? 'dark' : 'light',
        bg: document.body.dataset.bg || 'space',
        secs: document.getElementById('setsecs').checked,
        h24: document.getElementById('set24h').checked,
        user: document.getElementById('setuser').textContent
    };
    localStorage.setItem('galaxyos', JSON.stringify(settings));
}

function applyBackground(bg) {
    document.body.dataset.bg = bg;
    let colors = { space: '#0a0a1a', navy: '#0d0d24', black: '#000000' };
    let lightColors = { space: '#e8e8f0', navy: '#d0d0e0', black: '#f0f0f0' };
    
    let isLight = document.body.classList.contains('light');
    let color = isLight ? lightColors[bg] || '#e8e8f0' : colors[bg] || '#0a0a1a';
    
    document.body.style.background = color;
    document.querySelectorAll('.sc, #desk').forEach(function(el) {
        el.style.background = color;
    });
    saveSettings();
}

document.getElementById('setdark').addEventListener('click', function() {
    document.querySelectorAll('.setbtn').forEach(function(b) {
        b.classList.remove('active');
    });
    this.classList.add('active');
    if (!darkMode) document.getElementById('themebtn').click();
});

document.getElementById('setlight').addEventListener('click', function() {
    document.querySelectorAll('.setbtn').forEach(function(b) {
        b.classList.remove('active');
    });
    this.classList.add('active');
    if (darkMode) document.getElementById('themebtn').click();
});

document.getElementById('setbg1').addEventListener('click', function() {
    document.querySelectorAll('#set .setbtn').forEach(function(b) {
        b.classList.remove('active');
    });
    this.classList.add('active');
    applyBackground('space');
});

document.getElementById('setbg2').addEventListener('click', function() {
    document.querySelectorAll('#set .setbtn').forEach(function(b) {
        b.classList.remove('active');
    });
    this.classList.add('active');
    applyBackground('navy');
});

document.getElementById('setbg3').addEventListener('click', function() {
    document.querySelectorAll('#set .setbtn').forEach(function(b) {
        b.classList.remove('active');
    });
    this.classList.add('active');
    applyBackground('black');
});

document.getElementById('setsecs').addEventListener('change', function() {
    startClock();
    saveSettings();
});

document.getElementById('set24h').addEventListener('change', function() {
    startClock();
    saveSettings();
});

document.getElementById('setreset').addEventListener('click', function() {
    if (confirm('Reset all settings?')) {
        localStorage.removeItem('galaxyos');
        location.reload();
    }
});

document.addEventListener('DOMContentLoaded', function() {
    if (!darkMode) {
        document.getElementById('setlight').classList.add('active');
    }
});
