let currentIP = "";
let sensorData = { ph: 7.0, moisture: 50, rain: 0 };
const GOOGLE_CLIENT_ID = "YOUR_CLIENT_ID_HERE.apps.googleusercontent.com"; // ضع كود جوجل هنا

// قاعدة بيانات الـ 100 نبتة (أشهر أنواع النباتات في مصر)
const plants = [
    { n: "طماطم بلدي", phL: 5.5, phH: 7.0, m: 70 }, { n: "خيار صوبة", phL: 5.8, phH: 7.2, m: 75 },
    { n: "فلفل ألوان", phL: 6.0, phH: 7.0, m: 65 }, { n: "باذنجان رومي", phL: 5.5, phH: 6.8, m: 70 },
    { n: "بامية صعيدي", phL: 6.0, phH: 7.5, m: 60 }, { n: "ملوخية مصري", phL: 6.0, phH: 7.0, m: 80 },
    { n: "قمح جيزة", phL: 6.0, phH: 7.5, m: 50 }, { n: "أرز عريض", phL: 5.0, phH: 6.5, m: 90 },
    { n: "قطن طويل التيلة", phL: 6.5, phH: 8.0, m: 55 }, { n: "قصب سكر", phL: 6.0, phH: 8.0, m: 80 },
    { n: "مانجو عويس", phL: 5.5, phH: 7.5, m: 60 }, { n: "نخيل حياني", phL: 6.5, phH: 8.5, m: 45 },
    { n: "برسيم حجازي", phL: 6.5, phH: 7.5, m: 75 }, { n: "بطاطس سبونتا", phL: 4.8, phH: 6.5, m: 70 },
    { n: "بصل أحمر", phL: 6.0, phH: 7.0, m: 60 }, { n: "ثوم صيني", phL: 6.0, phH: 7.5, m: 60 },
    { n: "فراولة", phL: 5.5, phH: 6.5, m: 75 }, { n: "ليمون اضاليا", phL: 6.0, phH: 7.5, m: 65 },
    { n: "نعناع", phL: 6.5, phH: 7.5, m: 80 }, { n: "ريحان عطري", phL: 6.0, phH: 7.5, m: 60 },
    { n: "خس كابوتشا", phL: 6.0, phH: 7.0, m: 80 }, { n: "جزر بلدي", phL: 5.5, phH: 7.0, m: 70 },
    { n: "كرنب", phL: 6.5, phH: 7.5, m: 80 }, { n: "قرنبيط", phL: 6.5, phH: 7.5, m: 80 }
    // يمكنك إضافة الـ 100 نبتة كاملة هنا بنفس النمط
];

window.onload = () => {
    // تهيئة زر جوجل داخل المربع
    google.accounts.id.initialize({ client_id: GOOGLE_CLIENT_ID, callback: handleGoogleLogin });
    google.accounts.id.renderButton(document.getElementById("googleBtn"), { theme: "filled_blue", size: "large", shape: "pill" });

    // فحص الجلسة السابقة
    const savedUser = localStorage.getItem("userData");
    if (savedUser) applyLoginUI(JSON.parse(savedUser));

    // ملء قائمة النباتات
    const sel = document.getElementById('plantSelect');
    plants.sort((a,b) => a.n.localeCompare(b.n)).forEach(p => {
        let opt = document.createElement('option');
        opt.value = JSON.stringify(p); opt.innerText = p.n; sel.appendChild(opt);
    });

    // تحديث الساعة
    setInterval(() => { document.getElementById('liveClock').innerText = new Date().toLocaleTimeString('ar-EG'); }, 1000);
};

function handleGoogleLogin(res) {
    const payload = JSON.parse(atob(res.credential.split('.')[1]));
    localStorage.setItem("userData", JSON.stringify(payload));
    applyLoginUI(payload);
}

function applyLoginUI(user) {
    document.getElementById("loginAlert").style.display = "none";
    document.getElementById("mainDashboard").classList.remove("locked");
    document.getElementById("userProfile").style.display = "flex";
    document.getElementById("userName").innerText = user.name;
    document.getElementById("userImg").src = user.picture;

    // استرجاع الـ IP المرتبط بالحساب من الذاكرة المحلية
    const cloudIp = localStorage.getItem(`cloud_ip_${user.email}`);
    if (cloudIp) {
        currentIP = cloudIp;
        updateIPStatus(cloudIp);
        setInterval(pullData, 4000);
    }
}

function saveESPConfig() {
    const ipInput = document.getElementById('espIP').value;
    const user = JSON.parse(localStorage.getItem("userData"));
    if(ipInput && user) {
        currentIP = ipInput;
        localStorage.setItem(`cloud_ip_${user.email}`, ipInput);
        updateIPStatus(ipInput);
        toggleSettingsPage();
        setInterval(pullData, 4000);
    }
}

function updateIPStatus(ip) {
    document.getElementById('ipStatus').innerText = "متصل سحابياً: " + ip;
    document.getElementById('ipStatus').className = "status-tag online";
    document.getElementById('savedIpTag').innerText = "IP: " + ip;
}

function logout() { localStorage.removeItem("userData"); location.reload(); }

function toggleDarkMode() {
    const theme = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
}

async function pullData() {
    if(!currentIP) return;
    try {
        const res = await fetch(`http://${currentIP}/status`);
        const data = await res.json();
        document.getElementById('phVal').innerText = data.ph;
        document.getElementById('moistVal').innerText = data.moisture;
        sensorData = data;
    } catch(e) {}
}

function runLiveAnalysis() {
    const sel = document.getElementById('plantSelect');
    if(!sel.value) return;
    const p = JSON.parse(sel.value);
    const phOk = (sensorData.ph >= p.phL && sensorData.ph <= p.phH);
    const mOk = (sensorData.moisture >= p.m);
    document.getElementById('analysisResult').innerHTML = `<strong>تحليل ${p.n}:</strong><br>
        - pH: ${phOk?'مثالي ✅':'غير مناسب ❌'} (${p.phL}-${p.phH})<br>
        - رطوبة: ${mOk?'كافية ✅':'تحتاج ري 💧'} (${p.m}%)`;
}

function toggleSettingsPage() {
    const p = document.getElementById('ipSettingsPage');
    p.style.display = (p.style.display === 'flex') ? 'none' : 'flex';
}

function sendCmd(device) {
    if(!currentIP) return;
    const state = document.getElementById('sw'+device.charAt(0).toUpperCase()+device.slice(1)).checked ? 'ON' : 'OFF';
    fetch(`http://${currentIP}/control?device=${device}&state=${state}`);
}
