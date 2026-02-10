document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("login_btn").onclick = () => {
        let user = document.getElementById("login_name").value.trim();
        if (!user) return alert("Please enter your name");

        localStorage.setItem("logged_user", user);
        window.location.href = "index.html";
    };

});
