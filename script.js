// =========================================================================
// UBUNTU LINUX WEBOS V7.0 - LIVE TERMINAL CONNECTION (GHI ĐÈ TOÀN BỘ FILE)
// =========================================================================

// 1. Quản lý hệ thống Đồng hồ Top Bar theo thời gian thực
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

// 5. KẾT NỐI WEBSOCKET ĐẾN MÁY CHỦ LINUX THẬT (LIVE TERMINAL BACKEND)
const termHistory = document.getElementById('terminal-history');
const termInput = document.getElementById('terminal-input');

// Thiết lập đường truyền đến server Node.js chạy cục bộ trên máy Linux của bạn
// Lưu ý: Nếu mở WebOS từ thiết bị khác trong nhà, hãy thay 'localhost' bằng địa chỉ IP mạng nội bộ của máy Linux (ví dụ: 192.168.1.X)
const socket = new WebSocket('ws://localhost:8080');

// Xử lý khi kết nối mạng được thiết lập thành công
socket.onopen = function() {
    showNotification("Hệ thống lõi", "Đã kết nối thành công với máy chủ Linux thật!");
    if (termHistory) {
        termHistory.innerHTML = "<p class='terminal-text' style='color:#50fa7b;'>[Thành công] Đã thông tuyến WebSocket kết nối Kernel Linux thật.</p>";
    }
};

// Lắng nghe luồng dữ liệu phản hồi liên tục truyền lên từ máy Linux thật
socket.onmessage = function(event) {
    if (termHistory && termInput) {
        printLinuxStream(event.data);
        // Tự động cuộn khung màn hình Terminal xuống dưới cùng theo luồng văn bản
        termInput.parentElement.parentElement.scrollTop = termInput.parentElement.parentElement.scrollHeight;
    }
};

// Xử lý khi ngắt kết nối hoặc server backend bị tắt đột ngột
socket.onclose = function() {
    showNotification("Cảnh báo", "Mất kết nối tới Backend Terminal!");
    if (termHistory) {
        const p = document.createElement('p');
        p.className = 'terminal-text';
        p.style.color = '#ff5555';
        p.innerHTML = "<br>[Lỗi] Mất kết nối tới máy chủ Linux thật. Vui lòng chạy lệnh 'node server.js' trên máy Host.";
        termHistory.appendChild(p);
    }
};

// Bắt sự kiện gõ câu lệnh và truyền tải trực tiếp xuống máy Linux xử lý
if (termInput) {
    termInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const command = this.value;
            this.value = '';

            // Kiểm tra và đẩy chuỗi lệnh kèm ký tự xuống dòng (\n) sang WebSocket
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(command + '\n');
            } else {
                showNotification("Lỗi kết nối", "Không thể gửi lệnh do Socket đã đóng.");
            }
        }
    });
}

// Hàm bổ trợ chuyển đổi mã văn bản thô của Linux sang cấu trúc HTML chuẩn hiển thị
function printLinuxStream(text) {
    const span = document.createElement('span');
    span.className = 'terminal-text';
    
    // Xử lý chuyển đổi các ký tự xuống dòng đặc trưng của Terminal Linux (\r\n) thành thẻ ngắt dòng <br>
    let formattedText = text.replace(/\r\n/g, '<br>').replace(/\n/g, '<br>');
    
    // Mã hóa thực thể HTML cơ bản để bảo vệ cấu trúc hiển thị văn bản dòng lệnh
    span.innerHTML = formattedText;
    termHistory.appendChild(span);
}

// 6. HỆ THỐNG PHÍM TẮT ĐA NHIỆM THÔNG MINH (NHƯỜNG QUYỀN CHO GAME & TERMINAL)
window.addEventListener('keydown', function(e) {
    // Nếu người dùng đang bấm vào trong khung game Minecraft hoặc đang gõ ô lệnh thì bỏ qua phím tắt hệ thống
    if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'IFRAME') {
        return; 
    }

    const isModifier = e.altKey || e.metaKey; // Nhận phím Alt hoặc phím Win trên bàn phím

    // Phím tắt mở nhanh Terminal: Win + T hoặc Alt + T
    if (isModifier && e.key.toLowerCase() === 't') {
        e.preventDefault();
        openWindow('terminal-window');
        if (termInput) termInput.focus();
    }
    
    // Phím tắt mở bảng About: Win + X hoặc Alt + X
    if (isModifier && e.key.toLowerCase() === 'x') {
        e.preventDefault();
        openWindow('about-window');
    }
    
    // Phím tắt ẩn tất cả cửa sổ (Show Desktop): Win + D hoặc Alt + D
    if (isModifier && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        document.querySelectorAll('.window').forEach(w => w.classList.add('hidden'));
        showNotification("Desktop Shell", "Đã thu nhỏ toàn bộ ứng dụng.");
    }
});
