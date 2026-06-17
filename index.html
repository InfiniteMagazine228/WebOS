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
        // Tự động tối ưu căn chỉnh lại kích thước dòng của Xterm khi cửa sổ mở ra
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

// 5. KHỞI TẠO VÀ CẤU HÌNH LÕI NATIVE TERMINAL BẰNG XTERM.JS
const availablePackages = {
    'minecraft': { name: 'Minecraft Eaglercraft 1.8.8', windowId: 'minecraft-window' }
};
const installedPackages = {};

let term;
let currentInput = '';
const promptStr = '\x1b[1;32mubuntu@native-shell\x1b[0m:\x1b[1;34m~\x1b[0m$ ';

// Hàm khởi tạo lớp vẽ Xterm ngay khi trang tải xong
window.onload = function() {
    const container = document.getElementById('xterm-container');
    if (container) {
        // Cấu hình giao diện bảng chữ màu sắc cho Xterm (Hệ màu Dracula cực đẹp)
        term = new Terminal({
            cursorBlink: true,
            fontSize: 14,
            fontFamily: '"Courier New", Courier, monospace',
            theme: {
                background: '#1C131A',
                foreground: '#f8f8f2',
                cursor: '#f8f8f0'
            }
        });
        
        term.open(container);
        
        // Gõ lời chào hệ thống bằng mã ANSI Escape Color
        term.writeln('\x1b[1;35mWelcome to Ubuntu Linux WebOS v9.0 (Native Xterm Sandbox)\x1b[0m');
        term.writeln('Hệ thống lệnh gõ nội bộ chạy 24/7 siêu mượt.');
        term.writeln('Thử gõ câu lệnh sau: \x1b[1;33msudo apt install minecraft\x1b[0m');
        term.write('\r\n' + promptStr);

        // Đọc dữ liệu nhập phím từ người dùng gõ vào Xterm
        term.on('key', (key, ev) => {
            const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;

            if (ev.keyCode === 13) { // Phím Enter
                term.write('\r\n');
                handleCommand(currentInput.trim());
                currentInput = '';
            } else if (ev.keyCode === 8) { // Phím Backspace (Xóa chữ)
                if (currentInput.length > 0) {
                    currentInput = currentInput.slice(0, -1);
                    term.write('\b \b'); // Thao tác lùi con trỏ và xóa ký tự đồ họa của Xterm
                }
            } else if (printable) {
                currentInput += key;
                term.write(key);
            }
        });
    }
};

// Bộ não phân tích câu lệnh gõ trong Xterm
function handleCommand(cmd) {
    const lowerCmd = cmd.toLowerCase();
    
    if (lowerCmd === 'clear') {
        term.clear();
        term.write(promptStr);
        return;
    }
    if (lowerCmd === 'neofetch') {
        term.writeln('\x1b[1;31m         _nnnn_       \x1b[0m   \x1b[1;33mOS\x1b[0m: Ubuntu Linux WebOS v9.0 Stable');
        term.writeln('\x1b[1;31m        dGGGGMMb      \x1b[0m   \x1b[1;33mDE\x1b[0m: GNOME Shell Native Interface');
        term.writeln('\x1b[1;31m       @p~qp~~qMb     \x1b[0m   \x1b[1;33mKernel\x1b[0m: JavaScript Xterm Engine v9');
        term.writeln('\x1b[1;31m       M|@||@) M|     \x1b[0m   \x1b[1;33mShell\x1b[0m: bash 5.2.0-standalone');
        term.writeln('\x1b[1;31m       @,----.JM|     \x1b[0m   \x1b[1;33mUptime\x1b[0m: 24/7 Online via Vercel');
        term.writeln('\x1b[1;31m      JS^\\__/  qKL    \x1b[0m   \x1b[1;33mCPU\x1b[0m: Virtual Browser Core Intel/AMD');
        term.write(promptStr);
        return;
    }
    if (lowerCmd === 'help') {
        term.writeln('Các lệnh giả lập có sẵn:');
        term.writeln('  - \x1b[1;36msudo apt install minecraft\x1b[0m : Cài game Minecraft 1.8.8');
        term.writeln('  - \x1b[1;36msudo apt remove minecraft\x1b[0m  : Gỡ game khỏi hệ thống');
        term.writeln('  - \x1b[1;36mneofetch\x1b[0m                  : Hiện logo cánh cụt vẽ bằng ký tự');
        term.writeln('  - \x1b[1;36mclear\x1b[0m                     : Xóa sạch lịch sử màn hình chữ');
        term.write(promptStr);
        return;
    }

    // Logic xử lý cài đặt sudo apt install minecraft
    if (lowerCmd.startsWith('sudo apt install ') || lowerCmd.startsWith('sudo apt-get install ')) {
        const parts = lowerCmd.split(' ');
        const pkg = parts[parts.length - 1];

        if (availablePackages[pkg]) {
            if (installedPackages[pkg]) {
                term.writeln(`Gói phần mềm ${pkg} đã được cài đặt sẵn.`);
                term.write(promptStr);
            } else {
                term.writeln('Reading package lists... Done');
                term.writeln(`Installing NEW package: \x1b[1;32m${pkg}\x1b[0m`);
                
                let progress = 0;
                // Tạo hiệu ứng chạy thanh tiến trình tải tải thật trên Xterm
                const interval = setInterval(() => {
                    progress += 20;
                    const bar = "█".repeat(progress/10) + "░".repeat((100-progress)/10);
                    term.write(`\rProgress: [${bar}] ${progress}%`);

                    if (progress >= 100) {
                        clearInterval(interval);
                        term.write('\r\n');
                        term.writeln(`\x1b[1;32mSetting up ${pkg} (latest stable)... Done.\x1b[0m`);
                        term.writeln('Biểu tượng khối đất Minecraft đã xuất hiện trên thanh Dock!');
                        term.write(promptStr);
                        
                        // Kích hoạt sinh icon
                        executeInstallSuccess(pkg);
                    }
                }, 200);
            }
        } else {
            term.writeln(`E: Không tìm thấy gói phần mềm: ${pkg}. Thử gõ: sudo apt install minecraft`);
            term.write(promptStr);
        }
        return;
    }

    // Logic gỡ cài đặt app
    if (lowerCmd.startsWith('sudo apt remove ')) {
        const parts = lowerCmd.split(' ');
        const pkg = parts[parts.length - 1];

        if (availablePackages[pkg] && installedPackages[pkg]) {
            term.writeln(`Removing ${pkg}... Done.`);
            installedPackages[pkg] = false;
            closeWindow(availablePackages[pkg].windowId);
            const item = document.getElementById(`dynamic-dock-${pkg}`);
            if (item) item.remove();
            showNotification("APT Manager", `Đã gỡ bỏ thành công ${pkg}`);
            term.write(promptStr);
        } else {
            term.writeln(`Gói phần mềm ${pkg} chưa được cài đặt.`);
            term.write(promptStr);
        }
        return;
    }

    if (cmd !== '') {
        term.writeln(`bash: command not found: ${cmd}. Gõ 'help' để xem hướng dẫn.`);
    }
    term.write(promptStr);
}

function executeInstallSuccess(pkgId) {
    installedPackages[pkgId] = true;
    showNotification("APT Manager", `Cài đặt thành công Minecraft Eaglercraft!`);

    if (document.getElementById(`dynamic-dock-${pkgId}`)) return;

    const mainDock = document.getElementById('main-dock');
    const newDockItem = document.createElement('div');
    newDockItem.className = 'dock-item';
    newDockItem.id = `dynamic-dock-${pkgId}`;
    newDockItem.setAttribute('onclick', `openWindow('minecraft-window')`);
    newDockItem.innerHTML = `
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#fff" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><path d="M9 3v18"></path><path d="M15 3v18"></path><path d="M3 9h18"></path><path d="M3 15h18"></path></svg>
        <span class="tooltip">Minecraft Eaglercraft</span>
    `;
    mainDock.insertBefore(newDockItem, document.getElementById('dock-about'));
}

// 6. HỆ THỐNG PHÍM TẮT ĐA NHIỆM THÔNG MINH (NHƯỜNG QUYỀN CHO GAME & XTERM)
window.addEventListener('keydown', function(e) {
    // Nếu đang nhấp chuột chơi game Minecraft thì nhường phím tắt cho game, không cho kẹt phím
    if (document.activeElement.tagName === 'IFRAME') {
        return; 
    }

const isModifier = e.altKey || e.metaKey;if (isModifier && e.key.toLowerCase() === 't') {e.preventDefault();openWindow('terminal-window');}if (isModifier && e.key.toLowerCase() === 'x') {e.preventDefault();openWindow('about-window');}if (isModifier && e.key.toLowerCase() === 'd') {e.preventDefault();document.querySelectorAll('.window').forEach(w => w.classList.add('hidden'));showNotification("Desktop Shell", "Đã ẩn toàn bộ ứng dụng.");}});
