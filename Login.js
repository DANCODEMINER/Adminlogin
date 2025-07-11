function loginAdmin() {
  const username = document.getElementById("admin-login-username").value.trim();
  const password = document.getElementById("admin-login-password").value.trim();

  if (!username || !password) {
    document.getElementById("login-message").innerText = "❌ Enter both username and password.";
    return;
  }

  fetch("https://danoski-backend.onrender.com/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  })
  .then(res => res.json())
  .then(data => {
    if (data.error) {
      document.getElementById("login-message").innerText = "❌ " + data.error;
    } else {
      document.getElementById("login-message").innerText = "✅ Login successful!";
      // You can redirect or store session info here if needed
      // Example:
      // sessionStorage.setItem("admin", username);
      // window.location.href = "/admin/dashboard.html";
    }
  })
  .catch(err => {
    document.getElementById("login-message").innerText = "❌ Failed to log in.";
  });
}
