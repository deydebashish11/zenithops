/* ============================================================
   DASHBOARD ENGINE – Metrics, Charts, Recent Incidents
============================================================ */

document.addEventListener("DOMContentLoaded", () => {
    loadDashboardMetrics();
    loadRecentIncidents();
    loadPriorityChart();
    loadStateChart();
});

/* ------------------------------------------------------------
   LOAD METRICS
------------------------------------------------------------ */
function loadDashboardMetrics() {
    let db = JSON.parse(localStorage.getItem("incidents_db") || "[]");

    const total = db.length;
    const p1 = db.filter(i => i.priority === "P1").length;
    const p2 = db.filter(i => i.priority === "P2").length;
    const open = db.filter(i => i.state !== "Closed").length;

    const resolvedToday = db.filter(i => {
        return i.state === "Resolved" &&
               new Date(i.opened).toDateString() === new Date().toDateString();
    }).length;

    const breaches = db.filter(i => i.sla_seconds > 4 * 3600).length; // >4 hrs SLA breach

    document.getElementById("m_total").textContent = total;
    document.getElementById("m_p1").textContent = p1;
    document.getElementById("m_p2").textContent = p2;
    document.getElementById("m_open").textContent = open;
    document.getElementById("m_resolved_today").textContent = resolvedToday;
    document.getElementById("m_breaches").textContent = breaches;
}

/* ------------------------------------------------------------
   RECENT INCIDENTS TABLE
------------------------------------------------------------ */
function loadRecentIncidents() {
    let db = JSON.parse(localStorage.getItem("incidents_db") || "[]");
    db = db.slice().reverse().slice(0, 6); // show last 6 incidents

    let tbody = document.getElementById("recentIncTable");
    tbody.innerHTML = "";

    db.forEach(inc => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${inc.id}</td>
            <td>${inc.summary}</td>
            <td><span class="badge priority-${inc.priority}">${inc.priority}</span></td>
            <td><span class="badge state-${inc.state.toLowerCase().replace(/ /g, "-")}">${inc.state}</span></td>
            <td>${inc.opened}</td>
        `;

        tbody.appendChild(tr);
    });
}

/* ------------------------------------------------------------
   PRIORITY DISTRIBUTION (Simple Bar Chart)
------------------------------------------------------------ */
function loadPriorityChart() {
    let db = JSON.parse(localStorage.getItem("incidents_db") || "[]");

    const counts = {
        P1: db.filter(i => i.priority === "P1").length,
        P2: db.filter(i => i.priority === "P2").length,
        P3: db.filter(i => i.priority === "P3").length,
        P4: db.filter(i => i.priority === "P4").length,
    };

    const container = document.getElementById("priorityChart");
    container.innerHTML = "";

    Object.entries(counts).forEach(([prio, count]) => {
        container.innerHTML += `
            <div class="chart-row">
                <span>${prio}</span>
                <div class="bar" style="width:${count * 20}px"></div>
                <span>${count}</span>
            </div>
        `;
    });
}

/* ------------------------------------------------------------
   STATE DISTRIBUTION
------------------------------------------------------------ */
function loadStateChart() {
    let db = JSON.parse(localStorage.getItem("incidents_db") || "[]");

    const states = ["New", "In Progress", "On Hold", "Resolved", "Closed"];
    const counts = {};

    states.forEach(s => {
        counts[s] = db.filter(i => i.state === s).length;
    });

    const container = document.getElementById("stateChart");
    container.innerHTML = "";

    Object.entries(counts).forEach(([state, count]) => {
        container.innerHTML += `
            <div class="chart-row">
                <span>${state}</span>
                <div class="bar" style="width:${count * 20}px"></div>
                <span>${count}</span>
            </div>
        `;
    });
}

/* ------------------------------------------------------------
   DUMMY DATA GENERATOR (for Demo)
------------------------------------------------------------ */
function generateDummyData() {
    let sample = [
        {
            summary: "VPN access failure",
            description: "User unable to connect to VPN",
            caller: "John Carter",
            priority: "P2",
            state: "New",
            group: "Network Support"
        },
        {
            summary: "Email not syncing",
            description: "Outlook not syncing mails",
            caller: "Emma Ray",
            priority: "P3",
            state: "In Progress",
            group: "Messaging Support"
        },
        {
            summary: "Server CPU high",
            description: "CPU usage >95% for 20 mins",
            caller: "Auto Monitor",
            priority: "P1",
            state: "On Hold",
            group: "Infra Support"
        },
        {
            summary: "Application crash",
            description: "CRM application closes unexpectedly",
            caller: "Ravi Singh",
            priority: "P2",
            state: "Resolved",
            group: "App Support"
        }
    ];

    let db = JSON.parse(localStorage.getItem("incidents_db") || "[]");

    sample.forEach((item, i) => {
        db.push({
            id: "INC-" + String(db.length + 1).padStart(5, "0"),
            ...item,
            opened: new Date().toLocaleString(),
            sla_seconds: Math.floor(Math.random() * 10000)
        });
    });

    localStorage.setItem("incidents_db", JSON.stringify(db));

    alert("Dummy data generated successfully!");

    // Refresh dashboard
    loadDashboardMetrics();
    loadRecentIncidents();
    loadPriorityChart();
    loadStateChart();
}
