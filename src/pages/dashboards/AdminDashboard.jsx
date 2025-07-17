import React, { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import "animate.css";

const chartColors = ["#6b6b6b", "#444", "#888", "#999", "#ccc"];

export default function AdminDashboard() {
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("usersByRole");
    if (stored) {
      const parsed = JSON.parse(stored);
      const mergedUsers = Object.values(parsed).flat();
      setAllUsers(mergedUsers);
    }
  }, []);

  const roles = ["admin", "librarian", "faculty", "student"];
  const roleCounts = roles.map(
    (role) => allUsers.filter((u) => u.role === role).length
  );

  const departments = Array.from(
    new Set(allUsers.map((u) => u.department).filter(Boolean))
  );
  const deptCounts = departments.map(
    (dept) => allUsers.filter((u) => u.department === dept).length
  );

  const donutOptions = {
    chart: { type: "donut" },
    labels: roles,
    theme: { mode: "dark" },
    colors: chartColors,
    legend: { position: "bottom" },
  };

  const pieOptions = {
    chart: { type: "pie" },
    labels: departments,
    theme: { mode: "dark" },
    colors: chartColors,
    legend: { position: "bottom" },
  };

  return (
    <div className="container mt-4 text-white">
      <h3 className="mb-4 animate__animated animate__fadeInDown">Admin Dashboard</h3>
      <div className="row g-4">
        <div className="col-md-6">
          <div className="card bg-dark p-3 shadow animate__animated animate__fadeInLeft">
            <h5 className="text-center mb-3">Users by Role</h5>
            <ApexCharts options={donutOptions} series={roleCounts} type="donut" height={300} />
          </div>
        </div>
        <div className="col-md-6">
          <div className="card bg-dark p-3 shadow animate__animated animate__fadeInRight">
            <h5 className="text-center mb-3">Users by Department</h5>
            {departments.length > 0 ? (
              <ApexCharts options={pieOptions} series={deptCounts} type="pie" height={300} />
            ) : (
              <p className="text-center">No departmental data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
