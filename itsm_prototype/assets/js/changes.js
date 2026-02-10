/* ============================================================
   ZENITHOPS – CHANGE LIST ENGINE
   Loads all Change Requests (RFC/CHG) into table
============================================================ */

document.addEventListener("DOMContentLoaded", () => {
    loadChanges();
});

/* ---------------------------------------------------------
   LOAD CHANGES INTO TABLE
----------------------------------------------------------*/
function loadChanges() {
    const tbody = document.getElementById("changeTableBody");
    if (!tbody) return;

    let db = JSON.parse(localStorage.getItem("changes_db") || "[]");

    tbody.innerHTML = "";

    db.forEach(chg => {
        let tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${chg.id}</td>
            <td>${chg.summary}</td>
            <td>${chg.type}</td>
            <td>${chg.priority}</td>
            <td>${chg.state}</td>
            <td>${chg.requested_by}</td>
            <td>${chg.planned_start}</td>
        `;

        tr.onclick = () => {
            localStorage.setItem("current_change", chg.id);
            window.location.href = "change-details.html";
        };

        tbody.appendChild(tr);
    });
}
