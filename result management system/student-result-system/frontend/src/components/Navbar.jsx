import { Link, NavLink } from "react-router-dom";

function Navbar({ auth, onLogout }) {
  const role = auth?.user?.role;

  return (
    <header className="topbar">
      <Link to="/" className="brand">
        <span className="brand-badge">RMS</span>
        <span>
          <strong>Campus Result Portal</strong>
          <small>Secure academic result management</small>
        </span>
      </Link>

      <nav className="topbar-nav">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/search">Search Result</NavLink>
        {!auth && <NavLink to="/login/student">Student Login</NavLink>}
        {!auth && <NavLink to="/login/faculty">Faculty Login</NavLink>}
        {!auth && <NavLink to="/login/admin">Admin Login</NavLink>}
        {role === "student" && <NavLink to="/student/dashboard">Dashboard</NavLink>}
        {(role === "faculty" || role === "admin") && (
          <NavLink to="/faculty/dashboard">Faculty Panel</NavLink>
        )}
        {role === "admin" && <NavLink to="/admin/dashboard">Admin Panel</NavLink>}
        {auth && (
          <button type="button" className="button button-ghost" onClick={onLogout}>
            Logout
          </button>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
