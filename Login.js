// ========== Session Check on Load ==========
if (sessionStorage.getItem("admin")) {
  showDashboard();
}

// ========== Admin Login ==========
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
        sessionStorage.setItem("admin", username);
        document.getElementById("login-message").innerText = "✅ Login successful!";
        showDashboard();
      }
    })
    .catch(() => {
      document.getElementById("login-message").innerText = "❌ Failed to log in.";
    });
}

// ========== Show Dashboard ==========
function showDashboard() {
  document.getElementById("login-form").style.display = "none";
  document.getElementById("forgot-password-section").style.display = "none";
  document.getElementById("dashboard-section").style.display = "block";
}

// ========== Logout ==========
function logoutAdmin() {
  sessionStorage.clear();
  document.getElementById("dashboard-section").style.display = "none";
  document.getElementById("login-form").style.display = "block";
  document.getElementById("admin-login-username").value = "";
  document.getElementById("admin-login-password").value = "";
  document.getElementById("login-message").innerText = "";
}

// ========== Forgot Password Flow ==========
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

function verifyResetOtp() {
  const otp = document.getElementById("fp-otp").value.trim();
  const username = sessionStorage.getItem("fp-username");

  if (!otp) return (document.getElementById("otp-message").innerText = "❌ Please enter the OTP.");
  if (!username) return (document.getElementById("otp-message").innerText = "❌ Username missing.");

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
    });
}

function updatePassword() {
  const newPassword = document.getElementById("fp-new-password").value.trim();
  const username = sessionStorage.getItem("fp-username");

  if (!newPassword) return (document.getElementById("newpass-message").innerText = "❌ Please enter new password.");
  if (!username) return (document.getElementById("newpass-message").innerText = "❌ Username missing.");

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
        sessionStorage.removeItem("fp-username");
        document.getElementById("newpass-message").innerText = "✅ Password updated.";
        setTimeout(showLoginForm, 1500);
      }
    });
}

// ========== Back to Login ==========
function showLoginForm() {
  document.getElementById("login-form").style.display = "block";
  document.getElementById("forgot-password-section").style.display = "none";
  document.getElementById("fp-username-form").style.display = "block";
  document.getElementById("otp-form").style.display = "none";
  document.getElementById("new-password-form").style.display = "none";
  document.getElementById("dashboard-section").style.display = "none";

  document.getElementById("fp-username").value = "";
  document.getElementById("fp-otp").value = "";
  document.getElementById("fp-new-password").value = "";
  document.getElementById("login-message").innerText = "";
  document.getElementById("fp-message").innerText = "";
  document.getElementById("otp-message").innerText = "";
  document.getElementById("newpass-message").innerText = "";
}

// ========== User List ==========
function showUsers() {
  document.getElementById("users-section").style.display = "block";
  fetch("https://danoski-backend.onrender.com/admin/users")
    .then(res => res.json())
    .then(data => {
      const table = document.getElementById("users-table");
      table.innerHTML = "";
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
    });
}

// ========== Withdrawals ==========
let autoApprove = false;

function showWithdrawals() {
  const section = document.getElementById("withdrawals-section");
  section.style.display = "block";

  const backBtn = document.getElementById("withdrawals-back-btn");
  if (backBtn) backBtn.style.display = "inline-block";

  fetch("https://danoski-backend.onrender.com/admin/withdrawals")
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
          <td>${w.status === "pending" ? `<button onclick="updateWithdrawal(${w.id}, 'approved')">✅</button>
                                           <button onclick="updateWithdrawal(${w.id}, 'rejected')">❌</button>` : ""}</td>
        `;
        table.appendChild(row);
        if (w.status === "pending" && autoApprove) updateWithdrawal(w.id, 'approved');
      });
    });
}

function toggleSelectAll(source) {
  const checkboxes = document.querySelectorAll(".withdraw-checkbox");
  checkboxes.forEach(cb => {
    if (!cb.disabled) cb.checked = source.checked;
  });
}

function approveSelectedWithdrawals() {
  const selected = [...document.querySelectorAll(".withdraw-checkbox:checked")].map(cb => +cb.value);
  if (selected.length === 0) return alert("No withdrawals selected.");
  selected.forEach(id => updateWithdrawal(id, "approved"));
}

function approveAllWithdrawals() {
  fetch("https://danoski-backend.onrender.com/admin/withdrawals")
    .then(res => res.json())
    .then(data => {
      const pending = data.filter(w => w.status === "pending");
      if (!pending.length) return alert("No pending withdrawals.");
      let done = 0;
      pending.forEach(w => {
        updateWithdrawal(w.id, "approved", () => {
          done++;
          if (done === pending.length) showWithdrawals();
        });
      });
    });
}

function updateWithdrawal(id, status, callback) {
  fetch("https://danoski-backend.onrender.com/admin/update-withdrawal", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, status })
  })
    .then(res => res.json())
    .then(() => {
      if (typeof callback === "function") callback();
    });
}

function toggleAutoApprove() {
  autoApprove = document.getElementById("auto-approve-toggle").checked;
  showWithdrawals();
}

// ========== Announcements ==========
function postAnnouncement() {
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

// ========== Hashrate ==========
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
      loadCurrentHashrate();
    })
    .catch(() => {
      msg.innerText = "❌ Failed to update hashrate.";
      msg.style.color = "red";
    });
}

// ========== Toggle Sections ==========
function toggleSection(id) {
  document.querySelectorAll(".admin-container").forEach(sec => sec.style.display = "none");
  const target = document.getElementById(id);
  if (target) {
    target.style.display = "block";
    document.querySelector("#dashboard-section > h2").style.display = "none";
    document.querySelector(".admin-nav").style.display = "none";
  }
}

function closeSection(id) {
  const section = document.getElementById(id);
  if (section) {
    section.style.display = "none";
    document.querySelector("#dashboard-section > h2").style.display = "block";
    document.querySelector(".admin-nav").style.display = "block";
  }
}

// ========== Load Hashrate on Load ==========
window.onload = () => {
  loadCurrentHashrate();
};
