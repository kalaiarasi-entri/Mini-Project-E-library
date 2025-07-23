import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApexCharts from "react-apexcharts";
import { Users, GraduationCap, BookOpen, Archive } from "lucide-react";
import CountUp from "react-countup";
import "animate.css";

const chartColors = [
  "#4e79a7",
  "#f28e2b",
  "#e15759",
  "#76b7b2",
  "#59a14f",
  "#edc949",
  "#af7aa1",
];

export default function AdminDashboard() {
  const [allUsers, setAllUsers] = useState([]);
  const [borrowData, setBorrowData] = useState([]);
  const [bookData, setBookData] = useState([]);
  const navigate = useNavigate();
  const [animateCounts, setAnimateCounts] = useState(false);

  useEffect(() => {
    const storedUsers = localStorage.getItem("usersByRole");
    if (storedUsers) {
      const parsed = JSON.parse(storedUsers);
      const merged = Object.values(parsed).flat();
      setAllUsers(merged);
    }

    const br = JSON.parse(localStorage.getItem("borrowRequests")) || [];
    setBorrowData(br);

    const books = JSON.parse(localStorage.getItem("books")) || [];
    setBookData(books);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateCounts(true);
    }, 1000); // Wait 800ms for card animations to finish

    return () => clearTimeout(timer);
  }, []);

  const roles = ["admin", "librarian", "faculty", "student"];
  const roleCounts = roles.map(
    (role) => allUsers.filter((u) => u.role === role).length
  );

  const studentList = allUsers.filter((u) => u.role === "student");
  const departments = Array.from(
    new Set(studentList.map((u) => u.department).filter(Boolean))
  );
  const deptCounts = departments.map(
    (dept) => studentList.filter((u) => u.department === dept).length
  );

  const bookBorrowMap = {};
  borrowData.forEach((req) => {
    if (req.status === "Borrowed" || req.status === "Returned") {
      bookBorrowMap[req.bookId] = (bookBorrowMap[req.bookId] || 0) + 1;
    }
  });
  const topBooks = Object.entries(bookBorrowMap)
    .map(([bookId, count]) => {
      const book = bookData.find((b) => b.bookId === bookId);
      return { name: book?.title || "Unknown", count };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const studentBorrowMap = {};
  borrowData.forEach((req) => {
    if (req.status === "Borrowed" || req.status === "Returned") {
      studentBorrowMap[req.studentId] =
        (studentBorrowMap[req.studentId] || 0) + 1;
    }
  });
  const topBorrowers = Object.entries(studentBorrowMap)
    .map(([studentId, count]) => {
      const student = studentList.find((s) => s.userId === studentId);
      return { name: student?.username || studentId || "Unknown", count };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const pieOptions = {
    chart: { type: "pie" },
    labels: roles,
    theme: { mode: "dark" },
    colors: chartColors,
    legend: { position: "bottom" },
  };

  const deptDonutOptions = {
    chart: { type: "donut", toolbar: { show: false } },
    labels: departments,
    theme: { mode: "dark" },
    legend: { position: "bottom" },
    colors: chartColors,
  };

  const barOptions = {
    chart: { type: "bar" },
    xaxis: { categories: topBooks.map((b) => b.name) },
    theme: { mode: "dark" },
    colors: ["#8884d8"],
    plotOptions: { bar: { horizontal: false } },
    dataLabels: { enabled: true },
  };

  const studentBarOptions = {
    chart: { type: "bar" },
    xaxis: { categories: topBorrowers.map((s) => s.name) },
    theme: { mode: "dark" },
    colors: ["#00b894"],
    plotOptions: { bar: { horizontal: false } },
    dataLabels: { enabled: true },
  };

  const dashboardCards = [
    {
      label: "Total Users",
      count: allUsers.length,
      icon: <Users size={30} className="text-white" />,
      gradient: "linear-gradient(135deg, #4e79a7, #283e6e)",
      link: "/users",
    },
    {
      label: "Total Students",
      count: studentList.length,
      icon: <GraduationCap size={30} className="text-white" />,
      gradient: "linear-gradient(135deg, #59a14f, #2d6b34)",
      link: "/student-reports",
    },
    {
      label: "Total Books",
      count: bookData.length,
      icon: <BookOpen size={30} className="text-white" />,
      gradient: "linear-gradient(135deg, #f28e2b, #a95f17)",
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

  return (
    <div className="container mt-4 text-white">
      <div className="row g-4">
        <div className="row g-4 mb-4  animate__animated animate__fadeInRight">
          {dashboardCards.map((card, idx) => (
            <div className="col-md-3" key={idx}>
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
                  <div className="d-flex align-items-center gap-2 mb-3">
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

        {/* Users by Role - PIE chart */}
        <div className="col-md-6">
          <div className="card bg-dark p-3 shadow animate__animated animate__fadeInLeft">
            <h5 className="text-center mb-3 text-white">Users by Role</h5>
            <ApexCharts
              options={pieOptions}
              series={roleCounts}
              type="pie"
              height={300}
            />
          </div>
        </div>

        {/* Student Count by Department */}
        <div className="col-md-6">
          <div className="card bg-dark p-3 shadow animate__animated animate__fadeInRight">
            <h5 className="text-center mb-3 text-white">
              Student Count by Department
            </h5>
            {departments.length > 0 ? (
              <ApexCharts
                options={deptDonutOptions}
                series={deptCounts}
                type="donut"
                height={300}
              />
            ) : (
              <p className="text-center text-white">
                No student department data found
              </p>
            )}
          </div>
        </div>

        {/* Most Borrowed Books */}
        <div className="col-md-6">
          <div className="card bg-dark p-3 shadow animate__animated animate__fadeInUp">
            <h5 className="text-center mb-3 text-white">Most Borrowed Books</h5>
            {topBooks.length > 0 ? (
              <ApexCharts
                options={barOptions}
                series={[
                  { name: "Borrow Count", data: topBooks.map((b) => b.count) },
                ]}
                type="bar"
                height={300}
              />
            ) : (
              <p className="text-center text-white">No borrow data available</p>
            )}
          </div>
        </div>

        {/* Students Who Borrowed Most */}
        <div className="col-md-6">
          <div className="card bg-dark p-3 shadow animate__animated animate__fadeInUp">
            <h5 className="text-center mb-3 text-white">
              Top Borrowing Students
            </h5>
            {topBorrowers.length > 0 ? (
              <ApexCharts
                options={studentBarOptions}
                series={[
                  { name: "Borrowed", data: topBorrowers.map((s) => s.count) },
                ]}
                type="bar"
                height={300}
              />
            ) : (
              <p className="text-center text-white">
                No student borrow data available
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
