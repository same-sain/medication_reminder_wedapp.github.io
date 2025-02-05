document.addEventListener("DOMContentLoaded", function () {
    showCurrentTime();
    requestNotificationPermission();
});

// รับ audio element จาก HTML
const reminderAudio = document.getElementById("reminderSound");

// ให้ผู้ใช้กดปุ่มเปิดเสียงก่อน
document.getElementById("enableSound").addEventListener("click", function () {
    reminderAudio.play().then(() => {
        console.log("🔊 เล่นเสียงแจ้งเตือนสำเร็จ");
    }).catch(error => {
        console.log("❌ ไม่สามารถเล่นเสียงแจ้งเตือนได้:", error);
    });

    this.style.display = "none"; // ซ่อนปุ่มหลังจากกด
});

// ฟังก์ชันเล่นเสียงแจ้งเตือน
function playReminderSound() {
    reminderAudio.currentTime = 0; // เริ่มเสียงใหม่ทุกครั้ง
    reminderAudio.play().then(() => {
        console.log("🔊 เล่นเสียงสำเร็จ");
    }).catch(error => {
        console.log("❌ เล่นเสียงล้มเหลว:", error);
    });
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

// แจ้งเตือน + เล่นเสียง
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
