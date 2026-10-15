import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../style/Customer.css';

function Customer({ userId, isCoach, token }) {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [customerImage, setCustomerImage] = useState('');

  const handleSelectChange = async (event) => {
    const customerId = parseInt(event.target.value, 10);
    const customer = customers.find(c => c.customer_id === customerId);

    try {
      const response = await axios.get(`http://localhost:5000/customer/${customer.customer_id}`, {
        headers: {
          "token": token
        }
      });
      const meetingResponse = await axios.get(`http://localhost:5000/customer/encounter/${customer.customer_id}`, {
        headers: {
          "token": token
        }
      });
      const paymentResponse = await axios.get(`http://localhost:5000/customer/payement/${customer.customer_id}`, {
        headers: {
          "token": token
        }
      });
      const imageResponse = await axios.get(`http://localhost:5000/customer/${customer.customer_id}/image`, {
        headers: {
          "token": token
        }
      }); 

      setSelectedCustomer(response.data[0]);
      setMeetings(meetingResponse.data);
      setPayments(paymentResponse.data);
      setCustomerImage(imageResponse.data);
    } catch (error) {
      console.error('Error retrieving the data from the user');
    }
  };

  const HandleCustomers = async () => {
    try {
      if (isCoach) {
        const response = await axios.get(`http://localhost:5000/employee/${userId}/customer`, {
          headers: {
            "token": token
          }
        });

        setCustomers(response.data);
      } else {
        const response = await axios.get(`http://localhost:5000/customer/name`, {
          headers: {
            "token": token
          }
        });
        setCustomers(response.data);
      }
    } catch (error) {
      console.error('Failed to retrieve informations about the customer');
    }
  }

  useEffect (() => {
    HandleCustomers();
  }, [])

  return (
    <div className="customer-container">
      <header>
        <h1> Customers</h1>
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
        <div className="dashboard">
          <select onChange={handleSelectChange} value={selectedCustomer?.id || ''} className="customer-selector">
            <option value="">Select a customer</option>
            {customers.map((customer, index) => (
              <option key={index} value={customer.customer_id}>{customer.firstname} {customer.lastname}</option>
            ))}
          </select>
          {selectedCustomer && (
            <>
              <div className="profile-details">
                <div className="profile-text">
                  <h2>{selectedCustomer.firstname} {selectedCustomer.lastname}</h2>
                  <p>Birthday: {selectedCustomer.birth_date}</p>
                  <p>Address: {selectedCustomer._address}</p>
                </div>
                <div className="profile-avatar">
                  <img src={customerImage} alt={`Avatar of ${selectedCustomer.firstname}`} />
                </div>
              </div>
              <div className="customer-tables">
                {!isCoach && (
                  <div className="table payments-table">
                    <h3>Payments</h3>
                    <div className="table-scroll">
                      <table>
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Comment</th>
                          </tr>
                        </thead>
                        <tbody>
                          {payments.map((payment, index) => (
                            <tr key={index}>
                              <td>{payment._date}</td>
                              <td>{payment.amount}</td>
                              <td>{payment.comment}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                <div className="table meetings-table">
                  <h3>Meetings</h3>
                  <div className="table-scroll">
                    <table>
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Rating</th>
                          <th>Report</th>
                          <th>Source</th>
                        </tr>
                      </thead>
                      <tbody>
                        {meetings.map((meeting, index) => (
                          <tr key={index}>
                            <td>{meeting._date}</td>
                            <td>{meeting.rating}</td>
                            <td>{meeting.comment}</td>
                            <td>{meeting.source}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Customer;
