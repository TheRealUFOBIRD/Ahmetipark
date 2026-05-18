const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const ui = {
  modeSelect: document.getElementById("modeSelect"),
  levelSelect: document.getElementById("levelSelect"),
  carSelect: document.getElementById("carSelect"),
  resetButton: document.getElementById("resetButton"),
  nextLevelButton: document.getElementById("nextLevelButton"),
  scenarioName: document.getElementById("scenarioName"),
  scenarioDescription: document.getElementById("scenarioDescription"),
  speedValue: document.getElementById("speedValue"),
  steerValue: document.getElementById("steerValue"),
  gearValue: document.getElementById("gearValue"),
  progressValue: document.getElementById("progressValue"),
  modeLabel: document.getElementById("modeLabel"),
  carNameLabel: document.getElementById("carNameLabel"),
  levelNameLabel: document.getElementById("levelNameLabel"),
  statusText: document.getElementById("statusText"),
  statusHint: document.getElementById("statusHint"),
  toast: document.getElementById("toast"),
  steeringWheel: document.getElementById("steeringWheel"),
  pedalForward: document.getElementById("pedalForward"),
  pedalReverse: document.getElementById("pedalReverse"),
  editorPanel: document.getElementById("editorPanel"),
  rotateLeftButton: document.getElementById("rotateLeftButton"),
  rotateRightButton: document.getElementById("rotateRightButton"),
  clearEditorButton: document.getElementById("clearEditorButton"),
  saveEditorButton: document.getElementById("saveEditorButton"),
  testEditorButton: document.getElementById("testEditorButton"),
  toolButtons: [...document.querySelectorAll(".tool-button")]
};

const TRACK = { width: canvas.width, height: canvas.height };
const STORAGE_KEY = "ahmetipark-custom-scenario-v1";
const WHEEL_MAX_ROTATION = 150;

const vehicles = [
  {
    id: "compact",
    name: "Kompakt",
    color: "#6ad7c7",
    accent: "#d8fff6",
    length: 74,
    width: 36,
    wheelBase: 46,
    maxSteer: degToRad(34),
    maxForwardSpeed: 210,
    maxReverseSpeed: 90,
    engineForce: 188,
    brakeForce: 340,
    drag: 1.9,
    rollingResistance: 24,
    steerResponse: 5.6
  },
  {
    id: "suv",
    name: "SUV",
    color: "#8cb7ff",
    accent: "#f4f7ff",
    length: 92,
    width: 44,
    wheelBase: 58,
    maxSteer: degToRad(28),
    maxForwardSpeed: 192,
    maxReverseSpeed: 76,
    engineForce: 160,
    brakeForce: 304,
    drag: 2.3,
    rollingResistance: 34,
    steerResponse: 4.5
  },
  {
    id: "sport",
    name: "Sport",
    color: "#ff875c",
    accent: "#ffe0c8",
    length: 80,
    width: 38,
    wheelBase: 50,
    maxSteer: degToRad(32),
    maxForwardSpeed: 232,
    maxReverseSpeed: 88,
    engineForce: 178,
    brakeForce: 326,
    drag: 2.05,
    rollingResistance: 26,
    steerResponse: 5.3
  },
  {
    id: "limousine",
    name: "Limousine",
    color: "#d6a2ff",
    accent: "#f7ebff",
    length: 102,
    width: 40,
    wheelBase: 64,
    maxSteer: degToRad(27),
    maxForwardSpeed: 205,
    maxReverseSpeed: 78,
    engineForce: 166,
    brakeForce: 315,
    drag: 2.2,
    rollingResistance: 30,
    steerResponse: 4.6
  }
];

const builtInLevels = [
  {
    id: "easy-corner",
    name: "Marktplatz",
    description: "Ein breites Feld am Rand. Perfekt zum Einfahren und um das Fahrverhalten kennenzulernen.",
    start: { x: 140, y: 505, angle: -Math.PI / 2 },
    parking: { x: 772, y: 150, width: 130, height: 210, angle: -Math.PI / 2, tolerance: degToRad(13) },
    obstacles: [
      { x: 360, y: 132, width: 30, height: 360, color: "#505f6f" },
      { x: 640, y: 112, width: 34, height: 380, color: "#505f6f" },
      { x: 734, y: 372, width: 120, height: 22, color: "#505f6f" }
    ],
    decorations: [
      { x: 170, y: 180, radius: 18, color: "#7ac98b" },
      { x: 286, y: 450, radius: 15, color: "#7ac98b" },
      { x: 874, y: 122, radius: 16, color: "#7ac98b" }
    ]
  },
  {
    id: "parallel-street",
    name: "Parallelparken",
    description: "Enge Luecke zwischen zwei Fahrzeugattrappen. Hier sind langsame Korrekturen wichtig.",
    start: { x: 200, y: 500, angle: 0 },
    parking: { x: 636, y: 320, width: 162, height: 76, angle: 0, tolerance: degToRad(9) },
    obstacles: [
      { x: 540, y: 250, width: 138, height: 48, color: "#40556a" },
      { x: 540, y: 342, width: 138, height: 48, color: "#40556a" },
      { x: 262, y: 240, width: 70, height: 118, color: "#505f6f" },
      { x: 760, y: 240, width: 70, height: 118, color: "#505f6f" }
    ],
    decorations: [
      { x: 164, y: 176, radius: 15, color: "#7ac98b" },
      { x: 796, y: 176, radius: 15, color: "#7ac98b" },
      { x: 480, y: 154, radius: 12, color: "#7ac98b" }
    ]
  },
  {
    id: "warehouse",
    name: "Depot-Hof",
    description: "Rueckwaerts in eine Lagerbucht. Das Auto muss sauber ausgerichtet und fast still stehen.",
    start: { x: 190, y: 314, angle: 0 },
    parking: { x: 796, y: 300, width: 118, height: 168, angle: Math.PI / 2, tolerance: degToRad(10) },
    obstacles: [
      { x: 610, y: 126, width: 162, height: 26, color: "#505f6f" },
      { x: 610, y: 448, width: 162, height: 26, color: "#505f6f" },
      { x: 700, y: 180, width: 22, height: 240, color: "#505f6f" },
      { x: 374, y: 182, width: 40, height: 224, color: "#505f6f" },
      { x: 478, y: 182, width: 40, height: 224, color: "#505f6f" }
    ],
    decorations: [
      { x: 124, y: 120, radius: 14, color: "#7ac98b" },
      { x: 124, y: 480, radius: 14, color: "#7ac98b" },
      { x: 840, y: 98, radius: 14, color: "#7ac98b" }
    ]
  },
  {
    id: "cone-maze",
    name: "Kegel-Labyrinth",
    description: "Mehrere schmale Kurven und wenig Platz. Nutze kleine Lenkwinkel und Geduld.",
    start: { x: 130, y: 520, angle: -Math.PI / 2 },
    parking: { x: 826, y: 126, width: 118, height: 186, angle: -Math.PI / 2, tolerance: degToRad(9) },
    obstacles: [
      { x: 178, y: 102, width: 28, height: 368, color: "#49596a" },
      { x: 332, y: 176, width: 28, height: 332, color: "#49596a" },
      { x: 486, y: 88, width: 28, height: 332, color: "#49596a" },
      { x: 640, y: 176, width: 28, height: 248, color: "#49596a" },
      { x: 748, y: 88, width: 28, height: 260, color: "#49596a" }
    ],
    decorations: [
      { x: 106, y: 94, radius: 11, color: "#f7b23b" },
      { x: 280, y: 114, radius: 11, color: "#f7b23b" },
      { x: 434, y: 94, radius: 11, color: "#f7b23b" },
      { x: 588, y: 114, radius: 11, color: "#f7b23b" },
      { x: 696, y: 94, radius: 11, color: "#f7b23b" }
    ]
  }
];

const app = {
  mode: "play",
  selectedLevelId: builtInLevels[0].id,
  selectedCarId: vehicles[0].id,
  car: null,
  scenario: null,
  customScenario: loadCustomScenario() || createBlankScenario(),
  editorScenario: null,
  editorTool: "select",
  editorSelection: null,
  editorDraft: null,
  dragState: null,
  parked: false,
  lastTime: performance.now(),
  progress: 0,
  messageTimer: 0,
  collisionTimer: 0,
  wheelInput: 0,
  wheelDragActive: false,
  wheelDragStartAngle: 0,
  wheelDragStartInput: 0
};

const keys = new Set();
const pointerState = {
  forward: false,
  reverse: false
};

populateControls();
switchMode("play");
requestAnimationFrame(loop);

window.addEventListener("keydown", (event) => {
  const interactiveTag = document.activeElement?.tagName;
  if (interactiveTag === "SELECT") {
    return;
  }
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(event.key)) {
    event.preventDefault();
  }
  keys.add(event.key);
  if (event.key.toLowerCase() === "r" && app.mode === "play") {
    resetScenario();
  }
});

window.addEventListener("keyup", (event) => {
  keys.delete(event.key);
});

window.addEventListener("blur", () => {
  keys.clear();
  pointerState.forward = false;
  pointerState.reverse = false;
  app.wheelDragActive = false;
  ui.steeringWheel.classList.remove("dragging");
});

canvas.addEventListener("pointerdown", onCanvasPointerDown);
canvas.addEventListener("pointermove", onCanvasPointerMove);
window.addEventListener("pointerup", onCanvasPointerUp);
canvas.addEventListener("contextmenu", (event) => event.preventDefault());

ui.modeSelect.addEventListener("change", () => switchMode(ui.modeSelect.value));
ui.levelSelect.addEventListener("change", () => {
  app.selectedLevelId = ui.levelSelect.value;
  if (app.mode === "play") {
    loadSelectedScenario();
  }
});
ui.carSelect.addEventListener("change", () => {
  app.selectedCarId = ui.carSelect.value;
  if (app.mode === "play") {
    resetScenario();
  } else {
    syncLabels();
  }
});
ui.resetButton.addEventListener("click", () => resetScenario());
ui.nextLevelButton.addEventListener("click", () => goToNextLevel());

ui.pedalForward.addEventListener("pointerdown", () => {
  pointerState.forward = true;
});
ui.pedalForward.addEventListener("pointerup", () => {
  pointerState.forward = false;
});
ui.pedalForward.addEventListener("pointerleave", () => {
  pointerState.forward = false;
});
ui.pedalForward.addEventListener("pointercancel", () => {
  pointerState.forward = false;
});

ui.pedalReverse.addEventListener("pointerdown", () => {
  pointerState.reverse = true;
});
ui.pedalReverse.addEventListener("pointerup", () => {
  pointerState.reverse = false;
});
ui.pedalReverse.addEventListener("pointerleave", () => {
  pointerState.reverse = false;
});
ui.pedalReverse.addEventListener("pointercancel", () => {
  pointerState.reverse = false;
});

ui.toolButtons.forEach((button) => {
  button.addEventListener("click", () => {
    app.editorTool = button.dataset.tool;
    app.editorSelection = null;
    ui.toolButtons.forEach((candidate) => candidate.classList.toggle("active", candidate === button));
    setStatus("Editor aktiv", `Werkzeug: ${button.textContent}`);
  });
});

ui.rotateLeftButton.addEventListener("click", () => rotateSelection(-15));
ui.rotateRightButton.addEventListener("click", () => rotateSelection(15));
ui.clearEditorButton.addEventListener("click", () => {
  app.editorScenario = createBlankScenario();
  app.editorSelection = null;
  setStatus("Editor geleert", "Baue ein neues Park-Szenario.");
});
ui.saveEditorButton.addEventListener("click", () => {
  saveEditorScenario();
});
ui.testEditorButton.addEventListener("click", () => {
  const saved = saveEditorScenario(false);
  if (!saved) {
    return;
  }
  app.selectedLevelId = "custom";
  ui.levelSelect.value = "custom";
  switchMode("play");
  toast("Eigenes Level geladen");
});

setupSteeringWheel();

function populateControls() {
  ui.carSelect.innerHTML = "";
  vehicles.forEach((vehicle) => {
    const option = document.createElement("option");
    option.value = vehicle.id;
    option.textContent = vehicle.name;
    ui.carSelect.appendChild(option);
  });
  ui.carSelect.value = app.selectedCarId;
  rebuildLevelSelect();
}

function rebuildLevelSelect() {
  ui.levelSelect.innerHTML = "";
  const levels = getLevelOptions();
  levels.forEach((level) => {
    const option = document.createElement("option");
    option.value = level.id;
    option.textContent = level.name;
    ui.levelSelect.appendChild(option);
  });
  if (!levels.some((level) => level.id === app.selectedLevelId)) {
    app.selectedLevelId = levels[0].id;
  }
  ui.levelSelect.value = app.selectedLevelId;
}

function getLevelOptions() {
  const levels = [...builtInLevels];
  if (app.customScenario) {
    levels.push({
      id: "custom",
      name: app.customScenario.name || "Eigenes Szenario",
      description: app.customScenario.description || "Dein eigenes Parkfeld.",
      start: app.customScenario.start,
      parking: app.customScenario.parking,
      obstacles: app.customScenario.obstacles,
      decorations: app.customScenario.decorations || []
    });
  }
  return levels;
}

function switchMode(mode) {
  app.mode = mode;
  ui.modeSelect.value = mode;
  ui.modeLabel.textContent = mode === "play" ? "Spielen" : "Editor";
  ui.editorPanel.classList.toggle("hidden", mode !== "editor");
  ui.levelSelect.disabled = mode !== "play";
  ui.nextLevelButton.disabled = mode !== "play";
  if (mode === "editor") {
    app.editorScenario = cloneScenario(app.customScenario || createBlankScenario());
    app.editorSelection = null;
    setStatus("Editor bereit", "Ziehe Objekte direkt auf die Karte.");
  } else {
    loadSelectedScenario();
  }
  syncLabels();
}

function loadSelectedScenario() {
  const level = getLevelOptions().find((entry) => entry.id === app.selectedLevelId) || getLevelOptions()[0];
  app.selectedLevelId = level.id;
  ui.levelSelect.value = level.id;
  app.scenario = cloneScenario(level);
  const safeStart = findSafeSpawn(level.start, getCurrentVehicle(), app.scenario.obstacles);
  app.car = buildCar(safeStart, getCurrentVehicle());
  app.parked = false;
  app.progress = 0;
  app.wheelInput = 0;
  app.collisionTimer = 0;
  pointerState.forward = false;
  pointerState.reverse = false;
  const shiftedSpawn = safeStart.x !== level.start.x || safeStart.y !== level.start.y;
  setStatus("Fahrzeug bereit", shiftedSpawn ? "Startpunkt war blockiert und wurde auf freie Flaeche verschoben." : level.description);
  syncLabels();
}

function resetScenario() {
  if (app.mode === "editor") {
    app.editorScenario = cloneScenario(app.customScenario || createBlankScenario());
    app.editorSelection = null;
    setStatus("Editor zurueckgesetzt", "Das gespeicherte Szenario ist wieder geladen.");
    return;
  }
  loadSelectedScenario();
  toast("Szenario neu gestartet", 1200);
}

function goToNextLevel() {
  const levels = getLevelOptions();
  const currentIndex = levels.findIndex((level) => level.id === app.selectedLevelId);
  const nextIndex = (currentIndex + 1) % levels.length;
  app.selectedLevelId = levels[nextIndex].id;
  ui.levelSelect.value = app.selectedLevelId;
  loadSelectedScenario();
}

function saveEditorScenario(showToast = true) {
  if (!app.editorScenario?.parking) {
    setStatus("Parkfeld fehlt", "Lege mindestens ein Parkfeld an.");
    toast("Bitte zuerst ein Parkfeld anlegen", 1700);
    return false;
  }
  app.customScenario = {
    ...cloneScenario(app.editorScenario),
    id: "custom",
    name: "Eigenes Szenario",
    description: "Vom Editor gebaut. Probiere verschiedene Fahrzeuge und Winkel aus."
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(app.customScenario));
  } catch (error) {
    console.warn("Konnte eigenes Szenario nicht speichern.", error);
  }
  rebuildLevelSelect();
  if (showToast) {
    toast("Eigenes Level gespeichert");
  }
  setStatus("Editor gespeichert", "Das eigene Szenario ist jetzt spielbar.");
  return true;
}

function createBlankScenario() {
  return {
    id: "custom",
    name: "Eigenes Szenario",
    description: "Leere Karte fuer dein Parkprojekt.",
    start: { x: 160, y: 500, angle: -Math.PI / 2 },
    parking: { x: 750, y: 160, width: 120, height: 190, angle: -Math.PI / 2, tolerance: degToRad(10) },
    obstacles: [],
    decorations: []
  };
}

function loadCustomScenario() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.warn("Konnte eigenes Szenario nicht laden.", error);
    return null;
  }
}

function buildCar(start, spec) {
  return {
    x: start.x,
    y: start.y,
    angle: start.angle,
    steerAngle: 0,
    speed: 0,
    throttleHold: 0,
    reverseHold: 0,
    spec
  };
}

function findSafeSpawn(start, spec, obstacles) {
  const candidate = buildCar(start, spec);
  if (!detectCollision(candidate, obstacles) && !outsideBounds(candidate)) {
    return { ...start };
  }

  const angleOffsets = [0, degToRad(10), -degToRad(10), degToRad(20), -degToRad(20), Math.PI / 2, -Math.PI / 2, Math.PI];
  const maxRadius = 260;
  const radiusStep = 24;
  const directions = 16;

  for (let radius = radiusStep; radius <= maxRadius; radius += radiusStep) {
    for (let step = 0; step < directions; step += 1) {
      const direction = (step / directions) * Math.PI * 2;
      const x = clamp(start.x + Math.cos(direction) * radius, 40, TRACK.width - 40);
      const y = clamp(start.y + Math.sin(direction) * radius, 40, TRACK.height - 40);
      for (const angleOffset of angleOffsets) {
        const spawn = { x, y, angle: normalizeAngle(start.angle + angleOffset) };
        const probe = buildCar(spawn, spec);
        if (!detectCollision(probe, obstacles) && !outsideBounds(probe)) {
          return spawn;
        }
      }
    }
  }

  for (let y = 60; y <= TRACK.height - 60; y += 28) {
    for (let x = 60; x <= TRACK.width - 60; x += 28) {
      for (const angleOffset of angleOffsets) {
        const spawn = { x, y, angle: normalizeAngle(start.angle + angleOffset) };
        const probe = buildCar(spawn, spec);
        if (!detectCollision(probe, obstacles) && !outsideBounds(probe)) {
          return spawn;
        }
      }
    }
  }

  return { x: TRACK.width / 2, y: TRACK.height / 2, angle: start.angle };
}

function loop(timestamp) {
  const dt = Math.min((timestamp - app.lastTime) / 1000, 0.025);
  app.lastTime = timestamp;
  update(dt);
  render();
  requestAnimationFrame(loop);
}

function update(dt) {
  if (app.mode === "play" && app.car && app.scenario) {
    updateCarPhysics(dt);
    updateParkingProgress(dt);
    updateHud();
  } else if (app.mode === "editor") {
    updateEditorHud();
  }

  if (app.messageTimer > 0) {
    app.messageTimer -= dt;
    if (app.messageTimer <= 0) {
      ui.toast.classList.add("hidden");
    }
  }

  if (app.collisionTimer > 0) {
    app.collisionTimer -= dt;
  }

  ui.steeringWheel.style.transform = `rotate(${app.wheelInput * WHEEL_MAX_ROTATION}deg)`;
}

function updateCarPhysics(dt) {
  const car = app.car;
  if (app.parked) {
    car.speed = 0;
    car.steerAngle = approach(car.steerAngle, 0, car.spec.steerResponse * dt);
    car.throttleHold = 0;
    car.reverseHold = 0;
    return;
  }

  const controls = getControlState(dt);
  const speedRatio = Math.min(Math.abs(car.speed) / car.spec.maxForwardSpeed, 1);
  const speedSensitiveSteer = 1 - speedRatio * 0.45;
  const targetSteer = controls.steer * car.spec.maxSteer * speedSensitiveSteer;
  car.steerAngle = approach(car.steerAngle, targetSteer, car.spec.steerResponse * dt);

  let acceleration = 0;
  const hasForwardInput = controls.throttle > 0.05;
  const hasReverseInput = controls.reverse > 0.05;
  car.throttleHold = hasForwardInput && !hasReverseInput ? Math.min(car.throttleHold + dt, 3.5) : Math.max(car.throttleHold - dt * 2.6, 0);
  car.reverseHold = hasReverseInput && !hasForwardInput ? Math.min(car.reverseHold + dt, 2.5) : Math.max(car.reverseHold - dt * 3, 0);
  const throttleCharge = car.throttleHold / 3.5;
  const reverseCharge = car.reverseHold / 2.5;
  const forwardEngineForce = lerp(car.spec.engineForce * 0.72, car.spec.engineForce * 1.42, easeOutCubic(throttleCharge));
  const forwardSpeedCap = lerp(car.spec.maxForwardSpeed * 0.48, car.spec.maxForwardSpeed * 1.12, easeOutCubic(throttleCharge));
  const reverseEngineForce = lerp(car.spec.engineForce * 0.6, car.spec.engineForce * 0.9, easeOutCubic(reverseCharge));

  if (hasForwardInput) {
    if (car.speed < -8) {
      acceleration += car.spec.brakeForce;
    } else if (car.speed < forwardSpeedCap) {
      acceleration += forwardEngineForce;
    }
  }

  if (hasReverseInput) {
    if (car.speed > 8) {
      acceleration -= car.spec.brakeForce;
    } else if (car.speed > -car.spec.maxReverseSpeed) {
      acceleration -= reverseEngineForce;
    }
  }

  if (!hasForwardInput && !hasReverseInput) {
    const rolling = Math.min(Math.abs(car.speed), car.spec.rollingResistance * dt);
    car.speed -= Math.sign(car.speed || 0) * rolling;
  }

  acceleration -= car.spec.drag * car.speed;
  car.speed += acceleration * dt;

  if (Math.abs(car.speed) < 0.6 && !hasForwardInput && !hasReverseInput) {
    car.speed = 0;
  }

  const previous = { x: car.x, y: car.y, angle: car.angle, speed: car.speed };
  const halfWheelBase = car.spec.wheelBase / 2;
  let rearX = car.x - Math.cos(car.angle) * halfWheelBase;
  let rearY = car.y - Math.sin(car.angle) * halfWheelBase;
  let frontX = car.x + Math.cos(car.angle) * halfWheelBase;
  let frontY = car.y + Math.sin(car.angle) * halfWheelBase;

  rearX += Math.cos(car.angle) * car.speed * dt;
  rearY += Math.sin(car.angle) * car.speed * dt;
  frontX += Math.cos(car.angle + car.steerAngle) * car.speed * dt;
  frontY += Math.sin(car.angle + car.steerAngle) * car.speed * dt;

  car.x = (rearX + frontX) / 2;
  car.y = (rearY + frontY) / 2;
  car.angle = Math.atan2(frontY - rearY, frontX - rearX);

  if (detectCollision(car, app.scenario.obstacles) || outsideBounds(car)) {
    car.x = previous.x;
    car.y = previous.y;
    car.angle = previous.angle;
    car.speed = -previous.speed * 0.2;
    if (app.collisionTimer <= 0) {
      toast("Achtung, Kollision", 900);
      app.collisionTimer = 0.45;
    }
  }
}

function updateParkingProgress(dt) {
  const result = evaluateParking(app.car, app.scenario.parking);
  if (result.success) {
    app.progress = Math.min(app.progress + dt / 3, 1);
    if (app.progress >= 1 && !app.parked) {
      app.parked = true;
      setStatus("Geparkt", "3 Sekunden im gruenden Feld gehalten.");
      toast("Level geschafft");
    } else if (!app.parked) {
      setStatus("Parkbereich halten", `${Math.ceil((1 - app.progress) * 3)} Sek. noch im gruenden Feld bleiben.`);
    }
  } else {
    app.progress = 0;
    if (!app.parked) {
      setStatus("Einparken", result.message);
    }
  }
}

function updateHud() {
  const speedKmh = Math.round(Math.abs(app.car.speed) * 0.36);
  const steerDeg = Math.round(radToDeg(app.car.steerAngle));
  const gear = app.car.speed > 4 ? "D" : app.car.speed < -4 ? "R" : "N";
  ui.speedValue.textContent = `${speedKmh} km/h`;
  ui.steerValue.textContent = `${steerDeg} deg`;
  ui.gearValue.textContent = gear;
  ui.progressValue.textContent = `${Math.round(app.progress * 100)} %`;
}

function updateEditorHud() {
  ui.speedValue.textContent = "0 km/h";
  ui.steerValue.textContent = `${Math.round(app.wheelInput * WHEEL_MAX_ROTATION)} deg`;
  ui.gearValue.textContent = "Edit";
  ui.progressValue.textContent = `${app.editorScenario.obstacles.length} Objekte`;
}

function getControlState(dt) {
  const keyboardForward = keys.has("ArrowUp");
  const keyboardReverse = keys.has("ArrowDown");
  const keyboardLeft = keys.has("ArrowLeft");
  const keyboardRight = keys.has("ArrowRight");

  let steer = 0;
  if (keyboardLeft) {
    steer -= 1;
  }
  if (keyboardRight) {
    steer += 1;
  }

  const wheelSteer = app.wheelDragActive ? app.wheelInput : app.wheelInput * 0.9;
  if (Math.abs(wheelSteer) > Math.abs(steer)) {
    steer = wheelSteer;
  }

  if (!app.wheelDragActive && !keyboardLeft && !keyboardRight) {
    app.wheelInput = approach(app.wheelInput, 0, 2.8 * dt);
  } else if (!app.wheelDragActive && (keyboardLeft || keyboardRight)) {
    app.wheelInput = approach(app.wheelInput, steer, 4.4 * dt);
  }

  return {
    throttle: keyboardForward || pointerState.forward ? 1 : 0,
    reverse: keyboardReverse || pointerState.reverse ? 1 : 0,
    steer: clamp(steer, -1, 1)
  };
}

function evaluateParking(car, parking) {
  const parkingPoly = getRotatedRectPolygon(parking);
  const centerInside = pointInPolygon({ x: car.x, y: car.y }, parkingPoly);
  if (centerInside) {
    return { success: true, message: "Im Parkfeld." };
  }

  return { success: false, message: "Einfach ins gruene Feld fahren." };
}

function detectCollision(car, obstacles) {
  const carPoly = getCarPolygon(car);
  return obstacles.some((obstacle) => polygonsIntersect(carPoly, getAxisRectPolygon(obstacle)));
}

function outsideBounds(car) {
  return getCarPolygon(car).some((point) => point.x < 0 || point.y < 0 || point.x > TRACK.width || point.y > TRACK.height);
}

function render() {
  drawBackground();
  if (app.mode === "play" && app.scenario && app.car) {
    drawScenario(app.scenario);
    drawCar(app.car);
    if (app.parked) {
      drawParkingSuccess();
    }
  } else if (app.mode === "editor" && app.editorScenario) {
    drawScenario(app.editorScenario, true);
    drawEditorGhost();
    drawEditorSelection();
    drawEditorCarAnchor();
  }
}

function drawBackground() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const surface = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  surface.addColorStop(0, "#5d707a");
  surface.addColorStop(0.55, "#435561");
  surface.addColorStop(1, "#293743");
  ctx.fillStyle = surface;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  const panelGlow = ctx.createRadialGradient(canvas.width * 0.25, canvas.height * 0.15, 20, canvas.width * 0.25, canvas.height * 0.15, 420);
  panelGlow.addColorStop(0, "rgba(255,255,255,0.08)");
  panelGlow.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = panelGlow;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgba(255,255,255,0.03)";
  for (let i = 0; i < 320; i += 1) {
    const x = (i * 53) % canvas.width;
    const y = (i * 97) % canvas.height;
    const size = (i % 3) + 1;
    ctx.fillRect(x, y, size, size);
  }
  ctx.strokeStyle = "rgba(255,255,255,0.02)";
  ctx.lineWidth = 1;
  for (let x = 0; x <= canvas.width; x += 80) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y <= canvas.height; y += 80) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  const vignette = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 180, canvas.width / 2, canvas.height / 2, canvas.width * 0.75);
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, "rgba(7,12,18,0.22)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
}

function drawScenario(scenario, editor = false) {
  (scenario.decorations || []).forEach((item) => {
    ctx.save();
    const foliage = ctx.createRadialGradient(item.x - item.radius * 0.3, item.y - item.radius * 0.35, 3, item.x, item.y, item.radius);
    foliage.addColorStop(0, lightenColor(item.color, 0.2));
    foliage.addColorStop(1, darkenColor(item.color, 0.16));
    ctx.fillStyle = foliage;
    ctx.beginPath();
    ctx.arc(item.x, item.y, item.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(12, 22, 18, 0.18)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  });

  scenario.obstacles.forEach((obstacle, index) => {
    ctx.save();
    const obstacleFill = ctx.createLinearGradient(obstacle.x, obstacle.y, obstacle.x, obstacle.y + obstacle.height);
    obstacleFill.addColorStop(0, lightenColor(obstacle.color || "#59697b", 0.18));
    obstacleFill.addColorStop(1, obstacle.color || "#59697b");
    ctx.fillStyle = obstacleFill;
    roundRect(ctx, obstacle.x, obstacle.y, obstacle.width, obstacle.height, 8, true, false);
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    roundRect(ctx, obstacle.x + 4, obstacle.y + 4, obstacle.width - 8, Math.max(10, obstacle.height * 0.18), 6, true, false);
    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.lineWidth = 1.5;
    roundRect(ctx, obstacle.x, obstacle.y, obstacle.width, obstacle.height, 8, false, true);
    if (editor) {
      ctx.fillStyle = "rgba(255,255,255,0.18)";
      ctx.font = "12px Trebuchet MS";
      ctx.fillText(String(index + 1), obstacle.x + 6, obstacle.y + 14);
    }
    ctx.restore();
  });

  drawParkingSpot(scenario.parking, editor);
}

function drawParkingSpot(parking, editor = false) {
  ctx.save();
  ctx.translate(parking.x, parking.y);
  ctx.rotate(parking.angle);
  const parkingFill = ctx.createLinearGradient(0, -parking.height / 2, 0, parking.height / 2);
  parkingFill.addColorStop(0, "rgba(98, 206, 161, 0.28)");
  parkingFill.addColorStop(1, "rgba(58, 154, 116, 0.12)");
  ctx.fillStyle = parkingFill;
  ctx.strokeStyle = "rgba(205, 255, 235, 0.98)";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.rect(-parking.width / 2, -parking.height / 2, parking.width, parking.height);
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = "rgba(245,255,250,0.95)";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(-parking.width / 2 + 9, -parking.height / 2 + 9);
  ctx.lineTo(-parking.width / 2 + 9, parking.height / 2 - 9);
  ctx.moveTo(parking.width / 2 - 9, -parking.height / 2 + 9);
  ctx.lineTo(parking.width / 2 - 9, parking.height / 2 - 9);
  ctx.stroke();
  ctx.lineWidth = 3;
  ctx.setLineDash([16, 12]);
  ctx.beginPath();
  ctx.moveTo(-parking.width / 2 + 9, parking.height / 2 - 12);
  ctx.lineTo(parking.width / 2 - 9, parking.height / 2 - 12);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.beginPath();
  ctx.moveTo(0, -parking.height / 2 + 10);
  ctx.lineTo(-10, -parking.height / 2 + 30);
  ctx.lineTo(10, -parking.height / 2 + 30);
  ctx.closePath();
  ctx.fill();

  if (editor) {
    ctx.fillStyle = "#eff7ff";
    ctx.font = "bold 14px Trebuchet MS";
    ctx.fillText("P", -5, 5);
  }
  ctx.restore();
}

function drawCar(car, alpha = 1) {
  ctx.save();
  ctx.translate(car.x, car.y);
  ctx.rotate(car.angle);
  ctx.globalAlpha = alpha;

  ctx.fillStyle = "rgba(0,0,0,0.22)";
  roundRect(ctx, -car.spec.length / 2 + 6, -car.spec.width / 2 + 10, car.spec.length, car.spec.width - 1, 17, true, false);

  const axleOffset = car.spec.wheelBase / 2;
  const trackOffset = car.spec.width / 2 - 4;
  drawWheel(-axleOffset, -trackOffset, 0);
  drawWheel(-axleOffset, trackOffset, 0);
  drawWheel(axleOffset, -trackOffset, car.steerAngle);
  drawWheel(axleOffset, trackOffset, car.steerAngle);

  const bodyGradient = ctx.createLinearGradient(-car.spec.length / 2, 0, car.spec.length / 2, 0);
  bodyGradient.addColorStop(0, darkenColor(car.spec.color, 0.22));
  bodyGradient.addColorStop(0.45, car.spec.color);
  bodyGradient.addColorStop(1, lightenColor(car.spec.color, 0.2));
  ctx.fillStyle = bodyGradient;
  ctx.strokeStyle = "rgba(255,255,255,0.34)";
  ctx.lineWidth = 2;
  roundRect(ctx, -car.spec.length / 2, -car.spec.width / 2, car.spec.length, car.spec.width, 16, true, true);

  ctx.fillStyle = "rgba(255,255,255,0.1)";
  roundRect(ctx, -car.spec.length / 2 + 8, -car.spec.width / 2 + 6, car.spec.length - 16, 9, 7, true, false);

  ctx.fillStyle = car.spec.accent;
  roundRect(ctx, -car.spec.length * 0.21, -car.spec.width / 2 + 6, car.spec.length * 0.54, car.spec.width - 12, 12, true, false);

  ctx.fillStyle = "rgba(37, 48, 68, 0.98)";
  roundRect(ctx, -car.spec.length * 0.14, -car.spec.width / 2 + 9, car.spec.length * 0.3, car.spec.width - 18, 9, true, false);
  roundRect(ctx, car.spec.length * 0.19, -car.spec.width / 2 + 10, car.spec.length * 0.13, car.spec.width - 20, 7, true, false);
  roundRect(ctx, -car.spec.length * 0.32, -car.spec.width / 2 + 10, car.spec.length * 0.13, car.spec.width - 20, 7, true, false);

  ctx.fillStyle = darkenColor(car.spec.color, 0.14);
  roundRect(ctx, -car.spec.length * 0.4, -car.spec.width / 2 + 4, 10, car.spec.width - 8, 4, true, false);
  roundRect(ctx, car.spec.length * 0.38, -car.spec.width / 2 + 4, 10, car.spec.width - 8, 4, true, false);

  ctx.fillStyle = "rgba(0,0,0,0.12)";
  roundRect(ctx, -car.spec.length * 0.32, -car.spec.width / 2 + 2, car.spec.length * 0.64, 5, 3, true, false);
  roundRect(ctx, -car.spec.length * 0.32, car.spec.width / 2 - 7, car.spec.length * 0.64, 5, 3, true, false);

  ctx.fillStyle = "rgba(255, 248, 213, 0.85)";
  roundRect(ctx, car.spec.length / 2 - 11, -9, 7, 18, 3, true, false);
  ctx.fillStyle = "rgba(255, 103, 103, 0.9)";
  roundRect(ctx, -car.spec.length / 2 + 4, -10, 7, 8, 2, true, false);
  roundRect(ctx, -car.spec.length / 2 + 4, 2, 7, 8, 2, true, false);

  ctx.strokeStyle = "rgba(0,0,0,0.2)";
  ctx.beginPath();
  ctx.moveTo(-car.spec.length * 0.1, -car.spec.width / 2 + 6);
  ctx.lineTo(-car.spec.length * 0.1, car.spec.width / 2 - 6);
  ctx.stroke();

  ctx.restore();
}

function drawWheel(x, y, steerAngle) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(steerAngle);
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  roundRect(ctx, -12, -4, 24, 12, 4, true, false);
  ctx.fillStyle = "#161d25";
  roundRect(ctx, -12, -6, 24, 12, 4, true, false);
  ctx.fillStyle = "rgba(255,255,255,0.06)";
  roundRect(ctx, -9, -4.4, 18, 1.8, 2, true, false);
  roundRect(ctx, -9, -0.9, 18, 1.8, 2, true, false);
  roundRect(ctx, -9, 2.6, 18, 1.8, 2, true, false);
  ctx.restore();
}

function drawParkingSuccess() {
  ctx.save();
  ctx.fillStyle = "rgba(9, 16, 23, 0.58)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#eff7ff";
  ctx.font = "bold 44px Trebuchet MS";
  ctx.textAlign = "center";
  ctx.fillText("Perfekt geparkt!", canvas.width / 2, canvas.height / 2 - 8);
  ctx.font = "20px Trebuchet MS";
  ctx.fillStyle = "#b4c9db";
  ctx.fillText("Druecke Neu starten oder probiere das naechste Szenario.", canvas.width / 2, canvas.height / 2 + 30);
  ctx.restore();
}

function drawEditorGhost() {
  if (!app.editorDraft) {
    return;
  }

  ctx.save();
  ctx.globalAlpha = 0.55;
  if (app.editorDraft.type === "obstacle") {
    ctx.fillStyle = "#ff8743";
    ctx.fillRect(app.editorDraft.x, app.editorDraft.y, app.editorDraft.width, app.editorDraft.height);
  } else if (app.editorDraft.type === "parking") {
    drawParkingSpot({
      x: app.editorDraft.x + app.editorDraft.width / 2,
      y: app.editorDraft.y + app.editorDraft.height / 2,
      width: app.editorDraft.width,
      height: app.editorDraft.height,
      angle: app.editorDraft.angle,
      tolerance: app.editorDraft.tolerance
    }, true);
  } else if (app.editorDraft.type === "car") {
    drawCar(buildCar(app.editorDraft, getCurrentVehicle()), 0.5);
  }
  ctx.restore();
}

function drawEditorSelection() {
  if (!app.editorSelection) {
    return;
  }
  ctx.save();
  ctx.strokeStyle = "rgba(247, 178, 59, 0.95)";
  ctx.lineWidth = 3;
  ctx.setLineDash([8, 8]);
  if (app.editorSelection.type === "obstacle") {
    const obstacle = app.editorScenario.obstacles[app.editorSelection.index];
    ctx.strokeRect(obstacle.x - 3, obstacle.y - 3, obstacle.width + 6, obstacle.height + 6);
  } else if (app.editorSelection.type === "parking") {
    const parking = app.editorScenario.parking;
    strokePolygon(getRotatedRectPolygon(parking));
  } else if (app.editorSelection.type === "car") {
    const previewCar = buildCar(app.editorScenario.start, getCurrentVehicle());
    strokePolygon(getCarPolygon(previewCar));
  }
  ctx.restore();
}

function drawEditorCarAnchor() {
  const previewCar = buildCar(app.editorScenario.start, getCurrentVehicle());
  drawCar(previewCar, 0.9);
}

function onCanvasPointerDown(event) {
  const point = getCanvasPoint(event);
  if (app.mode !== "editor") {
    return;
  }

  if (app.editorTool === "erase") {
    eraseAtPoint(point);
    return;
  }

  if (app.editorTool === "select") {
    const selection = getEditorItemAtPoint(point);
    app.editorSelection = selection;
    if (selection) {
      app.dragState = getSelectionDragState(selection, point);
    }
    return;
  }

  if (app.editorTool === "obstacle" || app.editorTool === "parking") {
    app.dragState = { type: app.editorTool, start: point };
    app.editorDraft = { type: app.editorTool, x: point.x, y: point.y, width: 1, height: 1, angle: 0, tolerance: degToRad(10) };
    return;
  }

  if (app.editorTool === "car") {
    app.dragState = { type: "car", start: point };
    app.editorDraft = { type: "car", x: point.x, y: point.y, angle: app.editorScenario.start.angle };
  }
}

function onCanvasPointerMove(event) {
  if (app.mode !== "editor") {
    return;
  }
  const point = getCanvasPoint(event);

  if (!app.dragState) {
    return;
  }

  if (app.dragState.type === "obstacle" || app.dragState.type === "parking") {
    const rect = normalizeRect(app.dragState.start, point);
    app.editorDraft = {
      type: app.dragState.type,
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
      angle: app.dragState.type === "parking" ? app.editorScenario.parking.angle : 0,
      tolerance: degToRad(10)
    };
    return;
  }

  if (app.dragState.type === "car") {
    const angle = Math.atan2(point.y - app.dragState.start.y, point.x - app.dragState.start.x);
    app.editorDraft = { type: "car", x: app.dragState.start.x, y: app.dragState.start.y, angle };
    return;
  }

  if (app.dragState.type === "obstacle-move" || app.dragState.type === "parking-move" || app.dragState.type === "car-move") {
    moveSelection(point);
    return;
  }
}

function onCanvasPointerUp() {
  if (app.mode !== "editor") {
    app.dragState = null;
    return;
  }

  if (!app.dragState) {
    return;
  }

  if (app.dragState.type === "obstacle" && app.editorDraft && app.editorDraft.width > 14 && app.editorDraft.height > 14) {
    app.editorScenario.obstacles.push({
      x: app.editorDraft.x,
      y: app.editorDraft.y,
      width: app.editorDraft.width,
      height: app.editorDraft.height,
      color: "#505f6f"
    });
    setStatus("Hindernis gesetzt", "Ziehe weitere Formen auf die Karte.");
  }

  if (app.dragState.type === "parking" && app.editorDraft && app.editorDraft.width > 32 && app.editorDraft.height > 32) {
    app.editorScenario.parking = {
      x: app.editorDraft.x + app.editorDraft.width / 2,
      y: app.editorDraft.y + app.editorDraft.height / 2,
      width: app.editorDraft.width,
      height: app.editorDraft.height,
      angle: app.editorScenario.parking.angle,
      tolerance: degToRad(10)
    };
    setStatus("Parkfeld gesetzt", "Drehe es bei Bedarf mit den Buttons.");
  }

  if (app.dragState.type === "car" && app.editorDraft) {
    app.editorScenario.start = {
      x: clamp(app.editorDraft.x, 40, TRACK.width - 40),
      y: clamp(app.editorDraft.y, 40, TRACK.height - 40),
      angle: app.editorDraft.angle
    };
    app.editorSelection = { type: "car" };
    setStatus("Auto gesetzt", "Starte das Szenario direkt aus dem Editor.");
  }

  app.editorDraft = null;
  app.dragState = null;
}

function getSelectionDragState(selection, point) {
  if (selection.type === "obstacle") {
    const obstacle = app.editorScenario.obstacles[selection.index];
    return {
      type: "obstacle-move",
      selection,
      offset: { x: point.x - obstacle.x, y: point.y - obstacle.y }
    };
  }
  if (selection.type === "parking") {
    return {
      type: "parking-move",
      selection,
      offset: { x: point.x - app.editorScenario.parking.x, y: point.y - app.editorScenario.parking.y }
    };
  }
  return {
    type: "car-move",
    selection,
    offset: { x: point.x - app.editorScenario.start.x, y: point.y - app.editorScenario.start.y }
  };
}

function moveSelection(point) {
  const offset = app.dragState.offset;
  if (app.dragState.type === "obstacle-move") {
    const obstacle = app.editorScenario.obstacles[app.dragState.selection.index];
    obstacle.x = clamp(point.x - offset.x, 0, TRACK.width - obstacle.width);
    obstacle.y = clamp(point.y - offset.y, 0, TRACK.height - obstacle.height);
    return;
  }
  if (app.dragState.type === "parking-move") {
    app.editorScenario.parking.x = clamp(point.x - offset.x, app.editorScenario.parking.width / 2, TRACK.width - app.editorScenario.parking.width / 2);
    app.editorScenario.parking.y = clamp(point.y - offset.y, app.editorScenario.parking.height / 2, TRACK.height - app.editorScenario.parking.height / 2);
    return;
  }
  if (app.dragState.type === "car-move") {
    app.editorScenario.start.x = clamp(point.x - offset.x, 40, TRACK.width - 40);
    app.editorScenario.start.y = clamp(point.y - offset.y, 40, TRACK.height - 40);
  }
}

function getEditorItemAtPoint(point) {
  if (pointInPolygon(point, getCarPolygon(buildCar(app.editorScenario.start, getCurrentVehicle())))) {
    return { type: "car" };
  }
  if (pointInPolygon(point, getRotatedRectPolygon(app.editorScenario.parking))) {
    return { type: "parking" };
  }
  for (let index = app.editorScenario.obstacles.length - 1; index >= 0; index -= 1) {
    const obstacle = app.editorScenario.obstacles[index];
    if (point.x >= obstacle.x && point.x <= obstacle.x + obstacle.width && point.y >= obstacle.y && point.y <= obstacle.y + obstacle.height) {
      return { type: "obstacle", index };
    }
  }
  return null;
}

function eraseAtPoint(point) {
  const selection = getEditorItemAtPoint(point);
  if (!selection) {
    return;
  }
  if (selection.type === "obstacle") {
    app.editorScenario.obstacles.splice(selection.index, 1);
    setStatus("Hindernis entfernt", "Platz geschafft fuer ein neues Layout.");
  } else if (selection.type === "parking") {
    setStatus("Parkfeld geschuetzt", "Das Parkfeld bleibt erhalten. Du kannst es verschieben oder ersetzen.");
  } else if (selection.type === "car") {
    setStatus("Startpunkt geschuetzt", "Der Startpunkt bleibt immer vorhanden.");
  }
}

function rotateSelection(amountDeg) {
  const amount = degToRad(amountDeg);
  const target = app.mode === "editor" ? app.editorSelection : null;
  if (!target) {
    setStatus("Nichts ausgewaehlt", "Waehle zuerst das Auto oder das Parkfeld.");
    return;
  }
  if (target.type === "parking") {
    app.editorScenario.parking.angle = normalizeAngle(app.editorScenario.parking.angle + amount);
    setStatus("Parkfeld gedreht", "Ausrichtung aktualisiert.");
  } else if (target.type === "car") {
    app.editorScenario.start.angle = normalizeAngle(app.editorScenario.start.angle + amount);
    setStatus("Startauto gedreht", "Neue Ausrichtung gespeichert.");
  } else {
    setStatus("Objekt fix", "Hindernisse werden nur verschoben, nicht rotiert.");
  }
}

function setupSteeringWheel() {
  const wheel = ui.steeringWheel;
  wheel.addEventListener("pointerdown", (event) => {
    app.wheelDragActive = true;
    wheel.classList.add("dragging");
    wheel.setPointerCapture(event.pointerId);
    app.wheelDragStartAngle = getWheelPointerAngle(event);
    app.wheelDragStartInput = app.wheelInput;
  });
  wheel.addEventListener("pointermove", (event) => {
    if (!app.wheelDragActive) {
      return;
    }
    updateWheelFromPointer(event);
  });
  const stopWheelDrag = (event) => {
    if (!app.wheelDragActive) {
      return;
    }
    app.wheelDragActive = false;
    wheel.classList.remove("dragging");
    if (event?.pointerId !== undefined && wheel.hasPointerCapture(event.pointerId)) {
      wheel.releasePointerCapture(event.pointerId);
    }
  };
  wheel.addEventListener("pointerup", stopWheelDrag);
  wheel.addEventListener("pointercancel", stopWheelDrag);
}

function updateWheelFromPointer(event) {
  const currentAngle = getWheelPointerAngle(event);
  const delta = normalizeAngle(currentAngle - app.wheelDragStartAngle);
  const nextInput = app.wheelDragStartInput + radToDeg(delta) / WHEEL_MAX_ROTATION;
  app.wheelInput = clamp(nextInput, -1, 1);
}

function getWheelPointerAngle(event) {
  const rect = ui.steeringWheel.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  return Math.atan2(event.clientY - centerY, event.clientX - centerX);
}

function syncLabels() {
  const car = getCurrentVehicle();
  ui.carNameLabel.textContent = car.name;
  const level = app.mode === "play"
    ? getLevelOptions().find((entry) => entry.id === app.selectedLevelId)
    : app.editorScenario || app.customScenario;
  ui.levelNameLabel.textContent = level?.name || "Eigenes Szenario";
  ui.scenarioName.textContent = level?.name || "Eigenes Szenario";
  ui.scenarioDescription.textContent = level?.description || "Eigenes Szenario ohne Beschreibung.";
}

function setStatus(text, hint) {
  ui.statusText.textContent = text;
  ui.statusHint.textContent = hint;
}

function toast(message, duration = 1800) {
  ui.toast.textContent = message;
  ui.toast.classList.remove("hidden");
  app.messageTimer = duration / 1000;
}

function getCurrentVehicle() {
  return vehicles.find((vehicle) => vehicle.id === app.selectedCarId) || vehicles[0];
}

function getCanvasPoint(event) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY
  };
}

function getCarPolygon(car) {
  const halfLength = car.spec.length / 2;
  const halfWidth = car.spec.width / 2;
  return [
    rotatePoint({ x: -halfLength, y: -halfWidth }, car),
    rotatePoint({ x: halfLength, y: -halfWidth }, car),
    rotatePoint({ x: halfLength, y: halfWidth }, car),
    rotatePoint({ x: -halfLength, y: halfWidth }, car)
  ];
}

function getAxisRectPolygon(rect) {
  return [
    { x: rect.x, y: rect.y },
    { x: rect.x + rect.width, y: rect.y },
    { x: rect.x + rect.width, y: rect.y + rect.height },
    { x: rect.x, y: rect.y + rect.height }
  ];
}

function getRotatedRectPolygon(rect) {
  const halfWidth = rect.width / 2;
  const halfHeight = rect.height / 2;
  const points = [
    { x: -halfWidth, y: -halfHeight },
    { x: halfWidth, y: -halfHeight },
    { x: halfWidth, y: halfHeight },
    { x: -halfWidth, y: halfHeight }
  ];
  return points.map((point) => ({
    x: rect.x + point.x * Math.cos(rect.angle) - point.y * Math.sin(rect.angle),
    y: rect.y + point.x * Math.sin(rect.angle) + point.y * Math.cos(rect.angle)
  }));
}

function rotatePoint(point, body) {
  return {
    x: body.x + point.x * Math.cos(body.angle) - point.y * Math.sin(body.angle),
    y: body.y + point.x * Math.sin(body.angle) + point.y * Math.cos(body.angle)
  };
}

function polygonsIntersect(a, b) {
  return !hasSeparatingAxis(a, b) && !hasSeparatingAxis(b, a);
}

function hasSeparatingAxis(a, b) {
  for (let index = 0; index < a.length; index += 1) {
    const current = a[index];
    const next = a[(index + 1) % a.length];
    const axis = { x: -(next.y - current.y), y: next.x - current.x };
    const projectionA = projectPolygon(a, axis);
    const projectionB = projectPolygon(b, axis);
    if (projectionA.max < projectionB.min || projectionB.max < projectionA.min) {
      return true;
    }
  }
  return false;
}

function projectPolygon(points, axis) {
  const length = Math.hypot(axis.x, axis.y) || 1;
  const unit = { x: axis.x / length, y: axis.y / length };
  let min = Infinity;
  let max = -Infinity;
  points.forEach((point) => {
    const projection = point.x * unit.x + point.y * unit.y;
    min = Math.min(min, projection);
    max = Math.max(max, projection);
  });
  return { min, max };
}

function pointInPolygon(point, polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i, i += 1) {
    const xi = polygon[i].x;
    const yi = polygon[i].y;
    const xj = polygon[j].x;
    const yj = polygon[j].y;
    const intersect = yi > point.y !== yj > point.y
      && point.x < ((xj - xi) * (point.y - yi)) / (yj - yi + Number.EPSILON) + xi;
    if (intersect) {
      inside = !inside;
    }
  }
  return inside;
}

function roundRect(context, x, y, width, height, radius, fill, stroke) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.arcTo(x + width, y, x + width, y + height, radius);
  context.arcTo(x + width, y + height, x, y + height, radius);
  context.arcTo(x, y + height, x, y, radius);
  context.arcTo(x, y, x + width, y, radius);
  context.closePath();
  if (fill) {
    context.fill();
  }
  if (stroke) {
    context.stroke();
  }
}

function lightenColor(hexColor, amount) {
  return adjustColor(hexColor, Math.abs(amount));
}

function darkenColor(hexColor, amount) {
  return adjustColor(hexColor, -Math.abs(amount));
}

function adjustColor(hexColor, amount) {
  const color = hexColor.replace("#", "");
  const normalized = color.length === 3
    ? color.split("").map((value) => value + value).join("")
    : color;
  const channels = normalized.match(/.{2}/g)?.map((value) => parseInt(value, 16)) || [0, 0, 0];
  const adjusted = channels.map((channel) => {
    if (amount >= 0) {
      return Math.round(channel + (255 - channel) * amount);
    }
    return Math.round(channel * (1 + amount));
  });
  return `rgb(${adjusted[0]}, ${adjusted[1]}, ${adjusted[2]})`;
}

function strokePolygon(points) {
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let index = 1; index < points.length; index += 1) {
    ctx.lineTo(points[index].x, points[index].y);
  }
  ctx.closePath();
  ctx.stroke();
}

function normalizeRect(start, end) {
  const x = Math.min(start.x, end.x);
  const y = Math.min(start.y, end.y);
  return {
    x,
    y,
    width: Math.abs(end.x - start.x),
    height: Math.abs(end.y - start.y)
  };
}

function cloneScenario(scenario) {
  return JSON.parse(JSON.stringify(scenario));
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function lerp(start, end, t) {
  return start + (end - start) * t;
}

function degToRad(value) {
  return (value * Math.PI) / 180;
}

function radToDeg(value) {
  return (value * 180) / Math.PI;
}

function normalizeAngle(angle) {
  let result = angle;
  while (result > Math.PI) {
    result -= Math.PI * 2;
  }
  while (result < -Math.PI) {
    result += Math.PI * 2;
  }
  return result;
}

function approach(current, target, delta) {
  if (current < target) {
    return Math.min(current + delta, target);
  }
  if (current > target) {
    return Math.max(current - delta, target);
  }
  return current;
}

function easeOutCubic(value) {
  return 1 - Math.pow(1 - clamp(value, 0, 1), 3);
}
