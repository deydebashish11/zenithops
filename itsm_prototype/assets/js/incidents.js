/* ============================================================
   ZENITHOPS – ENTERPRISE INCIDENT LIST JS
   Search + Filters + Badges + Table Rendering
============================================================ */

let INCIDENT_DB = [];

/* ---------------------------------------------------------
   INIT
----------------------------------------------------------*/
document.addEventListener("DOMContentLoaded", () => {
    loadIncidentData();
    renderTable(INCIDENT_DB);
    initSearch();
    initFilters();
});

/* ---------------------------------------------------------
   LOAD INCIDENT DATA
----------------------------------------------------------*/
function loadIncidentData() {
    INCIDENT_DB = JSON.parse(localStorage.getItem("incidents_db") || "[]");
}

/* ---------------------------------------------------------
   RENDER INCIDENT TABLE
----------------------------------------------------------*/
function renderTable(data) {
    const tbody = document.getElementById("incidentTableBody");
    tbody.innerHTML = "";

    data.forEach(inc => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${inc.id}</td>

            <td>${inc.summary || "-"}</td>

            <td>
                <span class="badge priority-${inc.priority}">
                    ${inc.priority}
                </span>
            </td>

            <td>
                <span class="badge state-${formatState(inc.state)}">
                    ${inc.state}
                </span>
            </td>

            <td>${inc.caller || "-"}</td>
            <td>${inc.opened}</td>
        `;

        tr.onclick = () => openIncidentModal(inc);

        tbody.appendChild(tr);
    });
}

/* ---------------------------------------------------------
   FORMAT STATE STRING FOR CSS
----------------------------------------------------------*/
function formatState(state) {
    if (!state) return "new";
    return state.toLowerCase().replace(/\s+/g, "-");
}

/* ---------------------------------------------------------
   SEARCH FUNCTION
----------------------------------------------------------*/
function initSearch() {
    const input = document.getElementById("searchInput");

    input.addEventListener("input", () => {
        const term = input.value.toLowerCase().trim();

        const filtered = INCIDENT_DB.filter(inc =>
            inc.id.toLowerCase().includes(term) ||
            (inc.summary || "").toLowerCase().includes(term) ||
            (inc.caller || "").toLowerCase().includes(term)
        );

        renderTable(filtered);
    });
}

/* ---------------------------------------------------------
   FILTER CHIPS
----------------------------------------------------------*/
function initFilters() {
    const chips = document.querySelectorAll(".filter-chip");

    chips.forEach(chip => {
        chip.addEventListener("click", () => {
            const filter = chip.dataset.filter;

            // remove active from all chips
            chips.forEach(c => c.classList.remove("chip-active"));
            chip.classList.add("chip-active");

            if (filter === "all") {
                renderTable(INCIDENT_DB);
                return;
            }

            const filtered = INCIDENT_DB.filter(inc =>
                inc.priority === filter || inc.state === filter
            );

            renderTable(filtered);
        });
    });
}
