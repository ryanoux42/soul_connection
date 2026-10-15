import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import ReactStars from 'react-rating-stars-component';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import '../style/Statistics.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

function Statistics({ userId, isCoach, token }) {
  const possible_date = ["2023", "2024"];
  const [Coachs, setCoachs] = useState([]);
  const [CoachsWithoutData, setCoachsWithoutData] = useState([]);
  const [verticalBarDataArray, setVerticalBarDataArray] = useState([]);
  const [data, setData] = useState([]);
  const [rating, setRating] = useState([]);
  const [ratingUser, setRatingUser] = useState([]);
  const [averageRatingUser, setaverageRatingUser] = useState([]);
  const [customers, setCustomers] = useState([])
  const [statsUser, setStatsUser] = useState([]);
  const [possible_source, setPossibleSource] = useState([]);
  const [isRatingLoaded, setIsRatingLoaded] = useState(false);
  const [isSourceLoaded, setIsSourceLoaded] = useState(false);
  const [isCustomersLoaded, setIsCustomersLoaded] = useState(false);
  const [isDateLoaded, setIsDateLoaded] = useState(false);
  const [isSourceRatingLoaded, setIsSourceRatingLoaded] = useState(false);
  const [doughnutData, setdoughnutData] = useState({
      labels: [],
      datasets: [
        {
          labels: '',
          data: [],
          backgroundColor: []
        }
      ]
    });
  const [lineData, setLineData] = useState({
      labels: [],
      datasets: [{
        label: '',
        data: [],
        backgroundColor: '',
      }]
    });
  const [horizontalBarData, sethorizontalBarData] = useState({
      labels: [],
      datasets: [
        {
          label: '',
          data: [],
          backgroundColor: []
        }
      ]
    });
    const [verticalBarData, setverticalBarData] = useState({
        labels: [],
        datasets: [
          {
            label: '',
            data: [],
            backgroundColor: []
          }
        ]
      });

  const getStatsUser = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/employee/${userId}/encounter`, {
        headers: {
          "token": token
        }
      });
      setStatsUser(response.data);
      setPossibleSource(response.data.map(event => event.source));
      setRatingUser(response.data.map(event => event.rating));
      setCustomers([...new Set(response.data.map(event => event.customer_id))]);
    } catch (error) {
      console.error('No stats found for this user:', error)
    }
  }

  const getCoach = async () => {
    try {
      const response = await axios.get('http://localhost:5000/employee/coach', {
        headers: {
          "token": token
        }
      });
      setCoachs(response.data);
    } catch (error) {
      console.error('No coach found:', error);
    }
  }

  const getStats = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/employee/coach/statistic`, {
        headers: {
          "token": token
        }
      });
      let sorted_data = response.data.flatMap(item => {
        let result = { coach_id: item.coach_id };
        possible_date.forEach(date => { result[date] = item.tab.filter(sort => sort._date.substr(0, 4) === date); });
        return result;
      });
      setData(sorted_data);
    } catch (error) {
      console.error('No statistics found:', error);
    }
  }

  const calculateAverage = (arr) => {
    let sum = 0;
      for (let number of arr) {
        sum += number;
      }
      return sum / arr.length;
  }

  useEffect(() => {
    if (statsUser.length > 0 && possible_source.length > 0 && customers.length > 0) {
      const newDoughnutData = {
      labels: possible_source,
      datasets: [
        {
          label: "Traffic of each source",
          data: possible_source.map(source => { return statsUser.map(stats => {return stats.source === source ? "oui" : "non"}).filter(item => item != "non").length } ),
          backgroundColor: ['rgba(60, 60, 60, 1)', 'rgba(110, 110, 110, 1)', 'rgba(200, 200, 200, 1)']
        }]
      };
      setdoughnutData(newDoughnutData);
      setIsSourceLoaded(true);
      const newLineData = {
      labels: customers,
      datasets: [
        {
          label: "Number of encounter per customers",
          data: customers.map(custo => { return statsUser.map(stats => {return stats.customer_id === custo ? "oui" : "non"}).filter(item => item != "non").length } ),
          backgroundColor: ['rgba(60, 60, 60, 1)', 'rgba(110, 110, 110, 1)', 'rgba(200, 200, 200, 1)']
        }]
      };
      setLineData(newLineData);
      setIsCustomersLoaded(true);
      const newHorizontalBarData = {
      labels: possible_date,
      datasets: [
        {
          label: "Number of encounter created per years",
          data: possible_date.map(date => { return statsUser.map(stats => {return stats._date.substr(0, 4) === date ? "oui" : "non"}).filter(item => item != "non").length } ),
          backgroundColor: ['rgba(60, 60, 60, 1)', 'rgba(110, 110, 110, 1)', 'rgba(200, 200, 200, 1)']
        }]
      };
      sethorizontalBarData(newHorizontalBarData);
      setIsDateLoaded(true);
      const newVerticalBarData = {
      labels: possible_source,
      datasets: [
        {
          label: "Rating and popularity of each source",
          data: possible_source.map(source => { return calculateAverage(statsUser.map(stats => {return stats.source === source ? stats.rating : "non"}).filter(item => item != "non")) } ),
          backgroundColor: ['rgba(60, 60, 60, 1)', 'rgba(110, 110, 110, 1)', 'rgba(200, 200, 200, 1)']
        }]
      };
      setverticalBarData(newVerticalBarData);
      setIsSourceRatingLoaded(true);
      }
    }, [statsUser, possible_source, customers]);

    useEffect(() => {
      if (ratingUser.length > 0) {
        setaverageRatingUser(calculateAverage(ratingUser));
        setIsRatingLoaded(true);
      }
    }, [ratingUser])

    useEffect(() => {
      if (data.length > 0 && data[0]) {
        const newVerticalBarDataArray = data.map(coachData => {
          return {
            labels: possible_date,
            datasets: [{
              label: `Encounters for Coach: ${Coachs.map(coach => { return coach.user_id === coachData.coach_id ? coach.firstname + " " + coach.lastname : "null"}).filter(notnull => notnull != "null")}`,
              data: possible_date.map(date => { return Array.isArray(coachData[date]) ? coachData[date].length : 0; }),
              backgroundColor: ['rgba(100, 100, 100, 1)', 'rgba(200, 200, 200, 1)'],
            }]
          };
        });
        setVerticalBarDataArray(newVerticalBarDataArray);

        const averageRating = data.map(coachData => {
          const ratings = possible_date.flatMap(date => {
            return Array.isArray(coachData[date]) ? coachData[date].map(encounter => encounter.rating || 0) : [];
          });
          const sum = ratings.reduce((acc, rating) => acc + rating, 0);
        return ratings.length > 0 ? sum / ratings.length : 0;
        });
        setRating(averageRating);

        const coachesWithDataIds = data.map(coachData => coachData.coach_id);
        const result = Coachs.filter(coach => !(coachesWithDataIds.includes(coach.user_id)));
        setCoachsWithoutData(result);
    }
  }, [data]);

  useEffect(() => {
    getCoach();
    getStats();
    getStatsUser();
  }, []);

  return (
    <div className="statistics-container">
      <header>
        <h1>Statistics</h1>
      </header>
      <div className="main-content">
        <nav className="sidebar">
          <ul>
            <li><Link to="/home">Home</Link></li>
            {!isCoach &&
              <li><Link to="/coaches">Coaches</Link></li>
            }
            <li><Link to="/statistics">Statistics</Link></li>
            <li><Link to="/customer">Customers</Link></li>
            <li><Link to="/compatibility">Compatibility</Link></li>
            <li><Link to="/clothes">Clothes</Link></li>
            <li><Link to="/Tips">Tips</Link></li>
            <li><Link to="/events">Events</Link></li>
          </ul>
        </nav>
        <div>
        {isCoach &&
        <div className="main-content">
        <div className="charts">
          <div className="chart-item">{ isSourceLoaded ? ( <Doughnut data={doughnutData}/> ) : ( <p>Loading Source...</p> )} </div>
          <div className="chart-item">{ isSourceLoaded ? ( <Bar data={doughnutData} options={{ indexAxis: 'x' }}/> ) : ( <p>Loading Source...</p> )} </div>
          <div className="chart-item">{ isCustomersLoaded ? ( <Doughnut data={lineData}/> ) : ( <p>Loading Customers...</p> )} </div>
          <div className="chart-item">{ isCustomersLoaded ? ( <Bar data={lineData} options={{ indexAxis: 'x' }}/> ) : ( <p>Loading Customers...</p> )} </div>
          <div className="chart-item">{ isDateLoaded ? ( <Bar data={horizontalBarData} options={{ indexAxis: 'x' }}/> ) : ( <p>Loading Date...</p> )} </div>
          <div className="chart-item">{ isDateLoaded ? ( <Line data={horizontalBarData}/> ) : ( <p>Loading Date...</p> )} </div>
          <div className="chart-item">{ isSourceRatingLoaded ? ( <Bar data={verticalBarData}/> ) : ( <p>Loading Rating of Source...</p> )} </div>
          <div className="chart-item">{ isSourceRatingLoaded ? ( <Line data={verticalBarData}/> ) : ( <p>Loading Rating of Source...</p> )} </div>
          <div className="chart-item">{ isRatingLoaded ? (
            <ReactStars
            count={5}
            value={averageRatingUser}
            size={24}
            activeColor="#ffd700"
            isHalf={true}
            edit={false}
            /> ) : ( <p>Loading rating...</p> )}
          <p>Your Rating</p>
        </div>
        </div>
        </div>
        }
        {!isCoach &&
        <div className="dashboard">
          <div className="charts-container">
            <div className="charts-home">
              {verticalBarDataArray.map((barData, index) => (
                <div key={index} className="chart-item">
                  <Bar data={barData} options={{ indexAxis: 'y' }} />
                  <div className="coach-rating">
                    <p>Rating Of The Coach</p>
                    <ReactStars
                      count={5}
                      value={rating[index]}
                      size={24}
                      activeColor="#ffd700"
                      isHalf={true}
                      edit={false}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="coaches-without-data">
              {CoachsWithoutData.map((coach, index) => (
                <div key={index} className="coach-item">
                  <p>Coach ID: {coach.user_id}</p>
                  <p>Name: {coach.firstname} {coach.lastname}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
          }
      </div>
    </div>
    </div>
  );
}

export default Statistics;