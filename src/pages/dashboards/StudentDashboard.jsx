import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import 'animate.css';

export default function StudentDashboard() {
  const [books, setBooks] = useState([]);
  const [borrowRequests, setBorrowRequests] = useState([]);
  const [dataReady, setDataReady] = useState(false);

  useEffect(() => {
    const booksData = JSON.parse(localStorage.getItem('books')) || [];
    const requestsData = JSON.parse(localStorage.getItem('borrowRequests')) || [];
    const user = JSON.parse(localStorage.getItem('user'));

    const studentRequests = requestsData.filter(req => req.studentId === user?.email);
    setBooks(booksData);
    setBorrowRequests(studentRequests);

    setTimeout(() => {
      setDataReady(true);
    }, 300); // Simulate progressive load
  }, []);

  // Chart 1: Available Books by Department
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
      plotOptions: {
        bar: { borderRadius: 6, columnWidth: '60%' }
      },
      dataLabels: { enabled: true, style: { colors: ['#fff'] } },
      xaxis: {
        categories: Object.keys(deptMap),
        labels: { style: { colors: '#ccc' } }
      },
      theme: { mode: 'dark' },
      colors: ['#38bdf8']
    },
    series: [{ name: 'Available Books', data: Object.values(deptMap) }]
  };

  // Chart 2: Donut chart - Borrow Request Status
  const statusList = ['Requested', 'Borrowed', 'Returned'];
  const statusCounts = statusList.map(status =>
    borrowRequests.filter(req => req.status === status).length
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
      colors: ['#64748b', '#4b5563', '#1e293b'] // Cool grayscale
    },
    series: statusCounts
  };

  // Chart 3: Most Frequently Borrowed Book Types (Pie)
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
      colors: ['#334155', '#475569', '#64748b', '#94a3b8', '#cbd5e1']
    },
    series: Object.values(typeMap)
  };

  return (
    <div className="container mt-4 text-white">
      <div className="row g-4">
        {/* Chart 1: Bar - Available Books by Department */}
        <div className="col-md-6">
          <div className="card bg-dark shadow animate__animated animate__fadeInLeft">
            <div className="card-body">
              <h5 className="card-title">Books by Department</h5>
              {dataReady ? (
                <Chart
                  options={deptChart.options}
                  series={deptChart.series}
                  type="bar"
                  height={300}
                />
              ) : (
                <p className="text-muted">Loading...</p>
              )}
            </div>
          </div>
        </div>

        {/* Chart 2: Donut - Borrow Request Status */}
        <div className="col-md-6">
          <div className="card bg-dark shadow animate__animated animate__fadeInRight">
            <div className="card-body">
              <h5 className="card-title">Borrow Request Status</h5>
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

        {/* Chart 3: Pie - Most Borrowed Book Types */}
        <div className="col-md-12">
          <div className="card bg-dark shadow animate__animated animate__fadeInUp">
            <div className="card-body">
              <h5 className="card-title">Most Borrowed Book Types</h5>
              <small className="text-muted">Based on your borrowing activity</small>
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
  );
}
