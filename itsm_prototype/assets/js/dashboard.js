/* ============================================================
   ZENITHOPS – ENTERPRISE DASHBOARD ENGINE
============================================================ */

document.addEventListener("DOMContentLoaded", () => {
    loadMetrics();
    loadCharts();
    loadRecent();
});

/* ---------------------------------------------------------
   METRICS
----------------------------------------------------------*/
function loadMetrics() {
    let db = JSON.parse(localStorage.getItem("incidents_db") || "[]");

    document.getElementById("m_total").textContent = db.length;
    document.getElementById("m_p1").textContent = db.filter(i => i.priority === "P1").length;
    document.getElementById("m_p2").textContent = db.filter(i => i.priority === "P2").length;
    document.getElementById("m_open").textContent = db.filter(i => i.state !== "Closed").length;
    document.getElementById("m_resolved_today").textContent =
        db.filter(i => i.state === "Resolved").length;

    // Basic SLA breach example: SLA > 4 hours
    document.getElementById("m_breaches").textContent =
        db.filter(i => i.sla_seconds > 14400).length;
}

/* ---------------------------------------------------------
   PRIORITY & STATE CHARTS
----------------------------------------------------------*/
function bar(label, value, max) {
    const width = (value / max) * 100 || 5;
    return `
        <div class="bar-label">${label}: ${value}</div>
        <div class="bar" style="width:${width}%"></div>
    `;
}

function loadCharts() {
    let db = JSON.parse(localStorage.getItem("incidents_db") || "[]");

    const priorityCounts = {
        P1: db.filter(i => i.priority === "P1").length,
        P2: db.filter(i => i.priority === "P2").length,
        P3: db.filter(i => i.priority === "P3").length,
        P4: db.filter(i => i.priority === "P4").length
    };

    const stateCounts = {
        New: db.filter(i => i.state === "New").length,
        "In Progress": db.filter(i => i.state === "In Progress").length,
        Resolved: db.filter(i => i.state === "Resolved").length,
        Closed: db.filter(i => i.state === "Closed").length
    };

    const maxP = Math.max(...Object.values(priorityCounts), 1);
    const maxS = Math.max(...Object.values(stateCounts), 1);

    let priorityHTML = "";
    for (let k in priorityCounts) priorityHTML += bar(k, priorityCounts[k], maxP);

    let stateHTML = "";
    for (let k in stateCounts) stateHTML += bar(k, stateCounts[k], maxS);

    document.getElementById("priorityChart").innerHTML = priorityHTML;
    document.getElementById("stateChart").innerHTML = stateHTML;
}

/* ---------------------------------------------------------
   RECENT INCIDENTS
----------------------------------------------------------*/
function loadRecent() {
    let db = JSON.parse(localStorage.getItem("incidents_db") || "[]");

    db.sort((a, b) => new Date(b.updated) - new Date(a.updated));

    const recent = db.slice(0, 6);

    const tbody = document.getElementById("recentIncTable");
    tbody.innerHTML = "";

    recent.forEach(inc => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${inc.id}</td>
            <td>${inc.summary}</td>
            <td><span class="badge priority-${inc.priority}">${inc.priority}</span></td>
            <td><span class="badge state-${inc.state.toLowerCase().replace(/\s+/g,'-')}">${inc.state}</span></td>
            <td>${inc.updated}</td>
        `;

        tr.onclick = () => {
            localStorage.setItem("current_incident", inc.id);
            window.location.href = "incident-details.html";
        };

        tbody.appendChild(tr);
    });
}
// Expose global
window.generateDummyData = generateDummyData;
