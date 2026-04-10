import { useMemo } from "react";
import FacultyDashboard from "./FacultyDashboard";

function AdminDashboard({ auth }) {
  const banner = useMemo(
    () => ({
      title: "Administrator Control Center",
      description:
        "Admins can create student accounts, publish results, update records, review analytics, and delete obsolete entries.",
    }),
    []
  );

  return <FacultyDashboard auth={auth} canDelete banner={banner} />;
}

export default AdminDashboard;
