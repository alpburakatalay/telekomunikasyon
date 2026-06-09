/* 🔐 ŞİFRE SİSTEMİ */
const SITE_PASSWORD = "Password";

function checkPassword(){
    let p = document.getElementById("password").value;
    if(p === SITE_PASSWORD){
        document.getElementById("login").style.display = "none";
        document.getElementById("terminal").style.display = "block";
        document.getElementById("themeSelector").style.display = "block";
        log("✔ Erişim verildi");
    } else {
        alert("❌ Yanlış şifre!");
        document.getElementById("password").value = "";
    }
}

function logout(){
    document.getElementById("login").style.display = "flex";
    document.getElementById("terminal").style.display = "none";
    document.getElementById("password").value = "";
    log("");
}

/* 🤖 TELEGRAM BOT KONFİGURASYONU */
// ⚠️ GÜVENLİK NOTU: Gerçek token ve chat ID'yi buraya girin
const TOKEN = "8830218739:AAHqwEZ3t6TZTw6paRZ2F7RGxqabezWXymQ";
const CHAT_ID = "8510264483";
let lastUpdateId = 0;

/* 🎨 TEMA DEĞİŞTİRİCİ */
function changeTheme(themePath){
    document.getElementById("themeLink").href = themePath;
    localStorage.setItem("selectedTheme", themePath);
}

// Sayfa yüklenirken kaydedilmiş temayı uygula
window.addEventListener("load", () => {
    const savedTheme = localStorage.getItem("selectedTheme");
    if(savedTheme){
        document.getElementById("themeLink").href = savedTheme;
        document.getElementById("themeSelect").value = savedTheme;
    }
});

/* 📝 LOG FONKSİYONU */
function log(t){
    const logElement = document.getElementById("log");
    if(t === ""){
        logElement.innerHTML = "hazır...";
    } else {
        logElement.innerHTML += "<br>> " + t;
        logElement.scrollTop = logElement.scrollHeight;
    }
}

/* 🚀 MESAJ GÖNDER */
async function send(){
    let text = document.getElementById("input").value.trim();
    if(!text) return;
    
    if(!TOKEN || TOKEN === "8830218739:AAHqwEZ3t6TZTw6paRZ2F7RGxqabezWXymQ"){
        log("❌ Hata: Telegram token ayarlanmamış!");
        return;
    }
    
    if(!CHAT_ID || CHAT_ID === "8510264483"){
        log("❌ Hata: Chat ID ayarlanmamış!");
        return;
    }
    
    log("📤 sen: " + text);
    
    try {
        const response = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: text
            })
        });
        
        if(response.ok){
            log("✔ Gönderildi");
        } else {
            log("❌ Gönderme hatası");
        }
    } catch(error){
        log("❌ Bağlantı hatası: " + error.message);
    }
    
    document.getElementById("input").value = "";
}

/* ⌨️ ENTER TUŞU */
document.addEventListener("DOMContentLoaded", function(){
    const input = document.getElementById("input");
    if(input){
        input.addEventListener("keydown", function(e){
            if(e.key === "Enter"){
                send();
            }
        });
    }
});

/* 📥 GELEN MESAJLARI DİNLE */
setInterval(async () => {
    if(!TOKEN || TOKEN === "8830218739:AAHqwEZ3t6TZTw6paRZ2F7RGxqabezWXymQ") return;
    
    try {
        let res = await fetch(`https://api.telegram.org/bot${TOKEN}/getUpdates`);
        let data = await res.json();
        
        if(data.ok && data.result){
            data.result.forEach(u => {
                if (u.update_id > lastUpdateId && u.message) {
                    lastUpdateId = u.update_id;
                    let user = u.message.from.first_name || "Kullanıcı";
                    let text = u.message.text;
                    log("📥 " + user + ": " + text);
                }
            });
        }
    } catch(error){
        // Sessiz başarısız
    }
}, 2000);