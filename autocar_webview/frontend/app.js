const elements = {
    battery: document.getElementById('battery'),
    brake: document.getElementById('brake'),
    camera: document.getElementById('camera'),
    connectionPill: document.getElementById('connectionPill'),
    emergencyStop: document.getElementById('emergencyStop'),
    estopPill: document.getElementById('estopPill'),
    faultList: document.getElementById('faultList'),
    gps: document.getElementById('gps'),
    lidar: document.getElementById('lidar'),
    lidarCanvas: document.getElementById('lidarCanvas'),
    lidarSummary: document.getElementById('lidarSummary'),
    modePill: document.getElementById('modePill'),
    position: document.getElementById('position'),
    resetFaults: document.getElementById('resetFaults'),
    routeLabel: document.getElementById('routeLabel'),
    routeProgress: document.getElementById('routeProgress'),
    speedValue: document.getElementById('speedValue'),
    steering: document.getElementById('steering'),
    targetSpeed: document.getElementById('targetSpeed'),
    throttle: document.getElementById('throttle'),
    toggleAutonomy: document.getElementById('toggleAutonomy'),
    updatedAt: document.getElementById('updatedAt'),
};

const lidarContext = elements.lidarCanvas.getContext('2d');

function setPill(el, label, tone = '') {
    el.textContent = label;
    el.className = `pill ${tone}`.trim();
}

function renderFaults(faults) {
    elements.faultList.innerHTML = '';
    if (!faults.length) {
        const item = document.createElement('li');
        item.textContent = 'No active faults';
        item.className = 'muted';
        elements.faultList.appendChild(item);
        return;
    }

    faults.forEach((fault) => {
        const item = document.createElement('li');
        item.textContent = fault;
        elements.faultList.appendChild(item);
    });
}

function drawLidar(scan = []) {
    const canvas = elements.lidarCanvas;
    const ctx = lidarContext;
    const { width, height } = canvas;
    const originX = width / 2;
    const originY = height - 28;
    const maxDistance = 12;
    const scale = (height - 58) / maxDistance;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#10161b';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1;
    for (let distance = 3; distance <= maxDistance; distance += 3) {
        ctx.beginPath();
        ctx.arc(originX, originY, distance * scale, Math.PI, 0);
        ctx.stroke();
        ctx.fillStyle = 'rgba(207, 216, 227, 0.72)';
        ctx.fillText(`${distance}m`, originX + 8, originY - distance * scale + 14);
    }

    [-60, -30, 0, 30, 60].forEach((angle) => {
        const radians = (angle - 90) * Math.PI / 180;
        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.lineTo(originX + Math.cos(radians) * maxDistance * scale, originY + Math.sin(radians) * maxDistance * scale);
        ctx.stroke();
    });

    ctx.fillStyle = '#71e0ad';
    scan.forEach((point) => {
        const radians = (point.angle - 90) * Math.PI / 180;
        const distance = Math.min(point.distance, maxDistance);
        const x = originX + Math.cos(radians) * distance * scale;
        const y = originY + Math.sin(radians) * distance * scale;
        const close = distance < 4.8;

        ctx.beginPath();
        ctx.fillStyle = close ? '#ff7d6e' : '#71e0ad';
        ctx.arc(x, y, close ? 4 : 3, 0, Math.PI * 2);
        ctx.fill();
    });

    ctx.fillStyle = '#f4f7fb';
    ctx.beginPath();
    ctx.moveTo(originX, originY - 18);
    ctx.lineTo(originX - 12, originY + 12);
    ctx.lineTo(originX + 12, originY + 12);
    ctx.closePath();
    ctx.fill();

    elements.lidarSummary.textContent = `${scan.length} points / 12m`;
}

function renderStatus(status) {
    setPill(elements.connectionPill, status.connected ? 'Connected' : 'Disconnected', status.connected ? 'ok' : 'bad');
    setPill(elements.modePill, status.autonomous ? 'Autonomous' : 'Manual', status.autonomous ? 'active' : '');
    setPill(elements.estopPill, status.emergency_stop ? 'E-Stop Active' : 'E-Stop Clear', status.emergency_stop ? 'bad' : 'ok');

    elements.speedValue.textContent = Number(status.speed_kph).toFixed(1);
    elements.targetSpeed.textContent = Number(status.target_speed_kph).toFixed(1);
    elements.battery.textContent = `${status.battery_percent}%`;
    elements.steering.textContent = `${Number(status.steering_deg).toFixed(1)} deg`;
    elements.throttle.textContent = `${status.throttle_percent}%`;
    elements.brake.textContent = `${status.brake_percent}%`;
    elements.gps.textContent = `${status.gps_fix} / ${status.gps_satellites} sat`;
    elements.lidar.textContent = status.lidar;
    elements.camera.textContent = status.camera;
    elements.position.textContent = `${Number(status.latitude).toFixed(6)}, ${Number(status.longitude).toFixed(6)}`;
    elements.routeLabel.textContent = `${status.route_name} / ${status.route_progress_percent}%`;
    elements.routeProgress.style.width = `${status.route_progress_percent}%`;
    elements.updatedAt.textContent = status.updated_at_iso;
    elements.toggleAutonomy.textContent = status.autonomous ? 'Manual Mode' : 'Autonomy';

    drawLidar(status.lidar_scan || []);
    renderFaults(status.faults);
}

async function requestStatus(path, options = {}) {
    const response = await fetch(path, { cache: 'no-store', ...options });
    if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
    }
    renderStatus(await response.json());
}

function command(name) {
    requestStatus(`/api/command/${name}`, { method: 'POST' }).catch(() => {
        setPill(elements.connectionPill, 'Command Failed', 'bad');
    });
}

elements.toggleAutonomy.addEventListener('click', () => command('toggle-autonomy'));
elements.emergencyStop.addEventListener('click', () => command('emergency-stop'));
elements.resetFaults.addEventListener('click', () => command('reset-faults'));

const statusEvents = new EventSource('/api/status/events');

statusEvents.addEventListener('message', (event) => {
    renderStatus(JSON.parse(event.data));
});

statusEvents.addEventListener('error', () => {
    setPill(elements.connectionPill, 'Reconnecting', 'bad');
    requestStatus('/api/status').catch(() => {});
});
