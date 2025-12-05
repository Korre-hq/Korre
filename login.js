const supabaseClient = supabase.createClient(
  "https://qizzcebwnryawxegxzym.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpenpjZWJ3bnJ5YXd4ZWd4enltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5NTUyMDgsImV4cCI6MjA4MDUzMTIwOH0.mnMliRRMSyUsqU1zno3YTU0RuReh2LuVU1Uyx2F3Iyg"
);

async function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorBox = document.getElementById("error");

  // TRY SIGN IN FIRST
  let { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  });

  // IF LOGIN FAILS → TRY SIGNUP
  if (error) {
    const { data: signupData, error: signupError } = 
      await supabaseClient.auth.signUp({
        email,
        password,
      });

    if (signupError) {
      errorBox.textContent = signupError.message;
      return;
    }

    // after creating the user, create the business row
    await createBusinessRow(signupData.user.id);

    window.location.href = "client_portal.html";
    return;
  }

  // LOGIN SUCCESSFUL → CHECK IF BUSINESS EXISTS
  const { data: userData } = await supabaseClient.auth.getUser();
  await ensureBusinessExists(userData.user.id);

  window.location.href = "client_portal.html";
}

async function createBusinessRow(userId) {
  await supabaseClient.from("businesses").insert([
    {
      user_id: userId,
      name: "New Business"
    }
  ]);
}

async function ensureBusinessExists(userId) {
  const { data: existing } = await supabaseClient
    .from("businesses")
    .select("id")
    .eq("user_id", userId)
    .single();

  if (!existing) {
    await createBusinessRow(userId);
  }
}

