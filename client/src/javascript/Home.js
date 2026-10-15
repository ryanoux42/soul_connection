import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import '../style/Home.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Home({ userId, isCoach, token }) {
  const [year, setYear] = useState([]);
  const [earnings, setEarnings] = useState([]);
  const [yearRatings, setYearRatings] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [yearEncounters, setYearEncounters] = useState([]);
  const [encounters, setEncounters] = useState([]);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resEarnings = await axios.get(`http://localhost:5000/customer/payement`, {
          headers: { "token": token }
        });
        processEarnings(resEarnings.data);

        const resEncounters = await axios.get(`http://localhost:5000/customer/encounter`, {
          headers: { "token": token }
        });
        processEncounters(resEncounters.data);
        processRatings(resEncounters.data);

        if (!isCoach) {
          const resCustomers = await axios.get(`http://localhost:5000/customer`, {
            headers: { "token": token }
          });
          setCustomers(resCustomers.data);
        } else {
          const resCustomers = await axios.get(`http://localhost:5000/employee/${userId}/customer`, {
            headers: { "token": token }
          });
          setCustomers(resCustomers.data);
        }
      } catch (error) {
        console.error('Error retrieving data', error);
      }
    };

    fetchData();
  }, [userId, isCoach, token]);

  const processEarnings = (data) => {
    let earningsByYear = { year: [], earning: [] };
    data.forEach(item => {
      let year = item._date.split('-')[0];
      let index = earningsByYear.year.indexOf(year);

      if (index === -1) {
        earningsByYear.year.push(year);
        earningsByYear.earning.push(item.amount);
      } else {
        earningsByYear.earning[index] += item.amount;
      }
    });
    setYear(earningsByYear.year);
    setEarnings(earningsByYear.earning);
  };

  const processEncounters = (data) => {
    let encountersByYear = {};

    data.forEach(item => {
      const year = item._date.split('-')[0];
      if (!encountersByYear[year]) {
        encountersByYear[year] = 1;
      } else {
        encountersByYear[year]++;
      }
    });
    setYearEncounters(Object.keys(encountersByYear).sort());
    setEncounters(Object.values(encountersByYear));
  };

  const processRatings = (data) => {
    let ratingsByYear = {};
    let years = [];
    let averageRatings = [];

    data.forEach(item => {
      const year = item._date.split('-')[0];
      if (!ratingsByYear[year]) {
        ratingsByYear[year] = { total: item.rating, count: 1 };
      } else {
        ratingsByYear[year].total += item.rating;
        ratingsByYear[year].count++;
      }
    });
    Object.keys(ratingsByYear).forEach(year => {
      years.push(year);
      averageRatings.push(ratingsByYear[year].total / ratingsByYear[year].count);
    });
    setYearRatings(years);
    setRatings(averageRatings);
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Performance over Years' }
    },
    scales: {
      x: { title: { display: true, text: 'Year' } },
      y: { title: { display: true, text: 'Count' } }
    }
  };

  const chartData1 = {
    labels: year,
    datasets: [{
      label: 'Earnings',
      data: earnings,
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    }]
  };

  const chartData2 = {
    labels: yearEncounters,
    datasets: [{
      label: 'Encounters',
      data: encounters,
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    }]
  };

  const chartData3 = {
    labels: yearRatings,
    datasets: [{
      label: 'Ratings',
      data: ratings,
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    }]
  };

  return (
    <div className="home-container">
      <header>
        <h1>Soul Connection</h1>
      </header>
      <div className="main-content">
        <nav className="sidebar">
          <ul>
            <li><Link to="/home">Home</Link></li>
            {!isCoach && <li><Link to="/coaches">Coaches</Link></li>}
            <li><Link to="/statistics">Statistics</Link></li>
            <li><Link to="/customer">Customers</Link></li>
            <li><Link to="/compatibility">Compatibility</Link></li>
            <li><Link to="/clothes">Clothes</Link></li>
            <li><Link to="/tips">Tips</Link></li>
            <li><Link to="/events">Events</Link></li>
          </ul>
        </nav>
        <div className="dashboard">
          <div className="charts-home">
            <div className="chart">
              <Line data={chartData1} options={chartOptions} />
            </div>
            <div className="chart">
              <Line data={chartData2} options={chartOptions} />
            </div>
            <div className="chart">
              <Line data={chartData3} options={chartOptions} />
            </div>
          </div>
          <div className="data-table">
            <table>
              <thead>
                <tr>
                  <th>Firstname</th>
                  <th>Lastname</th>
                  <th>Astro Sign</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer, index) => (
                <tr key={index}>
                  <td>{customer.firstname}</td>
                  <td>{customer.lastname}</td>
                  <td>{customer.astro_sign}</td>
                </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;