import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import '../style/Coaches.css';

function Coaches({ token }) {
  const [coachesData, setCoachesData] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [isModified, setIsModified] = useState(false);
  const [actions, setActions] = useState([]);

  const animatedComponents = makeAnimated();

  const handleSelectChange = (selectedOptions, coachId) => {
    const selectedIds = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setCoachesData(coachesData.map(coach =>
      coach.user_id === coachId ? { ...coach, customers: selectedIds } : coach
    ));
    setIsModified(true);
    setActions(prev => {
      const index = prev.findIndex(action => action.coach_id === coachId);
      if (index === -1) {
        return [...prev, {coach_id: coachId, customers_id: selectedIds}];
      } else {
        const updatedActions = [...prev];
        updatedActions[index] = {...prev[updatedActions], ...{coach_id: coachId, customers_id: selectedIds}};
        return updatedActions;
      }
    })
  };

  const saveCustomers = (modifiedCoach) => {
    try {
      modifiedCoach.map((coach) => (
        axios.post(`http://localhost:5000/customer/link_coach`, {
          "coach_id": coach.coach_id,
          "customers_id": coach.customers_id,
          }, {
          headers: {
            "token": token
          }
        })
      ));
      setActions([]);
      setIsModified(false);
    } catch(error) {
      console.error('Error setting the coaches customers');
    }
  };

  const handleCoach = async () => {
    try {
      const coachResponse = await axios.get(`http://localhost:5000/employee/coach`, {
        headers: {
          "token": token
        }
      });

      const updatedCoaches = await Promise.all(coachResponse.data.map(async (coach) => {
        const customerResponse = await axios.get(`http://localhost:5000/employee/${coach.user_id}/customer`, {
          headers: {
            "token": token
          }
        });

        const linkedCustomers = customerResponse.data.map(customer => ({
          value: customer.customer_id,
          label: `${customer.firstname} ${customer.lastname}`
        }));
        return {
          ...coach,
          customers: linkedCustomers,
        };
      }));

      setCoachesData(updatedCoaches);
    } catch (error) {
      console.error('Error retrieving the coaches');
    }
  };

  const fetchCustomers = async () => {
    try {
      const customerResponse = await axios.get(`http://localhost:5000/customer/name`, {
        headers: {
          "token": token
        }
      });
      const customerOptions = customerResponse.data.map(customer => ({
        value: customer.customer_id,
        label: `${customer.firstname} ${customer.lastname}`,
      }));
      setCustomers(customerOptions);
    } catch (error) {
      console.error('Error retrieving customers');
    }
  };

  useEffect(() => {
    handleCoach();
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="coaches-container">
      <header>
        <h1>Coaches</h1>
      </header>
      <div className="coaches-main-content">
        <nav className="coaches-sidebar">
          <ul>
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/coaches">Coaches</Link></li>
            <li><Link to="/statistics">Statistics</Link></li>
            <li><Link to="/customer">Customers</Link></li>
            <li><Link to="/compatibility">Compatibility</Link></li>
            <li><Link to="/clothes">Clothes</Link></li>
            <li><Link to="/tips">Tips</Link></li>
            <li><Link to="/events">Events</Link></li>
          </ul>
        </nav>
        <div className="coaches-dashboard">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Birth Date</th>
                <th>Customers</th>
                <th>Gender</th>
              </tr>
            </thead>
            <tbody>
              {coachesData.map((coach, index) => (
                <tr key={index}>
                  <td>{coach.user_id}</td>
                  <td>{coach.firstname} {coach.lastname}</td>
                  <td>{coach.birth_date}</td>
                  <td>
                    <Select
                      components={animatedComponents}
                      isMulti
                      options={customers}
                      defaultValue={coach.customers}
                      onChange={(selectedOptions) => handleSelectChange(selectedOptions, coach.user_id)}
                      closeMenuOnSelect={false} 
                      placeholder="Select customers"
                    />
                  </td>
                  <td>{coach.gender}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Link to="/create_coach">
            <button>Add Coaches</button>
          </Link>
          {isModified && (
            <button onClick={() => saveCustomers(actions)}>Save Changes</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Coaches;
