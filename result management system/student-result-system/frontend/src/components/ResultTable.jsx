function ResultTable({ students, showActions = false, onEdit, onDelete, canDelete = false }) {
  if (!students.length) {
    return (
      <div className="empty-card">
        <h3>No records found</h3>
        <p>Add a student result or try another search value.</p>
      </div>
    );
  }

  return (
    <div className="table-card">
      <table className="results-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Roll No</th>
            <th>Department</th>
            <th>Semester</th>
            <th>Total</th>
            <th>Percentage</th>
            <th>Grade</th>
            <th>Published</th>
            {showActions && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td>{student.name}</td>
              <td>{student.rollNumber}</td>
              <td>{student.department}</td>
              <td>Sem {student.semester}</td>
              <td>{student.total}</td>
              <td>{student.percentage}%</td>
              <td>
                <span className={`badge badge-${student.grade.toLowerCase().replace("+", "plus")}`}>
                  {student.grade}
                </span>
              </td>
              <td>{new Date(student.publishedAt).toLocaleDateString()}</td>
              {showActions && (
                <td className="table-actions">
                  <button type="button" className="button button-ghost" onClick={() => onEdit(student)}>
                    Edit
                  </button>
                  {canDelete && (
                    <button type="button" className="button button-danger" onClick={() => onDelete(student)}>
                      Delete
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ResultTable;
