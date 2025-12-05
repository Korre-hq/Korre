document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Simple intersection observer for fade-in animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Select elements to animate
    const animatedElements = document.querySelectorAll('.service-card, .testimonial-item, .image-wrapper, .content-wrapper');

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
});
// client login//
const supabaseClient = supabase.createClient(
  "https://qizzcebwnryawxegxzym.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpenpjZWJ3bnJ5YXd4ZWd4enltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5NTUyMDgsImV4cCI6MjA4MDUzMTIwOH0.mnMliRRMSyUsqU1zno3YTU0RuReh2LuVU1Uyx2F3Iyg"
);

async function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorBox = document.getElementById("error");

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    errorBox.textContent = error.message;
    return;
  }

  window.location.href = "client-portal.html";
}
// client portal//
const supabaseClient = supabase.createClient(
  "https://qizzcebwnryawxegxzym.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpenpjZWJ3bnJ5YXd4ZWd4enltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5NTUyMDgsImV4cCI6MjA4MDUzMTIwOH0.mnMliRRMSyUsqU1zno3YTU0RuReh2LuVU1Uyx2F3Iyg"
);

async function loadPortal() {
  // 1. Confirm user is logged in
  const { data: session } = await supabaseClient.auth.getUser();
  if (!session.user) {
    window.location.href = "login.html";
    return;
  }

  const userId = session.user.id;

  // 2. Fetch business
  const { data: business } = await supabaseClient
    .from("businesses")
    .select("*")
    .eq("user_id", userId)
    .single();

  document.getElementById("business-info").innerHTML =
    `<pre>${JSON.stringify(business, null, 2)}</pre>`;

  const businessId = business.id;

  // 3. Branding rules
  const { data: branding } = await supabaseClient
    .from("branding_rules")
    .select("*")
    .eq("business_id", businessId);

  document.getElementById("branding").innerHTML =
    `<pre>${JSON.stringify(branding, null, 2)}</pre>`;

  // 4. SOPs
  const { data: sops } = await supabaseClient
    .from("sop")
    .select("*")
    .eq("business_id", businessId);

  document.getElementById("sops").innerHTML =
    `<pre>${JSON.stringify(sops, null, 2)}</pre>`;

  // 5. AI Settings
  const { data: aiSettings } = await supabaseClient
    .from("ai_settings")
    .select("*")
    .eq("business_id", businessId);

  document.getElementById("ai-settings").innerHTML =
    `<pre>${JSON.stringify(aiSettings, null, 2)}</pre>`;

  // 6. Calls
  const { data: calls } = await supabaseClient
    .from("calls")
    .select("*")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false });

  document.getElementById("calls").innerHTML =
    `<pre>${JSON.stringify(calls, null, 2)}</pre>`;
}

async function logout() {
  await supabaseClient.auth.signOut();
  window.location.href = "login.html";
}

loadPortal();
