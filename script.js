// 1. Đồng hồ thời gian thực
function updateClock() {
    const clockElement = document.getElementById('live-clock');
    if(clockElement) {
        const now = new Date();
        clockElement.innerText = now.toLocaleTimeString('vi-VN', { hour12: false });
    }
}
setInterval(updateClock, 1000);
updateClock();

// 2. Quản lý Đóng/Mở/Đè cửa sổ tầng Z-index
let globalZIndex = 100;

function openWindow(id) {
    const win = document.getElementById(id);
    if(win) {
        win.classList.remove('hidden');
        bringToFront(win);
    } else {
        showNotification("Hệ thống", "Vui lòng cài đặt ứng dụng này bằng lệnh 'sudo apt install' trước!");
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

// 3. Xử lý tính năng thông báo Pop-up hệ thống
function showNotification(title, msg) {
    const toast = document.getElementById('notification-toast');
    document.getElementById('toast-title').innerText = title;
    document.getElementById('toast-msg').innerText = msg;
    toast.classList.remove('hidden');
    setTimeout(() => { toast.classList.add('hidden'); }, 4000);
}

// 4. Logic kéo thả cửa sổ Gtk
function dragElement(header, event) {
    const win = header.parentElement;
    if (win.classList.contains('maximized')) return; // Không cho kéo khi đang phóng to full màn
    bringToFront(win);

    let pos1 = 0, pos2 = 0, pos3 = event.clientX, pos4 = event.clientY;
    document.onmousemove = (e) => {
        pos1 = pos3 - e.clientX; pos2 = pos4 - e.clientY;
        pos3 = e.clientX; pos4 = e.clientY;
        let newTop = win.offsetTop - pos2;
        let newLeft = win.offsetLeft - pos1;
        if(newTop < 28) newTop = 28; // chặn văng ngoài topbar
        win.style.top = newTop + "px";
        win.style.left = newLeft + "px";
    };
    document.onmouseup = () => { document.onmousemove = null; document.onmouseup = null; };
}

// 5. GIẢ LẬP HỆ THỐNG KHO PHẦN MỀM 'SUDO APT INSTALL'
const availablePackages = {
    'firefox': { name: 'Firefox Browser', icon: 'fab fa-firefox-browser', windowId: 'firefox-window' },
    'music': { name: 'Rhythmbox Music', icon: 'fas fa-music', windowId: 'music-window' },
    'paint': { name: 'GNU Paint JS', icon: 'fas fa-paint-brush', windowId: 'firefox-window' },
    'doom': { name: 'Classic Doom Game', icon: 'fas fa-gamepad', windowId: 'doom-window' }
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

            // In lại dòng lệnh cũ ra màn hình Terminal
            printText(`ubuntu@webos:~$ ${rawInput}`, "#50fa7b");

            // Xử lý các câu lệnh
            if(cmd === 'clear') {
                termHistory.innerHTML = '';
                return;
            }
            if(cmd === 'neofetch') {
                printText(`<b>OS:</b> Ubuntu Linux WebOS v4.0<br><b>Kernel:</b> Javascript APT Engine x86_64<br><b>Shell:</b> bash 5.1.16<br><b>DE:</b> GNOME Shell (Web OS)`);
                return;
            }
            if(cmd === 'help') {
                printText(`Các lệnh khả dụng:<br>- <span style='color:#ff79c6'>sudo apt install [tên_app]</span> : Cài ứng dụng<br>- <span style='color:#ff79c6'>neofetch</span> : Xem cấu hình<br>- <span style='color:#ff79c6'>clear</span> : Xóa màn hình`);
                return;
            }

            // Phân tích cú pháp cài đặt gói phần mềm sudo apt
            if(cmd.startsWith('sudo apt install ') || cmd.startsWith('sudo apt-get install ')) {
                const parts = cmd.split(' ');
                const pkg = parts[parts.length - 1];

                if(availablePackages[pkg]) {
                    if(installedPackages[pkg]) {
                        printText(`Gói phần mềm ${pkg} đã được cài đặt sẵn ở phiên bản mới nhất.`, "#ffb86c");
                    } else {
                        // Kích hoạt tiến trình chạy giả lập download
                        printText(`Reading package lists... Done<br>Building dependency tree... Done<br>The following NEW packages will be installed: <b>${pkg}</b><br>Need to get 14.2 MB of archives.`, "#8be9fd");
                        
                        let progress = 0;
                        printText(`Progress: [..........] 0%`, "#ffb86c", `prog-${pkg}`);
                        
                        const interval = setInterval(() => {
                            progress += 20;
                            const bar = "█".repeat(progress/10) + "░".repeat((100-progress)/10);
                            const progLine = document.getElementById(`prog-${pkg}`);
                            if(progLine) progLine.innerHTML = `Progress: [${bar}] ${progress}%`;

                            if(progress >= 100) {
                                clearInterval(interval);
                                // Thực thi nạp ứng dụng vào hệ thống sau khi tải xong
                                installPackageSuccess(pkg);
                            }
                        }, 400);
                    }
                } else {
                    printText(`E: Unable to locate package ${pkg}. <br>Thử lại với các gói có sẵn: firefox, music, doom, paint`, "#ff5555");
                }
                return;
            }

            // Lệnh không hợp lệ
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

// 6. XỬ LÝ KHI CÀI ĐẶT THÀNH CÔNG: TỰ SINH ICON DOCK MỚI
function installPackageSuccess(pkgId) {
    installedPackages[pkgId] = true;
    const pkgInfo = availablePackages[pkgId];

    printText(`Setting up ${pkgId} (latest)...<br>Processing triggers for desktop-file-utils...<br><span style='color:#50fa7b;'>Đã cài đặt thành công ${pkgInfo.name}! Biểu tượng đã xuất hiện trên thanh Dock bên trái.</span>`);
    showNotification("APT Package Manager", `Đã cài đặt thành công ứng dụng ${pkgInfo.name}!`);

    // Kiểm tra xem icon đã tồn tại trên thanh Dock chưa, tránh tạo trùng lặp
    if(document.getElementById(`dynamic-dock-${pkgId}`)) return;

    // Tiến hành chèn trực tiếp một phần tử HTML mới vào thanh Dock bên trái
    const mainDock = document.getElementById('main-dock');
    const newDockItem = document.createElement('div');
    newDockItem.className = 'dock-item';
    newDockItem.id = `dynamic-dock-${pkgId}`;
    newDockItem.setAttribute('onclick', `openWindow('${pkgInfo.windowId}')`);
    newDockItem.innerHTML = `
        <i class="${pkgInfo.icon}"></i>
        <span class="tooltip">${pkgInfo.name}</span>
    `;
    
    // Đẩy icon mới lên trước nút thông tin About cuối thanh Dock
    mainDock.insertBefore(newDockItem, document.getElementById('dock-about'));
}

// 7. HỆ THỐNG PHÍM TẮT ĐA NHIỆM TOÀN DIỆN (SHORTCUTS KEYBOARD)
window.addEventListener('keydown', function(e) {
    // Để tránh xung đột phím hệ thống của máy thật, chúng ta giả định nút "Alt" hoặc nút "Meta/Win" làm phím chủ đạo
    const isModifier = e.altKey || e.metaKey; 

    // 1. Phím tắt mở Menu Ứng dụng: Alt + X hoặc Win + X
    if (isModifier && e.key.toLowerCase() === 'x') {
        e.preventDefault();
        openWindow('about-window');
        showNotification("Hệ thống phím tắt", "Đã kích hoạt Cửa sổ Menu Hệ thống");
    }

    // 2. Phím tắt mở nhanh Terminal: Alt + T hoặc Win + T
    if (isModifier && e.key.toLowerCase() === 't') {
        e.preventDefault();
        openWindow('terminal-window');
        document.getElementById('terminal-input').focus();
    }

    // 3. Phím tắt ẩn toàn bộ các cửa sổ về màn hình nền (Show Desktop): Alt + D hoặc Win + D
    if (isModifier && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        const windows = document.querySelectorAll('.window');
        windows.forEach(w => w.classList.add('hidden'));
        showNotification("Desktop Shell", "Đã ẩn tất cả ứng dụng về màn hình nền.");
    }
});
