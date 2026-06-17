// 1. Đồng hồ thời gian thực thanh trạng thái
function updateClock() {
    const clockElement = document.getElementById('live-clock');
    const now = new Date();
    clockElement.innerText = now.toLocaleTimeString('vi-VN', { hour12: false });
}
setInterval(updateClock, 1000);
updateClock();

// 2. Cơ chế Mở / Đóng và Đè cửa sổ ứng dụng (Z-Index)
let topZIndex = 100;
let windowPositions = {}; // Lưu trữ vị trí cũ trước khi phóng to toàn màn hình

function openWindow(id) {
    const win = document.getElementById(id);
    win.classList.remove('hidden', 'closing');
    
    // Tự động căn tọa độ ban đầu lệch nhau một chút để giao diện thoáng
    if (!win.style.top && !win.classList.contains('maximized')) {
        win.style.top = (50 + Math.random() * 50) + "px";
        win.style.left = (70 + Math.random() * 70) + "px";
    }
    
    bringToFront(win);
}

function closeWindow(id) {
    const win = document.getElementById(id);
    win.classList.add('closing');
    setTimeout(() => {
        win.classList.add('hidden');
    }, 150);
}

function bringToFront(clickedWindow) {
    topZIndex++;
    clickedWindow.style.zIndex = topZIndex;
}

// TÍNH NĂNG MỚI: Phóng to (Maximize) toàn màn hình và khôi phục kích cỡ cũ
function toggleMaximize(id) {
    const win = document.getElementById(id);
    if (win.classList.contains('maximized')) {
        win.classList.remove('maximized');
        // Khôi phục lại tọa độ cũ trước khi phóng to
        if (windowPositions[id]) {
            win.style.top = windowPositions[id].top;
            win.style.left = windowPositions[id].left;
            win.style.width = windowPositions[id].width;
            win.style.height = windowPositions[id].height;
        }
    } else {
        // Lưu lại vị trí hiện tại của app trước khi bung to rộng
        windowPositions[id] = {
            top: win.style.top,
            left: win.style.left,
            width: win.style.width,
            height: win.style.height
        };
        win.classList.add('maximized');
    }
}

// 3. Cơ chế xử lý Kéo - Thả cửa sổ
function dragElement(header, event) {
    const targetElement = header.parentElement;
    
    // Nếu cửa sổ đang bung full màn hình thì cấm không cho kéo đi lung tung
    if (targetElement.classList.contains('maximized')) return;

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

        if (newTop < 28) newTop = 28; // Giới hạn không cho kẹt trên thanh Top bar

        targetElement.style.top = newTop + "px";
        targetElement.style.left = newLeft + "px";
    }

    function closeDragElement() {
        document.onmousemove = null;
        document.onmouseup = null;
    }
}

// TÍNH NĂNG MỚI: Cơ chế đổi trang và cập nhật thanh URL của trình duyệt Firefox
function changeWebPage(url, title) {
    document.getElementById('browser-iframe').src = url;
    
