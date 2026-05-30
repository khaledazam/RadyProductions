import { s as supabase } from './supabase_D9l0lVjm.mjs';

const POST = async ({ request, cookies }) => {
  try {
    const formData = await request.formData();
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();
    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Email and password are required." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (!data.session) {
      return new Response(JSON.stringify({ error: "Authentication failed. Session not established." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const { access_token, refresh_token } = data.session;
    cookies.set("sb-access-token", access_token, {
      path: "/",
      secure: true,
      httpOnly: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7
      // 1 week
    });
    cookies.set("sb-refresh-token", refresh_token, {
      path: "/",
      secure: true,
      httpOnly: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7
      // 1 week
    });
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
