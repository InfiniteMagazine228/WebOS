// 1. Quản lý hệ thống Đồng hồ
function updateClock() {
    const clockElement = document.getElementById('live-clock');
    if(clockElement) {
        const now = new Date();
        clockElement.innerText = now.toLocaleTimeString('vi-VN', { hour12: false });
    }
}
setInterval(updateClock, 1000);
updateClock();

// 2. Cơ chế quản lý tầng xếp đè Z-Index cửa sổ ứng dụng
let globalZIndex = 100;

function openWindow(id) {
    const win = document.getElementById(id);
    if(win) {
        win.classList.remove('hidden');
        bringToFront(win);
    }
}

function closeWindow(id) {
    const win = document.getElementById(id);
    if(win) win.classList.add('hidden');
}

function toggleMaximize(id) {
    const win = document.getElementById(id);
    if(win) win.classList.toggle('maximized');
}

function bringToFront(win) {
    globalZIndex++;
    win.style.zIndex = globalZIndex;
}

// 3. Quản lý Pop-up thông báo hệ thống nổi (Notification Toast)
function showNotification(title, msg) {
    const toast = document.getElementById('notification-toast');
    document.getElementById('toast-title').innerText = title;
    document.getElementById('toast-msg').innerText = msg;
    toast.classList.remove('hidden');
    setTimeout(() => { toast.classList.add('hidden'); }, 4000);
}

// 4. Logic kéo thả cửa sổ Gtk Linux mượt mà
function dragElement(header, event) {
    const win = header.parentElement;
    if (win.classList.contains('maximized')) return;
    bringToFront(win);

    let pos1 = 0, pos2 = 0, pos3 = event.clientX, pos4 = event.clientY;
    document.onmousemove = (e) => {
        pos1 = pos3 - e.clientX; pos2 = pos4 - e.clientY;
        pos3 = e.clientX; pos4 = e.clientY;
        let newTop = win.offsetTop - pos2;
        let newLeft = win.offsetLeft - pos1;
        if(newTop < 28) newTop = 28; // Ngăn không cho lọt lên thanh Topbar
        win.style.top = newTop + "px";
        win.style.left = newLeft + "px";
    };
    document.onmouseup = () => { document.onmousemove = null; document.onmouseup = null; };
}

// 5. GIẢ LẬP KHO GÓI PHẦN MỀM 'SUDO APT INSTALL' NÂNG CAO
const availablePackages = {
    'firefox': { name: 'Firefox Browser', icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#fff" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`, windowId: 'firefox-window' },
    'doom': { name: 'Classic DOOM Game', icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#fff" stroke-width="2"><line x1="6" y1="12" x2="10" y2="12"></line><line x1="8" y1="10" x2="8" y2="14"></line><circle cx="15.5" cy="13" r="1"></circle><circle cx="18.5" cy="11" r="1"></circle><rect x="2" y="6" width="20" height="12" rx="3"></rect></svg>`, windowId: 'doom-window' }
};
const installedPackages = {};

const termInput = document.getElementById('terminal-input');
const termHistory = document.getElementById('terminal-history');

if(termInput) {
    termInput.addEventListener('keydown', function(e) {
        if(e.key === 'Enter') {
            const rawInput = this.value.trim();
            const cmd = rawInput.toLowerCase();
            this.value = '';

            if(!rawInput) return;

            printText(`ubuntu@webos:~$ ${rawInput}`, "#50fa7b");

            if(cmd === 'clear') {
                termHistory.innerHTML = '';
                return;
            }
            if(cmd === 'neofetch') {
                printText(`<b>OS:</b> Ubuntu Linux WebOS v5.0 Stable<br><b>DE:</b> GNOME Shell Desktop<br><b>Kernel:</b> Browser JS Engine x86_64<br><b>Shell:</b> Bash 5.2.0`);
                return;
            }
            if(cmd === 'help') {
                printText(`Các lệnh khả dụng:<br>- <span style='color:#ff79c6'>sudo apt install firefox</span> : Cài Firefox<br>- <span style='color:#ff79c6'>sudo apt install doom</span> : Cài Game DOOM<br>- <span style='color:#ff79c6'>neofetch</span> : Cấu hình OS<br>- <span style='color:#ff79c6'>clear</span> : Xóa lịch sử`);
                return;
            }

            // Thực thi tính năng nạp gói cài đặt apt-get
            if(cmd.startsWith('sudo apt install ') || cmd.startsWith('sudo apt-get install ')) {
                const parts = cmd.split(' ');
                const pkg = parts[parts.length - 1];

                if(availablePackages[pkg]) {
                    if(installedPackages[pkg]) {
                        printText(`Gói phần mềm ${pkg} đã được cài đặt sẵn ở phiên bản mới nhất.`, "#ffb86c");
                    } else {
                        printText(`Reading package lists... Done<br>Building dependency tree... Done<br>Installing NEW packages: <b>${pkg}</b>`, "#8be9fd");
                        
                        let progress = 0;
                        printText(`Progress: [..........] 0%`, "#ffb86c", `prog-${pkg}`);
                        
                        const interval = setInterval(() => {
                            progress += 20;
                            const bar = "█".repeat(progress/10) + "░".repeat((100-progress)/10);
                            const progLine = document.getElementById(`prog-${pkg}`);
                            if(progLine) progLine.innerHTML = `Progress: [${bar}] ${progress}%`;

                            if(progress >= 100) {
                                clearInterval(interval);
                                executeInstallSuccess(pkg);
                            }
                        }, 300);
                    }
                } else {
                    printText(`E: Unable to locate package ${pkg}. <br>Gói ứng dụng khả dụng: firefox, doom`, "#ff5555");
                }
                return;
            }

            printText(`bash: command not found: ${rawInput}. Gõ 'help' để xem hướng dẫn.`, "#ff5555");
        }
    });
}

function printText(text, color = "#fff", id = null) {
    const p = document.createElement('p');
    p.className = 'terminal-text';
    p.style.color = color;
    p.innerHTML = text;
    if(id) p.id = id;
    termHistory.appendChild(p);
    termInput.parentElement.parentElement.scrollTop = termInput.parentElement.parentElement.scrollHeight;
}

function executeInstallSuccess(pkgId) {
    installedPackages[pkgId] = true;
    const pkgInfo = availablePackages[pkgId];

    printText(`Setting up ${pkgId} (stable)...<br><span style='color:#50fa7b;'>Đã cấu hình thành công ứng dụng! Biểu tượng mới đã xuất hiện trên thanh Dock.</span>`);
    showNotification("APT Manager", `Đã cài đặt thành công ${pkgInfo.name}!`);

    if(document.getElementById(`dynamic-dock-${pkgId}`)) return;

    // Tự động sinh ra Icon SVG mới tinh chèn vào thanh Dock bên trái
    const mainDock = document.getElementById('main-dock');
    const newDockItem = document.createElement('div');
    newDockItem.className = 'dock-item';
    newDockItem.id = `dynamic-dock-${pkgId}`;
    newDockItem.setAttribute('onclick', `openWindow('${pkgInfo.windowId}')`);
    newDockItem.innerHTML = `
        ${pkgInfo.icon}
        <span class="tooltip">${pkgInfo.name}</span>
    `;
    
    // Đặt icon mới nằm phía trên nút About System cuối cùng
    mainDock.insertBefore(newDockItem, document.getElementById('dock-about'));
}

// 6. HỆ THỐNG PHÍM TẮT ĐA NHIỆM CHUYÊN NGHIỆP (SHORTCUTS)
window.addEventListener('keydown', function(e) {
    const isModifier = e.altKey || e.metaKey; // Nhận phím Alt hoặc phím Win hệ thống

    // Mở nhanh Terminal: Win + T hoặc Alt + T
    if (isModifier && e.key.toLowerCase() === 't') {
        e.preventDefault();
        openWindow('terminal-window');
        document.getElementById('terminal-input').focus();
    }

    // Mở Menu hệ thống: Win + X hoặc Alt + X
    if (isModifier && e.key.toLowerCase() === 'x') {
        e.preventDefault();
        openWindow('about-window');
    }

    // Ẩn tất cả về màn hình nền (Show Desktop): Win + D hoặc Alt + D
    if (isModifier && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        document.querySelectorAll('.window').forEach(w => w.classList.add('hidden'));
        showNotification("Desktop Shell", "Đã thu nhỏ toàn bộ ứng dụng.");
    }
});
