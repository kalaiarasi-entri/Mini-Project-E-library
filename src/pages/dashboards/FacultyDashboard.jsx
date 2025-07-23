import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApexCharts from "react-apexcharts";
import { Users, GraduationCap, BookOpen, Archive } from "lucide-react";
import CountUp from "react-countup";
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
  const navigate = useNavigate();
  const [animateCounts, setAnimateCounts] = useState(false);

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateCounts(true);
    }, 1000); // Wait 800ms for card animations to finish

    return () => clearTimeout(timer);
  }, []);

  const dashboardCards = [
    {
      label: "Total Students",
      count: students.length,
      icon: <Users size={30} className="text-white" />,
      gradient: "linear-gradient(135deg, #4e79a7, #283e6e)",
      link: "/users",
    },
    {
      label: "Total Department",
      count: 5,
      icon: <BookOpen size={30} className="text-white" />,
      gradient: "linear-gradient(135deg, #59a14f, #2d6b34)",
      link: "/books",
    },
    {
      label: "Borrow Requests",
      count: borrowData.length,
      icon: <Archive size={30} className="text-white" />,
      gradient: "linear-gradient(135deg, #e15759, #a13a3c)",
      link: "/student-reports",
    },
  ];

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
          <div className="row g-4 mb-4  animate__animated animate__fadeInRight">
            {dashboardCards.map((card, idx) => (
              <div className="col-md-4" key={idx}>
                <div
                  className="card text-white"
                  style={{
                    background: card.gradient,
                    animationDelay: `${idx * 0.2}s`,
                    cursor: "pointer",
                    borderRadius: "1.2rem",
                    minHeight: "150px",
                    transition: "transform 0.3s ease",
                  }}
                  onClick={() => navigate(card.link)}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.03)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  {/* Card content wrapper */}
                  <div className="d-flex flex-column h-100 p-4">
                    {/* Header (icon + label) */}
                    <div className="d-flex align-items-center gap-4 mb-3">
                      <div
                        className="d-flex align-items-center justify-content-center"
                        style={{
                          backgroundColor: "rgba(255,255,255,0.15)",
                          borderRadius: "50%",
                          padding: "8px",
                        }}
                      >
                        {card.icon}
                      </div>
                      <div className="fw-semibold text-uppercase small">
                        {card.label}
                      </div>
                    </div>

                    {/* Centered Count in remaining space */}
                    <div className="flex-grow-1 d-flex justify-content-center align-items-center">
                      <div className="fs-2 fw-bold text-center">
                        {animateCounts ? (
                          <CountUp end={card.count} duration={2.5} />
                        ) : (
                          0
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Donut - Department Distribution */}
          <div className="col-md-6">
            <div className="card bg-dark p-3 shadow ">
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
            <div className="card bg-dark p-3 shadow">
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
          <div className="col-md-6 ">
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
            <div className="card bg-dark p-3 shadow">
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
