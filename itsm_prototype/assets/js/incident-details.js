/* ============================================================
   INCIDENT DETAILS – Logic for Tabs, SLA Timer, Save/Load
============================================================ */

/* -------------------------
   On Page Load
-------------------------- */
document.addEventListener("DOMContentLoaded", () => {
    setupTabs();
    startSLATimer();

    loadIncidentIfEditing(); // Load existing incident if editing

    const saveBtn = document.getElementById("saveIncident");
    if (saveBtn) saveBtn.addEventListener("click", saveIncident);
});

/* -------------------------
   TAB SYSTEM
-------------------------- */
function setupTabs() {
    const buttons = document.querySelectorAll(".tab-btn");
    const panes = document.querySelectorAll(".tab-pane");

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {

            // Remove active from all
            buttons.forEach(b => b.classList.remove("active"));
            panes.forEach(p => p.classList.remove("visible"));

            // Activate selected
            btn.classList.add("active");

            const tab = btn.dataset.tab;
            const pane = document.getElementById("tab-" + tab);

            if (pane) pane.classList.add("visible");
        });
    });
}

/* -------------------------
   SLA TIMER
-------------------------- */
let slaSeconds = 0;
let slaInterval = null;

function startSLATimer() {
    const el = document.getElementById("sla_timer");
    if (!el) return;

    if (slaInterval) clearInterval(slaInterval);

    slaInterval = setInterval(() => {
        slaSeconds++;

        const h = String(Math.floor(slaSeconds / 3600)).padStart(2, "0");
        const m = String(Math.floor((slaSeconds % 3600) / 60)).padStart(2, "0");
        const s = String(slaSeconds % 60).padStart(2, "0");

        el.textContent = `${h}:${m}:${s}`;
    }, 1000);
}

/* -------------------------
   SAVE INCIDENT
-------------------------- */
function saveIncident() {
    let db = JSON.parse(localStorage.getItem("incidents_db") || "[]");

    const editingId = localStorage.getItem("current_incident");

    let record = {
        id: editingId || generateIncidentID(),
        summary: document.getElementById("inc_summary").value,
        description: document.getElementById("inc_description").value,
        caller: document.getElementById("inc_caller").value,
        priority: document.getElementById("inc_priority").value,
        state: document.getElementById("inc_state").value,
        group: document.getElementById("inc_group").value,
        opened: new Date().toLocaleString(),
        sla_seconds: slaSeconds
    };

    // If editing → replace, otherwise push new
    if (editingId) {
        db = db.map(i => i.id === editingId ? record : i);
        localStorage.removeItem("current_incident");
    } else {
        db.push(record);
    }

    localStorage.setItem("incidents_db", JSON.stringify(db));

    alert("Incident saved successfully!");
    window.location.href = "incidents.html";
}

/* -------------------------
   AUTO-GENERATE ID
-------------------------- */
function generateIncidentID() {
    let db = JSON.parse(localStorage.getItem("incidents_db") || "[]");
    const newNumber = db.length + 1;
    return "INC-" + String(newNumber).padStart(5, "0");
}

/* -------------------------
   LOAD INCIDENT FOR EDITING
-------------------------- */
function loadIncidentIfEditing() {
    const editingId = localStorage.getItem("current_incident");
    if (!editingId) return; // Creating new incident

    let db = JSON.parse(localStorage.getItem("incidents_db") || "[]");
    const inc = db.find(i => i.id === editingId);

    if (!inc) return;

    // Fill fields
    document.getElementById("inc_summary").value = inc.summary;
    document.getElementById("inc_description").value = inc.description;
    document.getElementById("inc_caller").value = inc.caller;
    document.getElementById("inc_priority").value = inc.priority;
    document.getElementById("inc_state").value = inc.state;
    document.getElementById("inc_group").value = inc.group;

    // Restore SLA
    slaSeconds = inc.sla_seconds || 0;
}
