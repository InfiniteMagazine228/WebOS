// 1. Cập nhật đồng hồ hệ thống theo thời gian thực
function updateClock() {
    const clockElement = document.getElementById('live-clock');
    const now = new Date();
    clockElement.innerText = now.toLocaleTimeString('vi-VN', { hour12: false });
}
setInterval(updateClock, 1000);
updateClock();

// 2. Logic Mở/Đóng cửa sổ kèm Animation đẹp
function openWindow(id) {
    const win = document.getElementById(id);
    win.classList.remove('hidden', 'closing');
    // Đưa cửa sổ vừa bấm lên trên cùng (Z-Index)
    bringToFront(win);
}

function closeWindow(id) {
    const win = document.getElementById(id);
    win.classList.add('closing');
    // Đợi chạy hết animation đóng (0.2s) rồi mới ẩn hẳn
    setTimeout(() => {
        win.classList.add('hidden');
    }, 200);
}

function bringToFront(clickedWindow) {
    document.querySelectorAll('.window').forEach(win => {
        win.style.zindex = "10";
    });
    clickedWindow.style.zIndex = "100";
}

// 3. Xử lý tính năng Kéo - Thả cửa sổ (Drag and Drop)
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
        
        // Tính toán vị trí mới
        let newTop = targetElement.offsetTop - pos2;
        let newLeft = targetElement.offsetLeft - pos1;

        // Giới hạn không cho kéo cửa sổ văng ra ngoài thanh Top Bar
        if(newTop < 28) newTop = 28; 

        targetElement.style.top = newTop + "px";
        targetElement.style.left = newLeft + "px";
    }

    function closeDragElement() {
        document.onmousemove = null;
        document.onmouseup = null;
    }
}

// 4. Giả lập lệnh gõ trong Terminal Linux
const terminalInput = document.getElementById('terminal-input');
if(terminalInput) {
    terminalInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const command = this.value.trim().toLowerCase();
            const body = this.parentElement.parentElement;
            
            // Tạo dòng lịch sử lệnh cũ
            const oldLine = document.createElement('p');
            oldLine.className = 'terminal-text';
            oldLine.innerHTML = `ubuntu@webos:~$ ${this.value}`;
            body.insertBefore(oldLine, this.parentElement);

            // Tạo dòng phản hồi hệ thống (Response)
            const responseLine = document.createElement('p');
            responseLine.className = 'terminal-text';

            if (command === 'help') {
                responseLine.innerHTML = "Available commands: <br>- <span style='color:#8be9fd'>neofetch</span>: Show system details<br>- <span style='color:#8be9fd'>clear</span>: Clear terminal";
            } else if (command === 'neofetch') {
                responseLine.innerHTML = `
                    <span style='color:#ff5555'><b>OS:</b></span> Linux WebOS Ubuntu x86_64<br>
                    <span style='color:#ff5555'><b>Kernel:</b></span> Javascript Engine v8<br>
                    <span style='color:#ff5555'><b>Uptime:</b></span> Running on Browser<br>
                    <span style='color:#ff5555'><b>Shell:</b></span> WebOS-Bash v1.0`;
            } else if (command === 'clear') {
                // Xóa toàn bộ text cũ trừ dòng input cuối
                const textLines = body.querySelectorAll('.terminal-text');
                textLines.forEach(line => line.remove());
                this.value = '';
                return;
            } else if (command !== "") {
                responseLine.innerHTML = `bash: command not found: ${command}. Type 'help'.`;
                responseLine.style.color = '#ff5555';
            }

            if(command !== "") {
                body.insertBefore(responseLine, this.parentElement);
            }

            // Reset và cuộn xuống cuối
            this.value = '';
            body.scrollTop = body.scrollHeight;
        }
    });
}
