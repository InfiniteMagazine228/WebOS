// 1. Cập nhật đồng hồ Top Bar theo thời gian thực
function updateClock() {
    const clockElement = document.getElementById('live-clock');
    const now = new Date();
    clockElement.innerText = now.toLocaleTimeString('vi-VN', { hour12: false });
}
setInterval(updateClock, 1000);
updateClock();

// 2. Mở / Đóng cửa sổ và cơ chế đưa cửa sổ lên trên cùng
let topZIndex = 100;

function openWindow(id) {
    const win = document.getElementById(id);
    win.classList.remove('hidden', 'closing');
    
    // Tự động sắp xếp lệch nhau một chút để các ứng dụng không bị đè khít hoàn toàn lên nhau
    if (!win.style.top) {
        win.style.top = (60 + Math.random() * 60) + "px";
        win.style.left = (80 + Math.random() * 80) + "px";
    }
    
    bringToFront(win);
}

function closeWindow(id) {
    const win = document.getElementById(id);
    win.classList.add('closing');
    setTimeout(() => {
        win.classList.add('hidden');
    }, 180);
}

function bringToFront(clickedWindow) {
    topZIndex++;
    clickedWindow.style.zIndex = topZIndex;
}

// 3. Cơ chế kéo thả các cửa sổ Gtk Linux mượt mà
function dragElement(header, event) {
    const targetElement = header.parentElement;
    bringToFront(targetElement);

    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    pos3 = event.clientX;
    pos4 = event.clientY;
    
    document.onmousemove = elementDrag;
    document.onmouseup = closeDragElement;

    function elementDrag(e) {
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        
        let newTop = targetElement.offsetTop - pos2;
        let newLeft = targetElement.offsetLeft - pos1;

        if (newTop < 28) newTop = 28; // Giới hạn không cho lọt lên trên Topbar

        targetElement.style.top = newTop + "px";
        targetElement.style.left = newLeft + "px";
    }

    function closeDragElement() {
        document.onmousemove = null;
        document.onmouseup = null;
    }
}

// 4. Logic trình nghe nhạc Ubuntu (Music Player)
const audio = document.getElementById('bg-music');
const playBtn = document.getElementById('play-btn');
const disc = document.querySelector('.disc-anime');

function toggleMusic() {
    if (audio.paused) {
        audio.play().catch(err => console.log("Cần click chuột vào web trước để kích hoạt phát nhạc công khai"));
        playBtn.className = "fas fa-pause";
        disc.style.animationPlayState = "running";
    } else {
        audio.pause();
        playBtn.className = "fas fa-play";
        disc.style.animationPlayState = "paused";
    }
}

// 5. Trình xử lý câu lệnh hệ thống Terminal Linux
const terminalInput = document.getElementById('terminal-input');
if(terminalInput) {
    terminalInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const command = this.value.trim().toLowerCase();
            const body = this.parentElement.parentElement;
            
            const oldLine = document.createElement('p');
            oldLine.className = 'terminal-text';
            oldLine.innerHTML = `ubuntu@webos:~$ ${this.value}`;
            body.insertBefore(oldLine, this.parentElement);

            const responseLine = document.createElement('p');
            responseLine.className = 'terminal-text';

            if (command === 'help') {
                responseLine.innerHTML = "Lệnh khả dụng: <br>- <span style='color:#50fa7b'>neofetch</span>: Xem cấu hình hệ điều hành<br>- <span style='color:#8be9fd'>ls</span>: Xem danh sách các file tệp tin<br>- <span style='color:#ff79c6'>clear</span>: Xóa sạch màn hình dòng lệnh";
            } else if (command === 'neofetch') {
                responseLine.innerHTML = `
                    <span style='color:#e95420'><b>OS:</b></span> Ubuntu WebOS v2.5 Linux<br>
                    <span style='color:#e95420'><b>Host:</b></span> Vercel Cloud Server<br>
                    <span style='color:#e95420'><b>Kernel:</b></span> Browser JavaScript V8 Engine<br>
                    <span style='color:#e95420'><b>DE:</b></span> GNOME Web Shell`;
            } else if (command === 'ls') {
                responseLine.innerHTML = "<span style='color:#60A5FA'>Projects/</span> &nbsp;&nbsp; <span style='color:#60A5FA'>Photos/</span> &nbsp;&nbsp; kernel.c &nbsp;&nbsp; README.txt";
            } else if (command === 'clear') {
                const textLines = body.querySelectorAll('.terminal-text');
                textLines.forEach(line => line.remove());
                this.value = '';
                return;
            } else if (command !== "") {
                responseLine.innerHTML = `bash: không tìm thấy lệnh: ${command}. Gõ 'help' để xem danh sách lệnh.`;
                responseLine.style.color = '#ff5555';
            }

            if(command !== "") {
                body.insertBefore(responseLine, this.parentElement);
            }

            this.value = '';
            body.scrollTop = body.scrollHeight; 
        }
    });
}
