import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Chart from 'react-apexcharts';
import { Send, CheckCircle, CornerDownLeft,BookOpen } from "lucide-react";
import CountUp from "react-countup";
import 'animate.css';

export default function StudentDashboard() {
  const [books, setBooks] = useState([]);
  const [borrowRequests, setBorrowRequests] = useState([]);
  const [dataReady, setDataReady] = useState(false);
  const [animateCounts, setAnimateCounts] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  useEffect(() => {
    const booksData = JSON.parse(localStorage.getItem('books')) || [];
    const requestsData = JSON.parse(localStorage.getItem('borrowRequests')) || [];

    const studentRequests = requestsData.filter(req => req.studentId === user?.userId);
    setBooks(booksData);
    setBorrowRequests(studentRequests);

    setTimeout(() => {
      setDataReady(true);
    }, 300);
  }, []);

  useEffect(() => {
      const timer = setTimeout(() => {
        setAnimateCounts(true);
      }, 600);
      return () => clearTimeout(timer);
    }, []);

  // Chart 1: Books by Department
  const deptMap = {};
  books.forEach(book => {
    const dept = book.department?.trim() || book.type || 'Unknown';
    deptMap[dept] = (deptMap[dept] || 0) + 1;
  });

  const deptChart = {
    options: {
      chart: {
        type: 'bar',
        toolbar: { show: false },
        animations: {
          enabled: true,
          easing: 'easeInOutCubic',
          speed: 1200,
          animateGradually: { enabled: true, delay: 300 },
          dynamicAnimation: { enabled: true, speed: 800 }
        }
      },
      plotOptions: { bar: { borderRadius: 6, columnWidth: '60%' } },
      dataLabels: { enabled: true, style: { colors: ['#fff'] } },
      xaxis: {
        categories: Object.keys(deptMap),
        labels: { style: { colors: '#ccc' } }
      },
      theme: { mode: 'dark' },
      colors: ['#377B2B']
    },
    series: [{ name: 'Available Books', data: Object.values(deptMap) }]
  };

  // Chart 2: Donut - Borrow Request Status
  const statusList = ['Requested', 'Borrowed', 'Returned'];
  const statusCounts = statusList.map(
    status => borrowRequests.filter(req => req.status === status).length
  );

  const donutChart = {
    options: {
      chart: {
        type: 'donut',
        toolbar: { show: false },
        animations: {
          enabled: true,
          easing: 'easeInOutCubic',
          speed: 1000,
          animateGradually: { enabled: true, delay: 250 },
          dynamicAnimation: { enabled: true, speed: 600 }
        }
      },
      labels: statusList,
      legend: { position: 'bottom', labels: { colors: '#ccc' } },
      theme: { mode: 'dark' },
      stroke: { width: 1 },
      plotOptions: {
        pie: { donut: { size: '65%' } }
      },
      colors: ['#1F75FE', '#00008B', '#74BBFB']
    },
    series: statusCounts
  };

  // Chart 3: Pie - Most Borrowed Book Types
  const typeMap = {};
  borrowRequests.forEach(req => {
    const book = books.find(b => b.bookId === req.bookId);
    const type = book?.type || 'Unknown';
    typeMap[type] = (typeMap[type] || 0) + 1;
  });

  const pieChart = {
    options: {
      chart: {
        type: 'pie',
        toolbar: { show: false },
        animations: {
          enabled: true,
          easing: 'easeInOutCubic',
          speed: 1000,
          animateGradually: { enabled: true, delay: 300 },
          dynamicAnimation: { enabled: true, speed: 700 }
        }
      },
      labels: Object.keys(typeMap),
      legend: { position: 'bottom', labels: { colors: '#ccc' } },
      theme: { mode: 'dark' },
      stroke: { width: 1 },
      colors: ['#007ED6', '#377B2B', '#F47A1F', '#bc5090', '#58508d']
    },
    series: Object.values(typeMap)
  };

  const dashboardCards = [
      {
        label: "Total Books",
        count: books.length,
        icon: <BookOpen size={30} className="text-white" />,
        gradient: "linear-gradient(135deg, #4e79a7, #283e6e)",
        link: "/books",
      },
      {
        label: "Requested",
        count:  borrowRequests.filter(req => req.studentId === user?.userId).length,
        icon: <Send size={30} className="text-white" />,
        gradient: "linear-gradient(135deg, #59a14f, #2d6b34)",
        link: "/borrowed-books",
      },
      {
        label: "Borrowed",
        count: borrowRequests.filter((req) => req.status === "Borrowed").length,
        icon: <CheckCircle size={30} className="text-white" />,
        gradient: "linear-gradient(135deg, #f28e2b, #a95f17)",
        link: "/borrowed-books",
      },
      {
        label: "Returned",
        count: borrowRequests.filter((req) => req.status === "Returned").length,
        icon: <CornerDownLeft size={30} className="text-white" />,
        gradient: "linear-gradient(135deg, #e15759, #a13a3c)",
        link: "/borrowed-books",
      },
    ];

  return (
    <div className="container mt-4 text-white">
      <div className="row g-4">
        {/* cards */}
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

        {/* Chart 1: Bar - Books by Department */}
        <div className="col-md-6">
          <div className="card bg-dark shadow animate__animated animate__fadeInLeft">
            <div className="card-body">
              <h5 className="card-title text-white mb-4 text-center">Books by Department</h5>
              {dataReady ? (
                <Chart
                  options={deptChart.options}
                  series={deptChart.series}
                  type="bar"
                  height={300}
                />
              ) : (
                <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <p className="text-muted">Loading...</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chart 2: Donut - Borrow Request Status */}
        <div className="col-md-6">
          <div className="card bg-dark shadow animate__animated animate__fadeInRight">
            <div className="card-body">
              <h5 className="card-title text-white mb-4 text-center">Borrow Request Status</h5>
              <div style={{ minHeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {dataReady && donutChart.series.some(val => val > 0) ? (
                  <Chart
                    options={donutChart.options}
                    series={donutChart.series}
                    type="donut"
                    height={300}
                  />
                ) : (
                  <p className="text-muted">No borrow request data.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Chart 3: Pie - Most Borrowed Book Types */}
        <div className="col-md-12">
          <div className="card bg-dark shadow animate__animated animate__fadeInUp">
            <div className="card-body">
              <h5 className="card-title text-white mb-4 text-center">Most Borrowed Book Types</h5>
              <small className="text-muted">Based on your borrowing activity</small>
              <div style={{ minHeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {dataReady && pieChart.series.length > 0 ? (
                  <Chart
                    options={pieChart.options}
                    series={pieChart.series}
                    type="pie"
                    height={300}
                  />
                ) : (
                  <p className="text-white">No borrowing data found.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
