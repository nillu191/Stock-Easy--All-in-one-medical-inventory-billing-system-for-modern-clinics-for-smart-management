// ==========================================
// STOCK EASY - Core SaaS Client Application
// Local Time Reference: 2026-06-14
// ==========================================

// Global State Object
let state = {
    currentUser: null,       // Logged-in user details { email, role, shopEmail }
    currentRole: 'public',    // Active role for router: 'public', 'owner', 'admin'
    currentShop: null,        // Active shop object
    activeView: 'landing',    // Current SPA panel displayed
    inventoryFilter: 'all',   // Selected filter on Inventory page
    settingsTab: 'profile',   // Active sub-tab in Settings page
    centralTab: 'approvals',  // Active sub-tab in Central Oversight page
    cart: [],                 // POS Active Bill Cart
    mockFiles: []             // Uploaded files for registration
};

// Database Schema (Seeded into localStorage if empty)
const DEFAULT_DATABASE = {
    shops: [
        {
            name: "City Care Pharmacy",
            ownerName: "Dr. John Doe",
            email: "owner@citypharma.com",
            phone: "+1 (555) 019-2834",
            address: "402 Medicine Row, Health District, NY 10001",
            type: "retail",
            subscription: "Pro",
            status: "approved", // approved, pending, rejected
            licenseId: "DL-19283/26",
            panId: "ABCDE1234F",
            gstId: "27ABCDE1234F1Z5",
            submittedOn: "2026-06-10",
            docsUploaded: ["license.pdf", "pan.png", "gst.pdf", "shop_front.jpg"]
        },
        {
            name: "Sunrise Drugstore",
            ownerName: "Jane Smith",
            email: "sunrise@drugstore.com",
            phone: "+1 (555) 012-4455",
            address: "12 Greenway Blvd, Jersey City, NJ 07302",
            type: "retail",
            subscription: "Base",
            status: "pending",
            licenseId: "DL-48593/26",
            panId: "WXYZR9876Q",
            gstId: "34WXYZR9876Q1Z2",
            submittedOn: "2026-06-13",
            docsUploaded: ["license.pdf", "tax_doc.pdf"]
        },
        {
            name: "Metro Pharmacy Inc",
            ownerName: "Rob Lee",
            email: "metro@pharmacy.com",
            phone: "+1 (555) 014-8899",
            address: "808 Broadway, New York, NY 10003",
            type: "retail",
            subscription: "Enterprise",
            status: "rejected",
            licenseId: "DL-90182/25",
            panId: "LMNPU5544K",
            gstId: "36LMNPU5544K1Z0",
            submittedOn: "2026-06-08",
            docsUploaded: ["license_expired.pdf"]
        }
    ],
    dealers: [
        { name: "Apex Pharma Distributors", contact: "Mike Vance", phone: "+1 (555) 012-9283", email: "orders@apexpharma.com" },
        { name: "Biotech Solutions Co.", contact: "Sarah Patel", phone: "+1 (555) 015-3344", email: "contact@biotech.com" },
        { name: "MedLine Wholesale Inc.", contact: "Dave Miller", phone: "+1 (555) 018-7788", email: "supply@medline.com" }
    ],
    medicines: [
        { id: "med-01", name: "Paracetamol 500mg", salt: "Acetaminophen 500mg", category: "Tablets", rack: "A-42" },
        { id: "med-02", name: "Amoxicillin 250mg", salt: "Amoxicillin Trihydrate 250mg", category: "Capsules", rack: "B-12" },
        { id: "med-03", name: "Metformin 850mg", salt: "Metformin Hydrochloride 850mg", category: "Tablets", rack: "C-05" },
        { id: "med-04", name: "Ibuprofen 400mg", salt: "Ibuprofen 400mg", category: "Tablets", rack: "A-10" },
        { id: "med-05", name: "Cough Syrup (Dex)", salt: "Dextromethorphan HBr 15mg", category: "Syrup", rack: "D-03" }
    ],
    batches: [
        // City Care Pharmacy (owner@citypharma.com) Stock
        // Batch 1: Expiring in 10 days (Urgent Red)
        { id: "BT-P01", medId: "med-01", shopEmail: "owner@citypharma.com", dealer: "Apex Pharma Distributors", expiryDate: "2026-06-24", quantity: 80, initialQty: 100, costPrice: 1.20, retailPrice: 2.50 },
        // Batch 2: Expiring in 45 days (Warning Orange)
        { id: "BT-P02", medId: "med-01", shopEmail: "owner@citypharma.com", dealer: "Biotech Solutions Co.", expiryDate: "2026-07-29", quantity: 150, initialQty: 150, costPrice: 1.10, retailPrice: 2.50 },
        // Batch 3: Safe Expiry
        { id: "BT-P03", medId: "med-01", shopEmail: "owner@citypharma.com", dealer: "MedLine Wholesale Inc.", expiryDate: "2027-02-15", quantity: 200, initialQty: 200, costPrice: 1.00, retailPrice: 2.40 },
        // Batch 4: Expiring in 70 days (Warning Orange)
        { id: "BT-A01", medId: "med-02", shopEmail: "owner@citypharma.com", dealer: "Apex Pharma Distributors", expiryDate: "2026-08-22", quantity: 120, initialQty: 120, costPrice: 3.50, retailPrice: 6.00 },
        // Batch 5: Expired (Expired Loss Test)
        { id: "BT-A02", medId: "med-02", shopEmail: "owner@citypharma.com", dealer: "Apex Pharma Distributors", expiryDate: "2026-05-10", quantity: 40, initialQty: 40, costPrice: 3.50, retailPrice: 6.00 },
        // Batch 6: Safe Expiry
        { id: "BT-M01", medId: "med-03", shopEmail: "owner@citypharma.com", dealer: "Biotech Solutions Co.", expiryDate: "2027-10-30", quantity: 300, initialQty: 300, costPrice: 2.00, retailPrice: 4.50 },
        // Batch 7: Out of Stock
        { id: "BT-I01", medId: "med-04", shopEmail: "owner@citypharma.com", dealer: "MedLine Wholesale Inc.", expiryDate: "2026-11-12", quantity: 0, initialQty: 100, costPrice: 1.50, retailPrice: 3.00 },
        // Batch 8: Dead Stock (Safe expiry, but quantity hasn't moved for 30+ days)
        { id: "BT-S01", medId: "med-05", shopEmail: "owner@citypharma.com", dealer: "Apex Pharma Distributors", expiryDate: "2027-05-20", quantity: 50, initialQty: 50, costPrice: 2.50, retailPrice: 5.50 }
    ],
    bills: [
        {
            id: "TXN-908201",
            shopEmail: "owner@citypharma.com",
            customerName: "Walk-in Customer",
            date: "2026-06-13T10:30:00",
            total: 35.00,
            fefoStatus: "Compliant",
            items: [
                { medName: "Paracetamol 500mg", batchId: "BT-P01", quantity: 10, price: 2.50 },
                { medName: "Cough Syrup (Dex)", batchId: "BT-S01", quantity: 2, price: 5.00 }
            ]
        },
        {
            id: "TXN-908202",
            shopEmail: "owner@citypharma.com",
            customerName: "Mary Jenkins",
            date: "2026-06-13T16:15:00",
            total: 62.50,
            fefoStatus: "Compliant",
            items: [
                { medName: "Paracetamol 500mg", batchId: "BT-P01", quantity: 5, price: 2.50 },
                { medName: "Amoxicillin 250mg", batchId: "BT-A01", quantity: 10, price: 5.00 }
            ]
        },
        {
            id: "TXN-908203",
            shopEmail: "owner@citypharma.com",
            customerName: "Arthur Dent",
            date: "2026-06-14T09:12:00",
            total: 12.50,
            fefoStatus: "Compliant",
            items: [
                { medName: "Paracetamol 500mg", batchId: "BT-P01", quantity: 5, price: 2.50 }
            ]
        }
    ],
    staff: [
        { name: "Alice Smith", email: "alice@citypharma.com", role: "pharmacist", joinDate: "2026-01-15", shopEmail: "owner@citypharma.com" },
        { name: "Bob Johnson", email: "bob@citypharma.com", role: "billing_clerk", joinDate: "2026-03-20", shopEmail: "owner@citypharma.com" }
    ],
    globalSettings: {
        basePlanPrice: 29,
        proPlanPrice: 59,
        enterprisePlanPrice: 149,
        redAlertDays: 30,
        orangeAlertDays: 90
    }
};

// LocalStorage Helper
function getDB() {
    let db = localStorage.getItem("stock_easy_db");
    if (!db) {
        localStorage.setItem("stock_easy_db", JSON.stringify(DEFAULT_DATABASE));
        return DEFAULT_DATABASE;
    }
    return JSON.parse(db);
}

function saveDB(db) {
    localStorage.setItem("stock_easy_db", JSON.stringify(db));
}

// Chart Instances Tracker
let chartInstances = {};

// ==========================================
// SPA Navigation and Router Logic
// ==========================================

function navigateTo(viewId) {
    state.activeView = viewId;
    
    // Hide all view panels
    document.querySelectorAll(".view-panel").forEach(panel => {
        panel.classList.remove("active-view");
    });
    
    // Show active panel
    const targetPanel = document.getElementById(`view-${viewId}`);
    if (targetPanel) {
        targetPanel.classList.add("active-view");
    }

    // Set Sidebar Active Navigation Styling
    document.querySelectorAll(".sidebar-item").forEach(item => {
        item.classList.remove("active");
    });
    const sidebarNavBtn = document.getElementById(`nav-${viewId}`);
    if (sidebarNavBtn) {
        sidebarNavBtn.classList.add("active");
    }

    // Update screen data specifically
    if (viewId === 'owner-dashboard') {
        renderOwnerDashboard();
    } else if (viewId === 'billing-fefo') {
        setupBillingPOS();
    } else if (viewId === 'medicines-catalog') {
        renderMedicinesCatalog();
    } else if (viewId === 'stock-entry') {
        setupStockEntry();
    } else if (viewId === 'inventory-overview') {
        renderInventoryOverview();
    } else if (viewId === 'dealers') {
        renderDealers();
    } else if (viewId === 'owner-analytics') {
        renderOwnerCharts();
    } else if (viewId === 'bills-history') {
        renderBillsHistory();
    } else if (viewId === 'settings') {
        renderSettings();
    } else if (viewId === 'central-oversight') {
        renderCentralOversight();
    } else if (viewId === 'register-documents') {
        if (pendingRegDetails) {
            document.getElementById("reg-license-id").value = pendingRegDetails.licenseId || "";
            document.getElementById("reg-pan-id").value = pendingRegDetails.panId || "";
            document.getElementById("reg-gst-id").value = pendingRegDetails.gstId || "";
        }
    }

    // Dynamic Header Title adjustments
    const authBtn = document.getElementById("header-auth-btn");
    if (state.currentUser) {
        authBtn.innerHTML = `<i class="fa-solid fa-right-from-bracket"></i> Logout`;
        authBtn.setAttribute("onclick", "logout()");
    } else {
        authBtn.innerHTML = `<i class="fa-solid fa-right-to-bracket"></i> Login`;
        authBtn.setAttribute("onclick", "navigateTo('login')");
    }
}

// Theme management (Dark / Light)
function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute("data-theme") || "dark";
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    body.setAttribute("data-theme", newTheme);
    
    const themeBtn = document.getElementById("theme-toggle");
    if (newTheme === "light") {
        themeBtn.innerHTML = `<i class="fa-solid fa-sun" style="color:#eab308;"></i>`;
    } else {
        themeBtn.innerHTML = `<i class="fa-solid fa-moon"></i>`;
    }
}

// Seed admin/owner credentials helper
function fillDemoCreds(role) {
    if (role === 'owner') {
        document.getElementById("login-email").value = "owner@citypharma.com";
        document.getElementById("login-password").value = "password123";
    } else if (role === 'admin') {
        document.getElementById("login-email").value = "admin@stockeasy.com";
        document.getElementById("login-password").value = "adminpass";
    }
}

// Perform simulated login
function handleLoginSubmit(event) {
    event.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    const db = getDB();
    
    // Check if Central Admin
    if (email === 'admin@stockeasy.com') {
        state.currentUser = { email, role: 'admin', shopEmail: null };
        state.currentRole = 'admin';
        showNotification("Admin Logged In!", "success");
        setupUIForRole('admin');
        navigateTo('central-oversight');
        return;
    }
    
    // Check Shop Owners
    const shop = db.shops.find(s => s.email === email);
    if (shop) {
        if (shop.status === 'pending') {
            showNotification("Your shop registration verification is still PENDING. Please contact Stock Easy audit support.", "warning");
            navigateTo('verification-status');
            document.getElementById("status-search-query").value = email;
            lookupVerificationStatus();
            return;
        }
        if (shop.status === 'rejected') {
            showNotification("Your registration request was REJECTED by Central Oversight.", "error");
            navigateTo('verification-status');
            document.getElementById("status-search-query").value = email;
            lookupVerificationStatus();
            return;
        }
        
        state.currentUser = { email, role: 'owner', shopEmail: email };
        state.currentRole = 'owner';
        state.currentShop = shop;
        showNotification(`Welcome back, ${shop.ownerName}!`, "success");
        setupUIForRole('owner');
        navigateTo('owner-dashboard');
        return;
    }

    // Default Fallback Mock Registration Login
    showNotification("Credentials not found! Try Quick Demo Logins.", "error");
}

// Sign out
function logout() {
    state.currentUser = null;
    state.currentRole = 'public';
    state.currentShop = null;
    setupUIForRole('public');
    showNotification("Signed out successfully.", "info");
    navigateTo('landing');
}

// Config navigation panels
function setupUIForRole(role) {
    const sidebar = document.getElementById("app-sidebar");
    const ownerMenu = document.getElementById("owner-menu-items");
    const adminMenu = document.getElementById("admin-menu-items");
    const badge = document.getElementById("role-badge");
    const shopDisplay = document.getElementById("active-shop-display");

    // Adjust badge role class
    badge.className = "badge-role";
    
    if (role === 'owner') {
        sidebar.style.display = "flex";
        ownerMenu.style.display = "block";
        adminMenu.style.display = "none";
        badge.classList.add("badge-owner");
        badge.textContent = "Shop Owner";
        
        // Show active shop name
        shopDisplay.style.display = "flex";
        document.getElementById("active-shop-name").textContent = state.currentShop.name;
    } else if (role === 'admin') {
        sidebar.style.display = "flex";
        ownerMenu.style.display = "none";
        adminMenu.style.display = "block";
        badge.classList.add("badge-admin");
        badge.textContent = "Central Admin";
        
        shopDisplay.style.display = "none";
    } else {
        // Public
        sidebar.style.display = "none";
        badge.classList.add("badge-public");
        badge.textContent = "Public / Guest";
        shopDisplay.style.display = "none";
    }

    // Sync top demo selector buttons
    document.querySelectorAll(".demo-role-btn").forEach(btn => btn.classList.remove("active"));
    const demoSwitcher = document.getElementById("demo-switcher");
    const activeBtn = Array.from(demoSwitcher.children).find(b => b.textContent.toLowerCase().includes(role));
    if (activeBtn) activeBtn.classList.add("active");
}

// Handle Demo Role Swapping directly from header helper
function switchDemoRole(role) {
    const db = getDB();
    if (role === 'owner') {
        // Log in John Doe shop owner
        state.currentUser = { email: "owner@citypharma.com", role: 'owner', shopEmail: "owner@citypharma.com" };
        state.currentRole = 'owner';
        state.currentShop = db.shops.find(s => s.email === "owner@citypharma.com");
        setupUIForRole('owner');
        navigateTo('owner-dashboard');
    } else if (role === 'admin') {
        state.currentUser = { email: "admin@stockeasy.com", role: 'admin', shopEmail: null };
        state.currentRole = 'admin';
        setupUIForRole('admin');
        navigateTo('central-oversight');
    } else {
        logout();
    }
}

// Toast System
function showNotification(msg, type = "info") {
    const toast = document.getElementById("toast-notification");
    const messageSpan = document.getElementById("toast-message");
    const icon = document.getElementById("toast-icon");

    messageSpan.textContent = msg;
    
    // Set icon & border type
    toast.className = `toast show toast-${type}`;
    if (type === 'success') {
        icon.className = "fa-solid fa-circle-check";
    } else if (type === 'warning') {
        icon.className = "fa-solid fa-triangle-exclamation";
    } else if (type === 'error') {
        icon.className = "fa-solid fa-circle-xmark";
    } else {
        icon.className = "fa-solid fa-circle-info";
    }

    setTimeout(() => {
        toast.classList.remove("show");
    }, 4500);
}

// ==========================================
// Public Lookup & Registration views
// ==========================================

function lookupVerificationStatus() {
    const query = document.getElementById("status-search-query").value.trim().toLowerCase();
    if (!query) {
        showNotification("Please enter a valid search ID.", "warning");
        return;
    }
    const db = getDB();
    const shop = db.shops.find(s => s.email.toLowerCase() === query || s.licenseId.toLowerCase() === query);

    const resultBox = document.getElementById("status-result-box");
    if (!shop) {
        showNotification("No pharmacy found matching this search key.", "error");
        resultBox.style.display = "none";
        return;
    }

    resultBox.style.display = "block";
    document.getElementById("status-result-title").textContent = shop.name;
    document.getElementById("status-result-date").textContent = shop.submittedOn || "2026-06-14";
    document.getElementById("status-result-license").textContent = shop.licenseId;
    
    // Status badges
    const badge = document.getElementById("status-result-badge");
    badge.className = "badge-status";
    
    // Timeline steps
    const step1 = document.getElementById("tl-step-1");
    const step2 = document.getElementById("tl-step-2");
    const step3 = document.getElementById("tl-step-3");
    
    document.getElementById("tl-date-1").textContent = `${shop.submittedOn || '2026-06-14'} 10:00`;
    
    if (shop.status === 'pending') {
        badge.classList.add("status-pending");
        badge.textContent = "Pending Verification";
        
        step1.className = "timeline-item complete";
        step2.className = "timeline-item active";
        document.getElementById("tl-date-2").textContent = "In Progress";
        document.getElementById("tl-desc-2").textContent = "Drug license database audits are currently underway by the central oversight team.";
        
        step3.className = "timeline-item";
        document.getElementById("tl-date-3").textContent = "Pending Verification";
        document.getElementById("tl-desc-3").textContent = "Access details will activate once central auditors sign off on drug storage files.";
    } else if (shop.status === 'approved') {
        badge.classList.add("status-approved");
        badge.textContent = "Approved & Active";
        
        step1.className = "timeline-item complete";
        step2.className = "timeline-item complete";
        document.getElementById("tl-date-2").textContent = "Verified";
        
        step3.className = "timeline-item complete";
        document.getElementById("tl-date-3").textContent = "Activated";
        document.getElementById("tl-desc-3").textContent = "Account fully active. Login with registered email to configure FEFO billing terminals.";
    } else {
        badge.classList.add("status-rejected");
        badge.textContent = "Rejected / Audits Failed";
        
        step1.className = "timeline-item complete";
        step2.className = "timeline-item complete";
        document.getElementById("tl-date-2").textContent = "Failed";
        document.getElementById("tl-desc-2").textContent = "Drug license audit flagged expired credentials or document mismatch. Review failed.";
        
        step3.className = "timeline-item";
        document.getElementById("tl-date-3").textContent = "Access Denied";
        document.getElementById("tl-desc-3").textContent = "Account suspended from medical registers. Re-register with valid tax cards and credentials.";
    }
}

// Temporary cache for Registration Details
let pendingRegDetails = null;

function handleRegistrationDetails(event) {
    event.preventDefault();
    
    const firstName = document.getElementById("reg-first-name").value.trim();
    const middleName = document.getElementById("reg-middle-name").value.trim();
    const lastName = document.getElementById("reg-last-name").value.trim();
    const ownerName = middleName ? `${firstName} ${middleName} ${lastName}` : `${firstName} ${lastName}`;
    
    const businessName = document.getElementById("reg-business-name").value.trim();
    const country = document.getElementById("reg-country").value.trim();
    const city = document.getElementById("reg-city").value.trim();
    const stateVal = document.getElementById("reg-state").value.trim();
    const street = document.getElementById("reg-street-number").value.trim();
    const pin = document.getElementById("reg-pin-code").value.trim();
    const fullAddress = `${street}, ${city}, ${stateVal}, ${pin}, ${country}`;

    const email = document.getElementById("reg-email-id").value.trim();
    const phone = document.getElementById("reg-phone-number").value.trim();
    const altPhone = document.getElementById("reg-alt-phone").value.trim();
    
    const gst = document.getElementById("reg-gst-number").value.trim();
    const aadhaar = document.getElementById("reg-aadhaar-number").value.trim();
    const pan = document.getElementById("reg-pan-number").value.trim();
    const cert = document.getElementById("reg-cert-number").value.trim();
    const sub = document.getElementById("reg-saas-sub").value;

    pendingRegDetails = {
        name: businessName,
        ownerName: ownerName,
        email: email,
        phone: phone,
        address: fullAddress,
        type: "retail",
        subscription: sub,
        altPhone: altPhone,
        gstId: gst,
        panId: pan,
        aadhaarId: aadhaar,
        licenseId: cert
    };

    showNotification("Owner details saved. Please proceed to upload credentials.", "success");
    navigateTo('register-documents');
}

// Mock file upload simulation
function triggerMockFileSelection() {
    const list = document.getElementById("mock-uploaded-list");
    const docs = ["drug_license_signed.pdf", "shop_audit_photos.zip", "pan_verification.png", "tax_returns.pdf"];
    
    // Choose a random doc to show uploaded
    const chosen = docs[Math.floor(Math.random() * docs.length)];
    if (state.mockFiles.includes(chosen)) {
        showNotification("File already selected.", "info");
        return;
    }
    
    state.mockFiles.push(chosen);
    renderMockUploadedFiles();
    showNotification(`Uploaded ${chosen} (Simulation)`, "success");
}

function renderMockUploadedFiles() {
    const list = document.getElementById("mock-uploaded-list");
    list.innerHTML = "";
    if (state.mockFiles.length === 0) {
        list.innerHTML = `<div style="text-align: center; font-size: 0.8rem; color: var(--text-muted);">No documents added yet.</div>`;
        return;
    }

    state.mockFiles.forEach((file, idx) => {
        list.innerHTML += `
            <div class="uploaded-doc-item">
                <div>
                    <i class="fa-solid fa-file-pdf" style="color:var(--danger); margin-right: 0.5rem;"></i>
                    <strong style="font-size:0.85rem;">${file}</strong>
                </div>
                <button class="btn btn-danger" onclick="removeMockFile(${idx})" style="font-size: 0.7rem; padding: 0.25rem 0.5rem;">Delete</button>
            </div>
        `;
    });
}

function removeMockFile(idx) {
    state.mockFiles.splice(idx, 1);
    renderMockUploadedFiles();
}

function handleRegistrationDocuments(event) {
    event.preventDefault();
    if (!pendingRegDetails) {
        showNotification("Registration details are missing. Please fill step 1.", "error");
        navigateTo('register-details');
        return;
    }
    if (state.mockFiles.length === 0) {
        showNotification("Please upload at least one regulatory document for auditing.", "warning");
        return;
    }

    const licenseId = document.getElementById("reg-license-id").value.trim();
    const panId = document.getElementById("reg-pan-id").value.trim();
    const gstId = document.getElementById("reg-gst-id").value.trim();

    const db = getDB();
    
    // Check if email already registered
    if (db.shops.some(s => s.email.toLowerCase() === pendingRegDetails.email.toLowerCase())) {
        showNotification("This email address is already registered.", "error");
        return;
    }

    const newShop = {
        ...pendingRegDetails,
        status: "pending",
        licenseId,
        panId,
        gstId,
        submittedOn: new Date().toISOString().split('T')[0],
        docsUploaded: [...state.mockFiles]
    };

    db.shops.push(newShop);
    saveDB(db);

    // Reset details cache
    pendingRegDetails = null;
    state.mockFiles = [];
    document.getElementById("mock-uploaded-list").innerHTML = "";

    showNotification("Pharmacy registration successfully submitted for central license audit!", "success");
    navigateTo('verification-status');
    
    // Auto populate status page
    document.getElementById("status-search-query").value = newShop.email;
    lookupVerificationStatus();
}

// ==========================================
// Owner Dashboard Screen
// ==========================================

function renderOwnerDashboard() {
    if (!state.currentShop) return;
    const db = getDB();
    const shopEmail = state.currentShop.email;
    
    document.getElementById("dashboard-current-date").textContent = `Local Time: 2026-06-14`;

    // Filter relevant records
    const shopBatches = db.batches.filter(b => b.shopEmail === shopEmail);
    const shopBills = db.bills.filter(b => b.shopEmail === shopEmail);

    // Calculate metrics
    // Today's Sales
    const todayStr = "2026-06-14";
    const todaySales = shopBills
        .filter(b => b.date.startsWith(todayStr))
        .reduce((sum, b) => sum + b.total, 0);
    document.getElementById("kpi-today-sales").textContent = `$${todaySales.toFixed(2)}`;

    // Active Batches
    const activeBatches = shopBatches.filter(b => b.quantity > 0 && new Date(b.expiryDate) > new Date(todayStr));
    document.getElementById("kpi-active-batches").textContent = `${activeBatches.length} Batches`;

    // Expiring within 90 days
    const limitDate = new Date(todayStr);
    limitDate.setDate(limitDate.getDate() + 90);
    const expiringBatches = activeBatches.filter(b => new Date(b.expiryDate) <= limitDate);
    document.getElementById("kpi-expiring-soon").textContent = `${expiringBatches.length} Batches`;
    
    // Expired stock loss (expired batches quantity * cost price)
    const expiredLoss = shopBatches
        .filter(b => new Date(b.expiryDate) <= new Date(todayStr))
        .reduce((sum, b) => sum + (b.quantity * b.costPrice), 0);
    document.getElementById("kpi-expired-loss").textContent = `$${expiredLoss.toFixed(2)}`;

    // Populate dashboard expiry widget list
    const expiryTbody = document.getElementById("dashboard-expiry-table");
    expiryTbody.innerHTML = "";
    
    // Sort active batches by expiry ascending
    const urgentExpirations = [...expiringBatches].sort((a,b) => new Date(a.expiryDate) - new Date(b.expiryDate));
    
    if (urgentExpirations.length === 0) {
        expiryTbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--text-muted);">No urgent near-expiry items found!</td></tr>`;
    } else {
        urgentExpirations.slice(0, 4).forEach(batch => {
            const med = db.medicines.find(m => m.id === batch.medId);
            const daysLeft = Math.ceil((new Date(batch.expiryDate) - new Date(todayStr)) / (1000 * 60 * 60 * 24));
            expiryTbody.innerHTML += `
                <tr class="${daysLeft <= 30 ? 'expiry-urgent-danger' : 'expiry-urgent-warning'}">
                    <td><strong>${med ? med.name : 'Unknown Medicine'}</strong></td>
                    <td>${batch.id}</td>
                    <td>${batch.expiryDate} (${daysLeft}d left)</td>
                    <td>${batch.quantity}</td>
                    <td><button class="btn btn-secondary" onclick="navigateTo('billing-fefo'); startBillingSearch('${med ? med.name : ''}')" style="padding:0.25rem 0.5rem; font-size:0.75rem;">Sell Now</button></td>
                </tr>
            `;
        });
    }

    // Render 7-day dashboard preview chart
    render7DayPerformanceChart(shopBills);
}

// Quick helper to jump straight into billing search from dashboard clicking "Sell Now"
function startBillingSearch(medName) {
    setTimeout(() => {
        document.getElementById("bill-search-input").value = medName;
        searchBillMedicines();
    }, 100);
}

function render7DayPerformanceChart(bills) {
    const ctx = document.getElementById('ownerSalesDashboardChart');
    if (!ctx) return;

    // Destroy existing instance to prevent glitching
    if (chartInstances['dashboardPerformance']) {
        chartInstances['dashboardPerformance'].destroy();
    }

    const last7Days = [];
    const salesSums = [];
    const today = new Date("2026-06-14");

    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const dayStr = d.toISOString().split('T')[0];
        
        last7Days.push(d.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' }));
        
        const sum = bills
            .filter(b => b.date.startsWith(dayStr))
            .reduce((total, b) => total + b.total, 0);
        salesSums.push(sum);
    }

    chartInstances['dashboardPerformance'] = new Chart(ctx, {
        type: 'line',
        data: {
            labels: last7Days,
            datasets: [{
                label: 'Sales Revenue ($)',
                data: salesSums,
                borderColor: '#06b6d4',
                backgroundColor: 'rgba(6, 182, 212, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#9ca3af' } },
                x: { grid: { display: false }, ticks: { color: '#9ca3af' } }
            }
        }
    });
}

// ==========================================
// Billing & Strict FEFO POS logic
// ==========================================

let activeSelectedMedicine = null;

function setupBillingPOS() {
    document.getElementById("bill-search-input").value = "";
    document.getElementById("bill-suggestions").style.display = "none";
    document.getElementById("billing-batches-card").style.display = "none";
    activeSelectedMedicine = null;
    renderCart();
}

function searchBillMedicines() {
    const input = document.getElementById("bill-search-input").value.trim().toLowerCase();
    const suggestions = document.getElementById("bill-suggestions");
    
    if (input.length < 1) {
        suggestions.style.display = "none";
        return;
    }

    const db = getDB();
    // Filter medicines that have active batches
    const matches = db.medicines.filter(m => {
        const hasStock = db.batches.some(b => b.medId === m.id && b.shopEmail === state.currentShop.email && b.quantity > 0);
        return hasStock && (m.name.toLowerCase().includes(input) || m.salt.toLowerCase().includes(input));
    });

    if (matches.length === 0) {
        suggestions.innerHTML = `<div style="padding: 0.75rem; color: var(--text-muted); font-size:0.85rem;">No in-stock medicines found.</div>`;
        suggestions.style.display = "block";
        return;
    }

    suggestions.innerHTML = "";
    matches.forEach(med => {
        suggestions.innerHTML += `
            <div style="padding: 0.75rem; cursor: pointer; border-bottom: 1px solid var(--bg-card-border); font-size:0.875rem;" onclick="selectMedicineForBilling('${med.id}')">
                <strong>${med.name}</strong> <span style="font-size:0.75rem; color:var(--text-muted);">(${med.salt})</span>
            </div>
        `;
    });
    suggestions.style.display = "block";
}

function selectMedicineForBilling(medId) {
    const db = getDB();
    const med = db.medicines.find(m => m.id === medId);
    if (!med) return;

    activeSelectedMedicine = med;
    document.getElementById("bill-search-input").value = med.name;
    document.getElementById("bill-suggestions").style.display = "none";

    document.getElementById("billing-selected-med-name").textContent = med.name;
    document.getElementById("billing-batches-card").style.display = "block";

    renderMedicineBatchesForBilling();
}

function renderMedicineBatchesForBilling() {
    if (!activeSelectedMedicine) return;
    const db = getDB();
    const tbody = document.getElementById("billing-batches-tbody");
    tbody.innerHTML = "";

    // Find all active batches of this medicine for this shop
    const shopBatches = db.batches.filter(b => b.medId === activeSelectedMedicine.id && b.shopEmail === state.currentShop.email && b.quantity > 0);

    // Sort by expiry date ASCENDING (Strict FEFO)
    const sortedBatches = [...shopBatches].sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));

    if (sortedBatches.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:var(--text-muted);">No stock remaining for this item.</td></tr>`;
        return;
    }

    const today = new Date("2026-06-14");

    sortedBatches.forEach((batch, index) => {
        const isFefoRecommended = index === 0; // The closest to expiry has index 0
        const daysLeft = Math.ceil((new Date(batch.expiryDate) - today) / (1000 * 60 * 60 * 24));
        
        let statusBadge = "";
        if (daysLeft <= 30) {
            statusBadge = `<span class="badge-status status-rejected"><i class="fa-solid fa-triangle-exclamation"></i> Critical (${daysLeft}d)</span>`;
        } else if (daysLeft <= 90) {
            statusBadge = `<span class="badge-status status-pending"><i class="fa-solid fa-hourglass-half"></i> Warning (${daysLeft}d)</span>`;
        } else {
            statusBadge = `<span class="badge-status status-approved">Safe (${daysLeft}d)</span>`;
        }

        tbody.innerHTML += `
            <tr class="${isFefoRecommended ? 'fefo-highlight' : ''}">
                <td>
                    ${batch.id}
                    ${isFefoRecommended ? '<span class="fefo-badge"><i class="fa-solid fa-star"></i> FEFO Recommended</span>' : ''}
                </td>
                <td>${batch.expiryDate}</td>
                <td><strong>${batch.quantity} units</strong></td>
                <td>$${batch.retailPrice.toFixed(2)}</td>
                <td>${statusBadge}</td>
                <td>
                    <div style="display:flex; align-items:center; gap:0.25rem;">
                        <input type="number" id="qty-input-${batch.id}" class="form-input" style="width: 70px; padding: 0.25rem;" min="1" max="${batch.quantity}" value="1">
                        <button class="btn btn-primary" onclick="addBatchToCart('${batch.id}', ${isFefoRecommended})" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">Add</button>
                    </div>
                </td>
            </tr>
        `;
    });
}

function addBatchToCart(batchId, isFefoRecommended) {
    const db = getDB();
    const batch = db.batches.find(b => b.id === batchId);
    if (!batch) return;

    const qtyInput = document.getElementById(`qty-input-${batchId}`);
    const sellQty = parseInt(qtyInput.value);

    if (isNaN(sellQty) || sellQty <= 0) {
        showNotification("Please select a valid quantity.", "warning");
        return;
    }

    if (sellQty > batch.quantity) {
        showNotification(`Insufficient stock! Only ${batch.quantity} units available.`, "error");
        return;
    }

    // FEFO Override Check: If they choose a batch that is NOT recommended
    // while there's a recommended batch in stock with earlier expiry.
    if (!isFefoRecommended) {
        // Find if there is a recommended batch in stock (earliest expiry)
        const activeBatches = db.batches.filter(b => b.medId === batch.medId && b.shopEmail === state.currentShop.email && b.quantity > 0);
        const sorted = [...activeBatches].sort((a,b) => new Date(a.expiryDate) - new Date(b.expiryDate));
        const earliestBatch = sorted[0];

        if (earliestBatch && new Date(earliestBatch.expiryDate) < new Date(batch.expiryDate)) {
            // Emitting FEFO warning
            showNotification(`FEFO ALERT: Batch ${earliestBatch.id} expires earlier (${earliestBatch.expiryDate})! Selling newer stock creates waste risk.`, "warning");
        }
    }

    // Add to cart
    const medName = activeSelectedMedicine.name;
    const existingIndex = state.cart.findIndex(item => item.batchId === batchId);

    if (existingIndex > -1) {
        // Update quantity
        const newTotal = state.cart[existingIndex].quantity + sellQty;
        if (newTotal > batch.quantity) {
            showNotification(`Total quantity in cart cannot exceed batch capacity (${batch.quantity}).`, "error");
            return;
        }
        state.cart[existingIndex].quantity = newTotal;
    } else {
        // Insert new cart item
        state.cart.push({
            medId: batch.medId,
            medName: medName,
            batchId: batchId,
            expiryDate: batch.expiryDate,
            quantity: sellQty,
            price: batch.retailPrice,
            isFefoCompliant: isFefoRecommended
        });
    }

    // Refresh UI
    renderCart();
    // Reset inputs
    qtyInput.value = "1";
    showNotification("Added item to active bill cart.", "success");
}

function removeFromCart(idx) {
    state.cart.splice(idx, 1);
    renderCart();
}

function renderCart() {
    const list = document.getElementById("cart-items-list-container");
    list.innerHTML = "";

    if (state.cart.length === 0) {
        list.innerHTML = `
            <div style="text-align: center; color: var(--text-muted); margin-top: 3rem;">
                <i class="fa-solid fa-cart-arrow-down" style="font-size: 2.5rem; margin-bottom: 0.75rem;"></i>
                <p>No medicines added to bill yet.</p>
            </div>
        `;
        document.getElementById("cart-subtotal").textContent = "$0.00";
        document.getElementById("cart-total").textContent = "$0.00";
        return;
    }

    let subtotal = 0;
    state.cart.forEach((item, idx) => {
        const lineTotal = item.quantity * item.price;
        subtotal += lineTotal;

        list.innerHTML += `
            <div class="cart-item">
                <div style="flex:1;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <strong>${item.medName}</strong>
                        <span style="font-size:0.85rem; font-weight:700;">$${lineTotal.toFixed(2)}</span>
                    </div>
                    <div style="font-size:0.75rem; color:var(--text-muted); margin-top:0.25rem; display:flex; justify-content:space-between;">
                        <span>Batch: ${item.batchId} (${item.quantity} x $${item.price.toFixed(2)})</span>
                        ${item.isFefoCompliant ? 
                            '<span style="color:var(--success); font-weight:700;"><i class="fa-solid fa-check"></i> FEFO</span>' : 
                            '<span style="color:var(--warning); font-weight:700;"><i class="fa-solid fa-triangle-exclamation"></i> OVERRIDE</span>'
                        }
                    </div>
                </div>
                <button onclick="removeFromCart(${idx})" style="background:none; border:none; color:var(--danger); cursor:pointer; margin-left:1rem; font-size:1rem;"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
    });

    document.getElementById("cart-subtotal").textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById("cart-total").textContent = `$${subtotal.toFixed(2)}`;
}

// Complete the Billing transaction
function checkoutFEFOBill() {
    if (state.cart.length === 0) {
        showNotification("Your cart is empty.", "warning");
        return;
    }

    const db = getDB();
    const customer = document.getElementById("cart-customer-name").value.trim() || "Walk-in Customer";
    const shopEmail = state.currentShop.email;

    // Strict validation: Verify inventory batch stocks once more in transaction block
    for (let item of state.cart) {
        const batch = db.batches.find(b => b.id === item.batchId && b.shopEmail === shopEmail);
        if (!batch) {
            showNotification(`Stock Error: Batch ${item.batchId} not found in store register!`, "error");
            return;
        }
        if (batch.quantity < item.quantity) {
            showNotification(`Transaction aborted: Batch ${item.batchId} has insufficient stock!`, "error");
            return;
        }
    }

    // Success transaction: Decrement stock and save invoice
    const finalBillItems = [];
    let isOverallFEFOCompliant = true;

    state.cart.forEach(item => {
        const batch = db.batches.find(b => b.id === item.batchId && b.shopEmail === shopEmail);
        
        // Decrement quantity
        batch.quantity -= item.quantity;

        if (!item.isFefoCompliant) {
            isOverallFEFOCompliant = false;
        }

        finalBillItems.push({
            medName: item.medName,
            batchId: item.batchId,
            quantity: item.quantity,
            price: item.price
        });
    });

    // Subtotal total
    const totalAmount = state.cart.reduce((sum, item) => sum + (item.quantity * item.price), 0);

    const newInvoice = {
        id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
        shopEmail: shopEmail,
        customerName: customer,
        date: new Date().toISOString(),
        total: totalAmount,
        fefoStatus: isOverallFEFOCompliant ? "Compliant" : "Bypassed",
        items: finalBillItems
    };

    db.bills.push(newInvoice);
    saveDB(db);

    // Empty cart and reset UI
    state.cart = [];
    renderCart();
    setupBillingPOS();

    // Trigger Print Invoice modal popup
    showInvoiceModal(newInvoice);
    showNotification("Billing transaction completed and stock updated successfully!", "success");
}

// Print Invoice Modal Controllers
let activeInvoiceForSim = null;

function showInvoiceModal(invoice) {
    activeInvoiceForSim = invoice;
    const overlay = document.getElementById("invoice-modal");
    const printArea = document.getElementById("invoice-print-area");
    const formattedDate = new Date(invoice.date).toLocaleString();

    let itemsMarkup = "";
    invoice.items.forEach(it => {
        itemsMarkup += `
${it.medName.padEnd(25)} x${String(it.quantity).padEnd(2)} $${(it.quantity * it.price).toFixed(2).padStart(6)}
  [Batch: ${it.batchId}]
`;
    });

    printArea.innerHTML = `
========================================
             STOCK EASY SaaS
           INVOICE SLIP (DEMO)
========================================
Invoice: ${invoice.id}
Date   : ${formattedDate}
Store  : ${state.currentShop.name}
Phone  : ${state.currentShop.phone}
Client : ${invoice.customerName}
FEFO   : ${invoice.fefoStatus}
----------------------------------------
Item                      Qty   Total
----------------------------------------${itemsMarkup}
----------------------------------------
TOTAL PAID:                     $${invoice.total.toFixed(2)}
========================================
      Thank you for your business!
      Wastage Avoided with FEFO.
========================================
`;

    overlay.classList.add("open");
}

function closeInvoiceModal() {
    document.getElementById("invoice-modal").classList.remove("open");
    activeInvoiceForSim = null;
}

function simulatePrintInvoice() {
    showNotification("Connecting to thermal slip printer... Printed Invoice successfully!", "success");
    closeInvoiceModal();
}

function simulateDownloadInvoice() {
    showNotification(`Downloading PDF: Invoice_${activeInvoiceForSim.id}.pdf (Simulated)`, "info");
    closeInvoiceModal();
}

// ==========================================
// Medicines Catalog
// ==========================================

function renderMedicinesCatalog() {
    const db = getDB();
    const tbody = document.getElementById("catalog-table-body");
    tbody.innerHTML = "";

    const query = document.getElementById("catalog-search").value.trim().toLowerCase();
    const shopEmail = state.currentShop.email;

    // Filter medicines
    db.medicines.forEach(med => {
        if (query && !med.name.toLowerCase().includes(query) && !med.salt.toLowerCase().includes(query)) {
            return;
        }

        // Get all batches for this store
        const batches = db.batches.filter(b => b.medId === med.id && b.shopEmail === shopEmail);
        const totalQty = batches.reduce((sum, b) => sum + b.quantity, 0);

        // Find nearest expiry date
        const activeBatches = batches.filter(b => b.quantity > 0 && new Date(b.expiryDate) > new Date("2026-06-14"));
        const sortedActive = [...activeBatches].sort((a,b) => new Date(a.expiryDate) - new Date(b.expiryDate));
        
        let nearestExpiry = "N/A";
        let nearestBatchId = "N/A";
        let shelfLifeBadge = `<span class="badge-status status-pending">No Active Stock</span>`;

        if (sortedActive.length > 0) {
            nearestExpiry = sortedActive[0].expiryDate;
            nearestBatchId = sortedActive[0].id;
            
            const daysLeft = Math.ceil((new Date(nearestExpiry) - new Date("2026-06-14")) / (1000 * 60 * 60 * 24));
            if (daysLeft <= 30) {
                shelfLifeBadge = `<span class="badge-status status-rejected"><i class="fa-solid fa-triangle-exclamation"></i> Critical (${daysLeft}d)</span>`;
            } else if (daysLeft <= 90) {
                shelfLifeBadge = `<span class="badge-status status-pending"><i class="fa-solid fa-hourglass-half"></i> Urgent (${daysLeft}d)</span>`;
            } else {
                shelfLifeBadge = `<span class="badge-status status-approved">Safe (${daysLeft}d)</span>`;
            }
        } else if (batches.some(b => b.quantity > 0)) {
            // Means all stock is expired
            shelfLifeBadge = `<span class="badge-status status-rejected">ALL EXPIRED</span>`;
        }

        tbody.innerHTML += `
            <tr>
                <td><strong>${med.name}</strong></td>
                <td>${med.category}</td>
                <td>${batches.length} Batches</td>
                <td><strong>${totalQty} units</strong></td>
                <td>${nearestBatchId}</td>
                <td>${nearestExpiry}</td>
                <td>${shelfLifeBadge}</td>
            </tr>
        `;
    });
}

// ==========================================
// Stock Batch Entry
// ==========================================

function setupStockEntry() {
    // Optional: Pre-populate date of entry with today's date
    const dateEntryInput = document.getElementById("stock-entry-date-entry");
    if (dateEntryInput) {
        dateEntryInput.value = new Date().toISOString().split('T')[0];
    }
}

function handleStockBatchSubmit(event) {
    event.preventDefault();
    const batchId = document.getElementById("stock-entry-batch-id").value.trim().toUpperCase();
    const medName = document.getElementById("stock-entry-med-name").value.trim();
    const manfName = document.getElementById("stock-entry-manf-name").value.trim();
    const manfDate = document.getElementById("stock-entry-manf-date").value;
    const expiryDate = document.getElementById("stock-entry-expiry").value;
    const costPrice = parseFloat(document.getElementById("stock-entry-cost").value);
    const mrp = parseFloat(document.getElementById("stock-entry-mrp").value);
    const discount = parseFloat(document.getElementById("stock-entry-discount").value) || 0;
    const retailPrice = parseFloat(document.getElementById("stock-entry-retail").value);
    const rxNeeded = document.getElementById("stock-entry-rx-needed").value;
    const sellerId = document.getElementById("stock-entry-seller-id").value.trim();
    const dealerName = document.getElementById("stock-entry-dealer").value.trim();
    const category = document.getElementById("stock-entry-category").value.trim();
    const clientId = document.getElementById("stock-entry-client-id").value.trim();
    const dateEntry = document.getElementById("stock-entry-date-entry").value;
    const dateDispatch = document.getElementById("stock-entry-date-dispatch").value;
    const quantity = parseInt(document.getElementById("stock-entry-qty").value);
    const typeMedicine = document.getElementById("stock-entry-type-med").value.trim();

    const db = getDB();
    const shopEmail = state.currentShop ? state.currentShop.email : "owner@citypharma.com";

    // Check duplicate batch for this store
    if (db.batches.some(b => b.id === batchId && b.shopEmail === shopEmail)) {
        showNotification(`Batch ID ${batchId} already registered in your store database.`, "warning");
        return;
    }

    // Find or create medicine definition
    let med = db.medicines.find(m => m.name.toLowerCase() === medName.toLowerCase());
    if (!med) {
        med = {
            id: `med-${String(db.medicines.length + 1).padStart(2, '0')}`,
            name: medName,
            salt: "N/A",
            category: category || "General",
            rack: "N/A"
        };
        db.medicines.push(med);
    }

    // Add dealer/supplier if not already present
    if (dealerName && !db.dealers.some(d => d.name.toLowerCase() === dealerName.toLowerCase())) {
        db.dealers.push({
            name: dealerName,
            contact: "N/A",
            phone: "N/A",
            email: "N/A"
        });
    }

    const newBatch = {
        id: batchId,
        medId: med.id,
        shopEmail,
        dealer: dealerName,
        expiryDate,
        quantity,
        initialQty: quantity,
        costPrice,
        retailPrice,
        // Detailed record fields
        manfName,
        manfDate,
        mrp,
        discount,
        rxNeeded,
        sellerId,
        category,
        clientId,
        dateEntry,
        dateDispatch,
        typeMedicine
    };

    db.batches.push(newBatch);
    saveDB(db);

    // Reset Form fields
    document.getElementById("stock-entry-batch-id").value = "";
    document.getElementById("stock-entry-med-name").value = "";
    document.getElementById("stock-entry-manf-name").value = "";
    document.getElementById("stock-entry-manf-date").value = "";
    document.getElementById("stock-entry-expiry").value = "";
    document.getElementById("stock-entry-cost").value = "";
    document.getElementById("stock-entry-mrp").value = "";
    document.getElementById("stock-entry-discount").value = "";
    document.getElementById("stock-entry-retail").value = "";
    document.getElementById("stock-entry-rx-needed").value = "";
    document.getElementById("stock-entry-seller-id").value = "";
    document.getElementById("stock-entry-dealer").value = "";
    document.getElementById("stock-entry-category").value = "";
    document.getElementById("stock-entry-client-id").value = "";
    document.getElementById("stock-entry-date-dispatch").value = "";
    document.getElementById("stock-entry-qty").value = "";
    document.getElementById("stock-entry-type-med").value = "";
    
    setupStockEntry(); // Re-trigger default values

    showNotification(`Batch ${batchId} stored in database. Expiry calculations active.`, "success");
}

// ==========================================
// Inventory Overview View (Shading + Filters)
// ==========================================

function setInventoryFilter(filter) {
    state.inventoryFilter = filter;
    
    // Toggle active UI class
    document.querySelectorAll(".filter-badge").forEach(badge => {
        badge.classList.remove("active");
    });
    document.getElementById(`inv-filter-${filter}`).classList.add("active");

    renderInventoryOverview();
}

function renderInventoryOverview() {
    const db = getDB();
    const tbody = document.getElementById("inventory-table-body");
    tbody.innerHTML = "";

    const shopEmail = state.currentShop.email;
    const today = new Date("2026-06-14");

    db.batches.forEach(batch => {
        if (batch.shopEmail !== shopEmail) return;

        const med = db.medicines.find(m => m.id === batch.medId);
        const medName = med ? med.name : "Unknown Medicine";
        
        const daysLeft = Math.ceil((new Date(batch.expiryDate) - today) / (1000 * 60 * 60 * 24));
        const isExpired = daysLeft <= 0;

        // Apply advanced state filters
        if (state.inventoryFilter === 'expiring') {
            // Expiring soon: In stock, expiring in <=90 days, not expired
            if (batch.quantity <= 0 || daysLeft > 90 || isExpired) return;
        } else if (state.inventoryFilter === 'outofstock') {
            if (batch.quantity > 0) return;
        } else if (state.inventoryFilter === 'dead') {
            // Dead stock: active stock, safe shelf life, but not sold for 30+ days.
            // Check if any invoice contains this batch in the last 30 days
            const limitDate = new Date(today);
            limitDate.setDate(limitDate.getDate() - 30);
            
            const soldRecently = db.bills.some(bill => {
                if (bill.shopEmail !== shopEmail) return false;
                const billDate = new Date(bill.date);
                if (billDate < limitDate) return false;
                return bill.items.some(item => item.batchId === batch.id);
            });

            if (batch.quantity <= 0 || soldRecently || daysLeft < 90) return;
        }

        // Color coding by expiry urgency
        let rowClass = "";
        let shelfText = "Safe";

        if (isExpired) {
            rowClass = "expiry-urgent-danger";
            shelfText = "EXPIRED";
        } else if (daysLeft <= 30) {
            rowClass = "expiry-urgent-danger";
            shelfText = `Critical (${daysLeft}d)`;
        } else if (daysLeft <= 90) {
            rowClass = "expiry-urgent-warning";
            shelfText = `Warning (${daysLeft}d)`;
        } else {
            rowClass = "expiry-safe";
            shelfText = `Safe (${daysLeft}d)`;
        }

        tbody.innerHTML += `
            <tr class="${rowClass}">
                <td><strong>${medName}</strong></td>
                <td>${batch.id}</td>
                <td>${batch.dealer}</td>
                <td><strong>${batch.quantity} units</strong></td>
                <td>${batch.expiryDate}</td>
                <td>$${batch.costPrice.toFixed(2)}</td>
                <td>$${batch.retailPrice.toFixed(2)}</td>
                <td><span style="font-weight:700;">${shelfText}</span></td>
            </tr>
        `;
    });

    if (tbody.innerHTML === "") {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; color:var(--text-muted);">No inventory items matching this filter context.</td></tr>`;
    }
}

// ==========================================
// Dealers & Suppliers View
// ==========================================

function openAddDealerModal() {
    document.getElementById("add-dealer-modal").classList.add("open");
}

function closeDealerModal() {
    document.getElementById("add-dealer-modal").classList.remove("open");
}

function handleDealerSubmit(event) {
    event.preventDefault();
    const name = document.getElementById("dealer-name").value.trim();
    const contact = document.getElementById("dealer-contact").value.trim();
    const phone = document.getElementById("dealer-phone").value.trim();
    const email = document.getElementById("dealer-email").value.trim();

    const db = getDB();
    if (db.dealers.some(d => d.name.toLowerCase() === name.toLowerCase())) {
        showNotification("Supplier already registered.", "warning");
        return;
    }

    const newDealer = { name, contact, phone, email };
    db.dealers.push(newDealer);
    saveDB(db);

    closeDealerModal();
    renderDealers();
    showNotification(`Supplier "${name}" registered in platform index.`, "success");
}

function renderDealers() {
    const db = getDB();
    const tbody = document.getElementById("dealers-table-body");
    tbody.innerHTML = "";

    const shopEmail = state.currentShop.email;
    const today = new Date("2026-06-14");

    db.dealers.forEach(dlr => {
        // Find all batches supplied by this dealer to this shop
        const supplied = db.batches.filter(b => b.dealer === dlr.name && b.shopEmail === shopEmail);
        
        // Active Stock Value (qty * cost price)
        const activeStockValue = supplied
            .filter(b => new Date(b.expiryDate) > today)
            .reduce((sum, b) => sum + (b.quantity * b.costPrice), 0);

        // Expired Stock Value
        const expiredStockValue = supplied
            .filter(b => new Date(b.expiryDate) <= today)
            .reduce((sum, b) => sum + (b.quantity * b.costPrice), 0);

        tbody.innerHTML += `
            <tr>
                <td><strong>${dlr.name}</strong></td>
                <td>${dlr.contact}</td>
                <td>
                    <div style="font-size:0.8rem;">${dlr.email}</div>
                    <div style="font-size:0.75rem; color:var(--text-muted);">${dlr.phone}</div>
                </td>
                <td>${supplied.length} batches</td>
                <td><strong>$${activeStockValue.toFixed(2)}</strong></td>
                <td style="color:${expiredStockValue > 0 ? 'var(--danger)' : 'inherit'}; font-weight:700;">
                    $${expiredStockValue.toFixed(2)}
                </td>
                <td>
                    ${expiredStockValue > 0 ? 
                        '<span class="badge-status status-rejected"><i class="fa-solid fa-circle-exclamation"></i> Refund Claim</span>' : 
                        '<span class="badge-status status-approved">Balanced</span>'
                    }
                </td>
            </tr>
        `;
    });
}

// ==========================================
// Advanced Owner Analytics View
// ==========================================

function renderOwnerCharts() {
    const db = getDB();
    const shopEmail = state.currentShop.email;
    const bills = db.bills.filter(b => b.shopEmail === shopEmail);
    const batches = db.batches.filter(b => b.shopEmail === shopEmail);

    const today = new Date("2026-06-14");

    // 1. Sales Trend Line Chart (7 Days)
    const salesCtx = document.getElementById('ownerSalesTrendChart');
    if (salesCtx) {
        if (chartInstances['salesTrend']) chartInstances['salesTrend'].destroy();
        
        const days = [];
        const sums = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            const dStr = d.toISOString().split('T')[0];
            days.push(d.toLocaleDateString('en-US', { weekday: 'short' }));
            
            const totalSum = bills
                .filter(b => b.date.startsWith(dStr))
                .reduce((s, b) => s + b.total, 0);
            sums.push(totalSum);
        }

        chartInstances['salesTrend'] = new Chart(salesCtx, {
            type: 'line',
            data: {
                labels: days,
                datasets: [{
                    label: 'Revenue ($)',
                    data: sums,
                    borderColor: '#06b6d4',
                    backgroundColor: 'rgba(6, 182, 212, 0.1)',
                    borderWidth: 2.5,
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#9ca3af' } },
                    x: { grid: { display: false }, ticks: { color: '#9ca3af' } }
                }
            }
        });
    }

    // 2. Top Selling Medicines Bar Chart
    const sellersCtx = document.getElementById('ownerTopSellersChart');
    if (sellersCtx) {
        if (chartInstances['topSellers']) chartInstances['topSellers'].destroy();

        // Calculate quantity sold per medicine
        const medCounts = {};
        bills.forEach(bill => {
            bill.items.forEach(it => {
                medCounts[it.medName] = (medCounts[it.medName] || 0) + it.quantity;
            });
        });

        const sortedMeds = Object.keys(medCounts).sort((a,b) => medCounts[b] - medCounts[a]).slice(0, 5);
        const values = sortedMeds.map(k => medCounts[k]);

        chartInstances['topSellers'] = new Chart(sellersCtx, {
            type: 'bar',
            data: {
                labels: sortedMeds.length > 0 ? sortedMeds : ["No Sales"],
                datasets: [{
                    data: values.length > 0 ? values : [0],
                    backgroundColor: 'rgba(16, 185, 129, 0.75)',
                    borderRadius: 6,
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#9ca3af', stepSize: 5 } },
                    x: { grid: { display: false }, ticks: { color: '#9ca3af' } }
                }
            }
        });
    }

    // 3. Expiry Loss Trend (Month-on-Month)
    const lossCtx = document.getElementById('ownerExpiryLossChart');
    if (lossCtx) {
        if (chartInstances['expiryLoss']) chartInstances['expiryLoss'].destroy();

        // Expired batches value comparison
        // Let's mockup quarterly loss data for visual excellence
        const months = ['March 26', 'April 26', 'May 26', 'June 26 (Current)'];
        
        // Calculate June expired batch cost
        const juneLoss = batches
            .filter(b => new Date(b.expiryDate) <= today)
            .reduce((s,b) => s + (b.quantity * b.costPrice), 0);

        const losses = [120.00, 240.00, 80.00, juneLoss];

        chartInstances['expiryLoss'] = new Chart(lossCtx, {
            type: 'bar',
            data: {
                labels: months,
                datasets: [{
                    label: 'Stock Written-off ($)',
                    data: losses,
                    backgroundColor: 'rgba(244, 63, 94, 0.75)',
                    borderColor: '#f43f5e',
                    borderWidth: 1,
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#9ca3af' } },
                    x: { grid: { display: false }, ticks: { color: '#9ca3af' } }
                }
            }
        });
    }

    // Sync compliance count
    const compliantCount = bills.filter(b => b.fefoStatus === 'Compliant').length;
    document.getElementById("analytics-fefo-count").textContent = compliantCount;
}

// ==========================================
// Bills & Sales History
// ==========================================

function renderBillsHistory() {
    const db = getDB();
    const tbody = document.getElementById("bills-history-table-body");
    tbody.innerHTML = "";

    const query = document.getElementById("bill-history-search").value.trim().toLowerCase();
    const shopEmail = state.currentShop.email;

    // Filter relevant invoices
    const shopBills = db.bills.filter(b => b.shopEmail === shopEmail);

    shopBills.forEach(bill => {
        if (query && !bill.id.toLowerCase().includes(query) && !bill.customerName.toLowerCase().includes(query)) {
            return;
        }

        const dateFormatted = new Date(bill.date).toLocaleString();
        
        // Summarize items
        const itemsList = bill.items.map(it => `${it.medName} (x${it.quantity})`).join(", ");

        tbody.innerHTML += `
            <tr>
                <td><strong>${bill.id}</strong></td>
                <td>${dateFormatted}</td>
                <td>${bill.customerName}</td>
                <td style="max-width:280px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${itemsList}">
                    ${itemsList}
                </td>
                <td><strong>$${bill.total.toFixed(2)}</strong></td>
                <td>
                    ${bill.fefoStatus === 'Compliant' ? 
                        '<span class="badge-status status-approved"><i class="fa-solid fa-check-double"></i> FEFO Compliant</span>' : 
                        '<span class="badge-status status-pending"><i class="fa-solid fa-circle-exclamation"></i> Manual Override</span>'
                    }
                </td>
                <td>
                    <div style="display:flex; gap:0.5rem;">
                        <button class="btn btn-secondary" onclick="reprintBillFromHistory('${bill.id}')" style="padding:0.25rem 0.5rem; font-size:0.75rem;"><i class="fa-solid fa-receipt"></i> Reprint</button>
                        <button class="btn btn-secondary" onclick="simulateBillPDFDownload('${bill.id}')" style="padding:0.25rem 0.5rem; font-size:0.75rem;"><i class="fa-solid fa-download"></i> PDF</button>
                    </div>
                </td>
            </tr>
        `;
    });

    if (tbody.innerHTML === "") {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:var(--text-muted);">No sales invoices matching query.</td></tr>`;
    }
}

function reprintBillFromHistory(billId) {
    const db = getDB();
    const bill = db.bills.find(b => b.id === billId);
    if (bill) {
        showInvoiceModal(bill);
    }
}

function simulateBillPDFDownload(billId) {
    showNotification(`Downloading PDF: Invoice_${billId}.pdf (Simulated)`, "info");
}

// ==========================================
// Settings & Profile Tabs
// ==========================================

function switchSettingsTab(tabId) {
    state.settingsTab = tabId;
    
    // Switch active button tab
    document.querySelectorAll(".tab-btn").forEach(btn => {
        if (btn.id.startsWith("set-tab-")) btn.classList.remove("active");
    });
    document.getElementById(`set-tab-${tabId}`).classList.add("active");

    // Hide/show panels
    document.querySelectorAll(".settings-sub-pane").forEach(pane => {
        pane.style.display = "none";
    });
    document.getElementById(`settings-pane-${tabId}`).style.display = "block";

    if (tabId === 'staff') {
        renderStaffTable();
    } else if (tabId === 'sub') {
        renderSubscriptionTab();
    }
}

function renderSettings() {
    if (!state.currentShop) return;
    
    // Populate profile inputs
    document.getElementById("set-shop-name").value = state.currentShop.name;
    document.getElementById("set-owner-name").value = state.currentShop.ownerName;
    document.getElementById("set-shop-email").value = state.currentShop.email;
    document.getElementById("set-shop-phone").value = state.currentShop.phone;
    document.getElementById("set-shop-address").value = state.currentShop.address;
    
    document.getElementById("set-pass-old").value = "";
    document.getElementById("set-pass-new").value = "";

    switchSettingsTab('profile');
}

function handleSaveSettingsProfile(event) {
    event.preventDefault();
    const db = getDB();
    const shop = db.shops.find(s => s.email === state.currentShop.email);

    if (shop) {
        shop.name = document.getElementById("set-shop-name").value.trim();
        shop.ownerName = document.getElementById("set-owner-name").value.trim();
        shop.phone = document.getElementById("set-shop-phone").value.trim();
        shop.address = document.getElementById("set-shop-address").value.trim();
        
        saveDB(db);
        state.currentShop = shop;
        setupUIForRole('owner'); // Refresh header titles
        showNotification("Shop profile details updated successfully.", "success");
    }
}

// Staff Modal Controllers
function openAddStaffModal() {
    document.getElementById("add-staff-modal").classList.add("open");
}

function closeStaffModal() {
    document.getElementById("add-staff-modal").classList.remove("open");
}

function handleStaffSubmit(event) {
    event.preventDefault();
    const name = document.getElementById("staff-name").value.trim();
    const email = document.getElementById("staff-email").value.trim();
    const role = document.getElementById("staff-role").value;

    const db = getDB();
    const shopEmail = state.currentShop.email;

    if (db.staff.some(s => s.email.toLowerCase() === email.toLowerCase())) {
        showNotification("Email already assigned to a staff member.", "warning");
        return;
    }

    const newStaff = {
        name,
        email,
        role,
        joinDate: new Date().toISOString().split('T')[0],
        shopEmail: shopEmail
    };

    db.staff.push(newStaff);
    saveDB(db);

    closeStaffModal();
    renderStaffTable();
    showNotification(`Staff member ${name} added successfully!`, "success");
    
    // Clear inputs
    document.getElementById("staff-name").value = "";
    document.getElementById("staff-email").value = "";
}

function renderStaffTable() {
    const db = getDB();
    const tbody = document.getElementById("settings-staff-tbody");
    tbody.innerHTML = "";

    const shopEmail = state.currentShop.email;
    const shopStaff = db.staff.filter(s => s.shopEmail === shopEmail);

    if (shopStaff.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--text-muted);">No staff registered yet. Add staff above.</td></tr>`;
        return;
    }

    shopStaff.forEach((s, idx) => {
        let roleName = "Pharmacist";
        if (s.role === 'billing_clerk') roleName = "Billing Clerk";
        else if (s.role === 'inventory_manager') roleName = "Inventory Manager";

        tbody.innerHTML += `
            <tr>
                <td><strong>${s.name}</strong></td>
                <td>${s.email}</td>
                <td><span class="badge-status status-approved">${roleName}</span></td>
                <td>${s.joinDate}</td>
                <td>
                    <button class="btn btn-danger" onclick="removeStaffMember('${s.email}')" style="padding:0.25rem 0.5rem; font-size:0.75rem;">Remove</button>
                </td>
            </tr>
        `;
    });
}

function removeStaffMember(email) {
    if (confirm("Are you sure you want to remove this staff member?")) {
        const db = getDB();
        db.staff = db.staff.filter(s => s.email !== email);
        saveDB(db);
        renderStaffTable();
        showNotification("Staff member removed.", "info");
    }
}

// Subscription pricing card highlight sync
function renderSubscriptionTab() {
    const activeSub = state.currentShop.subscription;
    const db = getDB();
    
    const basePrice = db.globalSettings ? db.globalSettings.basePlanPrice : 29;
    const proPrice = db.globalSettings ? db.globalSettings.proPlanPrice : 59;
    const entPrice = db.globalSettings ? db.globalSettings.enterprisePlanPrice : 149;

    document.getElementById("settings-active-sub-title").textContent = `${activeSub} Plan ($${activeSub === 'Base' ? basePrice : (activeSub === 'Pro' ? proPrice : entPrice)}.00 / month)`;

    // Remove premium/popular highlights from settings plans
    document.querySelectorAll(".settings-sub-pane .pricing-card").forEach(c => {
        c.className = "card pricing-card";
        const btn = c.querySelector("button");
        btn.disabled = false;
        btn.style.opacity = "1";
        btn.style.cursor = "pointer";
        btn.textContent = c.id.includes("Base") ? "Downgrade to Base" : "Upgrade Plan";
    });

    const activeCard = document.getElementById(`sub-card-${activeSub}`);
    if (activeCard) {
        activeCard.className = "card pricing-card premium";
        const btn = activeCard.querySelector("button");
        btn.disabled = true;
        btn.style.opacity = "0.6";
        btn.style.cursor = "not-allowed";
        btn.textContent = "Current Plan";
    }
}

function updateSubscriptionTier(tier) {
    const db = getDB();
    const shop = db.shops.find(s => s.email === state.currentShop.email);

    if (shop) {
        shop.subscription = tier;
        saveDB(db);
        state.currentShop = shop;
        renderSubscriptionTab();
        showNotification(`SaaS subscription successfully updated to ${tier} Plan!`, "success");
    }
}

// ==========================================
// Central Oversight Dashboard (Admin Control)
// ==========================================

function switchCentralTab(tabId) {
    state.centralTab = tabId;

    document.querySelectorAll("#central-tab-approvals, #central-tab-analytics, #central-tab-health, #central-tab-settings").forEach(btn => {
        btn.classList.remove("active");
    });
    document.getElementById(`central-tab-${tabId}`).classList.add("active");

    document.querySelectorAll(".central-sub-pane").forEach(pane => {
        pane.style.display = "none";
    });
    document.getElementById(`central-pane-${tabId}`).style.display = "block";

    if (tabId === 'approvals') {
        renderCentralApprovals();
    } else if (tabId === 'analytics') {
        renderCentralAnalytics();
    } else if (tabId === 'settings') {
        renderCentralSettings();
    }
}

function renderCentralOversight() {
    switchCentralTab('approvals');
}

function renderCentralApprovals() {
    const db = getDB();
    const tbody = document.getElementById("central-verifications-tbody");
    tbody.innerHTML = "";

    db.shops.forEach(shop => {
        let statusBadge = "";
        let actionButtons = "";

        if (shop.status === 'pending') {
            statusBadge = `<span class="badge-status status-pending">Pending Audit</span>`;
            actionButtons = `
                <div style="display:flex; gap:0.25rem;">
                    <button class="btn btn-success" onclick="approveShop('${shop.email}')" style="padding:0.25rem 0.5rem; font-size:0.75rem;"><i class="fa-solid fa-check"></i> Approve</button>
                    <button class="btn btn-danger" onclick="rejectShop('${shop.email}')" style="padding:0.25rem 0.5rem; font-size:0.75rem;"><i class="fa-solid fa-xmark"></i> Reject</button>
                </div>
            `;
        } else if (shop.status === 'approved') {
            statusBadge = `<span class="badge-status status-approved">Approved</span>`;
            actionButtons = `<button class="btn btn-danger" onclick="rejectShop('${shop.email}')" style="padding:0.25rem 0.5rem; font-size:0.75rem;"><i class="fa-solid fa-ban"></i> Suspend</button>`;
        } else {
            statusBadge = `<span class="badge-status status-rejected">Rejected</span>`;
            actionButtons = `<button class="btn btn-success" onclick="approveShop('${shop.email}')" style="padding:0.25rem 0.5rem; font-size:0.75rem;"><i class="fa-solid fa-circle-check"></i> Re-Verify</button>`;
        }

        const docLinks = shop.docsUploaded.map(doc => `
            <a href="#" onclick="event.preventDefault(); showNotification('Auditing document: ${doc}', 'info')" style="font-size:0.75rem; color:var(--primary); text-decoration:none; margin-right:0.5rem;">
                <i class="fa-solid fa-file-pdf"></i> ${doc.split('_').pop()}
            </a>
        `).join("");

        tbody.innerHTML += `
            <tr>
                <td><strong>${shop.name}</strong></td>
                <td>
                    <div>${shop.ownerName}</div>
                    <div style="font-size:0.75rem; color:var(--text-muted);">${shop.email}</div>
                </td>
                <td style="font-family:monospace;">${shop.licenseId}</td>
                <td>
                    <div style="font-size:0.8rem;">PAN: ${shop.panId}</div>
                    <div style="font-size:0.8rem;">GST: ${shop.gstId}</div>
                </td>
                <td>${docLinks}</td>
                <td>${statusBadge}</td>
                <td>${actionButtons}</td>
            </tr>
        `;
    });
}

function approveShop(email) {
    const db = getDB();
    const shop = db.shops.find(s => s.email === email);
    if (shop) {
        shop.status = 'approved';
        saveDB(db);
        renderCentralApprovals();
        showNotification(`Shop ${shop.name} drug license approved! Login access enabled.`, "success");
    }
}

function rejectShop(email) {
    const db = getDB();
    const shop = db.shops.find(s => s.email === email);
    if (shop) {
        shop.status = 'rejected';
        saveDB(db);
        renderCentralApprovals();
        showNotification(`Shop ${shop.name} application rejected / suspended.`, "error");
    }
}

function renderCentralAnalytics() {
    const db = getDB();
    
    // Count stats
    const totalShops = db.shops.length;
    const activeCount = db.shops.filter(s => s.status === 'approved').length;
    document.getElementById("central-kpi-shops").textContent = `${activeCount} / ${totalShops} Active`;

    // Sum aggregate sales today
    const todayStr = "2026-06-14";
    const totalSalesToday = db.bills
        .filter(b => b.date.startsWith(todayStr))
        .reduce((sum, b) => sum + b.total, 0);
    document.getElementById("central-kpi-sales").textContent = `$${totalSalesToday.toFixed(2)}`;

    // Monthly SaaS subscription estimate
    const basePrice = db.globalSettings ? db.globalSettings.basePlanPrice : 29;
    const proPrice = db.globalSettings ? db.globalSettings.proPlanPrice : 59;
    const entPrice = db.globalSettings ? db.globalSettings.enterprisePlanPrice : 149;

    let totalSaaSRev = 0;
    let baseCount = 0, proCount = 0, entCount = 0;

    db.shops.filter(s => s.status === 'approved').forEach(s => {
        if (s.subscription === 'Base') {
            totalSaaSRev += basePrice;
            baseCount++;
        } else if (s.subscription === 'Pro') {
            totalSaaSRev += proPrice;
            proCount++;
        } else {
            totalSaaSRev += entPrice;
            entCount++;
        }
    });

    document.getElementById("central-kpi-saas").textContent = `$${totalSaaSRev.toFixed(2)}/mo`;

    // Render Pie/Doughnut SaaS Subscription Distribution Chart
    const subCtx = document.getElementById('centralSaaSDistributionChart');
    if (subCtx) {
        if (chartInstances['saasDist']) chartInstances['saasDist'].destroy();

        chartInstances['saasDist'] = new Chart(subCtx, {
            type: 'doughnut',
            data: {
                labels: ['Base Tier', 'Pro Tier', 'Enterprise'],
                datasets: [{
                    data: [baseCount, proCount, entCount],
                    backgroundColor: ['#64748b', '#06b6d4', '#8b5cf6'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: { color: '#9ca3af', boxWidth: 12 }
                    }
                }
            }
        });
    }

    // Top Performing Shops Table
    const shopTbody = document.getElementById("central-top-shops-tbody");
    shopTbody.innerHTML = "";

    // Calculate sales today per shop
    const shopPerform = db.shops.map(shop => {
        const salesSum = db.bills
            .filter(b => b.shopEmail === shop.email && b.date.startsWith(todayStr))
            .reduce((s,b) => s + b.total, 0);
        return { name: shop.name, plan: shop.subscription, sales: salesSum };
    }).sort((a,b) => b.sales - a.sales);

    shopPerform.forEach(sp => {
        shopTbody.innerHTML += `
            <tr>
                <td><strong>${sp.name}</strong></td>
                <td>${sp.plan}</td>
                <td><strong>$${sp.sales.toFixed(2)}</strong></td>
            </tr>
        `;
    });
}

function renderCentralSettings() {
    const db = getDB();
    if (!db.globalSettings) {
        db.globalSettings = DEFAULT_DATABASE.globalSettings;
    }
    
    document.getElementById("cset-base-price").value = db.globalSettings.basePlanPrice;
    document.getElementById("cset-pro-price").value = db.globalSettings.proPlanPrice;
    document.getElementById("cset-ent-price").value = db.globalSettings.enterprisePlanPrice;
    document.getElementById("cset-days-red").value = db.globalSettings.redAlertDays || 30;
    document.getElementById("cset-days-orange").value = db.globalSettings.orangeAlertDays || 90;
}

function handleCentralSettingsSubmit(event) {
    event.preventDefault();
    const db = getDB();

    db.globalSettings = {
        basePlanPrice: parseFloat(document.getElementById("cset-base-price").value),
        proPlanPrice: parseFloat(document.getElementById("cset-pro-price").value),
        enterprisePlanPrice: parseFloat(document.getElementById("cset-ent-price").value),
        redAlertDays: parseInt(document.getElementById("cset-days-red").value),
        orangeAlertDays: parseInt(document.getElementById("cset-days-orange").value)
    };

    saveDB(db);
    showNotification("Global platform SaaS pricing rules updated successfully.", "success");
}

// ==========================================
// local GenAI State-Aware Assistant Widget
// ==========================================

function toggleAICopilot() {
    const panel = document.getElementById("ai-copilot-panel");
    panel.classList.toggle("open");
    
    // Remove pulsing once opened
    const bubble = document.getElementById("ai-copilot-bubble");
    bubble.classList.remove("pulsing");
}

// Simulated queries click chip
function triggerAISkipQuery(text) {
    document.getElementById("ai-input-text").value = text;
    const form = document.querySelector(".ai-input-area");
    // Simulate form submit
    const event = { preventDefault: () => {} };
    handleAICopilotSubmit(event);
}

function handleAICopilotSubmit(event) {
    event.preventDefault();
    const input = document.getElementById("ai-input-text");
    const query = input.value.trim();
    if (!query) return;

    appendAIMessage(query, "user");
    input.value = "";

    // Simulated Smart State query evaluation
    setTimeout(() => {
        const response = evaluateLocalStateAIAnswer(query);
        appendAIMessage(response, "bot");
    }, 550);
}

function appendAIMessage(text, sender) {
    const container = document.getElementById("ai-messages-container");
    container.innerHTML += `
        <div class="ai-msg ${sender}">
            ${text}
        </div>
    `;
    container.scrollTop = container.scrollHeight;
}

function evaluateLocalStateAIAnswer(query) {
    const q = query.toLowerCase();
    const db = getDB();
    const shopEmail = state.currentShop ? state.currentShop.email : "owner@citypharma.com";
    const shopBatches = db.batches.filter(b => b.shopEmail === shopEmail);
    const shopBills = db.bills.filter(b => b.shopEmail === shopEmail);
    const today = new Date("2026-06-14");

    // 1. Next Expirations
    if (q.includes("expire") || q.includes("expiry")) {
        const activeNear = shopBatches.filter(b => b.quantity > 0 && new Date(b.expiryDate) > today);
        const sorted = [...activeNear].sort((a,b) => new Date(a.expiryDate) - new Date(b.expiryDate));
        
        if (sorted.length === 0) {
            return "You have no active in-stock batches with valid shelf lives.";
        }
        
        const first = sorted[0];
        const med = db.medicines.find(m => m.id === first.medId);
        const daysLeft = Math.ceil((new Date(first.expiryDate) - today) / (1000 * 60 * 60 * 24));
        
        let response = `Your batch closest to expiry is <strong>Batch ID ${first.id}</strong> of <strong>${med ? med.name : 'Unknown Medicine'}</strong>. Expiry Date: ${first.expiryDate} (only <strong>${daysLeft} days remaining</strong>). Shelf capacity left: ${first.quantity} units.`;
        
        if (sorted.length > 1) {
            const second = sorted[1];
            const med2 = db.medicines.find(m => m.id === second.medId);
            response += `<br><br>Second closest: Batch ${second.id} of ${med2 ? med2.name : 'Unknown'} expiring ${second.expiryDate}.`;
        }
        return response;
    }

    // 2. Total stock value
    if (q.includes("value") || q.includes("worth") || q.includes("cost")) {
        const totalCost = shopBatches
            .filter(b => b.quantity > 0)
            .reduce((sum, b) => sum + (b.quantity * b.costPrice), 0);
        
        const totalRetail = shopBatches
            .filter(b => b.quantity > 0)
            .reduce((sum, b) => sum + (b.quantity * b.retailPrice), 0);

        return `Your total active inventory valuation:<br>• <strong>Cost Value:</strong> $${totalCost.toFixed(2)} (Purchase Investment)<br>• <strong>Retail Value:</strong> $${totalRetail.toFixed(2)} (Potential Revenue)`;
    }

    // 3. Dead Stock query
    if (q.includes("dead") || q.includes("unsold") || q.includes("slow")) {
        const limitDate = new Date(today);
        limitDate.setDate(limitDate.getDate() - 30);
        
        const deadBatches = shopBatches.filter(batch => {
            if (batch.quantity <= 0) return false;
            
            const soldRecently = db.bills.some(bill => {
                if (bill.shopEmail !== shopEmail) return false;
                return new Date(bill.date) >= limitDate && bill.items.some(item => item.batchId === batch.id);
            });
            return !soldRecently;
        });

        if (deadBatches.length === 0) {
            return "Good news! All of your active medicine stock batches have recorded sales transactions within the last 30 days.";
        }

        let response = `We flagged <strong>${deadBatches.length} dead stock items</strong> (no sales in 30 days):`;
        deadBatches.slice(0, 3).forEach(b => {
            const med = db.medicines.find(m => m.id === b.medId);
            response += `<br>• ${med ? med.name : 'Unknown'} [Batch: ${b.id}] - Qty: ${b.quantity}`;
        });
        return response;
    }

    // 4. Today's sales query
    if (q.includes("sale") || q.includes("today") || q.includes("revenue")) {
        const todayStr = "2026-06-14";
        const todayBills = shopBills.filter(b => b.date.startsWith(todayStr));
        const todaySum = todayBills.reduce((sum, b) => sum + b.total, 0);
        
        return `Your pharmacy has processed <strong>${todayBills.length} sales receipts</strong> today, generating <strong>$${todaySum.toFixed(2)}</strong> in gross retail revenue.`;
    }

    // Help Fallback
    return `I am here to audit pharmacy data. Try asking:<br>
    - "What is my total stock value?"<br>
    - "Which medicines expire next?"<br>
    - "Check dead stock items"<br>
    - "Calculate today's sales"`;
}

// ==========================================
// Initialization on Document Load
// ==========================================

window.addEventListener("DOMContentLoaded", () => {
    // Seed DB if necessary
    getDB();
    
    // Check local storage for session (default guest/public role)
    setupUIForRole('public');
    navigateTo('landing');
    
    // Quick initialize file upload listener mock
    renderMockUploadedFiles();
});
