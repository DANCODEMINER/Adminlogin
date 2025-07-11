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

// Step 1: Send reset OTP
function sendResetOtp() {
  const username = document.getElementById("fp-username").value.trim();
  if (!username) {
    document.getElementById("fp-message").innerText = "❌ Please enter your username.";
    return;
  }

  fetch("https://danoski-backend.onrender.com/admin/send-reset-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username })
  })
  .then(res => res.json())
  .then(data => {
    if (data.error) {
      document.getElementById("fp-message").innerText = "❌ " + data.error;
    } else {
      sessionStorage.setItem("fp-username", username);
      document.getElementById("fp-message").innerText = "✅ OTP sent to admin email.";
      document.getElementById("forgot-username-form").style.display = "none";
      document.getElementById("otp-form").style.display = "block";
    }
  })
  .catch(() => {
    document.getElementById("fp-message").innerText = "❌ Failed to send OTP.";
  });
}

// Step 2: Verify OTP
function verifyResetOtp() {
  const otp = document.getElementById("fp-otp").value.trim();
  const username = sessionStorage.getItem("fp-username");

  if (!otp) {
    document.getElementById("otp-message").innerText = "❌ Please enter the OTP.";
    return;
  }
  if (!username) {
    document.getElementById("otp-message").innerText = "❌ Username missing, please restart.";
    return;
  }

  fetch("https://danoski-backend.onrender.com/admin/verify-reset-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, otp })
  })
  .then(res => res.json())
  .then(data => {
    if (data.error) {
      document.getElementById("otp-message").innerText = "❌ " + data.error;
    } else {
      document.getElementById("otp-message").innerText = "✅ OTP verified.";
      document.getElementById("otp-form").style.display = "none";
      document.getElementById("new-password-form").style.display = "block";
    }
  })
  .catch(() => {
    document.getElementById("otp-message").innerText = "❌ Failed to verify OTP.";
  });
}

// Step 3: Update password
function updatePassword() {
  const newPassword = document.getElementById("fp-new-password").value.trim();
  const username = sessionStorage.getItem("fp-username");

  if (!newPassword) {
    document.getElementById("newpass-message").innerText = "❌ Please enter the new password.";
    return;
  }
  if (!username) {
    document.getElementById("newpass-message").innerText = "❌ Username missing, please restart.";
    return;
  }

  fetch("https://danoski-backend.onrender.com/admin/update-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, new_password: newPassword })
  })
  .then(res => res.json())
  .then(data => {
    if (data.error) {
      document.getElementById("newpass-message").innerText = "❌ " + data.error;
    } else {
      document.getElementById("newpass-message").innerText = "✅ Password updated successfully.";
      sessionStorage.removeItem("fp-username");
      // Optionally, hide form or redirect here
    }
  })
  .catch(() => {
    document.getElementById("newpass-message").innerText = "❌ Failed to update password.";
  });
}

// Run after DOM loaded
document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const forgotPasswordBtn = document.getElementById("forgot-password-btn");
  const loginForm = document.getElementById("login-form");
  const forgotPasswordSection = document.getElementById("forgot-password-section");
  const dashboardSection = document.getElementById("dashboard-section");
  const logoutBtn = document.getElementById("dashboard-logout-btn"); // assign an id in HTML (see below)

  // Show forgot password section & hide login form
  forgotPasswordBtn.addEventListener("click", () => {
    loginForm.style.display = "none";
    forgotPasswordSection.style.display = "block";
  });

  // Logout handler
  logoutBtn.addEventListener("click", () => {
    dashboardSection.style.display = "none";
    loginForm.style.display = "block";

    // Clear sessionStorage etc
    sessionStorage.clear();

    // Clear login inputs and messages
    document.getElementById("admin-login-username").value = "";
    document.getElementById("admin-login-password").value = "";
    document.getElementById("login-message").innerText = "";
  });
});

// Call this function from your login success handler
function showDashboard() {
  document.getElementById("login-form").style.display = "none";
  document.getElementById("forgot-password-section").style.display = "none";
  document.getElementById("dashboard-section").style.display = "block";
}
