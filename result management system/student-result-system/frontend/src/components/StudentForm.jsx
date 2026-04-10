function StudentForm({
  formData,
  onChange,
  onSubmit,
  onCancel,
  isSubmitting,
  mode = "create",
}) {
  return (
    <form className="form-card" onSubmit={onSubmit}>
      <div className="section-heading">
        <h2>{mode === "edit" ? "Update Student Result" : "Publish New Result"}</h2>
        <p>Create student login credentials, store marks, and publish the result sheet.</p>
      </div>

      <div className="form-grid">
        <label>
          Full Name
          <input name="name" value={formData.name} onChange={onChange} placeholder="Aarav Sharma" required />
        </label>
        <label>
          Roll Number
          <input name="rollNumber" value={formData.rollNumber} onChange={onChange} placeholder="CSE2026-014" required />
        </label>
        <label>
          Department
          <input name="department" value={formData.department} onChange={onChange} placeholder="Computer Science" required />
        </label>
        <label>
          Semester
          <input name="semester" type="number" min="1" max="8" value={formData.semester} onChange={onChange} required />
        </label>
        <label>
          Section
          <input name="section" value={formData.section} onChange={onChange} placeholder="A" required />
        </label>
        <label>
          Login Password
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={onChange}
            placeholder={mode === "edit" ? "Leave blank to keep current password" : "Minimum 6 characters"}
          />
        </label>
        <label>
          Mathematics
          <input name="math" type="number" min="0" max="100" value={formData.math} onChange={onChange} required />
        </label>
        <label>
          Science
          <input name="science" type="number" min="0" max="100" value={formData.science} onChange={onChange} required />
        </label>
        <label>
          English
          <input name="english" type="number" min="0" max="100" value={formData.english} onChange={onChange} required />
        </label>
        <label>
          Computer
          <input name="computer" type="number" min="0" max="100" value={formData.computer} onChange={onChange} required />
        </label>
        <label className="full-width">
          Remarks
          <textarea name="remarks" value={formData.remarks} onChange={onChange} rows="4" placeholder="Consistent performance with strong programming skills." />
        </label>
      </div>

      <div className="form-actions">
        <button type="submit" className="button">
          {isSubmitting ? "Saving..." : mode === "edit" ? "Update Result" : "Publish Result"}
        </button>
        {mode === "edit" && (
          <button type="button" className="button button-ghost" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default StudentForm;
