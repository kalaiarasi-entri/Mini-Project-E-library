import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import 'animate.css';

export default function LibrarianDashboard() {
  const [books, setBooks] = useState([]);
  const [borrowRequests, setBorrowRequests] = useState([]);
  const [dataReady, setDataReady] = useState(false);

  useEffect(() => {
    const booksData = JSON.parse(localStorage.getItem('books')) || [];
    const requestsData = JSON.parse(localStorage.getItem('borrowRequests')) || [];

    setTimeout(() => {
      setBooks(booksData);
      setBorrowRequests(requestsData);
      setDataReady(true);
    }, 100);
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
        animations: { enabled: true, easing: 'easeOutBounce', speed: 1200 },
        toolbar: { show: false }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 8,
          columnWidth: '60%'
        }
      },
      dataLabels: { enabled: true, style: { colors: ['#fff'] } },
      xaxis: {
        categories: Object.keys(deptMap),
        labels: { style: { colors: '#fff' } }
      },
      theme: { mode: 'dark' },
      colors: ['#0dcaf0']
    },
    series: [{
      name: 'Books',
      data: Object.values(deptMap)
    }]
  };

  // Chart 2: Borrow Requests by Status (Monochromatic Pie)
  const statuses = ['Requested', 'Borrowed', 'Returned'];
  const statusCounts = statuses.map(
    status => borrowRequests.filter(req => req.status === status).length
  );

  const statusChart = {
    options: {
      chart: {
        type: 'pie',
        animations: { enabled: true, easing: 'easeOutCubic', speed: 1000 },
        toolbar: { show: false }
      },
      labels: statuses,
      legend: { position: 'bottom', labels: { colors: '#ffffff' } },
      stroke: { width: 1 },
      theme: { mode: 'dark' },
      colors: ['#1e3a8a', '#3b82f6', '#93c5fd'],
      plotOptions: {
        pie: { startAngle: -90, endAngle: 270 }
      }
    },
    series: statusCounts
  };

  // Chart 3: Most Borrowed Books
  const bookTitleMap = {};
  books.forEach(book => {
    if (book.bookId) bookTitleMap[book.bookId] = book.title;
  });

  const countMap = {};
  borrowRequests.forEach(req => {
    countMap[req.bookId] = (countMap[req.bookId] || 0) + 1;
  });

  const topBooks = Object.entries(countMap)
    .map(([bookId, count]) => ({
      title: bookTitleMap[bookId] || '(Deleted Book)',
      count
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const topChart = {
    options: {
      chart: {
        type: 'bar',
        animations: { enabled: true, easing: 'easeOutBounce', speed: 1200 },
        toolbar: { show: false }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 6,
          columnWidth: '55%'
        }
      },
      xaxis: {
        categories: topBooks.map(b => b.title),
        labels: { style: { colors: '#fff' } }
      },
      dataLabels: { enabled: true, style: { colors: ['#fff'] } },
      theme: { mode: 'dark' },
      colors: ['#6f42c1']
    },
    series: [{
      name: 'Times Borrowed',
      data: topBooks.map(b => b.count)
    }]
  };

  return (
    <div className="container mt-4 text-white">
      <div className="row g-4">
        {/* Chart 1: Books by Department */}
        <div className="col-md-6">
          <div className="card bg-dark shadow">
            <div className="card-body">
              <h5 className="card-title">Books by Department</h5>
              {dataReady && (
                <div>
                  <Chart options={deptChart.options} series={deptChart.series} type="bar" height={300} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chart 2: Borrow Request Status */}
        <div className="col-md-6">
          <div className="card bg-dark shadow">
            <div className="card-body">
              <h5 className="card-title">Borrow Request Status</h5>
              {dataReady && statusChart.series.some(s => s > 0) ? (
                <div>
                  <Chart
                    options={statusChart.options}
                    series={statusChart.series}
                    type="pie"
                    height={300}
                  />
                </div>
              ) : (
                <div style={{ height: 300 }} className="d-flex align-items-center justify-content-center">
                  <p className="text-white m-0">No status data to display</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chart 3: Most Borrowed Books */}
        <div className="col-md-12">
          <div className="card bg-dark shadow">
            <div className="card-body">
              <h5 className="card-title">Most Borrowed Books</h5>
              <small className="text-muted">Based on borrow request counts</small>
              {dataReady && (
                <div className="mt-2">
                  <Chart options={topChart.options} series={topChart.series} type="bar" height={300} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
