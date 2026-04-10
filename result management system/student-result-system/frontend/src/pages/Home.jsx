import { Link } from "react-router-dom";

const roleCards = [
  {
    title: "Admin",
    route: "/login/admin",
    accent: "sunset",
    description: "Manage users, publish results, edit records, and control secure access.",
  },
  {
    title: "Faculty",
    route: "/login/faculty",
    accent: "ocean",
    description: "Review performance analytics, search records, and maintain result data.",
  },
  {
    title: "Student",
    route: "/login/student",
    accent: "gold",
    description: "Log in with your roll number to view grades, totals, and printable marksheet.",
  },
];

function Home() {
  return (
    <main className="page">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">College Project - Result Management System</span>
          <h1>Academic results, role-based access, and polished reporting in one portal.</h1>
          <p>
            This result management system combines a React frontend, secure Express API,
            MongoDB schema design, CRUD operations, and JWT-based authentication to match
            full-stack project rubric requirements.
          </p>

          <div className="hero-actions">
            <Link to="/search" className="button">
              Search Result
            </Link>
            <Link to="/login/admin" className="button button-ghost">
              Open Admin Portal
            </Link>
          </div>

          <div className="stats-grid">
            <article>
              <strong>React Router</strong>
              <span>Multi-page client, faculty, and admin flow</span>
            </article>
            <article>
              <strong>JWT + bcrypt</strong>
              <span>Secure role-based authentication</span>
            </article>
            <article>
              <strong>CRUD + MongoDB</strong>
              <span>Structured student record management</span>
            </article>
          </div>
        </div>

        <div className="portal-grid">
          {roleCards.map((card, index) => (
            <article
              key={card.title}
              className={`portal-card portal-card-${card.accent}`}
              style={{ animationDelay: `${index * 120}ms` }}
            >
              <span className="portal-tag">{card.title} Access</span>
              <h2>{card.title}</h2>
              <p>{card.description}</p>
              <Link to={card.route} className="button">
                Login
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Home;
