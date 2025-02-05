document.addEventListener("DOMContentLoaded", function () {
    showCurrentTime();
    requestNotificationPermission();
});

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
    listItem.innerHTML = `
        <span>${medicineName} - ${convertToThaiTimeFormat(reminderTime)}</span>
        <button class="delete-btn" onclick="removeReminder(this)">ลบ</button>
    `;
    
    reminderList.appendChild(listItem);
    scheduleReminder(medicineName, reminderTime);
    
    document.getElementById("medicineName").value = "";
    document.getElementById("reminderTime").value = "";
}

function removeReminder(button) {
    const listItem = button.parentElement;
    listItem.remove();
}

function scheduleReminder(medicineName, reminderTime) {
    const now = new Date();
    const reminderDateTime = new Date();
    const [hours, minutes] = reminderTime.split(":");
    reminderDateTime.setHours(hours, minutes, 0, 0);
    
    const timeUntilReminder = reminderDateTime - now;
    
    if (timeUntilReminder > 0) {
        setTimeout(() => {
            showNotification(medicineName);
            playReminderSound();
        }, timeUntilReminder);
    }
}

function showNotification(medicineName) {
    if ("Notification" in window && Notification.permission === "granted") {
        new Notification("ถึงเวลาทานยา", {
            body: `กรุณาทานยา: ${medicineName}`,
            icon: "apps.47691.14209683806471457.7cc3f919-a3c0-4134-ae05-abe9b560f9df"
        });
    }
}

function playReminderSound() {
    const audio = new Audio("mixkit-happy-bells-notification-937.wav");
    audio.play();
}

function convertToThaiTimeFormat(timeString) {
    const [hours, minutes] = timeString.split(":");
    return `${hours}:${minutes} น.`;
}