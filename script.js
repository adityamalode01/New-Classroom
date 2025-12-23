// ===== DATABASE (localStorage) =====
function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

// ===== SIGNUP =====
const signupForm = document.getElementById("signupForm");

if (signupForm) {
    signupForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        let users = getUsers();

        // check if email exists
        const exists = users.find(u => u.email === email);
        if (exists) {
            alert("User already exists!");
            return;
        }

        users.push({ name, email, password });
        saveUsers(users);

        alert("Signup successful!");
        window.location.href = "login.html";
    });
}

// ===== LOGIN =====
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

        if (user) {
            localStorage.setItem("loggedUser", JSON.stringify(user));
            alert("Login successful!");
            window.location.href = "index.html";
        } else {
            alert("Invalid email or password");
        }
    });
}
