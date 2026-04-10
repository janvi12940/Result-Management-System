import { useState } from "react";
import { apiRequest } from "../lib/api";

function PublicSearch() {
  const [rollNumber, setRollNumber] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (event) => {
    event.preventDefault();
    setError("");
    setResult(null);

    if (!rollNumber.trim()) {
      setError("Enter a roll number to search the published result.");
      return;
    }

    try {
      setLoading(true);
      const data = await apiRequest(`/api/students/lookup/${rollNumber.trim()}`);
      setResult(data);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page">
      <section className="split-layout">
        <article className="feature-panel">
          <span className="eyebrow">Published Result Search</span>
          <h1>Check a student marksheet using roll number.</h1>
          <p>
            This public search module demonstrates result lookup, API integration,
            form validation, and user-friendly error handling.
          </p>
        </article>

        <article className="search-card">
          <form className="stack-form" onSubmit={handleSearch}>
            <label>
              Roll Number
              <input
                value={rollNumber}
                onChange={(event) => setRollNumber(event.target.value)}
                placeholder="CSE2026-014"
              />
            </label>
            <button type="submit" className="button" disabled={loading}>
              {loading ? "Searching..." : "Fetch Result"}
            </button>
            {error && <p className="form-error">{error}</p>}
          </form>

          {result && (
            <div className="marksheet-card">
              <div className="marksheet-header">
                <div>
                  <h2>{result.name}</h2>
                  <p>{result.rollNumber}</p>
                </div>
                <div className="marksheet-summary">
                  <strong>{result.grade}</strong>
                  <span>{result.percentage}%</span>
                </div>
              </div>

              <div className="marks-grid">
                <article><span>Math</span><strong>{result.marks.math}</strong></article>
                <article><span>Science</span><strong>{result.marks.science}</strong></article>
                <article><span>English</span><strong>{result.marks.english}</strong></article>
                <article><span>Computer</span><strong>{result.marks.computer}</strong></article>
              </div>

              <div className="marksheet-footer">
                <span>{result.department} • Semester {result.semester} • Section {result.section}</span>
                <strong>Total: {result.total} / 400</strong>
              </div>
            </div>
          )}
        </article>
      </section>
    </main>
  );
}

export default PublicSearch;
