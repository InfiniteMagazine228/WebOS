// 1. Khởi chạy đồng hồ hệ thống
function updateClock() {
    const clockElement = document.getElementById('live-clock');
    if(clockElement) {
        const now = new Date();
        clockElement.innerText = now.toLocaleTimeString('vi-VN', { hour12: false });
    }
}
setInterval(updateClock, 1000);
updateClock();

// 2. Hệ thống quản lý Z-Index và Cửa sổ
let topZIndex = 100;
let windowPositions = {}; // Lưu vị trí cũ trước khi phóng to

function openWindow(id) {
    const win = document.getElementById(id);
    if (!win) return;
    win.classList.remove('hidden');
    
    // Tự động căn giữa nếu mở lần đầu
    if (!win.style.top || win.style.top === "") {
        win.style.top = (80 + Math.random() * 40) + "px";
        win.style.left = (120 + Math.random() * 60) + "px";
    }
    bringToFront(win);
    
    // Auto focus vào input nếu mở terminal
    if(id === 'terminal-window') {
        setTimeout(() => document.getElementById('terminal-input').focus(), 50);
    }
}

function closeWindow(id) {
    const win = document.getElementById(id);
    if (win) win.classList.add('hidden');
}

function toggleMaximize(id) {
    const win = document.getElementById(id);
    if(!win) return;
    if (win.classList.contains('maximized')) {
        win.classList.remove('maximized');
        // Khôi phục vị trí cũ
        win.style.top = windowPositions[id].top;
        win.style.left = windowPositions[id].left;
        win.style.width = windowPositions[id].width;
        win.style.height = windowPositions[id].height;
    } else {
        // Lưu vị trí trước khi phóng to
        windowPositions[id] = {
            top: win.style.top,
            left: win.style.left,
            width: win.style.width,
            height: win.style.height
        };
        win.classList.add('maximized');
    }
}

function bringToFront(clickedWindow) {
    topZIndex += 2;
    clickedWindow.style.zIndex = topZIndex;
}

// 3. Cơ chế kéo thả cửa sổ mượt mà độc lập
function dragElement(header, event) {
    const targetElement = header.parentElement;
    if (targetElement.classList.contains('maximized')) return; // Không cho kéo khi phóng to
    
    bringToFront(targetElement);
    let pos1 = 0, pos2 = 0, pos3 = event.clientX, pos4 = event.clientY;
    
    document.onmousemove = (e) => {
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        
        let newTop = targetElement.offsetTop - pos2;
        let newLeft = targetElement.offsetLeft - pos1;
        if (newTop < 28) newTop = 28; // Ngăn không vượt quá TopBar
        
        targetElement.style.top = newTop + "px";
        targetElement.style.left = newLeft + "px";
    };
    
    document.onmouseup = () => {
        document.onmousemove = null;
        document.onmouseup = null;
    };
}

// 4. Trung tâm thông báo hệ thống (Notification)
function showNotification(title, message) {
    const box = document.getElementById('notification-zone');
    document.getElementById('noti-title').innerText = title;
    document.getElementById('noti-body').innerText = message;
    box.classList.remove('hidden');
    setTimeout(() => box.classList.add('hidden'), 3500);
}

// 5. Trình phát nhạc nền
const audio = document.getElementById('bg-music');
const playBtn = document.getElementById('play-btn');
const disc = document.getElementById('music-disc');

function toggleMusic() {
    if(!audio) return;
    if (audio.paused) {
        audio.play().catch(() => showNotification("Hệ thống", "Vui lòng click vào màn hình một lần trước khi bật nhạc"));
        if(playBtn) playBtn.className = "fas fa-pause";
        if(disc) disc.style.animationPlayState = "running";
    } else {
        audio.pause();
        if(playBtn) playBtn.className = "fas fa-play";
        if(disc) disc.style.animationPlayState = "paused";
    }
}

// 6. GIẢ LẬP HỆ THỐNG QUẢN LÝ GÓI APT (SUDO APT INSTALL)
const installedApps = {
    'terminal': true,
    'browser': true,
    'about': true,
    'files-manager': false,
    'music-player': false
};

function executeAptInstall(appName, historyContainer, callback) {
    if (installedApps[appName] === true) {
        printTerminalLine(`apt: ${appName} đã được cài đặt phiên bản mới nhất.`, historyContainer);
        callback();
        return;
    }

    if (appName !== 'files-manager' && appName !== 'music-player') {
        printTerminalLine(`<span style="color:#ff5555">E: Không tìm thấy gói ứng dụng mang tên: ${appName}</span>`, historyContainer);
        callback();
        return;
    }

    printTerminalLine(`Đang đọc danh sách gói dữ liệu... Hoàn thành`, historyContainer);
    printTerminalLine(`Đang phân tích cây phụ thuộc... Hoàn thành`, historyContainer);
    printTerminalLine(`Các gói bổ sung sau đây sẽ được cài đặt: <span style="color:#50fa7b">${appName}</span>`, historyContainer);
    printTerminalLine(`Mức độ tải về: 4.2 MB / Giải nén: 12.8 MB`, historyContainer);

    let progress = 0;
    const progressLine = document.createElement('p');
    progressLine.className = 'terminal-text';
    historyContainer.appendChild(progressLine);

    const interval = setInterval(() => {
        progress += 20;
        progressLine.innerHTML = `Đang tải: [${'#'.repeat(progress/10)}${'.'.repeat((100-progress)/10)}] ${progress}%`;
        
        if (progress >= 100) {
            clearInterval(interval);
            printTerminalLine(`<span style="color:#50fa7b">Cài đặt hoàn tất thành công gói: ${appName}!</span>`, historyContainer);
            
            // Đánh dấu đã cài đặt
            installedApps[appName] = true;
            
            // TỰ ĐỘNG THÊM ICON LÊN DOCK BẰNG JAVASCRIPT
            injectAppIconToDock(appName);
            showNotification("APT Manager", `Đã cài đặt thành công ${appName}!`);
            callback();
        }
    }, 300);
}

function printTerminalLine(text, container) {
    const p = document.createElement('p');
    p.className = 'terminal-text';
    p.innerHTML = text;
    container.appendChild(p);
}

function injectAppIconToDock(appName) {
    const dock = document.getElementById('ubuntu-dock');
    const aboutIcon = document.querySelector('.settings-icon');
    
    // Kiểm tra xem icon đã tồn tại chưa để tránh trùng lặp
    if (document.querySelector(`[data-app="${appName}"]`)) return;

    const newIcon = document.createElement('div');
    newIcon.className = 'dock-item';
    newIcon.setAttribute('data-app', appName);

    if (appName === 'files-manager') {
        newIcon.setAttribute('onclick', "openWindow('files-window')");
        newIcon.innerHTML = `<i class="fas fa-folder-open"></i><span class="tooltip">Files Manager</span>`;
    } else if (appName === 'music-player') {
        newIcon.setAttribute('onclick', "openWindow('music-window')");
        newIcon.innerHTML = `<i class="fas fa-music"></i><span class="tooltip">Music Player</span>`;
    }

    // Chèn icon mới lên ngay phía trước nút About (nút đáy dock)
    dock.insertBefore(newIcon, aboutIcon);
}

// 7. Bộ xử lý nhập lệnh Terminal (Bao gồm rẽ nhánh lệnh APT)
const terminalInput = document.getElementById('terminal-input');
const historyContainer = document.getElementById('terminal-history-container');

if(terminalInput) {
    // Luôn focus vào ô nhập lệnh khi người dùng click vào khoảng trống bất kỳ trong Terminal
    document.getElementById('terminal-window').addEventListener('click', () => {
        terminalInput.focus();
    });

    terminalInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const rawInput = this.value.trim();
            const command = rawInput.toLowerCase();
            
            if(rawInput === "") return;

            // In lại lệnh vừa gõ lên màn hình lịch sử
            printTerminalLine(`ubuntu@webos:~$ ${rawInput}`, historyContainer);
            this.value = ''; // Xóa sạch ô nhập ngay lập tức
            terminalInput.disabled = true; // Khóa input tạm thời để chờ chạy apt tải ứng dụng

            const finishCmd = () => {
                terminalInput.disabled = false;
                terminalInput.focus();
                const body = document.getElementById('terminal-window').querySelector('.terminal-body');
                body.scrollTop = body.scrollHeight;
            };

            // Kiểm tra lệnh sudo apt install hoặc apt-get install
            if (command.startsWith('sudo apt install ') || command.startsWith('sudo apt-get install ') || command.startsWith('apt install ')) {
                const parts = command.split(' ');
                const targetApp = parts[parts.length - 1];
                executeAptInstall(targetApp, historyContainer, finishCmd);
                return;
            }

            // Xử lý các câu lệnh Linux cơ bản khác
            if (command === 'help') {
                printTerminalLine("Lệnh hệ thống: <br>- <span style='color:#50fa7b'>neofetch</span>: Kiểm tra thông tin phần cứng<br>- <span style='color:#8be9fd'>ls</span>: Liệt kê danh sách file<br>- <span style='color:#ff79c6'>sudo apt install [tên_app]</span>: Cài ứng dụng<br>- <span style='color:#bd93f9'>clear</span>: Xóa màn hình dòng lệnh", historyContainer);
            } else if (command === 'neofetch') {
                printTerminalLine(`
                    <span style='color:#e95420'><b>OS:</b></span> Ubuntu WebOS v3.0 x86_64<br>
                    <span style='color:#e95420'><b>Kernel:</b></span> APT Mock Engine 1.0.4<br>
                    <span style='color:#e95420'><b>DE:</b></span> GNOME WebShell Realtime<br>
                    <span style='color:#e95420'><b>Shell:</b></span> JavaScript-bash v3`, historyContainer);
            } else if (command === 'ls') {
                let fileList = "kernel.c &nbsp;&nbsp; README.txt";
                if(installedApps['files-manager']) fileList += " &nbsp;&nbsp; <span style='color:#8be9fd'>Desktop/</span>";
printTerminalLine(fileList, historyContainer);} else if (command === 'clear') {historyContainer.innerHTML = '';} else {printTerminalLine(bash: command not found: ${rawInput}. Gõ 'help' để xem hướng dẫn., historyContainer);}finishCmd();}});}
