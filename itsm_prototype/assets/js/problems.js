/* ============================================================
   ZENITHOPS PROBLEMS LIST ENGINE
   Loads and displays all problems from problems_db
============================================================ */

document.addEventListener("DOMContentLoaded", () => {
    loadProblems();
});

/* ---------------------------------------------------------
   LOAD PROBLEMS INTO TABLE
----------------------------------------------------------*/
function loadProblems() {
    const tbody = document.getElementById("problemTableBody");
    if (!tbody) return;

    let db = JSON.parse(localStorage.getItem("problems_db") || "[]");

    tbody.innerHTML = "";

    db.forEach(prb => {
        let tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${prb.id}</td>
            <td>${prb.summary}</td>
            <td>${prb.state}</td>
            <td>${prb.priority}</td>
            <td>${prb.root_cause || "-"}</td>
            <td>${prb.opened}</td>
        `;

        tr.onclick = () => {
            localStorage.setItem("current_problem", prb.id);
            window.location.href = "problem-details.html";
        };

        tbody.appendChild(tr);
    });
}
