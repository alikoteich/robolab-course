// ══ LIGHTBOX ══
function openLB(title, file, desc, tags) {
  document.getElementById("lb-title").textContent = title;
  document.getElementById("lb-filename").textContent = file;
  document.getElementById("lb-desc").textContent = desc;
  document.getElementById("lb-tags").innerHTML = (tags || [])
    .map((t) => `<span class="tag tag-blue">${t}</span>`)
    .join("");
  const img = document.getElementById("lb-img-tag");
  const ph  = document.getElementById("lb-placeholder");
  img.style.display = "none";
  ph.style.display  = "flex";
  img.src = "";
  img.src = file;
  document.getElementById("lightbox").classList.add("open");
}
function closeLB() {
  document.getElementById("lightbox").classList.remove("open");
}
// Lightbox click-outside: attached once on the persistent lightbox element
document.addEventListener("click", function(e) {
  if (e.target && e.target.id === "lightbox") closeLB();
});

// ── NAVIGATION ──
// goSection is defined in index.html's inline script (dynamic lesson loader).
// This stub ensures lesson HTML onclick="goSection('sX')" calls work.
// The real implementation below is only used if somehow the index.html version isn't present.
if (typeof goSection === "undefined") {
  window.goSection = function(id) {
    console.warn("goSection called before index.html loader was ready:", id);
  };
}

// Nav event listeners are handled in index.html's inline script

// ── ARDUINO BOARD ──
const ardParts = {
  usb: {
    icon: "🔌", title: "USB-B Port",
    desc: "Connects the Arduino to your computer via USB cable. Used to upload programs and provides 5V power for testing. The ATmega16U2 chip converts USB signals to serial for the main chip.",
    tag: "tag-blue", tagText: "Upload + Power",
  },
  pwr: {
    icon: "🔋", title: "DC Barrel Jack",
    desc: "Accepts 7–12V DC from a wall adapter or 9V battery for standalone use. The onboard 7805 voltage regulator steps this down to a stable 5V used by all components.",
    tag: "tag-amber", tagText: "7–12V DC Input",
  },
  chip: {
    icon: "🧠", title: "ATmega328P Microcontroller",
    desc: "The main processor. Runs at 16 MHz, executes your program instructions, reads all sensor inputs, and controls all pin outputs. Has 32KB flash memory (program storage) and 2KB RAM.",
    tag: "tag-coral", tagText: "16 MHz · 32KB Flash",
  },
  reset: {
    icon: "🔄", title: "Reset Button",
    desc: "Pressing this restarts the program from the very beginning — exactly like cutting and restoring power. Useful if your program freezes or you want to restart a timed sequence.",
    tag: "tag-green", tagText: "Restart Program",
  },
  digital: {
    icon: "💛", title: "Digital Pins 0–13",
    desc: "These 14 pins each work as INPUT or OUTPUT. They read or write exactly two states: HIGH (5V) or LOW (0V). Pins marked ~ (3,5,6,9,10,11) also support PWM output — simulating analog levels by rapidly switching.",
    tag: "tag-amber", tagText: "14 pins · PWM on 6 pins",
  },
  analog: {
    icon: "💙", title: "Analog Pins A0–A5",
    desc: "These 6 pins read continuously varying voltages (0–5V) and convert them to a 10-bit number (0–1023) using the built-in ADC. Essential for sensors like LDRs, potentiometers, and temperature sensors.",
    tag: "tag-blue", tagText: "0 to 1023 · 10-bit ADC",
  },
  power: {
    icon: "⚡", title: "Power Pins",
    desc: "These pins distribute power to your circuit. 5V and 3.3V supply stable regulated voltages. GND is the common reference. VIN passes through the barrel jack voltage directly (7–12V unregulated).",
    tag: "tag-coral", tagText: "5V · 3.3V · GND · VIN",
  },
};
function ardClick(id) {
  const p = ardParts[id];
  if (!p) return;
  document.getElementById("ard-info-icon").textContent  = p.icon;
  document.getElementById("ard-info-title").textContent = p.title;
  document.getElementById("ard-info-desc").textContent  = p.desc;
  document.getElementById("ard-info-extra").innerHTML   =
    `<span class="tag ${p.tag}" style="font-size:12px;">${p.tagText}</span>`;
  if (id === "power") {
    document.getElementById("pwr-flow").style.opacity = "1";
    setTimeout(() => (document.getElementById("pwr-flow").style.opacity = "0"), 3000);
  }
}
function ardTip(e, text) {
  const ardTipEl = document.getElementById("ard-tip");
  if (!ardTipEl) return;
  ardTipEl.textContent   = text;
  ardTipEl.style.display = "block";
  ardTipEl.style.left    = e.clientX + 14 + "px";
  ardTipEl.style.top     = e.clientY - 36 + "px";
}
function ardHide() {
  const ardTipEl = document.getElementById("ard-tip");
  if (ardTipEl) ardTipEl.style.display = "none";
}
document.addEventListener("mousemove", (e) => {
  const ardTipEl = document.getElementById("ard-tip");
  if (ardTipEl && ardTipEl.style.display === "block") {
    ardTipEl.style.left = e.clientX + 14 + "px";
    ardTipEl.style.top  = e.clientY - 36 + "px";
  }
});

// ── S2 ELECTRICITY ──
function ohmUpdate() {
  const V = parseFloat(document.getElementById("ohm-slider-V").value);
  const R = parseInt(document.getElementById("ohm-slider-R").value);
  const I = (V / R) * 1000;
  const P = V * (V / R);
  document.getElementById("ohm-V-val").innerHTML   = V.toFixed(1) + '<span style="font-size:15px">V</span>';
  document.getElementById("ohm-I-val").innerHTML   = I.toFixed(1) + '<span style="font-size:15px">mA</span>';
  document.getElementById("ohm-R-val").innerHTML   = R + '<span style="font-size:15px">Ω</span>';
  document.getElementById("ohm-P-val").innerHTML   = P.toFixed(3) + '<span style="font-size:15px">W</span>';
  document.getElementById("ohm-slider-V-lbl").textContent = V.toFixed(1) + "V";
  document.getElementById("ohm-slider-R-lbl").textContent = R + "Ω";
  const status =
    I > 40  ? "⚠️ Exceeds Arduino pin limit of 40mA! Add more resistance." :
    I < 1   ? "💡 Very low current — LED barely visible."                   :
              "✅ Safe current level for an LED.";
  document.getElementById("ohm-explain").innerHTML =
    `With <strong>${V}V</strong> and <strong>${R}Ω</strong>: Current = ${V}÷${R} = <strong>${I.toFixed(1)}mA</strong>. Power = <strong>${P.toFixed(3)}W</strong>. ${status}`;
}
function ohmSelect(q) {
  ["V","I","R","P"].forEach((x) => document.getElementById("ohm-" + x).classList.remove("active"));
  document.getElementById("ohm-" + q).classList.add("active");
}
// ohmUpdate / updateResist called from onLessonLoad('s2')
function updateResist(v) {
  const vals = [
    "22Ω — Dangerous! LED will burn!", "47Ω — Too low", "100Ω — Risky",
    "150Ω — Borderline", "220Ω — Safe for LED", "330Ω — Good",
    "470Ω — Dimmer", "680Ω — Dim", "1kΩ — Very dim", "2.2kΩ — Barely visible",
  ];
  const b   = Math.max(0, 1 - (v - 1) / 12);
  const led = document.getElementById("resist-led");
  if (!led) return;
  document.getElementById("resist-val").textContent = vals[parseInt(v) - 1] || "220Ω";
  led.style.opacity   = 0.15 + b * 0.85;
  led.style.boxShadow = `0 0 ${b * 18}px rgba(255,215,0,${b * 0.9})`;
}

// ── S3 BREADBOARD ──
const bbMessages = {
  "rail-pos": "🔴 Power Rail (+): This entire red row is internally connected HORIZONTALLY by a long metal strip. Every hole in this row is at the same voltage. Connect your Arduino 5V pin here to distribute power across the breadboard.",
  "rail-neg": "🔵 Ground Rail (–): Connected horizontally just like the red rail — all holes share the same GND connection. Connect Arduino GND here. All component ground wires run back to this rail.",
  col: "⬜ Middle Column (5-hole vertical group): These 5 holes in each column are connected VERTICALLY by a short metal clip underneath. Insert component legs into the same column to connect them. The centre divider breaks all connections — left and right halves are completely separate.",
};
function bbClick(type) {
  const el = document.getElementById("bb-info");
  el.textContent    = bbMessages[type] || "";
  el.style.borderColor =
    type === "rail-pos" ? "var(--coral)" :
    type === "rail-neg" ? "var(--blue)"  : "var(--amber)";
  if (type === "col") {
    const hl = document.getElementById("col-hl-box");
    hl.setAttribute("fill", "rgba(37,99,235,0.12)");
    setTimeout(() => hl.setAttribute("fill", "rgba(37,99,235,0)"), 2000);
  }
}

// ── S4 DIGITAL vs ANALOG ──
let digState = false, digHistory = [];
function toggleDigital() {
  digState = !digState;
  const led = document.getElementById("dig-led");
  led.style.background = digState ? "#FFD700" : "#ddd";
  led.style.boxShadow  = digState ? "0 0 12px rgba(255,215,0,.9)" : "none";
  document.getElementById("dig-state").textContent  = digState ? "HIGH" : "LOW";
  document.getElementById("dig-state").style.color  = digState ? "var(--green)" : "var(--t3)";
  digHistory.push(digState ? 1 : 0);
  if (digHistory.length > 20) digHistory.shift();
  drawDigital();
}
function drawDigital() {
  const c = document.getElementById("dig-canvas");
  if (!c) return;
  const ctx = c.getContext("2d"), w = c.width, h = c.height;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#f8fafc";
  ctx.fillRect(0, 0, w, h);
  if (digHistory.length < 2) return;
  ctx.strokeStyle = "#D97706";
  ctx.lineWidth   = 2.5;
  ctx.lineJoin    = "round";
  const step = w / 20;
  ctx.beginPath();
  digHistory.forEach((v, i) => {
    const x = i * step, y = v === 1 ? 8 : h - 8;
    i === 0 ? ctx.moveTo(x, y) : (ctx.lineTo(x, v === 1 ? x : x), ctx.lineTo(x, y));
  });
  ctx.stroke();
  ctx.fillStyle = "#94a3b8";
  ctx.font      = "8px Figtree";
  ctx.fillText("5V", 2, 12);
  ctx.fillText("0V", 2, h - 4);
}
function updateAnalogDemo(v) {
  document.getElementById("analog-demo-val").textContent  = v;
  document.getElementById("analog-volt-val").textContent  = ((v / 1023) * 5).toFixed(2);
  drawAnalogWave(parseInt(v));
}
function drawAnalogWave(val) {
  const c = document.getElementById("analog-canvas");
  if (!c) return;
  const ctx = c.getContext("2d"), w = c.width, h = c.height;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#f8fafc";
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = "#2563EB";
  ctx.lineWidth   = 2;
  ctx.beginPath();
  for (let x = 0; x <= w; x++) {
    const phase = (x / w) * Math.PI * 4,
          amp   = (val / 1023) * (h / 2 - 4),
          y     = h / 2 - Math.sin(phase) * amp;
    x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.fillStyle = "#94a3b8";
  ctx.font      = "8px Figtree";
  ctx.fillText("5V", 2, 10);
  ctx.fillText("0V", 2, h - 4);
}
// analog-slider listener is attached inside onLessonLoad('s4')

// ── LESSON INIT CALLBACK (called by index.html after each lesson is injected) ──
function onLessonLoad(id) {
  // Re-attach lightbox click (DOM is replaced on each load)
  const lb = document.getElementById("lightbox");
  if (lb) lb.addEventListener("click", function(e){ if(e.target===this) closeLB(); });

  if (id === "s2") {
    ohmUpdate();
    updateResist(5);
  }
  if (id === "s4") {
    drawDigital();
    updateAnalogDemo(512);
    const slider = document.getElementById("analog-slider");
    if (slider) slider.addEventListener("input", function(){ updateAnalogDemo(this.value); });
  }
  if (id === "s6") {
    updateDist(80);
    updatePot(135);
    updateWater(40);
  }
  if (id === "s7") {
    document.querySelectorAll("#buzzer-waves div").forEach(
      (b) => (b.style.animationPlayState = "paused")
    );
    updateLedBrightness(80);
  }
  if (id === "s12") {
    // Reset serial state so it's clean on each load
    serialRunning  = false;
    serialTick     = 0;
    serialBaud     = 9600;
    if (serialInterval) { clearInterval(serialInterval); serialInterval = null; }
    updateLCD();
    setLCDBacklight(true);
    // Pre-select LCD as active in scanner
    scannerDevices.lcd.active  = true;
    scannerDevices.mpu.active  = false;
    scannerDevices.bmp.active  = false;
    scannerDevices.oled.active = false;
    const lcdBtn = document.getElementById("scan-lcd-btn");
    if (lcdBtn) { lcdBtn.style.background="var(--blue)"; lcdBtn.style.color="white"; lcdBtn.style.borderColor="var(--blue)"; }
    ["mpu","bmp","oled"].forEach(id=>{
      const b=document.getElementById("scan-"+id+"-btn");
      if(b){b.style.background="";b.style.color="";b.style.borderColor="";}
    });
  }
}

const wireInfo = {
  vcc: "⚡ VCC (Red wire) supplies electrical energy to the sensor. Without VCC, the sensor receives no power and produces no output. Connect to Arduino 5V. Some sensors (e.g. ESP-based) require 3.3V — always check the datasheet.",
  gnd: "⬛ GND (Black wire) provides the reference ground that completes the electrical circuit. Electrons must return through GND. Without a ground connection, no current flows and nothing works. Every component needs a GND connection.",
  sig: "🔵 Signal (Blue/Yellow wire) carries the sensor measurement to Arduino. Digital sensors (button, IR sensor) connect to Digital pins — they read HIGH or LOW. Analog sensors (LDR, potentiometer) connect to Analog pins (A0–A5) — they read 0 to 1023.",
};
function showWireInfo(w) {
  const p = document.getElementById("wire-info-panel");
  p.style.display     = "block";
  p.textContent       = wireInfo[w];
  p.style.borderColor =
    w === "vcc" ? "var(--coral)" :
    w === "gnd" ? "#475569"      : "var(--blue)";
}

// ── S5 DND ──
let score = 0;
const placed = {};
const correctTypes = {
  button: "input", light: "input", ultra: "input", pot: "input",
  led2: "output", buzzer: "output", servo: "output",
};
function drag(e) {
  e.dataTransfer.setData("id",   e.target.dataset.id);
  e.dataTransfer.setData("type", e.target.dataset.type);
}
function allowDrop(e) { e.preventDefault(); }
function dropItem(e, zone) {
  e.preventDefault();
  e.currentTarget.classList.remove("drag-over");
  const id   = e.dataTransfer.getData("id");
  const type = e.dataTransfer.getData("type");
  if (!id || placed[id]) return;
  const el = document.getElementById("dnd-pool").querySelector(`[data-id="${id}"]`);
  if (!el) return;
  const correct = correctTypes[id] === zone;
  el.classList.add(zone === "input" ? "placed-input" : "placed-output");
  document.getElementById("zone-" + zone).appendChild(el);
  el.setAttribute("draggable", "false");
  el.style.cursor = "default";
  placed[id] = zone;
  if (correct) score++;
  const fb = document.getElementById("dnd-feedback");
  fb.style.background  = correct ? "var(--green-l)" : "var(--coral-l)";
  fb.style.color       = correct ? "var(--green)"   : "var(--coral)";
  fb.style.borderColor = correct ? "var(--green)"   : "var(--coral)";
  fb.textContent =
    (correct ? "✅ Correct! " : "❌ Not quite — ") +
    el.textContent.trim() +
    (correct ? " is indeed an " : " belongs in ") +
    (correct ? zone : correctTypes[id]) + "s.";
  fb.style.display = "block";
  document.getElementById("score-display").textContent = score + " / 7";
}
function resetDnD() {
  score = 0;
  Object.keys(placed).forEach((k) => delete placed[k]);
  document.getElementById("score-display").textContent  = "0 / 7";
  document.getElementById("dnd-feedback").style.display = "none";
  const pool = document.getElementById("dnd-pool");
  document.querySelectorAll(".dnd-component").forEach((el) => {
    el.className = "dnd-component";
    el.setAttribute("draggable", "true");
    el.style.cursor = "grab";
    pool.appendChild(el);
  });
}

// ── S6 SENSORS ──
function btnDown() {
  document.getElementById("btn-led").style.cssText =
    "width:20px;height:20px;border-radius:50%;background:#FFD700;box-shadow:0 0 12px rgba(255,215,0,.9);transition:all .15s;";
  document.getElementById("btn-status").textContent = "HIGH — Circuit closed";
  document.getElementById("btn-sim").style.transform  = "translateY(3px)";
  document.getElementById("btn-sim").style.boxShadow  = "0 0 0 #1a4faf";
}
function btnUp() {
  document.getElementById("btn-led").style.cssText =
    "width:20px;height:20px;border-radius:50%;background:#ddd;transition:all .15s;";
  document.getElementById("btn-status").textContent = "LOW — Circuit open";
  document.getElementById("btn-sim").style.transform = "";
  document.getElementById("btn-sim").style.boxShadow = "0 4px 0 #1a4faf";
}
function updateLight(v) {
  document.getElementById("light-sun").style.filter = `brightness(${0.3 + (v / 100) * 0.9})`;
  const d = ["Total dark—0","Very dark—~100","Dark—~200","Dim—~300","Moderate—~400",
             "Medium—~512","Bright—~600","Very bright—~750","Sunlight—~900","Full sun—1023"];
  document.getElementById("light-val").textContent = d[Math.round(v / 10)];
}
function updateDist(v) {
  document.getElementById("dist-val").textContent = v + " cm";
  const waves = document.getElementById("dist-waves");
  const count = Math.max(1, Math.round((200 - v) / 45) + 1);
  waves.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const d = document.createElement("div");
    d.style.cssText = `position:absolute;left:${10 + (i / count) * 70}%;top:50%;transform:translateY(-50%);width:6px;height:6px;border-radius:50%;background:var(--blue);opacity:${1 - i * 0.15};animation:pulse .5s ${i * 0.12}s infinite`;
    waves.appendChild(d);
  }
}
function updatePot(v) {
  const a = parseInt(v) - 135, r = Math.round((v / 270) * 1023);
  document.getElementById("pot-needle").setAttribute("transform", `rotate(${a},32,32)`);
  document.getElementById("pot-val").textContent = r + " / 1023";
}
// S6 init deferred to onLessonLoad

// ── S6 ADDITIONAL SENSOR INTERACTIVES ──
function updateDHT(v) {
  v = parseInt(v);
  const temp = Math.round(10 + (v / 100) * 40);
  const hum  = Math.round(20 + (v / 100) * 75);
  document.getElementById("dht-temp").textContent = temp + "°C";
  document.getElementById("dht-hum").textContent  = hum  + "%";
  let status = "🌤️ Comfortable conditions";
  if      (temp > 38) status = "🔥 Very hot! Heat alert";
  else if (temp > 30) status = "☀️ Warm — stay hydrated";
  else if (temp < 15) status = "🧊 Cold — check heating";
  if      (hum  > 80) status = "💦 High humidity — muggy!";
  else if (hum  < 30) status = "🏜️ Very dry air";
  document.getElementById("dht-status").textContent = status;
}
function updateWater(v) {
  v = parseInt(v);
  const analog = Math.round((v / 100) * 1023);
  document.getElementById("water-fill").style.height = v + "%";
  document.getElementById("water-val").textContent   = analog;
  let status = "💧 Partially submerged";
  if      (v === 0) status = "⬜ Dry — no signal (0)";
  else if (v < 25)  status = "💧 Low level detected";
  else if (v < 60)  status = "💧 Partially submerged";
  else if (v < 85)  status = "🌊 High water level!";
  else              status = "🚨 Full / overflow risk!";
  document.getElementById("water-status").textContent = status;
}
// updateWater(40) deferred to onLessonLoad
function toggleLED(el) {
  const on    = el.dataset.on === "1";
  const color = el.dataset.color;
  const glow  = el.dataset.glow;
  if (!on) {
    el.style.background = color;
    el.style.boxShadow  = "0 0 14px " + glow + ", 0 0 4px " + glow;
    el.dataset.on = "1";
  } else {
    el.style.background = el.style.borderColor.replace(")", ", 0.18)").replace("rgb", "rgba");
    el.style.boxShadow  = "none";
    el.dataset.on = "0";
  }
  const hint   = document.getElementById("led-hint");
  const anyOn  = Array.from(document.querySelectorAll(".scard [data-color]")).some((d) => d.dataset.on === "1");
  if (hint) hint.textContent = anyOn
    ? "💡 digitalWrite(pin, HIGH) — LED on"
    : "⬛ digitalWrite(pin, LOW) — LED off";
}
const partInfoMap = {
  resistor:   "🟫 Resistors limit current flow. Without them, too much current burns your LED or Arduino pin. Common values: 220Ω (LED) or 10kΩ (pull-down).",
  wire:       "🔵 Jumper wires connect components on the breadboard to Arduino pins. Red = power, black = ground, any color = signal.",
  breadboard: "🟩 Breadboard lets you build circuits without soldering. Columns of 5 holes share a connection internally.",
  rail:       "⚡ Power rails run along the sides. The red (+) rail distributes 5V; the blue (–) rail distributes GND to the whole circuit.",
};
function showPartInfo(key) {
  const el = document.getElementById("part-info");
  if (!el) return;
  el.textContent       = partInfoMap[key] || "";
  el.style.borderColor =
    key === "resistor"   ? "var(--amber)"  :
    key === "wire"       ? "var(--blue)"   :
    key === "breadboard" ? "var(--green)"  : "var(--purple)";
}

// ── S7 ACTUATORS ──
function updateLedBrightness(v) {
  const pct = v / 100;
  const led = document.getElementById("act-led");
  led.style.opacity   = 0.15 + pct * 0.85;
  led.style.boxShadow = `0 0 ${pct * 26}px rgba(255,215,0,${pct * 0.9})`;
  document.getElementById("led-bright-pct").textContent = v + "% duty cycle";
  const viz = document.getElementById("pwm-viz");
  viz.innerHTML = "";
  for (let i = 0; i < 20; i++) {
    const on  = i < Math.round(v / 5);
    const bar = document.createElement("div");
    bar.style.cssText = `flex:1;border-radius:2px;background:${on ? "var(--blue)" : "#e2e8f0"};height:${on ? "100%" : "28%"};transition:all .1s;`;
    viz.appendChild(bar);
  }
}
let buzzerOn = false;
function toggleBuzzer() {
  buzzerOn = !buzzerOn;
  document.querySelectorAll("#buzzer-waves div").forEach(
    (b) => (b.style.animationPlayState = buzzerOn ? "running" : "paused")
  );
  document.getElementById("buzz-btn").textContent = buzzerOn ? "■ Stop" : "▶ Play";
}
function updateServo(v) {
  document.getElementById("servo-arm").setAttribute("transform", `rotate(${v - 90},42,42)`);
  document.getElementById("servo-angle").textContent = v + "°";
}
function setMotorSpeed(s) {
  const m = document.getElementById("motor-circle");
  m.style.animationPlayState = s === 0 ? "paused" : "running";
  if (s > 0) m.style.animationDuration = 1.4 / s + "s";
}
// S7 init deferred to onLessonLoad

// ── S8 ROBOT THINKING ──
const thinkInfo = {
  sense: {
    title: "📡 Step 1: Sense",
    text:  "The robot uses sensors to gather data from its environment. This could be distance, light level, temperature, or whether a button is pressed. The sensor converts a physical quantity into an electrical signal. Without sensing, the robot is completely blind to the world.",
    note:  "Example: Ultrasonic sensor sends a 40kHz sound pulse and measures how long the echo takes to return — giving distance in cm.",
  },
  decide: {
    title: "🧠 Step 2: Decide",
    text:  'The Arduino compares sensor data against rules programmed by you. These rules are IF/ELSE conditions: "IF distance < 20cm, THEN the robot is close to an obstacle." The processor evaluates these conditions thousands of times per second with perfect consistency.',
    note:  "Example: IF distance < 20cm → activate turn flag → prepare to steer away from obstacle.",
  },
  act: {
    title: "⚡ Step 3: Act",
    text:  "Based on the decision, Arduino sends precise electrical signals to actuators. A digital pin goes HIGH to turn on an LED. A PWM signal rotates a servo to a specific angle. Motor driver inputs are adjusted for speed and direction. Digital logic becomes physical movement.",
    note:  "Example: Left motor PWM at 80%, right motor at 0% → robot turns left.",
  },
  loop: {
    title: "🔁 Step 4: Loop Forever",
    text:  "The entire sense–decide–act sequence runs in an infinite loop — typically hundreds or thousands of times per second. The program never truly ends — it keeps reading, evaluating, and responding for as long as power is connected. This loop is what makes robots feel responsive and alive.",
    note:  "Remove the loop and the robot reads one sensor value, performs one action, then stops forever. The loop is the heartbeat.",
  },
};
function showThink(type) {
  const p     = thinkInfo[type];
  const panel = document.getElementById("think-panel");
  panel.style.display = "block";
  panel.innerHTML = `<div style="font-size:17px;font-weight:700;margin-bottom:10px;">${p.title}</div><p style="font-size:14.5px;color:var(--t2);line-height:1.8;margin-bottom:12px;">${p.text}</p><div class="concept-box"><div style="font-size:13.5px;color:var(--t2);">${p.note}</div></div>`;
}
function showScenario(idx) {
  const scenarios = [
    {
      icon: "🚗", name: "Obstacle Avoidance Robot",
      steps: [
        { i: "📡", l: "Ultrasonic pulses sound" }, { i: "📏", l: "Measures echo time" },
        { i: "🧠", l: "If distance < 20cm" },      { i: "↩️", l: "Turn motors left" },
        { i: "▶️", l: "Resume forward" },
      ],
    },
    {
      icon: "🌙", name: "Auto Night Light",
      steps: [
        { i: "☀️", l: "LDR reads light level" }, { i: "📊", l: "Analog: 0–1023" },
        { i: "🧠", l: "If value < 300 (dark)" }, { i: "💡", l: "Set LED HIGH → ON" },
        { i: "🔄", l: "Check every loop" },
      ],
    },
    {
      icon: "🚪", name: "Automatic Door",
      steps: [
        { i: "📡", l: "Ultrasonic reads distance" }, { i: "📏", l: "Value in cm" },
        { i: "🧠", l: "If dist. < 30cm" },           { i: "⚙️", l: "Servo rotates 90°" },
        { i: "⏱️", l: "Wait 3s → return 0°" },
      ],
    },
  ];
  const s     = scenarios[idx];
  const panel = document.getElementById("think-panel");
  panel.style.display = "block";
  const h = s.steps.map((st, i) =>
    `<div style="text-align:center;flex:1;min-width:70px;"><div style="font-size:22px;margin-bottom:4px;">${st.i}</div><div style="font-size:11.5px;font-weight:600;color:var(--t2);line-height:1.4;">${st.l}</div></div>` +
    (i < s.steps.length - 1 ? '<div style="font-size:16px;color:var(--t3);align-self:center;">→</div>' : "")
  ).join("");
  panel.innerHTML = `<div style="font-size:17px;font-weight:700;margin-bottom:12px;">${s.icon} ${s.name}</div><div style="display:flex;align-items:flex-start;gap:6px;background:var(--bg);padding:14px;border-radius:9px;flex-wrap:wrap;">${h}</div>`;
}

// ── S9 SYSTEMS ──
const systems = {
  trash: {
    icon: "🗑️", name: "Smart Trash Can",
    desc: "When a hand approaches within 15cm, the ultrasonic sensor detects it. Arduino triggers the SG90 servo motor to rotate the lid open 90°. After 3 seconds, the servo returns to 0° and the lid closes. The loop checks distance continuously.",
    sensors: ["📡 Ultrasonic HC-SR04"], actuators: ["⚙️ Servo Motor SG90"],
    flow: ["Hand approaches","Distance < 15cm?","Servo opens 90°","Wait 3 seconds","Lid closes → loop"],
  },
  parking: {
    icon: "🅿️", name: "Parking Sensor System",
    desc: "The ultrasonic sensor continuously measures distance to the vehicle behind. As distance decreases, Arduino increases buzzer beep frequency and changes LED colour from green to red — giving a real-time proximity warning.",
    sensors: ["📡 Ultrasonic Sensor"], actuators: ["🔊 Buzzer (PWM)", "💡 LED (Red/Green)"],
    flow: ["Car moves back","Read distance","Map → beep speed","LED changes colour","⚠️ Alarm at <10cm"],
  },
  line: {
    icon: "📏", name: "Line Following Robot",
    desc: "Two IR sensors sit underneath the robot facing the ground. Each detects whether it is over black tape (absorbs IR light, returns LOW) or white surface (reflects IR, returns HIGH). Arduino adjusts left and right motor speeds every millisecond to keep the robot centred on the line.",
    sensors: ["⬛ IR Sensor Left", "⬛ IR Sensor Right"], actuators: ["🔄 Left DC Motor", "🔄 Right DC Motor"],
    flow: ["Read both IR sensors","Both white: forward","Right black: turn right","Left black: turn left","Adjust every ms"],
  },
  light: {
    icon: "💡", name: "Automatic Room Lighting",
    desc: "An LDR connected to analog pin A0 continuously measures ambient light. When the reading falls below a set threshold (room becomes dark), Arduino activates the LED strip via a transistor switch. When light returns, the strip turns off automatically.",
    sensors: ["☀️ LDR — Analog A0"], actuators: ["💡 LED Strip (transistor)"],
    flow: ["LDR reads light","Value < 300 = dark?","Activate LED strip","Check every second","Off when light returns"],
  },
};
function showSystem(id) {
  const s     = systems[id];
  const panel = document.getElementById("system-panel");
  panel.style.display = "block";
  const flowHtml = s.flow.map((f, i) =>
    `<span class="tag ${["tag-blue","tag-amber","tag-coral","tag-green","tag-purple"][i]}">${f}</span>` +
    (i < s.flow.length - 1 ? '<span style="color:var(--t3);font-size:12px;margin:0 3px;">→</span>' : "")
  ).join("");
  panel.innerHTML = `<div style="display:flex;gap:22px;align-items:flex-start;flex-wrap:wrap;">
    <div style="flex:1;min-width:200px;">
      <div style="font-size:18px;font-weight:700;margin-bottom:8px;">${s.icon} ${s.name}</div>
      <p style="font-size:14px;color:var(--t2);line-height:1.8;margin-bottom:14px;">${s.desc}</p>
      <div style="margin-bottom:10px;"><div class="section-label" style="margin-bottom:6px;">Sensors</div>${s.sensors.map((x) => `<span class="tag tag-blue" style="margin:2px;font-size:11.5px;">${x}</span>`).join("")}</div>
      <div><div class="section-label" style="margin-bottom:6px;">Outputs</div>${s.actuators.map((x) => `<span class="tag tag-coral" style="margin:2px;font-size:11.5px;">${x}</span>`).join("")}</div>
    </div>
    <div style="flex:1;min-width:200px;background:var(--bg);border-radius:12px;padding:16px;">
      <div class="section-label" style="margin-bottom:10px;">Logic Flow</div>
      <div style="display:flex;align-items:center;gap:4px;flex-wrap:wrap;line-height:2.4;">${flowHtml}</div>
    </div>
  </div>`;
}

// ── S10 PROGRAMMING ──
const pillars = {
  seq: {
    title: "📋 Sequence — Do Things in Order",
    color: "var(--blue)",
    text: `<strong>Imagine making a sandwich 🥪</strong> — you can't put the lid on before the filling! A program works the same way: it reads your instructions from top to bottom, <em>one at a time</em>, and never skips ahead.<br><br>
<div style="background:var(--blue-l);border-radius:10px;padding:12px 16px;margin:8px 0;font-family:monospace;font-size:13.5px;line-height:2;">
  <span style="color:#888;">// Blink an LED — order matters!</span><br>
  <span style="color:var(--blue);font-weight:700;">Set Pin 13 HIGH</span>  <span style="color:#888;">← LED turns ON ✅</span><br>
  <span style="color:var(--purple);font-weight:700;">Wait 1 second</span><br>
  <span style="color:var(--blue);font-weight:700;">Set Pin 13 LOW</span>   <span style="color:#888;">← LED turns OFF ✅</span><br>
  <span style="color:var(--purple);font-weight:700;">Wait 1 second</span>
</div>
<strong>🔄 Swap the first two lines?</strong> The LED turns on with zero time to stay on — you'd never see it! Order is everything.`,
  },
  cond: {
    title: "🔀 Condition — Ask a Yes/No Question",
    color: "var(--amber)",
    text: `<strong>Think of a condition like a security guard 🚪</strong> — it checks something and decides what to do based on the answer.<br><br>
<div style="background:var(--amber-l);border-radius:10px;padding:12px 16px;margin:8px 0;font-family:monospace;font-size:13.5px;line-height:2.2;">
  <span style="color:var(--amber);font-weight:700;">IF</span> <span style="color:var(--blue);">distance &lt; 20cm</span> <span style="color:var(--t3);">(is something close?)</span><br>
  &nbsp;&nbsp;&nbsp;<span style="color:var(--coral);font-weight:700;">→ turn the robot away 🔄</span><br>
  <span style="color:var(--amber);font-weight:700;">ELSE</span> <span style="color:var(--t3);">(no obstacle nearby)</span><br>
  &nbsp;&nbsp;&nbsp;<span style="color:var(--green);font-weight:700;">→ keep moving forward ➡️</span>
</div>
<strong>Without IF/ELSE</strong>, your robot would just keep driving forward — straight into a wall! 🧱`,
  },
  loop: {
    title: "🔁 Loop — Never Stop Checking",
    color: "var(--green)",
    text: `<strong>Imagine a security camera 📷</strong> — it doesn't record one photo and stop. It keeps watching, every second, all day long. That's what a loop does for your robot.<br><br>
<div style="background:var(--green-l);border-radius:10px;padding:12px 16px;margin:8px 0;font-family:monospace;font-size:13.5px;line-height:2.2;">
  <span style="color:var(--green);font-weight:700;">Repeat Forever:</span><br>
  &nbsp;&nbsp;&nbsp;<span style="color:var(--blue);">📡 Read distance sensor</span><br>
  &nbsp;&nbsp;&nbsp;<span style="color:var(--amber);">🧠 IF obstacle → turn away</span><br>
  &nbsp;&nbsp;&nbsp;<span style="color:var(--coral);">⚡ ELSE → move forward</span><br>
  &nbsp;&nbsp;&nbsp;<span style="color:var(--t3);font-style:italic;">↩ back to top... forever</span>
</div>
This loop runs <strong>hundreds of times per second</strong> ⚡ — that's why robots feel smooth and reactive.`,
  },
  var: {
    title: "📦 Variable — A Labelled Box for Data",
    color: "var(--purple)",
    text: `<strong>A variable is like a labelled box 📦</strong> — you can put a number in it, check what's inside, and replace it with a new number any time you want.<br><br>
<div style="background:var(--purple-l);border-radius:10px;padding:12px 16px;margin:8px 0;font-family:monospace;font-size:13.5px;line-height:2.2;">
  <span style="color:var(--purple);font-weight:700;">distance</span> = <span style="color:var(--blue);">45</span> &nbsp;<span style="color:var(--t3);">← box labelled "distance", holding 45</span><br>
  <span style="color:var(--purple);font-weight:700;">distance</span> = <span style="color:var(--coral);">12</span> &nbsp;<span style="color:var(--t3);">← same box, new value from sensor</span><br>
  <span style="color:var(--amber);font-weight:700;">IF</span> <span style="color:var(--purple);">distance</span> &lt; <span style="color:var(--blue);">20</span> → <span style="color:var(--coral);">turn away!</span>
</div>
Every time the loop runs, the Arduino <strong>reads the sensor and puts the fresh number into the variable</strong>. Without variables, the robot can't remember anything! 🤖`,
  },
};
function showPillar(key) {
  const p  = pillars[key];
  const el = document.getElementById("pillar-panel");
  el.style.display     = "block";
  el.style.borderColor = p.color;
  el.innerHTML = `<div style="font-size:15px;font-weight:800;margin-bottom:10px;color:${p.color};font-family:'Space Grotesk',sans-serif;">${p.title}</div><div style="font-size:13.5px;color:var(--t2);line-height:1.85;">${p.text}</div>`;
  el.style.animation = "none";
  void el.offsetWidth;
  el.style.animation = "slideUp .22s ease";
}

// ── S10 MINI SIMULATOR ──
function updateSim(val) {
  val = parseInt(val);
  const isClose = val < 20;
  const badge = document.getElementById("sim-dist-badge");
  badge.textContent       = val + " cm";
  badge.style.background  = isClose ? "var(--coral)" : "var(--blue)";
  const zone = document.getElementById("sim-zone-badge");
  if (isClose) {
    zone.textContent       = "⚠️ Danger Zone";
    zone.style.background  = "var(--coral-l)";
    zone.style.color       = "var(--coral)";
    zone.style.borderColor = "var(--coral-m)";
  } else {
    zone.textContent       = "✅ Safe Zone";
    zone.style.background  = "var(--green-l)";
    zone.style.color       = "var(--green)";
    zone.style.borderColor = "var(--green-m)";
  }
  document.getElementById("sim-var-val").textContent = val;
  const ifRes = document.getElementById("sim-if-result");
  if (isClose) {
    ifRes.textContent = "TRUE ✔ — " + val + " IS less than 20 → TURN AWAY!";
    ifRes.style.color = "var(--green)";
  } else {
    ifRes.textContent = "FALSE ✘ — " + val + " is NOT less than 20";
    ifRes.style.color = "var(--coral)";
  }
  const box   = document.getElementById("sim-action-box");
  const emoji = document.getElementById("sim-robot-emoji");
  const title = document.getElementById("sim-action-title");
  const desc  = document.getElementById("sim-action-desc");
  if (isClose) {
    box.style.background  = "var(--coral-l)";
    box.style.borderColor = "var(--coral-m)";
    emoji.textContent     = "🤖🔄";
    title.textContent     = "TURNING LEFT — Obstacle detected!";
    desc.textContent      = "IF branch runs: obstacle is " + val + " cm away — too close! Left motor stops, right motor goes → robot turns left to avoid it.";
  } else {
    box.style.background  = "var(--green-l)";
    box.style.borderColor = "var(--green-m)";
    emoji.textContent     = "🤖➡️";
    title.textContent     = "Going FORWARD";
    desc.textContent      = "Path is clear at " + val + " cm — the ELSE branch runs. Both motors spin forward at full speed!";
  }
}

// Init s4 / s10 — deferred to onLessonLoad(id)

// ── S11 BUILD A ROBOT ──
let currentRobot    = "obs";
let currentTab      = "parts";
let stepsCompleted  = 0;

function selectRobot(type) {
  currentRobot = type;
  document.getElementById("rb-card-obs").style.borderColor =
    type === "obs" ? "var(--blue)"    : "var(--border-l)";
  document.getElementById("rb-card-obs").style.boxShadow =
    type === "obs" ? "0 0 0 3px rgba(29,78,216,0.18), var(--sh-lg)" : "var(--sh)";
  document.getElementById("rb-card-bt").style.borderColor =
    type === "bt"  ? "var(--green)"   : "var(--border-l)";
  document.getElementById("rb-card-bt").style.boxShadow =
    type === "bt"  ? "0 0 0 3px rgba(4,120,87,0.18), var(--sh-lg)"  : "var(--sh)";
  document.getElementById("rb-guide").style.display   = "block";
  document.getElementById("rb-guide").style.animation = "fadeSlide 0.3s ease";
  stepsCompleted = 0;
  updateProgress();
  document.querySelectorAll(".pstep").forEach((s) => {
    s.style.background  = "";
    s.style.borderColor = "";
    s.querySelector(".pnum").style.background = "";
  });
  showRobotContent(type);
  rbTab("parts");
}
function showRobotContent(type) {
  ["obs","bt"].forEach((r) => {
    ["parts","wiring","assemble","code","test"].forEach((t) => {
      const el = document.getElementById("rb-" + t + "-" + r);
      if (el) el.style.display = r === type ? "" : "none";
    });
  });
}
function rbTab(tab) {
  currentTab = tab;
  const tabs = ["parts","wiring","assemble","code","test"];
  tabs.forEach((t) => {
    const btn   = document.getElementById("rbt-" + t);
    const panel = document.getElementById("rbp-" + t);
    if (btn) {
      btn.style.background = t === tab
        ? (currentRobot === "obs" ? "var(--blue)" : "var(--green)") : "transparent";
      btn.style.color = t === tab ? "white" : "var(--t3)";
    }
    if (panel) panel.style.display = t === tab ? "" : "none";
  });
}
function hlWire(id) {
  document.querySelectorAll('path[id^="obs-"], path[id^="bt-"]').forEach((p) => {
    p.style.opacity     = "0.75";
    p.style.strokeWidth = p.getAttribute("stroke-width") || "2";
  });
  const wire = document.getElementById(id);
  if (wire) {
    wire.style.opacity     = "1";
    wire.style.strokeWidth = "4";
    setTimeout(() => {
      if (wire) { wire.style.strokeWidth = "2"; wire.style.opacity = "0.75"; }
    }, 2500);
  }
}
function toggleStep(el) {
  const done = el.dataset.done === "1";
  if (!done) {
    el.dataset.done = "1";
    el.style.background  = "var(--green-l)";
    el.style.borderColor = "var(--green)";
    el.querySelector(".pnum").style.background = "var(--green)";
    stepsCompleted++;
  } else {
    el.dataset.done = "0";
    el.style.background  = "";
    el.style.borderColor = "";
    el.querySelector(".pnum").style.background = "";
    stepsCompleted = Math.max(0, stepsCompleted - 1);
  }
  updateProgress();
}
function updateProgress() {
  const bar = document.getElementById("rb-progress-bar");
  const txt = document.getElementById("rb-progress-txt");
  if (bar) bar.style.width    = (stepsCompleted / 7) * 100 + "%";
  if (txt) txt.textContent    = stepsCompleted + "/7";
  if (txt) txt.style.color    = stepsCompleted >= 7 ? "var(--green)" : "var(--blue)";
}
function copyCode(type) {
  const pre = document.getElementById("code-" + type);
  if (!pre) return;
  navigator.clipboard.writeText(pre.innerText).then(() => {
    const btn = pre.parentElement.querySelector("button");
    if (btn) {
      const orig = btn.textContent;
      btn.textContent = "✅ Copied!";
      setTimeout(() => (btn.textContent = orig), 2000);
    }
  });
}
function sim11Update(val) {
  val = parseInt(val);
  const isClose = val < 20;
  const badge   = document.getElementById("sim11-badge");
  const emoji   = document.getElementById("sim11-emoji");
  const action  = document.getElementById("sim11-action");
  const codeH   = document.getElementById("sim11-code-highlight");
  if (badge)  { badge.textContent = val + " cm"; badge.style.background = isClose ? "var(--coral)" : "var(--blue)"; }
  if (emoji)  emoji.textContent = isClose ? "🤖🔄" : "🤖➡️";
  if (action) {
    action.textContent = isClose ? "⚠️ Obstacle! Stopping & turning left…" : "✅ Moving Forward — path clear";
    action.style.color = isClose ? "var(--coral)" : "var(--green)";
  }
  if (codeH)
    codeH.innerHTML = isClose
      ? '<span style="color:#ef4444;">→ stopMotors(); delay(300);</span> <span style="color:#64748b;">// Halt first</span><br><span style="color:#f59e0b;">→ turnLeft(); delay(500);</span> <span style="color:#64748b;">// Steer away</span>'
      : '<span style="color:#10b981;">→ moveForward();</span> <span style="color:#64748b;">// Both motors forward at 180</span>';
}
function simBT(cmd) {
  const emoji  = document.getElementById("bt-sim-emoji");
  const action = document.getElementById("bt-sim-action");
  const code   = document.getElementById("bt-sim-code");
  const map = {
    F: { e: "🤖⬆️", a: "Moving FORWARD",  c: "case 'F': moveForward(); break;" },
    B: { e: "🤖⬇️", a: "Moving BACKWARD", c: "case 'B': moveBack(); break;"    },
    L: { e: "🤖↰",  a: "Turning LEFT",    c: "case 'L': turnLeft(); break;"    },
    R: { e: "🤖↱",  a: "Turning RIGHT",   c: "case 'R': turnRight(); break;"   },
    S: { e: "🤖⬛", a: "STOPPED",         c: "case 'S': stopMotors(); break;"  },
  };
  const m = map[cmd];
  if (emoji)  emoji.textContent = m.e;
  if (action) { action.textContent = m.a; action.style.color = cmd === "S" ? "var(--t3)" : "var(--blue)"; }
  if (code)   code.textContent = m.c;
}

// ── S12 SERIAL MONITOR & I²C ──────────────────────────────────────────────────
let serialRunning  = false;
let serialInterval = null;
let serialBaud     = 9600;
const serialCodeBaud = 9600;
let serialTick = 0;

function setSerialBaud(rate) {
  serialBaud = rate;
  [9600, 115200, 4800].forEach((r) => {
    const btn = document.getElementById("baud-" + r);
    if (!btn) return;
    const active = r === rate;
    btn.style.background  = active ? "var(--blue)" : "";
    btn.style.color       = active ? "white"       : "";
    btn.style.borderColor = active ? "var(--blue)" : "";
  });
  const lbl   = document.getElementById("serial-baud-label");
  const match = serialBaud === serialCodeBaud;
  if (lbl) {
    lbl.textContent      = match ? rate + " baud ✓" : rate + " baud ✗ mismatch!";
    lbl.style.background = match ? "var(--green-l)" : "var(--coral-l)";
    lbl.style.color      = match ? "var(--green)"   : "var(--coral)";
  }
  if (serialRunning) { stopSerial(); startSerial(); }
}
function toggleSerial() { serialRunning ? stopSerial() : startSerial(); }
function startSerial() {
  serialRunning = true;
  serialTick    = 0;
  const btn   = document.getElementById("serial-run-btn");
  const match = serialBaud === serialCodeBaud;
  if (btn) { btn.textContent = "■ Stop"; btn.style.background = "var(--coral)"; btn.style.borderColor = "var(--coral)"; }
  serialInterval = setInterval(() => {
    const out = document.getElementById("serial-output");
    if (!out) return stopSerial();
    serialTick++;
    const line = match
      ? `<span style="color:#94a3b8;">Distance: </span><span style="color:#86efac;">${Math.round(20 + Math.sin(serialTick * 0.4) * 15 + Math.random() * 4)}</span>`
      : `<span style="color:#ef4444;">${["â€˜Â¿Â¥","���","Ã‚Â§Ã†","????","##!@","Ð¸Ñ‚","§¶ÿ"][serialTick % 7]}</span>`;
    out.innerHTML += line + "<br>";
    out.scrollTop  = out.scrollHeight;
    if (out.querySelectorAll("br").length > 40)
      out.innerHTML = Array.from(out.childNodes).slice(-80).map((n) => n.outerHTML || n.textContent).join("");
  }, match ? 500 : 120);
}
function stopSerial() {
  serialRunning = false;
  clearInterval(serialInterval);
  const btn = document.getElementById("serial-run-btn");
  if (btn) { btn.textContent = "▶ Run"; btn.style.background = "var(--blue)"; btn.style.borderColor = "var(--blue)"; }
}
function clearSerial() {
  const out = document.getElementById("serial-output");
  if (out) out.innerHTML = '<span style="color:#475569;">— press Run to start —</span>';
}

const i2cInfoMap = {
  arduino: { color: "var(--blue)",   text: "🤖 Arduino is the <strong>master</strong>. It initiates all communication — it calls out an address, sends or requests data, then releases the bus. Slaves never speak unless asked." },
  lcd:     { color: "var(--amber)",  text: "🖥️ LCD 1602 at address <strong>0x27</strong>. The PCF8574 I²C backpack converts the I²C signal into the 8-bit parallel signal the LCD panel needs. Only 4 wires needed instead of 12." },
  gyro:    { color: "var(--purple)", text: "🌀 MPU-6050 gyroscope/accelerometer at address <strong>0x68</strong>. Measures rotation and acceleration on 3 axes. Same SDA/SCL wires as the LCD — no extra pins used." },
  temp:    { color: "var(--green)",  text: "🌡️ BMP280 pressure/temperature sensor at address <strong>0x76</strong>. Three different devices, three different addresses, all sharing the same two wires. That's the power of I²C." },
};
function i2cClick(id) {
  const info  = i2cInfoMap[id];
  if (!info) return;
  const panel = document.getElementById("i2c-info");
  if (panel) { panel.innerHTML = info.text; panel.style.borderLeftColor = info.color; }
  ["lcd","gyro","temp"].forEach((d) => {
    const el = document.getElementById("i2c-" + d);
    if (el) { el.setAttribute("stroke", d === id ? "#1d4ed8" : "#e2e8f0"); el.setAttribute("stroke-width", d === id ? "2.5" : "1.5"); }
  });
}

const pinInfoData = {
  sda: { color: "var(--amber)",  bg: "var(--amber-l)",  text: "🟡 <strong>SDA (A4)</strong> — Serial Data Line. Carries the actual data. It is bidirectional: Arduino writes to the LCD, and reads back from sensors. Uses open-drain signalling with a pull-up resistor (usually built into the module)." },
  scl: { color: "var(--purple)", bg: "var(--purple-l)", text: "🟣 <strong>SCL (A5)</strong> — Serial Clock Line. Arduino drives this to set the timing. Data on SDA is only valid when the clock pulses. Standard I²C runs at 100 kHz; fast mode is 400 kHz." },
  vcc: { color: "var(--coral)",  bg: "var(--coral-l)",  text: "🔴 <strong>VCC (5V)</strong> — Powers the LCD module. The I²C backpack PCF8574 chip and the LCD panel both need 5V. Some OLED displays run on 3.3V — always check the module's datasheet." },
  gnd: { color: "var(--slate)",  bg: "var(--slate-l)",  text: "⚫ <strong>GND</strong> — Ground reference. Every component in the circuit must share the same GND with Arduino, or signals will not be read correctly. GND is the return path for all current." },
};
function showPinInfo(pin) {
  const p     = pinInfoData[pin];
  const panel = document.getElementById("pin-info-panel");
  if (!panel || !p) return;
  panel.style.display         = "block";
  panel.innerHTML             = p.text;
  panel.style.background      = p.bg;
  panel.style.borderLeftColor = p.color;
}

let lcdBacklight = true;
function updateLCD() {
  const l1 = (document.getElementById("lcd-line1")?.value || "").padEnd(16).slice(0, 16);
  const l2 = (document.getElementById("lcd-line2")?.value || "").padEnd(16).slice(0, 16);
  const r1 = document.getElementById("lcd-row1");
  const r2 = document.getElementById("lcd-row2");
  const c1 = document.getElementById("code-line1");
  const c2 = document.getElementById("code-line2");
  if (r1) r1.textContent = l1;
  if (r2) r2.textContent = l2;
  if (c1) c1.textContent = l1.trimEnd();
  if (c2) c2.textContent = l2.trimEnd();
}
function setLCDBacklight(on) {
  lcdBacklight = on;
  const screen = document.getElementById("lcd-screen");
  const btnOn  = document.getElementById("bl-on");
  const btnOff = document.getElementById("bl-off");
  if (screen) { screen.style.background = on ? "#4a7c2e" : "#2a2a2a"; screen.style.color = on ? "#0d1f0d" : "#1a1a1a"; }
  if (btnOn)  { btnOn.style.background  = on  ? "var(--amber)" : ""; btnOn.style.color  = on  ? "white" : ""; btnOn.style.borderColor  = on  ? "var(--amber)" : ""; }
  if (btnOff) { btnOff.style.background = !on ? "var(--slate)" : ""; btnOff.style.color = !on ? "white" : ""; btnOff.style.borderColor = !on ? "var(--slate)" : ""; }
}
function lcdPreset(type) {
  const presets = {
    sensor: { l1: "Dist: 42 cm",   l2: "Light: 768"  },
    status: { l1: "Robot: MOVING", l2: "Speed: 80%"  },
    ip:     { l1: "192.168.1.105", l2: "Port: 8080"  },
  };
  const p = presets[type];
  if (!p) return;
  const el1 = document.getElementById("lcd-line1");
  const el2 = document.getElementById("lcd-line2");
  if (el1) el1.value = p.l1;
  if (el2) el2.value = p.l2;
  updateLCD();
}

const scannerDevices = {
  lcd:  { addr: "0x27", name: "LCD 1602 (PCF8574)",    active: true  },
  mpu:  { addr: "0x68", name: "MPU-6050 Gyro",         active: false },
  bmp:  { addr: "0x76", name: "BMP280 Temp/Pressure",  active: false },
  oled: { addr: "0x3C", name: "OLED 128x64 (SSD1306)", active: false },
};
function scannerToggle(id) {
  const dev = scannerDevices[id];
  if (!dev) return;
  dev.active = !dev.active;
  const btn = document.getElementById("scan-" + id + "-btn");
  if (btn) {
    btn.style.background  = dev.active ? "var(--blue)" : "";
    btn.style.color       = dev.active ? "white"       : "";
    btn.style.borderColor = dev.active ? "var(--blue)" : "";
  }
}
function runScanner() {
  const out    = document.getElementById("scanner-output");
  if (!out) return;
  const active = Object.values(scannerDevices).filter((d) => d.active);
  out.innerHTML = '<span style="color:#64748b;">Scanning I²C bus (0x01–0x7F)…</span><br>';
  if (active.length === 0) {
    out.innerHTML +=
      '<span style="color:#ef4444;">No I²C devices found.</span><br>' +
      '<span style="color:#475569;">Check wiring: SDA→A4, SCL→A5, VCC→5V, GND→GND</span>';
    return;
  }
  active.forEach((d, i) => {
    setTimeout(() => {
      out.innerHTML +=
        `<span style="color:#94a3b8;">Found device at address </span>` +
        `<span style="color:#fbbf24;font-weight:700;">${d.addr}</span>` +
        `<span style="color:#64748b;"> — ${d.name}</span><br>`;
      out.scrollTop = out.scrollHeight;
    }, 400 + i * 600);
  });
  setTimeout(() => {
    out.innerHTML += `<span style="color:#86efac;">Done. ${active.length} device(s) found.</span>`;
    out.scrollTop  = out.scrollHeight;
  }, 400 + active.length * 600);
}

// ── EXPORT ALL ────────────────────────────────────────────────────────────────
Object.assign(window, {
  openLB, closeLB, goSection,
  ardClick, ardTip, ardHide,
  ohmUpdate, ohmSelect, updateResist,
  bbClick,
  toggleDigital, drawDigital, updateAnalogDemo, drawAnalogWave, showWireInfo,
  drag, allowDrop, dropItem, resetDnD,
  btnDown, btnUp, updateLight, updateDist, updatePot,
  updateDHT, updateWater, toggleLED, showPartInfo,
  updateLedBrightness, toggleBuzzer, updateServo, setMotorSpeed,
  showThink, showScenario, showSystem, showPillar, updateSim,
  selectRobot, showRobotContent, rbTab, hlWire, toggleStep, updateProgress,
  copyCode, sim11Update, simBT,
  setSerialBaud, toggleSerial, startSerial, stopSerial, clearSerial,
  i2cClick, showPinInfo, updateLCD, setLCDBacklight, lcdPreset,
  scannerToggle, runScanner,
  onLessonLoad,
});
