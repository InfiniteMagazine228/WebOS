// Đợi DOM tải hoàn tất mới chạy để tránh tuyệt đối lỗi treo luồng xử lý
document.addEventListener("DOMContentLoaded", function() {
    
    // 1. Cập nhật đồng hồ hệ thống theo thời gian thực
    const clockElement = document.getElementById('live-clock');
    if (clockElement) {
        function updateClock() {
            const now = new Date();
            clockElement.innerText = now.toLocaleTimeString('vi-VN', { hour12: false });
        }
        setInterval(updateClock, 1000);
        updateClock();
    }

    // 2. Trình xử lý câu lệnh hệ thống Terminal Linux
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
                    responseLine.innerHTML = "Lệnh khả dụng: <br>- <span style='color:#50fa7b'>neofetch</span>: Thông tin hệ thống<br>- <span style='color:#8be9fd'>ls</span>: Xem danh sách tệp tin<br>- <span style='color:#ff79c6'>clear</span>: Xóa sạch dòng lệnh";
                } else if (command === 'neofetch') {
                    responseLine.innerHTML = `
                        <span style='color:#e95420'><b>OS:</b></span> Ubuntu WebOS v3.0 x86_64<br>
                        <span style='color:#e95420'><b>Host:</b></span> Itch.io Player Platform<br>
                        <span style='color:#e95420'><b>Shell:</b></span> Native JS Engine Shell`;
                } else if (command === 'ls') {
                    responseLine.innerHTML = "Projects/ &nbsp;&nbsp; Photos/ &nbsp;&nbsp; kernel.c &nbsp;&nbsp; README.txt";
                } else if (command === 'clear') {
                    const textLines = body.querySelectorAll('.terminal-text');
                    textLines.forEach(line => line.remove());
                    this.value = '';
                    return;
                } else if (command !== "") {
                    responseLine.innerHTML = `bash: command not found: ${command}.`;
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

    // 3. Hệ thống LẮNG NGHE PHÍM TẮT TOÀN CỤC (Keyboard Shortcuts)
    window.addEventListener('keydown', function(e) {
        // Kiểm tra xem người dùng có giữ phím Super/Win (hoặc Alt/Meta tùy hệ điều hành) hay không
        const isSuper = e.metaKey || e.winKey || e.altKey || e.ctrlKey;

        if (isSuper) {
            // Khóa các hành vi mặc định của trình duyệt để ưu tiên cho WebOS
            if(['t','b','f','m','d'].includes(e.key.toLowerCase())) {
                e.preventDefault();
            }

            switch(e.key.toLowerCase()) {
                case 't': // Win + T: Mở Terminal
                    openWindow('terminal-window');
                    break;
                case 'b': // Win + B: Mở Trình duyệt Browser
                    openWindow('browser-window');
                    break;
                case 'f': // Win + F: Mở Quản lý tệp tin Files
                    openWindow('files-window');
                    break;
                case 'm': // Win + M: Mở Trình phát nhạc
                    openWindow('music-window');
                    break;
                case 'd': // Win + D: Thu nhỏ hết tất cả ẩn về Desktop
                    document.querySelectorAll('.window').forEach(win => win.classList.add('hidden'));
                    break;
            }
        }

        // Bấm phím Escape (ESC) để đóng nhanh cửa sổ đang nổi lên trên cùng
        if (e.key === "Escape") {
            const openWindows = Array.from(document.querySelectorAll('.window:not(.hidden)'));
            if(openWindows.length > 0) {
                // Sắp xếp tìm cửa sổ có zIndex cao nhất hiện tại
                openWindows.sort((a, b) => Number(b.style.zIndex || 0) - Number(a.style.zIndex || 0));
                closeWindow(openWindows[0].id);
            }
        }
    });

});

// --- CÁC HÀM ĐIỀU KHIỂN HỆ THỐNG TOÀN CỤC ---
let topZIndex = 1000;

function openWindow(id) {
    const win = document.getElementById(id);
    if (!win) return;
    
    win.classList.remove('hidden', 'closing');
    
    // Tạo vị trí ngẫu nhiên không trùng lắp khi mở lần đầu
    if (!win.style.top || win.style.top === "") {
        win.style.top = (40 + Math.random() * 40) + "px";
        win.style.left = (60 + Math.random() * 60) + "px";
    }
    
    bringToFront(win);
    
    // Tự động focus vào ô input nếu đó là Terminal
    if (id === 'terminal-window') {
        setTimeout(() => {
            const input = document.getElementById('terminal-input');
            if(input) input.focus();
        }, 50);
    }
}

function closeWindow(id) {
    const win = document.getElementById(id);
    if (!win) return;
    win.classList.add('closing');
    setTimeout(() => {
        win.classList.add('hidden');
    
