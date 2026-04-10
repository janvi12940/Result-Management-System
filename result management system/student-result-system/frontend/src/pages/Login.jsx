import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

const roleContent = {
  admin: {
    title: "Administrator Login",
    subtitle: "Use the seeded admin email and password from your backend .env file.",
    identifierLabel: "Admin Email",
    placeholder: "admin@campus.edu",
  },
  faculty: {
    title: "Faculty Login",
    subtitle: "Faculty can review performance analytics and update student result records.",
    identifierLabel: "Faculty Email",
    placeholder: "faculty@campus.edu",
  },
  student: {
    title: "Student Login",
    subtitle: "Students can log in using their roll number and password to view marksheets.",
    identifierLabel: "Roll Number",
    placeholder: "CSE2026-014",
  },
};

function Login({ onLogin }) {
  const { role = "student" } = useParams();
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const content = useMemo(() => roleContent[role] || roleContent.student, [role]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.identifier.trim() || !form.password.trim()) {
      setError("Please fill in both fields.");
      return;
    }

    try {
      setLoading(true);
      await onLogin({
        identifier: form.identifier.trim(),
        password: form.password,
        role,
      });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page narrow-page">
      <section className="auth-card">
        <span className="eyebrow">{role.toUpperCase()} PORTAL</span>
        <h1>{content.title}</h1>
        <p>{content.subtitle}</p>

        <form className="stack-form" onSubmit={handleSubmit}>
          <label>
            {content.identifierLabel}
            <input
              name="identifier"
              value={form.identifier}
              onChange={(event) => setForm((current) => ({ ...current, identifier: event.target.value }))}
              placeholder={content.placeholder}
            />
          </label>
          <label>
            Password
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              placeholder="Enter your password"
            />
          </label>
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="button" disabled={loading}>
            {loading ? "Authenticating..." : "Login Securely"}
          </button>
        </form>

        <div className="login-links">
          <Link to="/login/admin">Admin</Link>
          <Link to="/login/faculty">Faculty</Link>
          <Link to="/login/student">Student</Link>
        </div>
      </section>
    </main>
  );
}

export default Login;
