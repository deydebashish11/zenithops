/* ============================================================
   ZENITHOPS – ENTERPRISE INCIDENT DETAILS JS
   Create/Edit + SLA + Worknotes + Timeline + Full ITIL Fields
============================================================ */

let editingIncident = null;
let slaSeconds = 0;
let slaInterval = null;

/* ---------------------------------------------------------
   INIT
----------------------------------------------------------*/
document.addEventListener("DOMContentLoaded", () => {

    setupTabs();
    detectMode();
    document.getElementById("saveIncident").onclick = saveOrUpdateIncident;
    document.getElementById("addWorkNote").onclick = addWorkNote;
    document.getElementById("resolveIncident").onclick = resolveIncident;

});

/* ---------------------------------------------------------
   CHECK CREATE OR EDIT MODE
----------------------------------------------------------*/
function detectMode() {
    const id = localStorage.getItem("current_incident");

    if (!id) {
        createMode();
    } else {
        editMode(id);
    }
}

/* ---------------------------------------------------------
   CREATE MODE
----------------------------------------------------------*/
function createMode() {
    let db = JSON.parse(localStorage.getItem("incidents_db") || "[]");

    const newId = "INC-" + String(db.length + 1).padStart(5, "0");
    const now = new Date().toLocaleString();

    document.getElementById("inc_id").value = newId;
    document.getElementById("inc_opened").value = now;
    document.getElementById("inc_updated").value = now;

    document.getElementById("timeline_opened").textContent = now;
    document.getElementById("timeline_updated").textContent = now;

    startSLATimer(0);
}

/* ---------------------------------------------------------
   EDIT MODE
----------------------------------------------------------*/
function editMode(id) {
    let db = JSON.parse(localStorage.getItem("incidents_db") || "[]");
    let inc = db.find(i => i.id === id);
    if (!inc) return;

    editingIncident = inc;

    // Fill all fields
    document.getElementById("inc_id").value = inc.id;
    document.getElementById("inc_summary").value = inc.summary;
    document.getElementById("inc_description").value = inc.description;
    document.getElementById("inc_caller").value = inc.caller;
    document.getElementById("inc_business").value = inc.business || "";
    document.getElementById("inc_location").value = inc.location || "";
    document.getElementById("inc_priority").value = inc.priority;
    document.getElementById("inc_state").value = inc.state;

    // Classification
    document.getElementById("inc_category").value = inc.category || "";
    document.getElementById("inc_subcategory").value = inc.subcategory || "";
    document.getElementById("inc_ci").value = inc.ci || "";

    // Assignment
    document.getElementById("inc_group").value = inc.group || "";
    document.getElementById("inc_assigned_to").value = inc.assigned_to || "";

    // Timestamps
    document.getElementById("inc_opened").value = inc.opened;
    document.getElementById("inc_updated").value = inc.updated;

    document.getElementById("timeline_opened").textContent = inc.opened;
    document.getElementById("timeline_updated").textContent = inc.updated;

    // SLA
    startSLATimer(inc.sla_seconds || 0);

    // Work Notes
    if (inc.work_notes) renderWorkNotes(inc.work_notes);

    // Timeline
    if (inc.timeline) renderTimeline(inc.timeline);
}

/* ---------------------------------------------------------
   SLA TIMER
----------------------------------------------------------*/
function startSLATimer(startValue) {
    slaSeconds = startValue;

    if (slaInterval) clearInterval(slaInterval);

    slaInterval = setInterval(() => {
        slaSeconds++;
        const h = String(Math.floor(slaSeconds/3600)).padStart(2,"0");
        const m = String(Math.floor((slaSeconds%3600)/60)).padStart(2,"0");
        const s = String(slaSeconds%60).padStart(2,"0");
        document.getElementById("sla_timer").value = `${h}:${m}:${s}`;
    }, 1000);
}

/* ---------------------------------------------------------
   SAVE / UPDATE SWITCH
----------------------------------------------------------*/
function saveOrUpdateIncident() {
    if (editingIncident) updateIncident();
    else saveIncident();
}

/* ---------------------------------------------------------
   SAVE NEW INCIDENT
----------------------------------------------------------*/
function saveIncident() {
    let db = JSON.parse(localStorage.getItem("incidents_db") || "[]");

    const now = new Date().toLocaleString();

    const newObj = {
        id: document.getElementById("inc_id").value,
        summary: document.getElementById("inc_summary").value,
        description: document.getElementById("inc_description").value,
        caller: document.getElementById("inc_caller").value,
        business: document.getElementById("inc_business").value,
        location: document.getElementById("inc_location").value,
        priority: document.getElementById("inc_priority").value,
        state: document.getElementById("inc_state").value,

        opened: document.getElementById("inc_opened").value,
        updated: now,

        sla_seconds: slaSeconds,

        category: document.getElementById("inc_category").value,
        subcategory: document.getElementById("inc_subcategory").value,
        ci: document.getElementById("inc_ci").value,

        group: document.getElementById("inc_group").value,
        assigned_to: document.getElementById("inc_assigned_to").value,

        work_notes: [],
        timeline: []
    };

    db.push(newObj);
    localStorage.setItem("incidents_db", JSON.stringify(db));

    alert("Incident Created!");
    window.location.href = "incidents.html";
}

/* ---------------------------------------------------------
   UPDATE INCIDENT
----------------------------------------------------------*/
function updateIncident() {
    let db = JSON.parse(localStorage.getItem("incidents_db") || "[]");
    let inc = db.find(i => i.id === editingIncident.id);

    const now = new Date().toLocaleString();

    inc.summary = document.getElementById("inc_summary").value;
    inc.description = document.getElementById("inc_description").value;
    inc.caller = document.getElementById("inc_caller").value;
    inc.business = document.getElementById("inc_business").value;
    inc.location = document.getElementById("inc_location").value;
    inc.priority = document.getElementById("inc_priority").value;
    inc.state = document.getElementById("inc_state").value;

    inc.category = document.getElementById("inc_category").value;
    inc.subcategory = document.getElementById("inc_subcategory").value;
    inc.ci = document.getElementById("inc_ci").value;

    inc.group = document.getElementById("inc_group").value;
    inc.assigned_to = document.getElementById("inc_assigned_to").value;

    inc.updated = now;
    inc.sla_seconds = slaSeconds;

    // Save Work Notes & Timeline arrays
    inc.work_notes = editingIncident.work_notes || [];
    inc.timeline = editingIncident.timeline || [];

    localStorage.setItem("incidents_db", JSON.stringify(db));

    alert("Incident Updated!");
    window.location.href = "incidents.html";
}

/* ---------------------------------------------------------
   WORK NOTES
----------------------------------------------------------*/
function addWorkNote() {
    const txt = document.getElementById("work_note_input").value.trim();
    if (!txt) return;

    const entry = {
        author: "Debashish",
        text: txt,
        time: new Date().toLocaleString()
    };

    editingIncident.work_notes = editingIncident.work_notes || [];
    editingIncident.work_notes.unshift(entry);

    renderWorkNotes(editingIncident.work_notes);

    document.getElementById("work_note_input").value = "";
}

function renderWorkNotes(list) {
    const ul = document.getElementById("worknotes_list");
    ul.innerHTML = "";

    list.forEach(w => {
        const li = document.createElement("li");
        li.textContent = `[${w.time}] ${w.author}: ${w.text}`;
        ul.appendChild(li);
    });
}

/* ---------------------------------------------------------
   RESOLUTION WORKFLOW
----------------------------------------------------------*/
function resolveIncident() {
    document.getElementById("inc_state").value = "Resolved";

    addTimelineEvent("Incident marked Resolved");

    alert("Incident marked as Resolved.");
}

/* ---------------------------------------------------------
   TIMELINE
----------------------------------------------------------*/
function addTimelineEvent(text) {
    const entry = {
        event: text,
        time: new Date().toLocaleString()
    };

    editingIncident.timeline = editingIncident.timeline || [];
    editingIncident.timeline.unshift(entry);

    renderTimeline(editingIncident.timeline);
}

function renderTimeline(list) {
    const ul = document.getElementById("timeline_list");
    ul.innerHTML = "";

    list.forEach(t => {
        const li = document.createElement("li");
        li.textContent = `[${t.time}] ${t.event}`;
        ul.appendChild(li);
    });
}

/* ---------------------------------------------------------
   TAB SYSTEM
----------------------------------------------------------*/
function setupTabs() {
    const buttons = document.querySelectorAll(".tab-btn");
    const panes = document.querySelectorAll(".tab-pane");

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            buttons.forEach(b => b.classList.remove("active"));
            panes.forEach(p => p.classList.remove("visible"));

            btn.classList.add("active");
            document.getElementById("tab-" + btn.dataset.tab).classList.add("visible");
        });
    });
}
