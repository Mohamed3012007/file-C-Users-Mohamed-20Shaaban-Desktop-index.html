let currentIP = "";
let sensorData = { ph: 7.0, moisture: 50, rain: 0 };
const WEATHER_API = "bd5e378503939dbaee5720a28305d1aa"; 

// قاعدة بيانات المحاصيل المصرية (Data Sheet)
const plants = [
    // خضروات
    { n: "الطماطم", phL: 5.5, phH: 7.0, m: 70 },
    { n: "الخيار", phL: 5.8, phH: 7.2, m: 75 },
    { n: "الفلفل الرومي", phL: 6.0, phH: 7.0, m: 65 },
    { n: "الباذنجان", phL: 5.5, phH: 6.8, m: 70 },
    { n: "البامية", phL: 6.0, phH: 7.5, m: 60 },
    { n: "الملوخية", phL: 6.0, phH: 7.0, m: 80 },
    { n: "الفاصوليا الخضراء", phL: 6.0, phH: 7.5, m: 60 },
    { n: "البسلة", phL: 6.0, phH: 7.5, m: 65 },
    { n: "الكرنب", phL: 6.5, phH: 7.5, m: 80 },
    { n: "القرنبيط", phL: 6.5, phH: 7.5, m: 80 },
    // محاصيل حقلية
    { n: "القمح", phL: 6.0, phH: 7.5, m: 50 },
    { n: "الأرز المصرى", phL: 5.0, phH: 6.5, m: 90 },
    { n: "الذرة الشامية", phL: 5.8, phH: 7.0, m: 60 },
    { n: "القطن المصري", phL: 6.5, phH: 8.0, m: 55 },
    { n: "قصب السكر", phL: 6.0, phH: 8.0, m: 80 },
    { n: "البرسيم المسقاوي", phL: 6.5, phH: 7.5, m: 75 },
    { n: "الفول البلدي", phL: 6.0, phH: 8.0, m: 60 },
    { n: "العدس", phL: 6.0, phH: 8.0, m: 50 },
    { n: "الحلبة", phL: 6.5, phH: 7.5, m: 50 },
    // فواكه
    { n: "الموالح (برتقال/ليمون)", phL: 6.0, phH: 7.5, m: 65 },
    { n: "العنب", phL: 6.5, phH: 8.5, m: 50 },
    { n: "المانجو", phL: 5.5, phH: 7.5, m: 60 },
    { n: "الجوافة", phL: 5.0, phH: 8.0, m: 55 },
    { n: "الزيتون", phL: 6.5, phH: 8.5, m: 40 },
    { n: "النخيل (البلح)", phL: 6.5, phH: 8.5, m: 45 },
    { n: "الرمان", phL: 5.5, phH: 7.0, m: 50 },
    { n: "التين البلدي", phL: 6.0, phH: 8.0, m: 45 },
    { n: "الموز", phL: 5.5, phH: 7.5, m: 85 },
    { n: "الفراولة", phL: 5.5, phH: 6.5, m: 75 },
    // نباتات طبية وعطرية
    { n: "الكمون", phL: 6.8, phH: 7.5, m: 50 },
    { n: "اليانسون", phL: 6.0, phH: 7.5, m: 55 },
    { n: "البردقوش", phL: 6.5, phH: 8.0, m: 60 },
    { n: "الشيح البابونج", phL: 6.5, phH: 8.5, m: 60 },
    { n: "النعناع الفلفلي", phL: 6.5, phH: 7.5, m: 80 },
    { n: "الريحان", phL: 6.0, phH: 7.5, m: 60 },
    { n: "اللافندر", phL: 6.5, phH: 8.5, m: 40 },
    { n: "الصبار", phL: 6.0, phH: 8.5, m: 30 },
    // جذريات وبصليات
    { n: "البصل", phL: 6.0, phH: 7.0, m: 60 },
    { n: "الثوم", phL: 6.0, phH: 7.5, m: 60 },
    { n: "البطاطس", phL: 4.8, phH: 6.5, m: 70 },
    { n: "البنجر (السكّر)", phL: 6.0, phH: 8.0, m: 65 },
    { n: "الفجل", phL: 6.0, phH: 7.0, m: 70 },
    { n: "الجرجير", phL: 6.0, phH: 7.5, m: 80 },
    { n: "البقدونس", phL: 6.0, phH: 8.0, m: 75 }
    // ملاحظة: تم إضافة أهم 45 نبتة زراعية في مصر، يمكنك إضافة المزيد بنفس النمط
];

window.onload = () => {
    const sel = document.getElementById('plantSelect');
    plants.sort((a,b) => a.n.localeCompare(b.n)).forEach(p => {
        let opt = document.createElement('option');
        opt.value = JSON.stringify(p);
        opt.innerText = p.n;
        sel.appendChild(opt);
    });

    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    document.querySelector("#darkModeToggle i").className = savedTheme === "dark" ? "fas fa-sun" : "fas fa-moon";
    
    updateClock();
    setInterval(updateClock, 1000);
};

function toggleDarkMode() {
    const theme = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    document.querySelector("#darkModeToggle i").className = theme === "dark" ? "fas fa-sun" : "fas fa-moon";
}

function saveESPConfig() {
    currentIP = document.getElementById('espIP').value;
    if(currentIP) {
        document.getElementById('ipStatus').innerText = "متصل: " + currentIP;
        document.getElementById('ipStatus').className = "status-tag online";
        toggleSettingsPage();
        setInterval(pullData, 4000);
    }
}

function toggleSettingsPage() {
    const p = document.getElementById('ipSettingsPage');
    p.style.display = (p.style.display === 'flex') ? 'none' : 'flex';
}

async function pullData() {
    if(!currentIP) return;
    try {
        const res = await fetch(`http://${currentIP}/status`);
        const data = await res.json();
        sensorData = data;
        document.getElementById('phVal').innerText = data.ph;
        document.getElementById('moistVal').innerText = data.moisture;
        const rb = document.getElementById('rainBox');
        if(data.rain === "WET" || data.rain === 1) {
            document.getElementById('rainStatus').innerText = "تمطر الآن!";
            rb.className = "s-card rainy-active";
        } else {
            document.getElementById('rainStatus').innerText = "جاف";
            rb.className = "s-card";
        }
    } catch(e) { console.log("ESP Offline"); }
}

function runLiveAnalysis() {
    const sel = document.getElementById('plantSelect');
    const out = document.getElementById('analysisResult');
    if(!sel.value) return;
    const p = JSON.parse(sel.value);
    const isPhOk = (sensorData.ph >= p.phL && sensorData.ph <= p.phH);
    const isMoistOk = (sensorData.moisture >= p.m);
    out.innerHTML = `<strong>تحليل ${p.n}:</strong><br>- pH: ${isPhOk?'مناسب ✅':'غير مناسب ❌'} (${p.phL}-${p.phH})<br>- الرطوبة: ${isMoistOk?'كافية ✅':'تحتاج ري 💧'} (${p.m}%)`;
}

function updateClock() {
    const now = new Date();
    document.getElementById('liveClock').innerText = now.toLocaleTimeString('ar-EG');
    const month = now.getMonth() + 1;
    let s = (month >= 3 && month <= 5) ? "الربيع" : (month >= 6 && month <= 8) ? "الصيف" : (month >= 9 && month <= 11) ? "الخريف" : "الشتاء";
    document.getElementById('seasonName').innerText = "الموسم: " + s;
}

function sendCmd(device) {
    if(!currentIP) return;
    const state = document.getElementById('sw'+device.charAt(0).toUpperCase()+device.slice(1)).checked ? 'ON' : 'OFF';
    fetch(`http://${currentIP}/control?device=${device}&state=${state}`);
}

function openMapPicker() {
    navigator.geolocation.getCurrentPosition(p => {
        const lat = p.coords.latitude.toFixed(2);
        const lon = p.coords.longitude.toFixed(2);
        document.getElementById('lat').innerText = lat;
        document.getElementById('lon').innerText = lon;
        fetchWeatherData(lat, lon);
    });
}

async function fetchWeatherData(lat, lon) {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=ar&appid=${WEATHER_API}`);
    const d = await res.json();
    document.getElementById('cityName').innerText = d.name;
    document.getElementById('outerTemp').innerText = Math.round(d.main.temp);
    document.getElementById('weatherDesc').innerText = d.weather[0].description;
    document.getElementById('windSpeed').innerText = d.wind.speed;
    document.getElementById('outHumidity').innerText = d.main.humidity;
}
