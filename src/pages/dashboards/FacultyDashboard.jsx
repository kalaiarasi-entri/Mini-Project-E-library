import React, { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import "animate.css";

const chartColors = [
  "#00b894",
  "#e17055",
  "#6c5ce7",
  "#fab1a0",
  "#0984e3",
  "#ffeaa7",
];

export default function FacultyDashboard() {
  const [students, setStudents] = useState([]);
  const [borrowData, setBorrowData] = useState([]);
  const [showCharts, setShowCharts] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setShowCharts(true), 2000); // 1 second delay
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("usersByRole")) || {};
    const studentList = storedUsers.student || [];
    setStudents(studentList);

    const br = JSON.parse(localStorage.getItem("borrowRequests")) || [];
    setBorrowData(br);
  }, []);

  const departments = Array.from(
    new Set(students.map((u) => u.department).filter(Boolean))
  );
  const deptCounts = departments.map(
    (dept) => students.filter((u) => u.department === dept).length
  );

  const studentBorrowMap = {};
  borrowData.forEach((req) => {
    if (req.status === "Borrowed" || req.status === "Returned") {
      studentBorrowMap[req.studentId] =
        (studentBorrowMap[req.studentId] || 0) + 1;
    }
  });

  const topBorrowers = students
  .map((student) => {
    const borrowCount = borrowData.filter(
      (req) =>
        req.studentId === student.userId &&
        (req.status === "Borrowed" || req.status === "Returned")
    ).length;

    return { name: student.username, count: borrowCount };
  })
  .filter((s) => s.count > 0) // Only include students who have at least one valid borrow
  .sort((a, b) => b.count - a.count)
  .slice(0, 5);

  // Borrow request status pie data
  const statusCount = { Requested: 0, Borrowed: 0, Returned: 0 };
  borrowData.forEach((req) => {
    if (statusCount.hasOwnProperty(req.status)) {
      statusCount[req.status]++;
    }
  });

  const statusLabels = Object.keys(statusCount);
  const statusSeries = Object.values(statusCount);

  const donutOptions = {
    chart: { type: "donut", toolbar: { show: false } },
    labels: departments,
    theme: { mode: "dark" },
    legend: { position: "bottom" },
    colors: chartColors,
  };

  const radialOptions = {
    chart: { type: "radialBar" },
    labels: ["Total Students", "Active Borrowers"],
    theme: { mode: "dark" },
    colors: ["#00cec9", "#d63031"],
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: { fontSize: "16px" },
          value: { fontSize: "14px" },
        },
      },
    },
  };

  const verticalBarOptions = {
    chart: { type: "bar", toolbar: { show: false } },
    plotOptions: { bar: { vertical: true } },
    xaxis: { categories: topBorrowers.map((s) => s.name) },
    theme: { mode: "dark" },
    colors: ["#0984e3"],
    dataLabels: { enabled: true },
  };

  const pieOptions = {
    chart: { type: "pie" },
    labels: statusLabels,
    theme: { mode: "dark" },
    colors: ["#00b894", "#e17055", "#6c5ce7"],
    legend: { position: "bottom" },
  };

  return (
    <div className="container mt-4 text-white overflow-hidden">
      <h3 className="mb-4 animate__animated animate__fadeInDown">
        Faculty Dashboard
      </h3>
      {showCharts ? (
        <div className="row g-4">
          {/* Donut - Department Distribution */}
          <div className="col-md-6">
            <div className="card bg-dark p-3 shadow animate__animated animate__flipInX">
              <h5 className="text-center mb-3 text-white">
                Student Count by Department
              </h5>
              {departments.length > 0 ? (
                <ApexCharts
                  options={donutOptions}
                  series={deptCounts}
                  type="donut"
                  height={410}
                />
              ) : (
                <p className="text-center text-white">
                  No department data found
                </p>
              )}
            </div>
          </div>

          {/* Radial Chart - Overall Students */}
          <div className="col-md-6">
            <div className="card bg-dark p-3 shadow animate__animated animate__flipInX animate__delay-1s">
              <h5 className="text-center mb-3 text-white">Student Overview</h5>
              <ApexCharts
                options={radialOptions}
                series={[students.length, Object.keys(studentBorrowMap).length]}
                type="radialBar"
                height={395}
              />
            </div>
          </div>

          {/* Top Borrowing Students - Horizontal Bar */}
          <div className="col-md-6">
            <div className="card bg-dark p-3 shadow animate__animated ">
              <h5 className="text-center mb-3 text-white">
                Top Borrowing Students
              </h5>
              {topBorrowers.length > 0 ? (
                <ApexCharts
                  options={verticalBarOptions}
                  series={[
                    {
                      name: "Borrow Count",
                      data: topBorrowers.map((s) => s.count),
                    },
                  ]}
                  type="bar"
                  height={300}
                />
              ) : (
                <p className="text-center text-white">
                  No borrow data available
                </p>
              )}
            </div>
          </div>

          {/* Borrow Request Status Pie Chart */}
          <div className="col-md-6">
            <div className="card bg-dark p-3 shadow animate__animated animate__flipInX">
              <h5 className="text-center mb-3 text-white">
                Borrow Request Status Distribution
              </h5>
              {statusSeries.some((s) => s > 0) ? (
                <ApexCharts
                  options={pieOptions}
                  series={statusSeries}
                  type="pie"
                  height={320}
                />
              ) : (
                <p className="text-center text-white">
                  No borrow request data found
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-white">Loading reports...</p>
      )}
    </div>
  );
}
