import React from "react";
import { BarChart3 } from "lucide-react";
import "animate.css";

export default function AdminReports() {
  return (
    <div className="container mt-4 text-white">
      <h3 className="animate__animated animate__fadeInDown d-flex align-items-center gap-2">
        <BarChart3 /> Admin Reports
      </h3>
      <div className="card bg-dark mt-3 p-4 shadow animate__animated animate__fadeInUp">
        <p>This section can include custom student-related reports in future.</p>
      </div>
    </div>
  );
}
