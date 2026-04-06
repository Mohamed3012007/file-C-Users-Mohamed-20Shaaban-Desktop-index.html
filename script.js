let currentIP = "";
let currentSensors = { ph: 0, moisture: 0, temp: 0 };
let deviceDatabase = JSON.parse(localStorage.getItem('deviceDB')) || {};

// 1. فتح وإغلاق صفحة الإعدادات
function toggleSettingsPage() {
    const page = document.getElementById('ipSettingsPage');
    page.style.display = (page.style.display === 'flex') ? 'none' : 'flex';
}

// 2. حفظ إعدادات الـ IP والتعرف على الجهاز
function saveESPConfig() {
    const ip = document.getElementById('espIP').value;
    if (ip) {
        currentIP = ip;
        document.getElementById('ipStatus').innerText = "الجهاز: متصل (" + ip + ")";
        document.getElementById('ipStatus').className = "status-tag online";

        // إذا كان الجهاز جديداً، ننشئ له سجل بيانات فارغ
        if (!deviceDatabase[ip]) {
            deviceDatabase[ip] = { lat: null, lon: null, users: [] };
            localStorage.setItem('deviceDB', JSON.stringify(deviceDatabase));
            alert("تم التعرف على جهاز جديد. يرجى ضبط إعدادات الموقع له.");
        } else {
            // تحميل إعدادات الموقع المخزنة مسبقاً لهذا الـ IP تحديداً
            loadDeviceData(ip);
        }

        localStorage.setItem('last_connected_ip', ip);
        setInterval(pullData, 4000);
        toggleSettingsPage();
    }
}

// 3. تحميل بيانات جهاز معين
function loadDeviceData(ip) {
    const data = deviceDatabase[ip];
    if (data && data.lat) {
        document.getElementById('latDisplay').innerText = data.lat;
        document.getElementById('lonDisplay').innerText = data.lon;
        updateEgyptWeather(data.lat, data.lon);
    }
}

// 4. تحديد الموقع أوتوماتيكياً (GPS Picker)
function openMapPicker() {
    if (!currentIP) { alert("يرجى ربط الـ IP أولاً!"); return; }

    // هنا نقوم باستخدام الـ GPS الفعلي للجهاز (المتصفح) لتحديد الموقع
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude.toFixed(5);
            const lon = position.coords.longitude.toFixed(5);

            // تحديث الواجهة
            document.getElementById('latDisplay').innerText = lat;
            document.getElementById('lonDisplay').innerText = lon;

            // حفظ الموقع لهذا الـ IP تحديداً في قاعدة البيانات
            deviceDatabase[currentIP].lat = lat;
            deviceDatabase[currentIP].lon = lon;
            localStorage.setItem('deviceDB', JSON.stringify(deviceDatabase));

            updateEgyptWeather(lat, lon);
            alert("تم تحديد موقع الصوبة وحفظه للجهاز الحالي.");
        }, () => {
            alert("يرجى السماح بالوصول للموقع أو إدخاله يدوياً.");
        });
    }
}

// 5. جلب بيانات المناخ المصري
function updateEgyptWeather(lat, lon) {
    document.getElementById('egyptWeatherOutput').innerHTML = `
        <div style="color:var(--main)"><b>موقع الصوبة المسجل:</b> ${lat}, ${lon}</div>
        <p><b>المناخ الإقليمي:</b> جاري التحليل بناءً على بيانات الأرصاد المصرية..</p>
        <p><b>توقعات الري:</b> يفضل الري في الصباح الباكر نظراً لارتفاع الحرارة.</p>
    `;
}

// 6. سحب البيانات والتحكم (كما في الأكواد السابقة)
async function pullData() {
    if (!currentIP) return;
    try {
        const res = await fetch(`http://${currentIP}/status`);
        const data = await res.json();
        document.getElementById('phVal').innerText = data.ph;
        document.getElementById('moistVal').innerText = data.moisture;
    } catch (e) { console.log("ESP Offline"); }
}

function sendCmd(device) {
    if (!currentIP) return;
    const isChecked = document.getElementById('sw' + device.charAt(0).toUpperCase() + device.slice(1)).checked;
    fetch(`http://${currentIP}/control?device=${device}&state=${isChecked ? 'ON' : 'OFF'}`);
}

window.onload = () => {
    const lastIP = localStorage.getItem('last_connected_ip');
    if (lastIP) {
        document.getElementById('espIP').value = lastIP;
        saveESPConfig();
    }
};