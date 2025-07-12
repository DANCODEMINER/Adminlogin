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
        
        // Set session storage to persist login
        sessionStorage.setItem("admin", username);
        sessionStorage.setItem("adminLoggedIn", "true");

        // Show dashboard
        showDashboard();
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
  document.getElementById("dashboard-section").style.display = "none";
  document.getElementById("login-form").style.display = "block";
  sessionStorage.clear();

  document.getElementById("admin-login-username").value = "";
  document.getElementById("admin-login-password").value = "";
  document.getElementById("login-message").innerText = "";
}

function showUsers() {
  document.getElementById("users-section").style.display = "block";
  fetchUsers();
}

function fetchUsers() {
  fetch("https://danoski-backend.onrender.com/admin/users")
    .then(res => res.json())
    .then(data => {
      const table = document.getElementById("users-table");
      table.innerHTML = ""; // Clear previous data

      data.forEach(user => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${user.email}</td>
          <td>${user.btc_balance.toFixed(8)}</td>
          <td>${user.total_earned.toFixed(8)}</td>
          <td>${user.hashrate}</td>
          <td>${user.last_mined ? new Date(user.last_mined).toLocaleString() : "N/A"}</td>
        `;
        table.appendChild(row);
      });
    })
    .catch(err => {
      console.error("Error loading users:", err);
      alert("❌ Failed to load users.");
    });
}

let autoApprove = false;

function showWithdrawals() {
  const section = document.getElementById("withdrawals-section");
  section.style.display = "block"; // Always show this section when called

  fetch("https://danoski-backend.onrender.com/admin/withdrawal-requests")
    .then(res => res.json())
    .then(data => {
      const table = document.getElementById("withdrawals-table");
      table.innerHTML = "";

      data.forEach(w => {
        const row = document.createElement("tr");

        row.innerHTML = `
          <td><input type="checkbox" class="withdraw-checkbox" value="${w.id}" ${w.status !== "pending" ? "disabled" : ""}></td>
          <td>${w.email}</td>
          <td>${w.amount}</td>
          <td>${w.wallet}</td>
          <td>${w.status}</td>
          <td>${new Date(w.created_at).toLocaleString()}</td>
          <td>
            ${w.status === "pending" ? `
              <button onclick="updateWithdrawal(${w.id}, 'approved')">✅</button>
              <button onclick="updateWithdrawal(${w.id}, 'rejected')">❌</button>
            ` : ""}
          </td>
        `;

        table.appendChild(row);

        // Auto-approve logic
        if (w.status === "pending" && autoApprove) {
          updateWithdrawal(w.id, 'approved');
        }
      });
    })
    .catch(err => {
      console.error("Error loading withdrawals:", err);
      alert("❌ Failed to load withdrawals.");
    });
}


function toggleSelectAll(source) {
  const checkboxes = document.querySelectorAll(".withdraw-checkbox");
  checkboxes.forEach(cb => {
    if (!cb.disabled) cb.checked = source.checked;
  });
}

function approveSelectedWithdrawals() {
  const selected = Array.from(document.querySelectorAll(".withdraw-checkbox:checked"))
    .map(cb => parseInt(cb.value));

  if (selected.length === 0) return alert("No withdrawals selected.");

  selected.forEach(id => updateWithdrawal(id, "approved"));
}

function approveAllWithdrawals() {
  fetch("https://danoski-backend.onrender.com/admin/withdrawals")
    .then(res => res.json())
    .then(data => {
      data.filter(w => w.status === "pending").forEach(w => {
        updateWithdrawal(w.id, "approved");
      });
    });
}

function updateWithdrawal(id, status) {
  fetch("https://danoski-backend.onrender.com/admin/update-withdrawal", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, status })
  })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      showWithdrawals(); // Refresh
    });
}

function toggleAutoApprove() {
  const isChecked = document.getElementById("auto-approve-toggle").checked;
  autoApprove = isChecked;
  sessionStorage.setItem("autoApprove", isChecked.toString()); // 🔧 Correct
}

function postAnnouncement() {
  console.log("postAnnouncement() called"); // ✅ For DevTools console
  alert("📬 Post button clicked"); // ✅ For user popup feedback

  const title = document.getElementById("announce-title").value.trim();
  const content = document.getElementById("announce-content").value.trim();

  if (!title || !content) {
    document.getElementById("announce-status").innerText = "❌ Title and content required.";
    return;
  }

  fetch("https://danoski-backend.onrender.com/admin/add-message", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content })
  })
  .then(res => res.json())
  .then(data => {
    document.getElementById("announce-status").innerText = data.message || data.error;
  })
  .catch(error => {
    console.error("Post failed:", error);
    document.getElementById("announce-status").innerText = "❌ Failed to send announcement.";
  });
}

function deleteAnnouncement() {
  fetch("https://danoski-backend.onrender.com/admin/delete-message", {
    method: "DELETE"
  })
  .then(res => res.json())
  .then(data => {
    document.getElementById("announce-status").innerText = data.message || data.error;
    document.getElementById("announce-title").value = "";
    document.getElementById("announce-content").value = "";
  });
        }

function loadCurrentHashrate() {
  fetch("https://danoski-backend.onrender.com/admin/get-hashrate")
    .then(res => res.json())
    .then(data => {
      document.getElementById("current-hashrate").innerText = data.hashrate;
    })
    .catch(() => {
      document.getElementById("current-hashrate").innerText = "Error";
    });
}

function updateHashrate() {
  const value = document.getElementById("hashrate-value").value;
  const msg = document.getElementById("hashrate-msg");

  if (!value || isNaN(value) || value <= 0) {
    msg.innerText = "❌ Enter a valid hashrate.";
    msg.style.color = "red";
    return;
  }

  fetch("https://danoski-backend.onrender.com/admin/set-hashrate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ value: parseInt(value) })
  })
    .then(res => res.json())
    .then(data => {
      msg.innerText = data.message || data.error;
      msg.style.color = data.error ? "red" : "green";
      loadCurrentHashrate(); // Refresh displayed hashrate
    })
    .catch(() => {
      msg.innerText = "❌ Failed to update hashrate.";
      msg.style.color = "red";
    });
}
// Automatically load hashrate when the page loads
window.onload = () => {
  loadCurrentHashrate();
};

function loadCurrentAnnouncement() {
  fetch("https://danoski-backend.onrender.com/user/messages")
    .then(res => res.json())
    .then(data => {
      if (data.title && data.content) {
        document.getElementById("current-title").innerText = data.title;
        document.getElementById("current-content").innerText = data.content;
      } else {
        document.getElementById("current-title").innerText = "No title";
        document.getElementById("current-content").innerText = "No announcement found.";
      }
    })
    .catch(err => {
      console.error("Error loading announcement:", err);
      document.getElementById("current-title").innerText = "Error";
      document.getElementById("current-content").innerText = "Unable to fetch announcement.";
    });
}

function toggleSection(id) {
  const sections = document.querySelectorAll('.admin-container');
  sections.forEach(sec => sec.style.display = 'none');

  const target = document.getElementById(id);
  if (target) {
    target.style.display = 'block';
    document.querySelector('#dashboard-section > h2').style.display = 'none';
    document.querySelector('.admin-nav').style.display = 'none';

    if (id === "announcement-section") {
      loadCurrentAnnouncement(); // ✅ Call the function here
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const admin = sessionStorage.getItem("admin");
  if (admin) showDashboard();

  const forgotPasswordBtn = document.getElementById("forgot-password-btn");
  if (forgotPasswordBtn) {
    forgotPasswordBtn.addEventListener("click", () => {
      document.getElementById("login-form").style.display = "none";
      document.getElementById("forgot-password-section").style.display = "block";
    });
  }

  const logoutBtn = document.getElementById("dashboard-logout-btn");
  if (logoutBtn) logoutBtn.addEventListener("click", logoutAdmin);

  loadMessages?.();

  // ✅ Delay restore to ensure checkbox exists
  setTimeout(() => {
    const saved = sessionStorage.getItem("autoApprove") === "true";
    autoApprove = saved;

    const autoToggle = document.getElementById("auto-approve-toggle");
    if (autoToggle) autoToggle.checked = saved;

    console.log("Restored autoApprove:", saved);
  }, 0);

  // ✅ Auto-approve loop
  setInterval(() => {
    if (autoApprove) {
      fetch("https://danoski-backend.onrender.com/admin/withdrawal-requests")
        .then(res => res.json())
        .then(data => {
          data.forEach(w => {
            if (w.status === "pending") {
              updateWithdrawal(w.id, "approved");
            }
          });
        })
        .catch(err => console.error("Auto-approval error:", err));
    }
  }, 15000);
});

function closeSection(id) {
  const section = document.getElementById(id);
  if (section) {
    section.style.display = 'none';
    document.querySelector('#dashboard-section > h2').style.display = 'block';
    document.querySelector('.admin-nav').style.display = 'block';
  }
}
