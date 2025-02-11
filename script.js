document.addEventListener("DOMContentLoaded", function () {
    showCurrentTime();
    requestNotificationPermission();
});

// รับ audio element จาก HTML
const reminderAudio = new Audio("mixkit-happy-bells-notification-937.wav");

// ให้ผู้ใช้กดปุ่มเปิดเสียงก่อนใช้งาน
const enableSoundButton = document.getElementById("enableSound");
if (enableSoundButton) {
    enableSoundButton.addEventListener("click", function () {
        reminderAudio.play().then(() => {
            console.log("🔊 เล่นเสียงแจ้งเตือนสำเร็จ");
        }).catch(error => {
            console.log("❌ ไม่สามารถเล่นเสียงแจ้งเตือนได้:", error);
        });
        this.style.display = "none"; // ซ่อนปุ่มหลังจากกด
    });
}

// ฟังก์ชันเล่นเสียงแจ้งเตือน
function playReminderSound() {
    reminderAudio.currentTime = 0; // เริ่มเสียงใหม่ทุกครั้ง
    reminderAudio.play().then(() => {
        console.log("🔊 เล่นเสียงสำเร็จ");
    }).catch(error => {
        console.log("❌ เล่นเสียงล้มเหลว:", error);
    });
}

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

// ฟังก์ชันแจ้งเตือน Notification + เสียง
function showNotification(medicineName) {
    console.log(`🔔 แจ้งเตือนยา: ${medicineName}`);
    
    if ("Notification" in window && Notification.permission === "granted") {
        let notification = new Notification("ถึงเวลาทานยา", {
            body: `กรุณาทานยา: ${medicineName}`,
            icon: "apps.47691.14209683806471457.7cc3f919-a3c0-4134-ae05-abe9b560f9df.png"
        });
        
        notification.onshow = () => {
            playReminderSound();
        };
    } else {
        alert("⚠️ กรุณาอนุญาตให้แจ้งเตือนในเบราว์เซอร์ของคุณ");
    }
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
    listItem.setAttribute("data-time", reminderTime);
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

// ตรวจสอบเวลาทุก 10 วินาที
function checkReminders() {
    let now = new Date();
    let currentTime = now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0');

    console.log(`⏰ กำลังตรวจสอบการแจ้งเตือน - เวลาปัจจุบัน: ${currentTime}`);

    document.querySelectorAll('.reminder-item').forEach(item => {
        let time = item.getAttribute('data-time');
        
        if (time === currentTime) {
            console.log(`✅ ถึงเวลา! แจ้งเตือน: ${item.textContent.split(" - ")[0]}`);
            showNotification(item.textContent.split(" - ")[0]);
        }
    });
}

// เรียกใช้ checkReminders ทุก 10 วินาที
setInterval(checkReminders, 10000);

// แปลงเวลาให้อ่านง่าย
function convertToThaiTimeFormat(timeString) {
    const [hours, minutes] = timeString.split(":");
    return `${hours}:${minutes} น.`;
}
