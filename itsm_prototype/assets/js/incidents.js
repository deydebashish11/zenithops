/* ============================================================
   INCIDENTS LIST – Loads all incidents & handles navigation
============================================================ */

/* -------------------------
   On Page Load
-------------------------- */
document.addEventListener("DOMContentLoaded", () => {
    loadIncidentTable();
});


/* -------------------------
   LOAD INCIDENT LIST
-------------------------- */
function loadIncidentTable() {
    let db = JSON.parse(localStorage.getItem("incidents_db") || "[]");
    let tbody = document.getElementById("incidentTableBody");

    if (!tbody) return;

    tbody.innerHTML = ""; // Clear table

    db.forEach(inc => {
        let tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${inc.id}</td>
            <td>${inc.summary}</td>
            <td><span class="badge priority-${inc.priority}">${inc.priority}</span></td>
            <td><span class="badge state-${inc.state.toLowerCase().replace(/ /g, "-")}">${inc.state}</span></td>
            <td>${inc.opened}</td>
        `;

        // Click → open incident details
        tr.addEventListener("click", () => {
            localStorage.setItem("current_incident", inc.id);
            window.location.href = "incident-details.html";
        });

        tbody.appendChild(tr);
    });
}



/* -------------------------
   NEW INCIDENT BUTTON
-------------------------- */
function goToNewIncident() {
    localStorage.removeItem("current_incident");
    window.location.href = "incident-details.html";
}
