/* ============================================================
   ZENITHOPS — INCIDENT NEON MODAL ENGINE
============================================================ */

function openIncidentModal(incident) {
    const overlay = document.getElementById("modalOverlay");
    const modal = document.getElementById("incidentModal");

    modal.innerHTML = `
        <div class="modal-title">${incident.summary || "No Summary"}</div>

        <div class="modal-row">
            <span class="modal-label">ID:</span> ${incident.id}
        </div>

        <div class="modal-row">
            <span class="modal-label">Priority:</span>
            <span class="badge priority-${incident.priority}">${incident.priority}</span>
        </div>

        <div class="modal-row">
            <span class="modal-label">State:</span>
            <span class="badge state-${incident.state.toLowerCase().replace(/\s+/g,'-')}">${incident.state}</span>
        </div>

        <div class="modal-row">
            <span class="modal-label">SLA:</span> 
            ${formatSLA(incident.sla_seconds || 0)}
        </div>

        <div class="modal-divider"></div>

        <div class="modal-row">
            <span class="modal-label">Caller:</span> ${incident.caller || "-"}
        </div>

        <div class="modal-row">
            <span class="modal-label">Assignment Group:</span> ${incident.group || "-"}
        </div>

        <div class="modal-row">
            <span class="modal-label">Updated:</span> ${incident.updated}
        </div>

        <div class="modal-divider"></div>

        <div class="modal-btn" id="openFullBtn">Open Full Incident</div>
    `;

    overlay.style.display = "flex";

    document.getElementById("openFullBtn").onclick = () => {
        localStorage.setItem("current_incident", incident.id);
        window.location.href = "incident-details.html";
    };
}

function closeIncidentModal() {
    document.getElementById("modalOverlay").style.display = "none";
}

function formatSLA(sec) {
    const h = String(Math.floor(sec / 3600)).padStart(2, "0");
    const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
}
