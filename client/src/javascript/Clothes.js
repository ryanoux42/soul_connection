import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../style/Clothes.css';

function Clothes({ userId, isCoach, token }) {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerImage, setCustomerImage] = useState('');
  const [customers, setCustomers] = useState([]);
  const [hats, setHats] = useState([]);
  const [tops, setTops] = useState([]);
  const [bottoms, setBottoms] = useState([]);
  const [shoes, setShoes] = useState([]);
  const [categories, setCategories] = useState({ hat: [], top: [], bottom: [], shoe: [] });
  const [zoomedImage, setZoomedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState({
    hat: 0,
    top: 0,
    bottom: 0,
    shoe: 0,
  });

  const handleSelectChange = async (event) => {
    const customerId = parseInt(event.target.value, 10);
    const customer = customers.find(c => c.customer_id === customerId);

    try {
      const response = await axios.get(`http://localhost:5000/customer/${customer.customer_id}`, {
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
      setCustomerImage(imageResponse.data);
    } catch (error) {
      console.error('Error retrieving the data from the user');
    }
  };

  const handleImageClick = (image) => {
    setZoomedImage(image);
  };

  const handleZoomedClose = () => {
    setZoomedImage(null);
  };

  const handleImageChange = (category, direction) => {
    const maxIndex = categories[category].length - 1;
    let newIndex = currentIndex[category] + (direction === 'next' ? 1 : -1);
    if (newIndex > maxIndex) {
      newIndex = 0;
    } else if (newIndex < 0) {
      newIndex = maxIndex;
    }
    setCurrentIndex((prev) => ({ ...prev, [category]: newIndex }));
  };

  const handleHats = async() => {
    try {
      const response = await axios.get(`http://localhost:5000/customer/clothe/${selectedCustomer.customer_id}/hat`, {
        headers: {
          "token": token
        }
      });

      setHats(response.data);
    } catch {
      console.error(`Error retrieving the Hats`);
    }
  }

  const handleTops = async() => {
    try {
      const response = await axios.get(`http://localhost:5000/customer/clothe/${selectedCustomer.customer_id}/top`, {
        headers: {
          "token": token
        }
      });

      setTops(response.data);
    } catch {
      console.error(`Error retrieving the Tops`);
    }
  }

  const handleBottoms = async() => {
    try {
      const response = await axios.get(`http://localhost:5000/customer/clothe/${selectedCustomer.customer_id}/bottom`, {
        headers: {
          "token": token
        }
      });

      setBottoms(response.data);
    } catch {
      console.error(`Error retrieving the Bottoms`);
    }
  }

  const handleShoes = async() => {
    try {
      const response = await axios.get(`http://localhost:5000/customer/clothe/${selectedCustomer.customer_id}/shoe`, {
        headers: {
          "token": token
        }
      });

      setShoes(response.data);
    } catch {
      console.error(`Error retrieving the Shoes`);
    }
  }
  const handleCustomers = async (event) => {
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
    } catch(error) {
      console.error('Error while retrieving the customers');
    }
  }

  useEffect(() => {
    handleCustomers();
  }, []);

  useEffect(() => {
    if (selectedCustomer !== null) {
      handleHats();
      handleTops();
      handleBottoms();
      handleShoes();
    }
  }, [selectedCustomer]);

  useEffect(() => {
    setCategories({
      hat: hats,
      top: tops,
      bottom: bottoms,
      shoe: shoes,
    });
  }, [hats, tops, bottoms, shoes]);

  return (
    <div className="clothes-container">
      <header className="clothes-header">
        <h1>Clothes</h1>
      </header>
      <div className="clothes-main-content">
        <nav className="clothes-sidebar">
          <ul>
            <li><Link to="/home">Home</Link></li>
            {!isCoach && (
              <li><Link to="/coaches">Coaches</Link></li>
            )}
            <li><Link to="/statistics">Statistics</Link></li>
            <li><Link to="/customer">Customers</Link></li>
            <li><Link to="/compatibility">Compatibility</Link></li>
            <li><Link to="/clothes">Clothes</Link></li>
            <li><Link to="/Tips">Tips</Link></li>
            <li><Link to="/events">Events</Link></li>
          </ul>
        </nav>
        <div className='profile-container'>
          <select onChange={handleSelectChange} value={selectedCustomer?.id || ''} className="customer-selector">
            <option value="">Select a customer</option>
            {customers.map((customer, index) => (
              <option key={index} value={customer.customer_id}>{customer.firstname} {customer.lastname}</option>
            ))}
          </select>
          {selectedCustomer &&
          <>
            <div className="profile-avatar">
              <img src={customerImage} alt={`Avatar of ${selectedCustomer.firstname}`}></img>
            </div>
            <div className='profile-infos'>
              <ul>
                <li><b>Firstname:</b> {selectedCustomer.firstname}</li>
                <li><b>Lastname:</b> {selectedCustomer.lastname}</li>
                <li><b>Gender:</b> {selectedCustomer.gender}</li>
                <li><b>Sign:</b> {selectedCustomer.astro_sign}</li>
              </ul>
            </div>
            </>
          }
        </div>
        {selectedCustomer &&
        <>
          <div className="clothes-dashboard">
            {Object.keys(categories).map((category, index) => (
              <div className="clothes-category" key={index}>
                {categories[category].length > 0 && (
                  <>
                    <button className="carousel-button left" onClick={() => handleImageChange(category, 'prev')} >
                      &lt;
                    </button>
                        <img src={categories[category][currentIndex[category]]} alt={category} onClick={() => handleImageClick(categories[category][currentIndex[category]])}/>
                    <button className="carousel-button right" onClick={() => handleImageChange(category, 'next')}>
                      &gt;
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        </>
        }
      </div>
      {zoomedImage && (
        <div className="zoomed-modal" onClick={handleZoomedClose}>
          <div className="zoomed-content">
            <button className="close-button" onClick={handleZoomedClose}>
              Close
            </button>
            <img src={zoomedImage} alt="Zoomed" />
          </div>
        </div>
      )}
    </div>
  );
}

export default Clothes;
