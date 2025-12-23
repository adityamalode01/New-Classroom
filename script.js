/* =========================
   SMART CLASSROOM DATABASE
   ========================= */

// --------- UTILITIES ----------
function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

function getLoggedUser() {
    return JSON.parse(localStorage.getItem("loggedUser"));
}

/* =========================
   SIGNUP HANDLER
   ========================= */
const signupForm = document.getElementById("signupForm");

if (signupForm) {
    signupForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        if (!name || !email || !password) {
            alert("All fields are required!");
            return;
        }

        let users = getUsers();

        // Check duplicate email
        if (users.some(user => user.email === email)) {
            alert("User already exists!");
            return;
        }

        users.push({ name, email, password });
        saveUsers(users);

        alert("Signup successful! Please login.");
        window.location.href = "login.html";
    });
}

/* =========================
   LOGIN HANDLER
   ========================= */
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        let users = getUsers();

        const user = users.find(
            u => u.email === email && u.password === password
        );

        if (!user) {
            alert("Invalid email or password");
            return;
        }

        localStorage.setItem("loggedUser", JSON.stringify(user));
        alert("Login successful!");
        window.location.href = "index.html";
    });
}

/* =========================
   INDEX.HTML USER CHECK
   ========================= */
document.addEventListener("DOMContentLoaded", function () {
    const user = getLoggedUser();

    if (user) {
        console.log("Logged in as:", user.name);

        // OPTIONAL: show username if element exists
        const userDisplay = document.getElementById("userName");
        if (userDisplay) {
            userDisplay.textContent = user.name;
        }
    }
});

/* =========================
   LOGOUT FUNCTION
   ========================= */
function logout() {
    localStorage.removeItem("loggedUser");
    alert("Logged out successfully!");
    window.location.href = "index.html";
}
