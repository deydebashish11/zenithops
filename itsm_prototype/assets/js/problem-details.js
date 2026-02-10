/* ============================================================
   ZENITHOPS – PROBLEM DETAILS JS
   Full ITIL Problem Management
============================================================ */

let editingProblem = null;

/* ---------------------------------------------------------
   INIT
----------------------------------------------------------*/
document.addEventListener("DOMContentLoaded", () => {
    setupTabs();
    detectMode();
    document.getElementById("saveProblem").onclick = saveOrUpdateProblem;
});

/* ---------------------------------------------------------
   DETECT MODE (Create vs Edit)
----------------------------------------------------------*/
function detectMode() {
    const id = localStorage.getItem("current_problem");

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
    let db = JSON.parse(localStorage.getItem("problems_db") || "[]");

    const newId = "PRB-" + String(db.length + 1).padStart(5, "0");
    const now = new Date().toLocaleString();

    document.getElementById("prb_id").value = newId;
    document.getElementById("prb_opened").value = now;
    document.getElementById("prb_updated").value = now;

    document.getElementById("timeline_opened").textContent = now;
    document.getElementById("timeline_updated").textContent = now;

    editingProblem = null;
}

/* ---------------------------------------------------------
   EDIT MODE
----------------------------------------------------------*/
function editMode(id) {
    let db = JSON.parse(localStorage.getItem("problems_db") || "[]");
    let prb = db.find(p => p.id === id);

    if (!prb) return;

    editingProblem = prb;

    // Fill Problem Details
    document.getElementById("prb_id").value = prb.id;
    document.getElementById("prb_summary").value = prb.summary;
    document.getElementById("prb_description").value = prb.description;
    document.getElementById("prb_priority").value = prb.priority;
    document.getElementById("prb_state").value = prb.state;

    // Timestamps
    document.getElementById("prb_opened").value = prb.opened;
    document.getElementById("prb_updated").value = prb.updated;

    document.getElementById("timeline_opened").textContent = prb.opened;
    document.getElementById("timeline_updated").textContent = prb.updated;

    // Root Cause
    document.getElementById("prb_rootcause").value = prb.root_cause || "";

    // Workaround
    document.getElementById("prb_workaround").value = prb.workaround || "";

    // Assignment
    document.getElementById("prb_group").value = prb.group || "";
    document.getElementById("prb_assigned_to").value = prb.assigned_to || "";

    // Known Error
    document.getElementById("prb_known_error").checked = prb.known_error || false;
}

/* ---------------------------------------------------------
   SAVE OR UPDATE
----------------------------------------------------------*/
function saveOrUpdateProblem() {
    if (editingProblem) {
        updateProblem();
    } else {
        saveProblem();
    }
}

/* ---------------------------------------------------------
   SAVE NEW PROBLEM
----------------------------------------------------------*/
function saveProblem() {
    let db = JSON.parse(localStorage.getItem("problems_db") || "[]");

    const now = new Date().toLocaleString();

    const newPRB = {
        id: document.getElementById("prb_id").value,
        summary: document.getElementById("prb_summary").value,
        description: document.getElementById("prb_description").value,
        priority: document.getElementById("prb_priority").value,
        state: document.getElementById("prb_state").value,
        opened: document.getElementById("prb_opened").value,
        updated: now,

        root_cause: document.getElementById("prb_rootcause").value,
        workaround: document.getElementById("prb_workaround").value,

        group: document.getElementById("prb_group").value,
        assigned_to: document.getElementById("prb_assigned_to").value,

        known_error: document.getElementById("prb_known_error").checked
    };

    db.push(newPRB);
    localStorage.setItem("problems_db", JSON.stringify(db));

    alert("Problem Created!");
    window.location.href = "problems.html";
}

/* ---------------------------------------------------------
   UPDATE EXISTING PROBLEM
----------------------------------------------------------*/
function updateProblem() {
    let db = JSON.parse(localStorage.getItem("problems_db") || "[]");
    let prb = db.find(p => p.id === editingProblem.id);

    const now = new Date().toLocaleString();

    prb.summary = document.getElementById("prb_summary").value;
    prb.description = document.getElementById("prb_description").value;
    prb.priority = document.getElementById("prb_priority").value;
    prb.state = document.getElementById("prb_state").value;

    prb.root_cause = document.getElementById("prb_rootcause").value;
    prb.workaround = document.getElementById("prb_workaround").value;

    prb.group = document.getElementById("prb_group").value;
    prb.assigned_to = document.getElementById("prb_assigned_to").value;

    prb.known_error = document.getElementById("prb_known_error").checked;

    prb.updated = now;
    document.getElementById("prb_updated").value = now;

    localStorage.setItem("problems_db", JSON.stringify(db));

    alert("Problem Updated!");
    window.location.href = "problems.html";
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
