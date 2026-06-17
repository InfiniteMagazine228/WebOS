// File: server.js (Chạy cục bộ trên máy Linux thật)
const WebSocket = require('ws');
const pty = require('node-pty');
const os = require('os');

// Khởi tạo máy chủ WebSocket chạy ở cổng 8080
const wss = new WebSocket.Server({ port: 8080 });
console.log("Máy chủ WebOS-Terminal thật đang chạy tại cổng 8080...");

wss.on('connection', (ws) => {
    console.log("Đã kết nối thành công với giao diện WebOS!");

    // Xác định shell mặc định của hệ thống Linux (thường là /bin/bash)
    const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';
    
    // Khởi tạo một tiến trình Terminal ảo của Linux
    const ptyProcess = pty.spawn(shell, [], {
        name: 'xterm-color',
        cols: 80,
        rows: 24,
        cwd: process.env.HOME,
        env: process.env
    });

    // Khi máy Linux trả về dữ liệu (chữ, tiến trình apt install), gửi ngược lên WebOS
    ptyProcess.on('data', (data) => {
        ws.send(data);
    });

    // Khi người dùng gõ chữ từ ô lệnh WebOS gửi xuống, ghi trực tiếp vào máy Linux
    ws.on('message', (message) => {
        ptyProcess.write(message.toString());
    });

    ws.on('close', () => {
        ptyProcess.kill();
        console.log("Đã ngắt kết nối với WebOS.");
    });
});
