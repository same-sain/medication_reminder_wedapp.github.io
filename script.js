document.addEventListener("DOMContentLoaded", function () {
    showCurrentTime();
    requestNotificationPermission();
});

// แสดงเวลาปัจจุบัน
function showCurrentTime() {
    const timeElement = document.getElementById("currentTime");
    setInterval(() => {
        const now = new Date();
        const formattedTime = now.toLocaleTimeString("th-TH", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
        timeElement.textContent = `เวลา: ${formattedTime} น.`;
    }, 1000);
}

// ขออนุญาต Notification
function requestNotificationPermission() {
    if ("Notification" in window) {
        Notification.requestPermission().then(permission => {
            if (permission !== "granted") {
                alert("โปรดเปิดใช้งานการแจ้งเตือนเพื่อให้แอปทำงานได้สมบูรณ์");
            }
        });
    }
}

// ปุ่มเปิดใช้งานเสียงแจ้งเตือน
let audio = new Audio("mixkit-happy-bells-notification-937.wav");

function enableSound() {
    audio.play().then(() => {
        console.log("เสียงพร้อมใช้งาน");
        document.getElementById("enableSound").style.display = "none"; // ซ่อนปุ่มหลังจากกด
    }).catch(error => {
        alert("โปรดแตะที่หน้าจออีกครั้งเพื่อเปิดใช้งานเสียงแจ้งเตือน");
    });
}

// เพิ่มการแจ้งเตือนใหม่
function addReminder() {
    const medicineName = document.getElementById("medicineName").value.trim();
    const reminderTime = document.getElementById("reminderTime").value;
    
    if (medicineName === "" || reminderTime === "") {
        alert("โปรดป้อนข้อมูลให้ครบถ้วน");
        return;
    }
    
    const reminderList = document.getElementById("reminders");
    const listItem = document.createElement("li");
    listItem.classList.add("reminder-item");
    listItem.setAttribute("data-time", reminderTime); // เพิ่มข้อมูลเวลา
    listItem.innerHTML = `
        <span>${medicineName} - ${convertToThaiTimeFormat(reminderTime)}</span>
        <button class="delete-btn" onclick="removeReminder(this)">ลบ</button>
    `;
    
    reminderList.appendChild(listItem);
    document.getElementById("medicineName").value = "";
    document.getElementById("reminderTime").value = "";
}

// ลบการแจ้งเตือน
function removeReminder(button) {
    const listItem = button.parentElement;
    listItem.remove();
}

// ฟังก์ชันแจ้งเตือน + เล่นเสียง
function showNotification(medicineName) {
    if ("Notification" in window && Notification.permission === "granted") {
        new Notification("ถึงเวลาทานยา", {
            body: `กรุณาทานยา: ${medicineName}`,
            icon: "apps.47691.14209683806471457.7cc3f919-a3c0-4134-ae05-abe9b560f9df.png"
        });
    }
    playReminderSound();
}

// เล่นเสียงแจ้งเตือน
function playReminderSound() {
    audio.play();
}

// ตรวจสอบเวลาทุก 60 วินาที
function checkReminders() {
    let now = new Date();
    let currentTime = now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0');

    document.querySelectorAll('.reminder-item').forEach(item => {
        let time = item.getAttribute('data-time');
        if (time === currentTime) {
            showNotification(item.textContent.split(" - ")[0]); // แจ้งเตือนชื่อยา
        }
    });
}

setInterval(checkReminders, 60000); // ตรวจสอบทุก 60 วินาที

// แปลงเวลาให้อ่านง่าย
function convertToThaiTimeFormat(timeString) {
    const [hours, minutes] = timeString.split(":");
    return `${hours}:${minutes} น.`;
}
