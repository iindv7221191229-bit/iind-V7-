let DEVICE_DB = {
  samsung: [92,88,84,74,50,75],
  apple: [82,78,74,64,40,70],
  xiaomi: [94,90,86,76,52,75],
  redmi: [95,91,87,77,54,75],
  poco: [90,86,82,72,48,75],
  vivo: [95,91,87,77,55,75],
  oppo: [94,90,86,76,54,75],
  realme: [92,88,84,74,50,75],
  oneplus: [88,84,80,70,45,75],
  iqoo: [87,83,79,69,44,75],
  motorola: [93,89,85,75,52,75],
  google: [80,76,72,62,38,70],
  nothing: [88,84,80,70,45,75],
  lava: [100,96,92,85,60,80],
  tecno: [97,93,89,79,58,78],
  huawei: [90,86,82,72,48,75]
};

// -----------------------------
// AUTO DETECTION ENGINE
// -----------------------------
function autoDetect() {
  let ram = navigator.deviceMemory || 4;
  let cores = navigator.hardwareConcurrency || 4;

  let start = performance.now();
  let load = 0;

  for (let i = 0; i < 4e6; i++) {
    load += Math.sqrt(i % 120);
  }

  let end = performance.now();

  estimateFPS((fps) => {
    document.getElementById("ram").value = ram;
    document.getElementById("fps").value = fps;

    let type = "mid device";

    if (ram <= 3 || (end - start) > 120) {
      type = "low-end device";
    } else if (ram >= 6 && (end - start) < 80) {
      type = "high-end device";
    }

    document.getElementById("device").value =
      type + " | cores:" + cores;
  });
}

// -----------------------------
// FPS DETECTOR
// -----------------------------
function estimateFPS(cb) {
  let frames = 0;
  let start = performance.now();

  function loop(t) {
    frames++;
    if (t - start >= 1000) {
      cb(frames);
      return;
    }
    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
}

// -----------------------------
// MAIN AI ENGINE
// -----------------------------
function generateSensi() {
  let device = document.getElementById("device").value.toLowerCase();
  let ram = parseFloat(document.getElementById("ram").value) || 4;
  let fps = parseInt(document.getElementById("fps").value) || 60;

  // base sensitivity
  let sensi = [95, 90, 85, 75, 50, 75];

  // FPS logic
  if (fps <= 30) sensi = sensi.map(v => v + 6);
  if (fps >= 90) sensi = sensi.map(v => v - 6);

  // RAM logic
  if (ram <= 3) sensi = sensi.map(v => v + 5);
  if (ram >= 8) sensi = sensi.map(v => v - 4);

  // DEVICE MATCH ENGINE
  let matched = false;

  for (let key in DEVICE_DB) {
    if (device.includes(key)) {
      sensi = DEVICE_DB[key];
      matched = true;
      break;
    }
  }

  // AI fallback (unknown devices)
  if (!matched) {
    sensi = sensi.map(v => v + Math.floor(Math.random() * 3));
  }

  // clamp values
  sensi = sensi.map(v => Math.max(0, Math.min(100, Math.round(v))));

  // OUTPUT
  document.getElementById("result").innerHTML = `
    <h2>🔥 UNIVERSAL AI SENSI ENGINE</h2>

    <p><b>Device:</b> ${device}</p>
    <p><b>RAM:</b> ${ram}GB</p>
    <p><b>FPS:</b> ${fps}</p>

    <hr>

    <p>General: ${sensi[0]}</p>
    <p>Red Dot: ${sensi[1]}</p>
    <p>2X Scope: ${sensi[2]}</p>
    <p>4X Scope: ${sensi[3]}</p>
    <p>Sniper: ${sensi[4]}</p>
    <p>Free Look: ${sensi[5]}</p>
  `;
}
