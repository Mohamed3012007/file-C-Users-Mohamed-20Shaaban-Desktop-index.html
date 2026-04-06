// المتغيرات العامة
let isAuto = false;
let isLoggedIn = false;
const API_KEY = "bd5e378503939dbaee5720a28305d1aa";
let serialPort, bluetoothDevice;

// قائمة الـ 100 نبتة
const plants = [
    { n: "طماطم", t: [20, 30], ph: [5.5, 7.0] }, { n: "خيار", t: [22, 32], ph: [6.0, 7.5] },
    { n: "فلفل", t: [20, 28], ph: [6.0, 7.0] }, { n: "باذنجان", t: [24, 32], ph: [5.5, 6.5] },
    { n: "خس", t: [15, 22], ph: [6.0, 7.0] }, { n: "جرجير", t: [10, 25], ph: [6.5, 7.5] },
    { n: "فراولة", t: [18, 25], ph: [5.5, 6.5] }, { n: "نعناع", t: [15, 30], ph: [6.0, 7.5] },
    { n: "بطاطس", t: [15, 20], ph: [4.8, 6.0] }, { n: "جزر", t: [15, 21], ph: [5.5, 7.0] },
    { n: "بصل", t: [12, 25], ph: [6.0, 7.5] }, { n: "ثوم", t: [10, 24], ph: [6.0, 7.0] },
    { n: "سبانخ", t: [10, 20], ph: [6.5, 7.5] }, { n: "بقدونس", t: [15, 25], ph: [6.0, 7.0] },
    { n: "كزبرة", t: [15, 22], ph: [6.5, 7.5] }, { n: "ريحان", t: [20, 35], ph: [5.5, 6.5] },
    { n: "فاصوليا", t: [18, 28], ph: [6.0, 7.0] }, { n: "بازلاء", t: [13, 18], ph: [6.0, 7.5] },
    { n: "ذرة", t: [18, 30], ph: [5.8, 7.0] }, { n: "قمح", t: [10, 25], ph: [6.0, 7.0] },
    { n: "أرز", t: [20, 35], ph: [5.0, 6.5] }, { n: "قطن", t: [25, 35], ph: [5.5, 7.5] },
    { n: "عباد الشمس", t: [20, 30], ph: [6.0, 7.5] }, { n: "فول سوداني", t: [22, 30], ph: [5.8, 6.2] },
    { n: "كرنب", t: [15, 20], ph: [6.5, 7.5] }, { n: "قرنبيط", t: [15, 20], ph: [6.0, 7.0] },
    { n: "بروكلي", t: [13, 20], ph: [6.0, 7.0] }, { n: "فجل", t: [10, 20], ph: [6.0, 7.0] },
    { n: "لفت", t: [10, 20], ph: [5.5, 7.0] }, { n: "بنجر", t: [15, 21], ph: [6.0, 7.5] },
    { n: "كوسة", t: [18, 30], ph: [6.0, 7.5] }, { n: "بطيخ", t: [22, 35], ph: [6.0, 7.0] },
    { n: "شمام", t: [22, 32], ph: [6.0, 7.0] }, { n: "عنب", t: [15, 30], ph: [5.5, 7.0] },
    { n: "تين", t: [20, 35], ph: [6.0, 7.5] }, { n: "زيتون", t: [15, 30], ph: [6.5, 8.5] },
    { n: "رمان", t: [20, 35], ph: [5.5, 7.0] }, { n: "ليمون", t: [15, 30], ph: [5.5, 6.5] },
    { n: "برتقال", t: [15, 30], ph: [6.0, 7.0] }, { n: "مانجو", t: [24, 30], ph: [5.5, 7.5] },
    { n: "موز", t: [26, 30], ph: [5.5, 6.5] }, { n: "نخيل", t: [20, 40], ph: [6.0, 8.0] },
    { n: "صبار", t: [15, 45], ph: [5.0, 6.5] }, { n: "ياسمين", t: [15, 30], ph: [6.0, 7.0] },
    { n: "ورد بلدي", t: [15, 25], ph: [6.0, 7.0] }, { n: "توليب", t: [5, 15], ph: [6.0, 7.0] },
    { n: "أوركيد", t: [18, 25], ph: [5.5, 6.5] }, { n: "قرنفل", t: [10, 20], ph: [6.0, 7.0] },
    { n: "لافندر", t: [15, 30], ph: [6.5, 8.0] }, { n: "زعتر", t: [15, 25], ph: [6.0, 8.0] },
    { n: "روزماري", t: [15, 25], ph: [6.0, 7.5] }, { n: "مرمية", t: [15, 25], ph: [6.0, 7.0] },
    { n: "زعفران", t: [10, 20], ph: [6.0, 8.0] }, { n: "كمون", t: [20, 30], ph: [6.5, 7.5] },
    { n: "يانسون", t: [15, 25], ph: [6.0, 7.5] }, { n: "شمر", t: [15, 25], ph: [6.0, 7.0] },
    { n: "حلبة", t: [10, 25], ph: [6.0, 7.5] }, { n: "ترمس", t: [10, 20], ph: [6.0, 7.5] },
    { n: "عدس", t: [15, 25], ph: [6.0, 7.5] }, { n: "حمص", t: [15, 25], ph: [6.0, 7.0] },
    { n: "كرفس", t: [15, 21], ph: [6.0, 7.0] }, { n: "كرات", t: [15, 25], ph: [6.0, 7.0] },
    { n: "فجل أحمر", t: [10, 20], ph: [6.0, 7.0] }, { n: "خرشوف", t: [15, 24], ph: [6.5, 7.5] }, 
    { n: "هليون", t: [15, 25], ph: [6.5, 7.5] }, { n: "زنجبيل", t: [20, 30], ph: [5.5, 6.5] }, 
    { n: "كركم", t: [20, 30], ph: [5.5, 6.5] }, { n: "قرفة", t: [25, 30], ph: [4.5, 5.5] }, 
    { n: "كاكاو", t: [20, 30], ph: [5.0, 6.5] }, { n: "بن", t: [15, 25], ph: [5.0, 6.0] }, 
    { n: "شاي", t: [13, 30], ph: [4.5, 5.5] }, { n: "تبغ", t: [20, 30], ph: [5.5, 6.5] }, 
    { n: "قصب سكر", t: [20, 35], ph: [5.5, 6.5] }, { n: "بنجر سكر", t: [15, 25], ph: [6.0, 8.0] }, 
    { n: "كاجو", t: [20, 30], ph: [5.0, 6.5] }, { n: "لوز", t: [15, 30], ph: [7.0, 8.5] }, 
    { n: "فستق", t: [15, 35], ph: [7.0, 8.0] }, { n: "بندق", t: [12, 20], ph: [6.0, 7.0] }, 
    { n: "جوز", t: [10, 25], ph: [6.0, 7.5] }, { n: "توت", t: [15, 25], ph: [5.5, 6.5] }, 
    { n: "مشمش", t: [15, 30], ph: [6.0, 8.0] }, { n: "خوخ", t: [15, 25], ph: [6.0, 7.0] }, 
    { n: "برقوق", t: [15, 25], ph: [6.0, 7.5] }, { n: "كرز", t: [10, 20], ph: [6.0, 7.5] }, 
    { n: "تفاح", t: [10, 25], ph: [6.0, 7.5] }, { n: "كمثرى", t: [10, 25], ph: [6.0, 7.5] }, 
    { n: "سفرجل", t: [15, 25], ph: [6.0, 7.5] }, { n: "جوافة", t: [20, 30], ph: [5.0, 7.0] }, 
    { n: "قشطة", t: [20, 30], ph: [5.5, 6.5] }, { n: "أفوكادو", t: [15, 25], ph: [6.0, 7.0] }, 
    { n: "بابايا", t: [20, 30], ph: [5.5, 6.5] }, { n: "أناناس", t: [20, 30], ph: [4.5, 5.5] }, 
    { n: "جوز هند", t: [20, 35], ph: [5.0, 7.0] }, { n: "كيوي", t: [15, 25], ph: [5.5, 6.5] }, 
    { n: "باشن فروت", t: [20, 30], ph: [5.5, 6.5] }, { n: "قلقاس", t: [20, 30], ph: [5.5, 6.5] }, 
    { n: "بطاطا حلوة", t: [20, 30], ph: [5.5, 6.5] }, { n: "كرنب بروكسل", t: [15, 20], ph: [6.5, 7.5] }, 
    { n: "كالي", t: [10, 20], ph: [6.5, 7.5] }
];

// تشغيل النظام عند التحميل
window.onload = () => {
    populatePlants();
    setInterval(updateClock, 1000);
    getUserLocation();
};

function populatePlants() {
    const sel = document.getElementById('plantSelector');
    plants.forEach((p, index) => {
        let o = document.createElement('option');
        o.value = index; o.innerText = p.n;
        sel.appendChild(o);
    });
}

function updateClock() {
    const now = new Date();
    document.getElementById('headerDate').innerText = now.toLocaleDateString('ar-EG');
    document.getElementById('headerTime').innerText = now.toLocaleTimeString('ar-EG');
}

// --- دوال الاتصال (بلوتوث، سيريال، واي فاي) ---
async function connect(type) {
    toggleMenu();
    try {
        if (type === 'Serial') {
            if ("serial" in navigator) {
                serialPort = await navigator.serial.requestPort();
                await serialPort.open({ baudRate: 9600 });
                readSerialData();
                alert("تم الاتصال بالكابل");
            } else alert("المتصفح لا يدعم Serial");
        } 
        else if (type === 'Bluetooth') {
            bluetoothDevice = await navigator.bluetooth.requestDevice({ acceptAllDevices: true });
            await bluetoothDevice.gatt.connect();
            alert("تم الاتصال ببلوتوث: " + bluetoothDevice.name);
        }
        else if (type === 'IP') {
            let ip = prompt("أدخل عنوان IP الجهاز:");
            if(ip) fetch(`http://${ip}/data`).then(r => r.json()).then(d => updateUI(d));
        }
    } catch (e) { console.log("اتصال ملغي"); }
}

async function readSerialData() {
    const reader = serialPort.readable.getReader();
    while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const data = new TextDecoder().decode(value).split(',');
        if(data.length >= 4) updateUI(data);
    }
}

function updateUI(d) {
    document.getElementById('temp').innerText = d[0];
    document.getElementById('hum').innerText = d[1];
    document.getElementById('ph').innerText = d[2];
    document.getElementById('water').innerText = d[3];
}

// --- دوال جوجل (اختيارية) ---
function googleSignIn() {
    isLoggedIn = !isLoggedIn;
    document.getElementById('userStatus').innerText = isLoggedIn ? "محمد" : "زائر";
    document.getElementById('menuUserStatus').innerText = isLoggedIn ? "خروج" : "تسجيل الدخول";
    if(isLoggedIn) alert("مرحباً بك! تم تفعيل المزامنة السحابية اختيارياً.");
}

// --- دوال التحكم والطقس ---
function toggleMenu() { document.getElementById('sideMenu').classList.toggle('open'); }

function toggleSystemMode() {
    isAuto = !isAuto;
    const btn = document.getElementById('systemModeBtn');
    btn.className = isAuto ? "mode-toggle-btn auto" : "mode-toggle-btn manual";
    document.getElementById('modeText').innerText = isAuto ? "أوتوماتيك" : "يدوي";
    document.getElementById('manualControls').style.opacity = isAuto ? "0.3" : "1";
}

function toggleDevice(id) {
    if(isAuto) return;
    document.getElementById(id + 'Btn').classList.toggle('btn-on');
}

function updatePlantAnalysis() {
    const p = plants[document.getElementById('plantSelector').value];
    document.getElementById('plantAnalysis').innerHTML = `<b>${p.n}</b><br>حرارة: ${p.t[0]}-${p.t[1]}° | الحموضة: ${p.ph[0]}-${p.ph[1]}`;
}

function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(p => {
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${p.coords.latitude}&lon=${p.coords.longitude}&units=metric&lang=ar&appid=${API_KEY}`)
            .then(r => r.json()).then(d => {
                document.getElementById('weatherDisplay').innerText = `${d.name}: ${Math.round(d.main.temp)}°م - ${d.weather[0].description}`;
            });
        });
    }
}

function toggleDarkMode() {
    const b = document.body;
    b.setAttribute('data-theme', b.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
}
