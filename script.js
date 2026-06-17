// =========================================================================
// UBUNTU LINUX WEBOS V8.0 - STANDALONE PERFECT SANDBOX (GHI ĐÈ TOÀN BỘ FILE)
// =========================================================================

// 1. Quản lý đồng hồ hệ thống theo thời gian thực
function updateClock() {
    const clockElement = document.getElementById('live-clock');
    if (clockElement) {
        const now = new Date();
        clockElement.innerText = now.toLocaleTimeString('vi-VN', { hour12: false });
    }
}
setInterval(updateClock, 1000);
updateClock();

// 2. Bộ quản lý đa nhiệm và tầng xếp đè Z-Index của các cửa sổ
let globalZIndex = 1000;

function openWindow(id) {
    const win = document.getElementById(id);
    if (win) {
        win.classList.remove('hidden');
        bringToFront(win);
    }
}

function closeWindow(id) {
    const win = document.getElementById(id);
    if (win) win.classList.add('hidden');
}

function toggleMaximize(id) {
    const win = document.getElementById(id);
    if (win) win.classList.toggle('maximized');
}

function bringToFront(win) {
    globalZIndex += 5;
    win.style.zIndex = globalZIndex;
}

// 3. Hệ thống hiển thị Pop-up thông báo nổi (Notification Toast)
function showNotification(title, msg) {
    const toast = document.getElementById('notification-toast');
    const tTitle = document.getElementById('toast-title');
    const tMsg = document.getElementById('toast-msg');
    
    if (toast && tTitle && tMsg) {
        tTitle.innerText = title;
        tMsg.innerText = msg;
        toast.classList.remove('hidden');
        setTimeout(() => { toast.classList.add('hidden'); }, 4000);
    }
}

// 4. Cơ chế di chuyển kéo thả các cửa sổ ứng dụng (GNOME Window Dragging)
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
        if (newTop < 28) newTop = 28; // Giới hạn không cho lọt qua thanh trạng thái trên cùng
        win.style.top = newTop + "px";
        win.style.left = newLeft + "px";
    };
    document.onmouseup = () => { document.onmousemove = null; document.onmouseup = null; };
}

// 5. GIẢ LẬP NHÂN LÕI KHO ỨNG DỤNG 'SUDO APT' CHẠY OFFLINE SANDBOX v8.0
const availablePackages = {
    'firefox': { name: 'Firefox Browser', icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#fff" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`, windowId: 'firefox-window' },
    'minecraft': { name: 'Minecraft Eaglercraft 1.8.8', icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#fff" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><path d="M9 3v18"></path><path d="M15 3v18"></path><path d="M3 9h18"></path><path d="M3 15h18"></path></svg>`, windowId: 'minecraft-window' }
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

            // In lại lịch sử dòng lệnh cũ ra màn hình Terminal
            printText(`ubuntu@webos:~$ ${rawInput}`, "#50fa7b");

            if(cmd === 'clear') {
                termHistory.innerHTML = '';
                return;
            }
            if(cmd === 'neofetch') {
                printText(`<b>OS:</b> Ubuntu Linux WebOS v6.5 Perfect<br><b>DE:</b> GNOME Web Shell Desktop<br><b>Kernel:</b> Engine Core x86_64<br><b>Shell:</b> Bash v5.2`);
                return;
            }
            if(cmd === 'help') {
                printText(`Các lệnh khả dụng:<br>- <span style='color:#ff79c6'>sudo apt install firefox</span> : Cài Firefox (Google)<br>- <span style='color:#ff79c6'>sudo apt install minecraft</span> : Cài Minecraft 1.8.8<br>- <span style='color:#ff5555'>sudo apt remove minecraft</span> : Gỡ ứng dụng khỏi hệ thống<br>- <span style='color:#ff79c6'>neofetch</span> : Cấu hình nhân OS<br>- <span style='color:#ff79c6'>clear</span> : Xóa màn hình Terminal`);
                return;
            }

            // Lệnh gỡ bỏ gói phần mềm
            if(cmd.startsWith('sudo apt remove ') || cmd.startsWith('sudo apt-get remove ')) {
                const parts = cmd.split(' ');
                const pkg = parts[parts.length - 1];

                if(availablePackages[pkg]) {
                    if(installedPackages[pkg]) {
                        printText(`Reading package lists... Done<br>Removing <b>${pkg}</b>... Done`, "#8be9fd");
                        installedPackages[pkg] = false;
                        closeWindow(availablePackages[pkg].windowId);
                        const targetItem = document.getElementById(`dynamic-dock-${pkg}`);
                        if(targetItem) targetItem.remove();

                        showNotification("APT Manager", `Đã gỡ cài đặt ${availablePackages[pkg].name}!`);
                        printText(`<span style='color:#ff5555;'>Đã gỡ bỏ ứng dụng ${pkg} khỏi thanh Dock.</span>`);
                    } else {
                        printText(`Gói phần mềm ${pkg} chưa được cài đặt.`, "#ffb86c");
                    }
                } else {
                    printText(`E: Không tìm thấy gói phần mềm ${pkg}.`, "#ff5555");
                }
                return;
            }

            // Lệnh cài đặt gói phần mềm
            if(cmd.startsWith('sudo apt install ') || cmd.startsWith('sudo apt-get install ')) {
                const parts = cmd.split(' ');
                const pkg = parts[parts.length - 1];

                if(availablePackages[pkg]) {
                    if(installedPackages[pkg]) {
                        printText(`Gói phần mềm ${pkg} đã được cài đặt sẵn.`, "#ffb86c");
                    } else {
                        printText(`Reading package lists... Done<br>Installing NEW packages: <b>${pkg}</b>`, "#8be9fd");
                        
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
                        }, 250);
                    }
                } else {
                    printText(`E: Unable to locate package ${pkg}. <br>Gói ứng dụng có sẵn: firefox, minecraft`, "#ff5555");
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

    printText(`Setting up ${pkgId}...<br><span style='color:#50fa7b;'>Cài đặt thành công! Biểu tượng mới đã xuất hiện trên thanh Dock.</span>`);
    showNotification("APT Manager", `Đã cài đặt thành công ${pkgInfo.name}!`);

    if(document.getElementById(`dynamic-dock-${pkgId}`)) return;

    const mainDock = document.getElementById('main-dock');
    const newDockItem = document.createElement('div');
    newDockItem.className = 'dock-item';
    newDockItem.id = `dynamic-dock-${pkgId}`;
    newDockItem.setAttribute('onclick', `openWindow('${pkgInfo.windowId}')`);
    newDockItem.innerHTML = `
        ${pkgInfo.icon}
        <span class="tooltip">${pkgInfo.name}</span>
    `;
    mainDock.insertBefore(newDockItem, document.getElementById('dock-about'));
}

// 6. HỆ THỐNG PHÍM TẮT ĐA NHIỆM THÔNG MINH (NHƯỜNG QUYỀN CHO GAME & TERMINAL)
window.addEventListener('keydown', function(e) {
    // Nếu người dùng đang bấm vào trong khung game Minecraft hoặc đang gõ ô lệnh thì nhường phím cho game/input
    if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'IFRAME') {
        return; 
    }

    const isModifier = e.altKey || e.metaKey; 

    if (isModifier && e.key.toLowerCase() === 't') {
        e.preventDefault();
        openWindow('terminal-window');
        document.getElementById('terminal-input').focus();
    }
    if (isModifier && e.key.toLowerCase() === 'x') {
        e.preventDefault();
        openWindow('about-window');
    }
    if (isModifier && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        document.querySelectorAll('.window').forEach(w => w.classList.add('hidden'));
        showNotification("Desktop Shell", "Đã ẩn toàn bộ ứng dụng.");
    }
});
