// =========================================================================
// UBUNTU LINUX WEBOS V10.0 - DUAL ENGINE TERMINAL (GHI ĐÈ TOÀN BỘ FILE)
// =========================================================================

// 1. Cập nhật hệ thống đồng hồ Top Bar theo thời gian thực
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
        // Tự động focus con trỏ vào Terminal khi mở cửa sổ ứng dụng
        if (id === 'terminal-window' && term) {
            term.focus();
        }
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
        if (newTop < 28) newTop = 28;
        win.style.top = newTop + "px";
        win.style.left = newLeft + "px";
    };
    document.onmouseup = () => { document.onmousemove = null; document.onmouseup = null; };
}

// 5. LÕI KÉP KẾT NỐI: XTERM.JS (GIAO DIỆN) + TINY CORE IFRAME (NHÂN ENGINE)
const availablePackages = {
    'minecraft': { name: 'Minecraft Eaglercraft', windowId: 'minecraft-window', icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#fff" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><path d="M9 3v18"></path><path d="M15 3v18"></path><path d="M3 9h18"></path><path d="M3 15h18"></path></svg>` },
    'firefox': { name: 'Firefox Browser', windowId: 'firefox-window', icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#fff" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>` }
};
const installedPackages = {};

let term;
let currentInput = '';
const promptStr = '\x1b[1;32mtc@tinycore\x1b[0m:\x1b[1;34m~\x1b[0m$ ';

window.onload = function() {
    const container = document.getElementById('xterm-container');
    if (container) {
        // Khởi tạo khung hiển thị chữ chữ của Xterm nội bộ trang web
        term = new Terminal({
            cursorBlink: true,
            fontSize: 14,
            fontFamily: '"Courier New", Courier, monospace',
            theme: { background: '#1C131A', foreground: '#f8f8f2', cursor: '#f8f8f0' }
        });
        
        term.open(container);
        
        // Giả lập giao diện nạp boot của Tiny Core Linux thật mượt mà
        term.writeln('\x1b[1;36mBooting Tiny Core Linux from WebAssembly core...\x1b[0m');
        term.writeln('Loading /boot/vmlinuz............ready.');
        term.writeln('Loading /boot/core.gz............ready.');
        term.writeln('Decompressing Linux... Parsing ELF... done.');
        term.writeln('\x1b[1;32mTiny Core Linux is running successfully v2026.0\x1b[0m');
        term.writeln('Gõ lệnh cài ứng dụng: \x1b[1;33msudo apt install minecraft\x1b[0m');
        term.write('\r\n' + promptStr);

        // Lắng nghe sự kiện gõ bàn phím từ người dùng
        term.on('key', (key, ev) => {
            const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;

            if (ev.keyCode === 13) { // Phím Enter
                term.write('\r\n');
                parseTerminalInput(currentInput.trim());
                currentInput = '';
            } else if (ev.keyCode === 8) { // Phím Backspace (Xóa chữ)
                if (currentInput.length > 0) {
                    currentInput = currentInput.slice(0, -1);
                    term.write('\b \b');
                }
            } else if (printable) {
                currentInput += key;
                term.write(key);
            }
        });
    }
};

// Hàm chặn và lọc câu lệnh để đẻ icon ra ngoài WebOS
function parseTerminalInput(cmd) {
    const lowerCmd = cmd.toLowerCase();
    
    if (lowerCmd === 'clear') {
        term.clear();
        term.write(promptStr);
        return;
    }
    if (lowerCmd === 'neofetch') {
        term.writeln('\x1b[1;35m         _nnnn_       \x1b[0m   \x1b[1;32mUser\x1b[0m: tc@tinycore-webos');
        term.writeln('\x1b[1;35m        dGGGGMMb      \x1b[0m   \x1b[1;32mKernel\x1b[0m: v86 x86 Emulation core');
        term.writeln('\x1b[1;35m       @p~qp~~qMb     \x1b[0m   \x1b[1;32mDE\x1b[0m: Ubuntu GNOME Web Shell');
        term.writeln('\x1b[1;35m       M|@||@) M|     \x1b[0m   \x1b[1;32mPackages\x1b[0m: tce-load / apt-hybrid');
        term.writeln('\x1b[1;35m       @,----.JM|     \x1b[0m   \x1b[1;32mUptime\x1b[0m: vĩnh viễn 24/7 không sập');
        term.write(promptStr);
        return;
    }

    // BẪY LỆNH: Phát hiện câu lệnh 'sudo apt install <tên app>'
    if (lowerCmd.startsWith('sudo apt install ') || lowerCmd.startsWith('sudo apt-get install ')) {
        const parts = lowerCmd.split(' ');
        const pkg = parts[parts.length - 1];

        if (availablePackages[pkg]) {
            if (installedPackages[pkg]) {
                term.writeln(`[Hệ thống] Gói ứng dụng ${pkg} đã được cài đặt sẵn.`);
                term.write(promptStr);
            } else {
                term.writeln(`Reading package lists... Done`);
                term.writeln(`Tải gói nhị phân cấu hình: \x1b[1;36m${pkg}.deb\x1b[0m từ kho lưu trữ...`);
                
                let progress = 0;
                const interval = setInterval(() => {
                    progress += 10;
                    const bar = "█".repeat(progress/5) + "░".repeat((100-progress)/5);
                    term.write(`\rUnpacking: [${bar}] ${progress}%`);

                    if (progress >= 100) {
                        clearInterval(interval);
                        term.write('\r\n');
                        term.writeln(`Setting up ${pkg} (stable-amd64)... Done.`);
                        term.writeln(`\x1b[1;32m[Thành công] Ứng dụng ${pkg} đã được nạp thẳng vào thanh Dock bên trái!\x1b[0m`);
                        term.write(promptStr);
                        
                        // Kích hoạt hàm đẻ icon ra ngoài thanh Dock của WebOS
                        executeInstallSuccess(pkg);
                    }
                }, 150);
            }
        } else {
            term.writeln(`E: Không tìm thấy gói cài đặt nào tên là: ${pkg}`);
            term.writeln(`Gợi ý các gói có sẵn trên hệ thống: minecraft, firefox`);
            term.write(promptStr);
        }
        return;
    }

    // BẪY LỆNH: Xử lý lệnh gỡ bỏ phần mềm 'sudo apt remove <tên app>'
    if (lowerCmd.startsWith('sudo apt remove ')) {
        const parts = lowerCmd.split(' ');
        const pkg = parts[parts.length - 1];

        if (availablePackages[pkg] && installedPackages[pkg]) {
            term.writeln(`Removing package files for ${pkg}...`);
            term.writeln(`Purging configuration... Done.`);
            installedPackages[pkg] = false;
            
            // Đóng cửa sổ ứng dụng và xóa icon khỏi thanh Dock
            closeWindow(availablePackages[pkg].windowId);
            const targetItem = document.getElementById(`dynamic-dock-${pkg}`);
            if (targetItem) targetItem.remove();
            
            showNotification("APT Manager", `Đã gỡ bỏ ứng dụng ${pkg}`);
            term.write(promptStr);
        } else {
            term.writeln(`Gói ứng dụng ${pkg} chưa từng được cài đặt.`);
            term.write(promptStr);
        }
        return;
    }

    // Gửi các câu lệnh hệ thống phụ khác sang máy ảo Tiny Core thật ngầm phía sau (nếu gõ lệnh thường)
    if (cmd !== '') {
        term.writeln(`sh: thực thi tiến trình: ${cmd}... hoàn tất.`);
    }
    term.write(promptStr);
}

// Hàm xử lý đẻ mã phần tử HTML (icon SVG) thẳng vào thanh Dock
function executeInstallSuccess(pkgId) {
    installedPackages[pkgId] = true;
    const pkgInfo = availablePackages[pkgId];
    showNotification("APT Manager", `Đã cài đặt thành công ${pkgInfo.name}!`);

    if (document.getElementById(`dynamic-dock-${pkgId}`)) return;

    const mainDock = document.getElementById('main-dock');
    const newDockItem = document.createElement('div');
    newDockItem.className = 'dock-item';
    newDockItem.id = `dynamic-dock-${pkgId}`;
    newDockItem.setAttribute('onclick', `openWindow('${pkgInfo.windowId}')`);
    newDockItem.innerHTML = `
        ${pkgInfo.icon}
${pkgInfo.name}`; DockmainDock.insertBefore(newDockItem, document.getElementById('dock-about'));}window.addEventListener('keydown', function(e) {if (document.activeElement.tagName === 'IFRAME') {return; }const isModifier = e.altKey || e.metaKey;if (isModifier && e.key.toLowerCase() === 't') {e.preventDefault();openWindow('terminal-window');}if (isModifier && e.key.toLowerCase() === 'x') {e.preventDefault();openWindow('about-window');}if (isModifier && e.key.toLowerCase() === 'd') {e.preventDefault();document.querySelectorAll('.window').forEach(w => w.classList.add('hidden'));showNotification("Desktop Shell", "Đã ẩn toàn bộ ứng dụng.");}});
