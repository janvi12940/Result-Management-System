import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ResultTable from "../components/ResultTable";
import StudentForm from "../components/StudentForm";
import { apiRequest } from "../lib/api";
import initialForm from "../lib/initialForm";

const sanitizePayload = (formData) => ({
  name: formData.name.trim(),
  rollNumber: formData.rollNumber.trim(),
  department: formData.department.trim(),
  semester: Number(formData.semester),
  section: formData.section.trim(),
  math: Number(formData.math),
  science: Number(formData.science),
  english: Number(formData.english),
  computer: Number(formData.computer),
  remarks: formData.remarks.trim(),
  ...(formData.password ? { password: formData.password } : {}),
});

function FacultyDashboard({ auth, canDelete = false, banner }) {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [editingStudent, setEditingStudent] = useState(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState({ loading: true, saving: false, error: "", info: "" });

  const title = banner?.title || "Faculty Result Dashboard";
  const description =
    banner?.description ||
    "Faculty can maintain student result entries, monitor subject trends, and keep records updated.";

  const fetchStudents = useCallback(async (searchValue = "") => {
    try {
      setStatus((current) => ({ ...current, loading: true, error: "" }));
      const data = await apiRequest(`/api/students${searchValue ? `?search=${encodeURIComponent(searchValue)}` : ""}`, {
        token: auth.token,
      });
      setStudents(data);
    } catch (requestError) {
      setStatus((current) => ({ ...current, error: requestError.message }));
    } finally {
      setStatus((current) => ({ ...current, loading: false }));
    }
  }, [auth.token]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const analytics = useMemo(() => {
    if (!students.length) {
      return [];
    }

    const totalStudents = students.length;

    return [
      {
        subject: "Math",
        average: Number((students.reduce((sum, student) => sum + student.marks.math, 0) / totalStudents).toFixed(2)),
      },
      {
        subject: "Science",
        average: Number((students.reduce((sum, student) => sum + student.marks.science, 0) / totalStudents).toFixed(2)),
      },
      {
        subject: "English",
        average: Number((students.reduce((sum, student) => sum + student.marks.english, 0) / totalStudents).toFixed(2)),
      },
      {
        subject: "Computer",
        average: Number((students.reduce((sum, student) => sum + student.marks.computer, 0) / totalStudents).toFixed(2)),
      },
    ];
  }, [students]);

  const summaryCards = useMemo(() => {
    if (!students.length) {
      return [
        { label: "Published Results", value: 0 },
        { label: "Average Percentage", value: "0%" },
        { label: "Top Grade", value: "N/A" },
      ];
    }

    const averagePercentage = students.reduce((sum, student) => sum + student.percentage, 0) / students.length;
    const topGradeStudent = [...students].sort((a, b) => b.percentage - a.percentage)[0];

    return [
      { label: "Published Results", value: students.length },
      { label: "Average Percentage", value: `${averagePercentage.toFixed(1)}%` },
      { label: "Top Performer", value: topGradeStudent.name },
    ];
  }, [students]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const validateForm = () => {
    const requiredFields = ["name", "rollNumber", "department", "semester", "section", "math", "science", "english", "computer"];
    const missingField = requiredFields.find((field) => !String(formData[field]).trim());

    if (missingField) {
      return "Please complete all required student and marks fields.";
    }

    const markFields = ["math", "science", "english", "computer"];
    const invalidMarks = markFields.some((field) => {
      const value = Number(formData[field]);
      return Number.isNaN(value) || value < 0 || value > 100;
    });

    if (invalidMarks) {
      return "Each subject mark must be between 0 and 100.";
    }

    if (!editingStudent && formData.password && formData.password.length < 6) {
      return "Student password must be at least 6 characters.";
    }

    return "";
  };

  const resetForm = () => {
    setFormData(initialForm);
    setEditingStudent(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus((current) => ({ ...current, error: "", info: "" }));

    const validationMessage = validateForm();
    if (validationMessage) {
      setStatus((current) => ({ ...current, error: validationMessage }));
      return;
    }

    try {
      setStatus((current) => ({ ...current, saving: true }));
      const payload = sanitizePayload(formData);

      if (editingStudent) {
        await apiRequest(`/api/students/${editingStudent._id}`, {
          method: "PUT",
          body: payload,
          token: auth.token,
        });
        setStatus((current) => ({ ...current, info: "Student result updated successfully." }));
      } else {
        await apiRequest("/api/students", {
          method: "POST",
          body: payload,
          token: auth.token,
        });
        setStatus((current) => ({ ...current, info: "Student result published successfully." }));
      }

      resetForm();
      await fetchStudents(search);
    } catch (requestError) {
      setStatus((current) => ({ ...current, error: requestError.message }));
    } finally {
      setStatus((current) => ({ ...current, saving: false }));
    }
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    await fetchStudents(search);
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      rollNumber: student.rollNumber,
      department: student.department,
      semester: String(student.semester),
      section: student.section,
      math: String(student.marks.math),
      science: String(student.marks.science),
      english: String(student.marks.english),
      computer: String(student.marks.computer),
      remarks: student.remarks || "",
      password: "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (student) => {
    const confirmed = window.confirm(`Delete result record for ${student.name}?`);
    if (!confirmed) {
      return;
    }

    try {
      await apiRequest(`/api/students/${student._id}`, {
        method: "DELETE",
        token: auth.token,
      });
      setStatus((current) => ({ ...current, info: "Student record deleted successfully.", error: "" }));
      await fetchStudents(search);
    } catch (requestError) {
      setStatus((current) => ({ ...current, error: requestError.message }));
    }
  };

  return (
    <main className="page dashboard-page">
      <section className="dashboard-hero">
        <div>
          <span className="eyebrow">{auth.user.role.toUpperCase()} DASHBOARD</span>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        <div className="summary-row">
          {summaryCards.map((card) => (
            <article key={card.label} className="summary-card">
              <span>{card.label}</span>
              <strong>{card.value}</strong>
            </article>
          ))}
        </div>
      </section>

      {status.error && <div className="status-message status-error">{status.error}</div>}
      {status.info && <div className="status-message status-success">{status.info}</div>}

      <StudentForm
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onCancel={resetForm}
        isSubmitting={status.saving}
        mode={editingStudent ? "edit" : "create"}
      />

      <section className="panel-grid">
        <article className="chart-card">
          <div className="section-heading">
            <h2>Subject Performance Analytics</h2>
            <p>Average marks across all published results.</p>
          </div>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={analytics}>
                <CartesianGrid strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="subject" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="average" fill="#2364aa" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="search-card">
          <div className="section-heading">
            <h2>Search Result Records</h2>
            <p>Filter by name, roll number, or department.</p>
          </div>
          <form className="search-inline" onSubmit={handleSearch}>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by student, roll no, or department"
            />
            <button type="submit" className="button">
              Search
            </button>
          </form>
        </article>
      </section>

      {status.loading ? (
        <div className="empty-card">
          <h3>Loading student records...</h3>
        </div>
      ) : (
        <ResultTable
          students={students}
          showActions
          onEdit={handleEdit}
          onDelete={handleDelete}
          canDelete={canDelete}
        />
      )}
    </main>
  );
}

export default FacultyDashboard;
