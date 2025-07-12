// Login Admin
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
        showDashboard();
        sessionStorage.setItem("admin", username);
      }
    })
    .catch(() => {
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
        document.getElementById("fp-username-form").style.display = "none";
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

        // Redirect to login after short delay
        setTimeout(() => {
          showLoginForm();
        }, 1500);
      }
    })
    .catch(() => {
      document.getElementById("newpass-message").innerText = "❌ Failed to update password.";
    });
}

// Show dashboard after login
function showDashboard() {
  document.getElementById("login-form").style.display = "none";
  document.getElementById("forgot-password-section").style.display = "none";
  document.getElementById("dashboard-section").style.display = "block";
}

// Back to login view from any form
function showLoginForm() {
  document.getElementById("login-form").style.display = "block";
  document.getElementById("forgot-password-section").style.display = "none";
  document.getElementById("fp-username-form").style.display = "block";
  document.getElementById("otp-form").style.display = "none";
  document.getElementById("new-password-form").style.display = "none";
  document.getElementById("dashboard-section").style.display = "none";

  // Clear all messages and inputs
  document.getElementById("login-message").innerText = "";
  document.getElementById("fp-message").innerText = "";
  document.getElementById("otp-message").innerText = "";
  document.getElementById("newpass-message").innerText = "";

  document.getElementById("fp-username").value = "";
  document.getElementById("fp-otp").value = "";
  document.getElementById("fp-new-password").value = "";
}

// Logout
function logoutAdmin() {
  sessionStorage.clear();
  showLoginForm();
  document.getElementById("admin-login-username").value = "";
  document.getElementById("admin-login-password").value = "";
}

// DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  const forgotPasswordBtn = document.getElementById("forgot-password-btn");
  const logoutBtn = document.getElementById("dashboard-logout-btn");

  forgotPasswordBtn.addEventListener("click", () => {
    document.getElementById("login-form").style.display = "none";
    document.getElementById("forgot-password-section").style.display = "block";
  });

  logoutBtn.addEventListener("click", logoutAdmin);

  // Session persist after refresh
  if (sessionStorage.getItem("admin")) {
    showDashboard();
  }
});

// Back buttons from reset forms
function backToLoginFromForgot() {
  showLoginForm();
}
function backToLoginFromOtp() {
  showLoginForm();
}
function backToLoginFromNewPass() {
  showLoginForm();
}

// ... All your other unchanged functions go below (users, withdrawals, hashrate, etc)
// No modifications needed for those, just continue exactly as you had them
