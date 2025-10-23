document.addEventListener("DOMContentLoaded", function () {
    showCurrentTime();
    requestNotificationPermission();
});

const reminderAudio = new Audio("mixkit-happy-bells-notification-937.wav");

const enableSoundButton = document.getElementById("enableSound");
if (enableSoundButton) {
    enableSoundButton.addEventListener("click", function () {
        reminderAudio.play().then(() => {
            console.log("🔊 เล่นเสียงแจ้งเตือนสำเร็จ");
        }).catch(error => {
            console.log("❌ ไม่สามารถเล่นเสียงแจ้งเตือนได้:", error);
        });
        this.style.display = "none"; 
    });
}

function playReminderSound() {
    reminderAudio.currentTime = 0; 
    reminderAudio.play().then(() => {
        console.log("🔊 เล่นเสียงสำเร็จ");
    }).catch(error => {
        console.log("❌ เล่นเสียงล้มเหลว:", error);
    });
}


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


function requestNotificationPermission() {
    if ("Notification" in window) {
        Notification.requestPermission().then(permission => {
            if (permission !== "granted") {
                alert("โปรดเปิดใช้งานการแจ้งเตือนเพื่อให้แอปทำงานได้สมบูรณ์");
            }
        });
    }
}


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


function removeReminder(button) {
    const listItem = button.parentElement;
    listItem.remove();
}


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


setInterval(checkReminders, 10000);


function convertToThaiTimeFormat(timeString) {
    const [hours, minutes] = timeString.split(":");
    return `${hours}:${minutes} น.`;
}

