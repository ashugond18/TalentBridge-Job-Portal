/* ================================================================
   TalentBridge — script.js
   Particle canvas · Job data · Filtering · Resume matching · Tracker
   ================================================================ */
"use strict";

/* ================================================================
   CANVAS BACKGROUND — Constellation particles
   ================================================================ */
(function initCanvas() {
  const canvas = document.getElementById("bgCanvas");
  const ctx = canvas.getContext("2d");
  let W, H, particles = [], mouse = { x: -999, y: -999 };
  const COUNT = 90;
  const MAX_DIST = 140;
  const COLORS = ["#5ee7df", "#b490f5", "#f093fb", "#60a5fa"];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function rand(a, b) { return a + Math.random() * (b - a); }

  function initParticles() {
    particles = [];
    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: rand(0, W), y: rand(0, H),
        vx: rand(-0.25, 0.25), vy: rand(-0.25, 0.25),
        r: rand(1.2, 2.6),
        color: COLORS[Math.floor(rand(0, COLORS.length))],
        alpha: rand(0.3, 0.8)
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Lines between close particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < MAX_DIST) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          const a = (1 - d / MAX_DIST) * 0.18;
          ctx.strokeStyle = `rgba(94,231,223,${a})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
      // Mouse attraction lines
      const dx = particles[i].x - mouse.x;
      const dy = particles[i].y - mouse.y;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < 200) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(mouse.x, mouse.y);
        const a = (1 - d / 200) * 0.35;
        ctx.strokeStyle = `rgba(180,144,245,${a})`;
        ctx.lineWidth = 0.9;
        ctx.stroke();
      }
    }

    // Draw particles
    particles.forEach(p => {
      // Subtle glow
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
      g.addColorStop(0, p.color + "88");
      g.addColorStop(1, p.color + "00");
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();

      // Core dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
      ctx.globalAlpha = 1;

      // Move
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", () => { resize(); initParticles(); });
  window.addEventListener("mousemove", e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener("mouseleave", () => { mouse.x = -999; mouse.y = -999; });
  resize(); initParticles(); draw();
})();

/* ================================================================
   JOB DATA
   ================================================================ */
const JOBS = [
  {
    id: 1, title: "Senior Frontend Developer", company: "Stripe",
    logo: "💳", location: "San Francisco, CA", type: "Full-time",
    category: "Engineering", salary: "$140k – $180k",
    posted: "2025-05-20", isNew: true, isRemote: false,
    description: "Join Stripe's product engineering team to build next-generation payment interfaces. You'll work on high-traffic React applications used by millions of businesses worldwide, collaborate with designers and backend engineers, and ship features that directly impact revenue for our customers.",
    skills: ["React", "TypeScript", "CSS", "GraphQL", "Jest", "Figma", "Webpack"]
  },
  {
    id: 2, title: "Product Designer (UX/UI)", company: "Figma",
    logo: "🎨", location: "Remote", type: "Remote",
    category: "Design", salary: "$120k – $160k",
    posted: "2025-05-18", isNew: true, isRemote: true,
    description: "Figma is hiring a Product Designer to shape the future of collaborative design tools. You'll own end-to-end design for key product areas, from discovery and wireframing to high-fidelity prototypes and shipped features. Strong systems thinking and a portfolio of shipped work required.",
    skills: ["Figma", "UX Research", "Prototyping", "Design Systems", "User Testing", "Sketch"]
  },
  {
    id: 3, title: "Data Scientist", company: "Airbnb",
    logo: "🏠", location: "New York, NY", type: "Full-time",
    category: "Data & Analytics", salary: "$130k – $170k",
    posted: "2025-05-15", isNew: false, isRemote: false,
    description: "Airbnb's Data Science team is looking for a Data Scientist to support Trust & Safety and Pricing teams. You will develop statistical models, run A/B experiments, and communicate insights to leadership. Experience with Python, SQL, and experimentation at scale is required.",
    skills: ["Python", "SQL", "Machine Learning", "Statistics", "Spark", "Tableau", "R"]
  },
  {
    id: 4, title: "Backend Engineer (Node.js)", company: "Notion",
    logo: "📝", location: "Remote", type: "Remote",
    category: "Engineering", salary: "$125k – $165k",
    posted: "2025-05-14", isNew: false, isRemote: true,
    description: "Notion is building the world's most versatile workspace. We're looking for a Backend Engineer to scale our core APIs, improve database performance, and ship real-time collaboration features. You'll work in a small, high-ownership team where your code will impact millions of users.",
    skills: ["Node.js", "TypeScript", "PostgreSQL", "Redis", "REST APIs", "Docker", "AWS"]
  },
  {
    id: 5, title: "Growth Marketing Manager", company: "HubSpot",
    logo: "📣", location: "Boston, MA", type: "Full-time",
    category: "Marketing", salary: "$95k – $130k",
    posted: "2025-05-13", isNew: false, isRemote: false,
    description: "HubSpot is hiring a Growth Marketing Manager to drive acquisition for our SMB segment. You'll own paid channels, SEO strategy, landing page optimization, and collaborate with content and product to improve conversion. Strong analytical and A/B testing skills required.",
    skills: ["SEO", "Google Ads", "Analytics", "A/B Testing", "HubSpot", "Content Strategy", "SQL"]
  },
  {
    id: 6, title: "iOS Engineer", company: "Spotify",
    logo: "🎵", location: "Stockholm, Sweden", type: "Full-time",
    category: "Engineering", salary: "€100k – €140k",
    posted: "2025-05-12", isNew: false, isRemote: false,
    description: "Spotify's Mobile team is looking for an iOS Engineer to build the audio experiences enjoyed by over 600 million users. You'll work on the iOS app's core playback engine, home feed, and social features. Experience with Swift, UIKit, and Combine is essential.",
    skills: ["Swift", "Xcode", "UIKit", "SwiftUI", "Combine", "CoreData", "REST APIs"]
  },
  {
    id: 7, title: "DevOps / Cloud Engineer", company: "Cloudflare",
    logo: "☁️", location: "Austin, TX", type: "Full-time",
    category: "Engineering", salary: "$135k – $175k",
    posted: "2025-05-11", isNew: false, isRemote: false,
    description: "Cloudflare is building a faster, safer internet. We need a DevOps Engineer to manage infrastructure for our global edge network, automate deployments, and ensure 99.99% uptime. Deep expertise in Kubernetes, Terraform, and CI/CD pipelines is required.",
    skills: ["Kubernetes", "Terraform", "Docker", "AWS", "GCP", "CI/CD", "Python", "Linux"]
  },
  {
    id: 8, title: "Financial Analyst", company: "Goldman Sachs",
    logo: "📊", location: "New York, NY", type: "Full-time",
    category: "Finance", salary: "$110k – $145k",
    posted: "2025-05-10", isNew: false, isRemote: false,
    description: "Goldman Sachs Investment Banking Division is seeking a Financial Analyst to support M&A and capital markets transactions. You will build financial models, prepare pitch books, conduct industry research, and work directly with senior bankers and clients.",
    skills: ["Excel", "Financial Modeling", "PowerPoint", "SQL", "Bloomberg", "Valuation", "DCF"]
  },
  {
    id: 9, title: "Machine Learning Engineer", company: "OpenAI",
    logo: "🤖", location: "San Francisco, CA", type: "Full-time",
    category: "Data & Analytics", salary: "$160k – $250k",
    posted: "2025-05-09", isNew: false, isRemote: false,
    description: "OpenAI is seeking ML Engineers to train and deploy large-scale AI models. You will work on model architecture, training infrastructure, RLHF pipelines, and production serving. Deep knowledge of PyTorch and distributed training is required.",
    skills: ["Python", "PyTorch", "Machine Learning", "CUDA", "Distributed Systems", "MLflow", "AWS"]
  },
  {
    id: 10, title: "UX Researcher", company: "Google",
    logo: "🔍", location: "Mountain View, CA", type: "Full-time",
    category: "Design", salary: "$125k – $170k",
    posted: "2025-05-08", isNew: false, isRemote: false,
    description: "Google's UXR team partners with product teams across Search, Maps, and Assistant. We're looking for a UX Researcher to plan and conduct qualitative and quantitative research studies, synthesize insights, and influence product roadmaps at scale.",
    skills: ["UX Research", "User Testing", "Figma", "Qualtrics", "Data Analysis", "Statistics", "Interviewing"]
  },
  {
    id: 11, title: "Content Marketing Specialist", company: "Buffer",
    logo: "✍️", location: "Remote", type: "Remote",
    category: "Marketing", salary: "$70k – $95k",
    posted: "2025-05-07", isNew: false, isRemote: true,
    description: "Buffer is a fully remote, transparent company building social media tools. We need a Content Marketing Specialist to write blog posts, newsletters, and case studies that attract and convert our target audience. SEO knowledge and exceptional writing skills required.",
    skills: ["Content Writing", "SEO", "WordPress", "Google Analytics", "Social Media", "Copywriting"]
  },
  {
    id: 12, title: "Android Developer", company: "Duolingo",
    logo: "🦜", location: "Pittsburgh, PA", type: "Full-time",
    category: "Engineering", salary: "$115k – $150k",
    posted: "2025-05-06", isNew: false, isRemote: false,
    description: "Duolingo's Android team is building the world's most-downloaded education app. We're looking for an Android Developer to improve app performance, ship new learning features, and collaborate with product and design teams on delightful user experiences.",
    skills: ["Kotlin", "Android SDK", "Jetpack Compose", "REST APIs", "Git", "MVVM", "Coroutines"]
  },
  {
    id: 13, title: "Product Manager – Platform", company: "Shopify",
    logo: "🛒", location: "Ottawa, Canada", type: "Full-time",
    category: "Product", salary: "CA$130k – CA$170k",
    posted: "2025-05-05", isNew: false, isRemote: false,
    description: "Shopify is looking for a Product Manager for its Platform team to define the roadmap for developer tools and APIs. You'll work with engineering, design, and merchant success teams to ship features that empower 1M+ developers building on Shopify.",
    skills: ["Product Management", "APIs", "Agile", "SQL", "User Research", "Roadmapping", "JIRA"]
  },
  {
    id: 14, title: "Cybersecurity Analyst", company: "CrowdStrike",
    logo: "🛡️", location: "Remote", type: "Remote",
    category: "Engineering", salary: "$105k – $140k",
    posted: "2025-05-04", isNew: false, isRemote: true,
    description: "CrowdStrike is hiring a Cybersecurity Analyst to detect and respond to threats across our clients' endpoints. You'll analyze threat intelligence, conduct incident response, and develop detection signatures. CISSP or equivalent experience preferred.",
    skills: ["Threat Analysis", "SIEM", "Python", "Linux", "Incident Response", "Network Security", "OSINT"]
  },
  {
    id: 15, title: "Software Engineering Intern", company: "Microsoft",
    logo: "🪟", location: "Redmond, WA", type: "Internship",
    category: "Engineering", salary: "$40/hr",
    posted: "2025-05-03", isNew: false, isRemote: false,
    description: "Microsoft's internship program gives students hands-on experience shipping real features on Azure, GitHub, and Microsoft 365. Interns work in small teams with a dedicated mentor and present their work to leadership at the end of the term.",
    skills: ["JavaScript", "Python", "C#", "Git", "Azure", "REST APIs", "Algorithms"]
  },
  {
    id: 16, title: "Brand Designer", company: "Canva",
    logo: "🖼️", location: "Sydney, Australia", type: "Full-time",
    category: "Design", salary: "AU$110k – AU$145k",
    posted: "2025-05-02", isNew: false, isRemote: false,
    description: "Canva's Brand team shapes how we present ourselves across campaigns, events, and social media. We're looking for a Brand Designer who can concept and craft stunning visual campaigns, maintain our brand system, and collaborate with marketing and comms.",
    skills: ["Figma", "Illustrator", "Photoshop", "Motion Design", "Brand Strategy", "Typography"]
  }
];

/* ================================================================
   CATEGORIES
   ================================================================ */
const CATEGORIES = [
  { name: "Engineering",      icon: "💻" },
  { name: "Design",           icon: "🎨" },
  { name: "Marketing",        icon: "📣" },
  { name: "Data & Analytics", icon: "📊" },
  { name: "Finance",          icon: "💰" },
  { name: "Product",          icon: "🗺️" }
];

/* ================================================================
   APP STATE
   ================================================================ */
let applications = [];
let currentFilter = "all";
let userSkills = [];

/* ================================================================
   INIT
   ================================================================ */
document.addEventListener("DOMContentLoaded", () => {
  loadApplications();
  renderCategories();
  renderFeaturedJobs();
  renderJobsGrid(JOBS);
  populateCategoryFilter();
  populateJobSelect();
  updateNavBadge();
  setupHamburger();
  document.getElementById("totalJobs").textContent = JOBS.length;
});

/* ================================================================
   NAVIGATION
   ================================================================ */
function showSection(id) {
  document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  document.querySelectorAll(".nav-link").forEach(l => l.classList.toggle("active", l.dataset.section === id));
  document.getElementById("navLinks").classList.remove("open");
  document.getElementById("hamburger").classList.remove("open");
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (id === "tracker") renderTracker();
}

function setupHamburger() {
  const btn = document.getElementById("hamburger");
  btn.addEventListener("click", () => {
    btn.classList.toggle("open");
    document.getElementById("navLinks").classList.toggle("open");
  });
}

/* ================================================================
   CATEGORIES GRID
   ================================================================ */
function renderCategories() {
  const el = document.getElementById("categoriesGrid");
  el.innerHTML = CATEGORIES.map(cat => {
    const count = JOBS.filter(j => j.category === cat.name).length;
    return `
      <div class="category-card" onclick="filterByCategory('${cat.name}')">
        <span class="cat-icon">${cat.icon}</span>
        <div class="cat-name">${cat.name}</div>
        <div class="cat-count">${count} open role${count !== 1 ? "s" : ""}</div>
      </div>`;
  }).join("");
}

/* ================================================================
   FEATURED JOBS
   ================================================================ */
function renderFeaturedJobs() {
  document.getElementById("featuredJobs").innerHTML =
    JOBS.slice(0, 6).map(j => buildJobCard(j, [])).join("");
}

/* ================================================================
   JOB CARD
   ================================================================ */
function buildJobCard(job, matchedSkills) {
  const applied = isApplied(job.id);
  const badgeCls = getBadgeClass(job.type);

  const score = matchedSkills.length > 0
    ? Math.round(
        job.skills.filter(sk => matchedSkills.some(u =>
          u.toLowerCase() === sk.toLowerCase() ||
          sk.toLowerCase().includes(u.toLowerCase()) ||
          u.toLowerCase().includes(sk.toLowerCase())
        )).length / job.skills.length * 100
      )
    : null;

  const skillsHtml = job.skills.slice(0, 4).map(skill => {
    if (matchedSkills.length === 0) return `<span class="skill-tag">${skill}</span>`;
    const m = matchedSkills.some(u =>
      u.toLowerCase() === skill.toLowerCase() ||
      skill.toLowerCase().includes(u.toLowerCase()) ||
      u.toLowerCase().includes(skill.toLowerCase())
    );
    return `<span class="skill-tag ${m ? "matched" : "missing"}">${skill}</span>`;
  }).join("") + (job.skills.length > 4 ? `<span class="skill-tag">+${job.skills.length - 4}</span>` : "");

  const matchPill = score !== null
    ? `<span class="match-score-pill ${score >= 70 ? "high" : score >= 40 ? "mid" : "low"}">🎯 ${score}%</span>`
    : "";

  return `
    <div class="job-card" onclick="openJobModal(${job.id})">
      <div class="job-card-top">
        <div class="job-logo">${job.logo}</div>
        <div class="job-info">
          <div class="job-title">${job.title}</div>
          <div class="job-company">${job.company}</div>
        </div>
        ${matchPill}
      </div>
      <div class="job-meta">
        <span class="job-location">📍 ${job.location}</span>
        <span class="badge ${badgeCls}">${job.type}</span>
        ${job.isNew ? '<span class="badge badge-new">New</span>' : ""}
      </div>
      <div class="job-salary">${job.salary}</div>
      <div class="job-skills">${skillsHtml}</div>
      <div class="job-card-footer">
        <span class="job-date">Posted ${formatDate(job.posted)}</span>
        <div class="card-actions">
          <button class="btn-view" onclick="event.stopPropagation();openJobModal(${job.id})">Details</button>
          <button class="btn-apply ${applied ? "applied" : ""}"
            onclick="event.stopPropagation();applyToJob(${job.id})">
            ${applied ? "✓ Applied" : "Apply Now"}
          </button>
        </div>
      </div>
    </div>`;
}

function getBadgeClass(type) {
  return { "Full-time":"badge-fulltime", "Part-time":"badge-intern",
           "Contract":"badge-contract", "Remote":"badge-remote",
           "Internship":"badge-intern" }[type] || "badge-fulltime";
}

/* ================================================================
   JOBS GRID + FILTER
   ================================================================ */
function renderJobsGrid(jobs) {
  const grid = document.getElementById("jobsGrid");
  const count = document.getElementById("resultsCount");
  const none  = document.getElementById("noResults");
  count.textContent = `${jobs.length} role${jobs.length !== 1 ? "s" : ""} found`;
  if (jobs.length === 0) {
    grid.innerHTML = ""; none.classList.remove("hidden");
  } else {
    none.classList.add("hidden");
    grid.innerHTML = jobs.map(j => buildJobCard(j, userSkills)).join("");
  }
}

function filterJobs() {
  const q   = document.getElementById("searchInput").value.toLowerCase();
  const cat = document.getElementById("categoryFilter").value;
  const typ = document.getElementById("typeFilter").value;
  const res = JOBS.filter(job => {
    const mQ = !q || job.title.toLowerCase().includes(q) ||
               job.company.toLowerCase().includes(q) ||
               job.location.toLowerCase().includes(q) ||
               job.skills.some(s => s.toLowerCase().includes(q));
    const mC = !cat || job.category === cat;
    const mT = !typ || job.type === typ;
    return mQ && mC && mT;
  });
  renderJobsGrid(res);
}

function populateCategoryFilter() {
  const sel = document.getElementById("categoryFilter");
  CATEGORIES.forEach(c => {
    const o = document.createElement("option");
    o.value = c.name; o.textContent = c.name; sel.appendChild(o);
  });
}

function filterByCategory(cat) {
  showSection("jobs");
  setTimeout(() => { document.getElementById("categoryFilter").value = cat; filterJobs(); }, 60);
}

function doHeroSearch() {
  const q = document.getElementById("heroSearch").value;
  showSection("jobs");
  setTimeout(() => { document.getElementById("searchInput").value = q; filterJobs(); }, 60);
}
function tagSearch(tag) {
  showSection("jobs");
  setTimeout(() => { document.getElementById("searchInput").value = tag; filterJobs(); }, 60);
}

/* ================================================================
   JOB DETAIL MODAL
   ================================================================ */
function openJobModal(jobId) {
  const job = JOBS.find(j => j.id === jobId);
  if (!job) return;
  const applied = isApplied(job.id);

  const skillsHtml = job.skills.map(s => {
    const m = userSkills.length > 0 && userSkills.some(u =>
      u.toLowerCase() === s.toLowerCase() ||
      s.toLowerCase().includes(u.toLowerCase()) ||
      u.toLowerCase().includes(s.toLowerCase())
    );
    return `<span class="skill-tag ${userSkills.length > 0 ? (m ? "matched" : "missing") : ""}">${s}</span>`;
  }).join("");

  document.getElementById("jobModalContent").innerHTML = `
    <button class="modal-close" onclick="closeModal()">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
    </button>
    <div class="modal-header">
      <div class="modal-logo">${job.logo}</div>
      <div>
        <div class="modal-title">${job.title}</div>
        <div class="modal-company">${job.company} · ${job.location}</div>
        <div class="modal-badges">
          <span class="badge ${getBadgeClass(job.type)}">${job.type}</span>
          ${job.isNew    ? '<span class="badge badge-new">✨ New</span>'    : ""}
          ${job.isRemote ? '<span class="badge badge-remote">🌍 Remote</span>' : ""}
        </div>
      </div>
    </div>
    <div class="modal-section">
      <h4>Compensation</h4>
      <div class="modal-salary">${job.salary}</div>
    </div>
    <div class="modal-section">
      <h4>About the Role</h4>
      <p>${job.description}</p>
    </div>
    <div class="modal-section">
      <h4>Required Skills</h4>
      <div class="modal-skills">${skillsHtml}</div>
      ${userSkills.length > 0 ? "<p style='font-size:12px;color:var(--text3);margin-top:10px;'>🟢 Matched &nbsp; 🔴 Missing from your resume</p>" : ""}
    </div>
    <div class="modal-section">
      <h4>Date Posted</h4>
      <p>${formatDate(job.posted)}</p>
    </div>
    <div class="modal-footer">
      <button class="btn-primary ${applied ? "applied" : ""}"
        id="modalApplyBtn"
        onclick="applyToJob(${job.id}); document.getElementById('modalApplyBtn').textContent='✓ Applied'; document.getElementById('modalApplyBtn').disabled=true;"
        ${applied ? "disabled" : ""}>
        ${applied ? "✓ Already Applied" : "Apply Now"}
      </button>
      <button class="btn-secondary" onclick="closeModal()">Close</button>
    </div>`;

  document.getElementById("jobModal").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  document.getElementById("jobModal").classList.remove("open");
  document.body.style.overflow = "";
}
document.getElementById("jobModal").addEventListener("click", e => {
  if (e.target === document.getElementById("jobModal")) closeModal();
});

/* ================================================================
   RESUME MATCHING
   ================================================================ */
function switchResumeTab(tab, btn) {
  document.querySelectorAll(".rtab").forEach(b => b.classList.remove("active"));
  document.querySelectorAll(".resume-tab-content").forEach(c => c.classList.remove("active"));
  btn.classList.add("active");
  document.getElementById(tab + "Tab").classList.add("active");
}

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const text = e.target.result;
    document.getElementById("filePreview").textContent = text.slice(0, 500) + (text.length > 500 ? "…" : "");
    document.getElementById("filePreview").classList.remove("hidden");
    document.getElementById("skillsInput").value = text;
    showToast("📄", "File loaded successfully!");
  };
  reader.readAsText(file);
}

function populateJobSelect() {
  const sel = document.getElementById("targetJobSelect");
  JOBS.forEach(job => {
    const o = document.createElement("option");
    o.value = job.id;
    o.textContent = `${job.title} — ${job.company}`;
    sel.appendChild(o);
  });
}

function runMatch() {
  const raw = document.getElementById("skillsInput").value;
  if (!raw.trim()) { showToast("⚠️", "Please enter your skills first."); return; }

  userSkills = raw.split(/[,\n;]+/).map(s => s.trim()).filter(s => s.length > 1);

  const targetId = parseInt(document.getElementById("targetJobSelect").value);
  const jobs = targetId ? JOBS.filter(j => j.id === targetId) : JOBS;

  const scored = jobs.map(job => {
    const matched = job.skills.filter(sk =>
      userSkills.some(u =>
        u.toLowerCase() === sk.toLowerCase() ||
        sk.toLowerCase().includes(u.toLowerCase()) ||
        u.toLowerCase().includes(sk.toLowerCase())
      )
    );
    const missing = job.skills.filter(sk => !matched.includes(sk));
    const pct = Math.round((matched.length / job.skills.length) * 100);
    return { job, matched, missing, pct };
  }).sort((a, b) => b.pct - a.pct);

  const panel = document.getElementById("resumeResults");
  panel.innerHTML = scored.map(({ job, matched, missing, pct }, i) => {
    const cls = pct >= 70 ? "high" : pct >= 40 ? "mid" : "low";
    return `
      <div class="match-card" style="animation-delay:${i * 0.06}s">
        <div class="match-card-header">
          <div class="match-logo">${job.logo}</div>
          <div class="match-info">
            <div class="match-title">${job.title}</div>
            <div class="match-company">${job.company} · ${job.location}</div>
          </div>
          <div class="match-score-wrap">
            <div class="match-pct ${cls}">${pct}%</div>
            <div class="match-label">match score</div>
          </div>
        </div>
        <div class="match-bar-track">
          <div class="match-bar-fill ${cls}" style="width:0" data-width="${pct}"></div>
        </div>
        <div class="match-skills-row">
          <div class="match-skills-col">
            <h5>✅ Matched (${matched.length})</h5>
            ${matched.length
              ? matched.map(s => `<span class="skill-tag matched">${s}</span>`).join("")
              : `<span style="color:var(--text3);font-size:13px;">None matched</span>`}
          </div>
          <div class="match-skills-col">
            <h5>⛔ Missing (${missing.length})</h5>
            ${missing.length
              ? missing.map(s => `<span class="skill-tag missing">${s}</span>`).join("")
              : `<span style="color:var(--green);font-size:13px;">All skills matched! 🎉</span>`}
          </div>
        </div>
        <div class="match-card-actions">
          <button class="btn-primary" style="font-size:13px;padding:10px 20px;"
            onclick="applyToJob(${job.id})">Apply Now</button>
          <button class="btn-secondary" style="font-size:13px;padding:10px 18px;"
            onclick="openJobModal(${job.id})">View Details</button>
        </div>
      </div>`;
  }).join("");

  // Animate bars after paint
  setTimeout(() => {
    document.querySelectorAll(".match-bar-fill[data-width]").forEach(el => {
      el.style.width = el.dataset.width + "%";
    });
  }, 80);

  renderJobsGrid(JOBS);
  showToast("🎯", `Analyzed ${scored.length} role${scored.length !== 1 ? "s" : ""}!`);
}

/* ================================================================
   APPLY
   ================================================================ */
function applyToJob(jobId) {
  const job = JOBS.find(j => j.id === jobId);
  if (!job) return;
  if (isApplied(jobId)) { showToast("ℹ️", "Already applied to this job."); return; }
  applications.push({
    id: Date.now(), jobId: job.id,
    title: job.title, company: job.company,
    logo: job.logo, location: job.location, salary: job.salary,
    dateApplied: new Date().toISOString().split("T")[0],
    status: "Applied"
  });
  saveApplications(); updateNavBadge();
  renderJobsGrid(JOBS); renderFeaturedJobs();
  showToast("🎉", `Applied to ${job.title} at ${job.company}!`);
}

function isApplied(jobId) {
  return applications.some(a => a.jobId === jobId);
}

/* ================================================================
   TRACKER
   ================================================================ */
function renderTracker(filter) {
  filter = filter || currentFilter;
  const container = document.getElementById("applicationsContainer");
  const empty     = document.getElementById("emptyTracker");
  renderTrackerStats();
  if (applications.length === 0) { container.innerHTML = ""; empty.classList.remove("hidden"); return; }
  empty.classList.add("hidden");
  const filtered = filter === "all" ? applications : applications.filter(a => a.status === filter);
  if (filtered.length === 0) {
    container.innerHTML = `<p style="color:var(--text2);padding:40px 0;text-align:center;">No <strong>${filter}</strong> applications yet.</p>`;
    return;
  }
  container.innerHTML = filtered.map((app, i) => `
    <div class="app-card" style="animation-delay:${i * 0.05}s">
      <div class="app-logo">${app.logo}</div>
      <div class="app-info">
        <div class="app-title">${app.title}</div>
        <div class="app-company">${app.company} · ${app.location}</div>
        <div class="app-date">Applied ${formatDate(app.dateApplied)}</div>
      </div>
      <div class="app-controls">
        <select class="status-select ${app.status}" onchange="updateStatus(${app.id}, this.value)">
          <option value="Applied"     ${app.status==="Applied"     ?"selected":""}>Applied</option>
          <option value="Shortlisted" ${app.status==="Shortlisted" ?"selected":""}>Shortlisted</option>
          <option value="Interview"   ${app.status==="Interview"   ?"selected":""}>Interview</option>
          <option value="Rejected"    ${app.status==="Rejected"    ?"selected":""}>Rejected</option>
        </select>
        <button class="btn-delete" onclick="deleteApplication(${app.id})">Remove</button>
      </div>
    </div>`).join("");
}

function renderTrackerStats() {
  const total = applications.length;
  const stats = ["Applied","Shortlisted","Interview","Rejected"].reduce((a,s) => {
    a[s] = applications.filter(x => x.status === s).length; return a;
  }, {});
  document.getElementById("trackerStats").innerHTML = `
    <div class="t-stat"><strong>${total}</strong><small>Total</small></div>
    <div class="t-stat"><strong>${stats.Applied}</strong><small>Applied</small></div>
    <div class="t-stat"><strong>${stats.Shortlisted}</strong><small>Shortlisted</small></div>
    <div class="t-stat"><strong>${stats.Interview}</strong><small>Interview</small></div>
    <div class="t-stat"><strong>${stats.Rejected}</strong><small>Rejected</small></div>`;
}

function filterApplications(filter, btn) {
  currentFilter = filter;
  document.querySelectorAll(".sf-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  renderTracker(filter);
}

function updateStatus(appId, newStatus) {
  const app = applications.find(a => a.id === appId);
  if (!app) return;
  const old = app.status;
  app.status = newStatus;
  saveApplications(); renderTracker();
  showToast("🔄", `Status: ${old} → ${newStatus}`);
}

function deleteApplication(appId) {
  applications = applications.filter(a => a.id !== appId);
  saveApplications(); updateNavBadge(); renderTracker();
  renderJobsGrid(JOBS); renderFeaturedJobs();
  showToast("🗑️", "Application removed.");
}

/* ================================================================
   LOCALSTORAGE
   ================================================================ */
function saveApplications()  { localStorage.setItem("tb_apps", JSON.stringify(applications)); }
function loadApplications()  { try { applications = JSON.parse(localStorage.getItem("tb_apps")) || []; } catch { applications = []; } }
function updateNavBadge()    { document.getElementById("appCount").textContent = applications.length; }

/* ================================================================
   UTILITIES
   ================================================================ */
function formatDate(d) {
  return d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";
}

let toastTimer;
function showToast(icon, msg) {
  document.getElementById("toastIcon").textContent = icon;
  document.getElementById("toastMsg").textContent  = msg;
  const t = document.getElementById("toast");
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 3200);
}