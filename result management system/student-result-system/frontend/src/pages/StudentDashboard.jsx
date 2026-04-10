import { useEffect, useState } from "react";
import { apiRequest } from "../lib/api";

function StudentDashboard({ auth }) {
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const data = await apiRequest("/api/students/me", { token: auth.token });
        setResult(data);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [auth.token]);

  return (
    <main className="page">
      <section className="dashboard-hero">
        <div>
          <span className="eyebrow">Student Dashboard</span>
          <h1>Welcome back, {auth.user.name}</h1>
          <p>Your marksheet is available below with subject-wise scores and academic summary.</p>
        </div>
        <button type="button" className="button button-ghost" onClick={() => window.print()}>
          Print Result
        </button>
      </section>

      {loading && <div className="empty-card"><h3>Loading result...</h3></div>}
      {error && <div className="empty-card"><h3>Unable to load result</h3><p>{error}</p></div>}

      {result && (
        <section className="marksheet-card large-sheet">
          <div className="marksheet-header">
            <div>
              <span className="eyebrow">Official Result Sheet</span>
              <h2>{result.name}</h2>
              <p>{result.rollNumber}</p>
            </div>
            <div className="marksheet-summary">
              <strong>{result.grade}</strong>
              <span>{result.percentage}%</span>
            </div>
          </div>

          <div className="marks-grid">
            <article><span>Mathematics</span><strong>{result.marks.math}</strong></article>
            <article><span>Science</span><strong>{result.marks.science}</strong></article>
            <article><span>English</span><strong>{result.marks.english}</strong></article>
            <article><span>Computer</span><strong>{result.marks.computer}</strong></article>
          </div>

          <div className="detail-grid">
            <article><span>Department</span><strong>{result.department}</strong></article>
            <article><span>Semester</span><strong>{result.semester}</strong></article>
            <article><span>Section</span><strong>{result.section}</strong></article>
            <article><span>Total Marks</span><strong>{result.total} / 400</strong></article>
          </div>

          <div className="remarks-box">
            <span>Faculty Remarks</span>
            <p>{result.remarks || "No remarks have been added for this result."}</p>
          </div>
        </section>
      )}
    </main>
  );
}

export default StudentDashboard;
