import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Input, Space, Button } from 'antd';
import 'antd/dist/reset.css';
import CustomerTable from './components/CustomerTable/CustomerTable';
import CustomerChart from './components/CustomerChart/CustomerChart';

const App = () => {
  const [customers, setCustomers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchAmount, setSearchAmount] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/customers').then(response => {
      console.log('Customers:', response.data); // Log the customers data
      setCustomers(response.data);
    });
    axios.get('http://localhost:5000/transactions').then(response => {
      console.log('Transactions:', response.data); // Log the transactions data
      setTransactions(response.data);
    });
  }, []);

  const handleSearch = () => {
    let filtered = transactions;

    if (searchName) {
      const customer = customers.find(c => c.name.toLowerCase().includes(searchName.toLowerCase()));
      console.log('Customer found for search:', customer); // Log the found customer
      if (customer) {
        filtered = filtered.filter(t => t.customer_id === customer.id);
      } else {
        filtered = [];
      }
    }

    if (searchAmount) {
      filtered = filtered.filter(t => t.amount === parseInt(searchAmount));
    }

    setFilteredTransactions(filtered);

    // Debugging output
    console.log('Filtered Transactions:', filtered);
  };

  const handleCustomerClick = (customerId) => {
    setSelectedCustomer(customerId);
  };

  const getCustomerName = (customerId) => {
    const customer = customers.find(c => c.id === customerId);
    return customer ? customer.name : '';
  };

  const transactionsByDate = selectedCustomer ? transactions.filter(t => t.customer_id === selectedCustomer).reduce((acc, curr) => {
    const date = curr.date;
    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date] += curr.amount;
    return acc;
  }, {}) : {};

  const chartData = Object.keys(transactionsByDate).map(date => ({
    date,
    amount: transactionsByDate[date]
  }));

  return (
    <div>
      <h1>Transactions</h1>
      <Space style={{ marginBottom: 16 }}>
        <Input placeholder="Search by customer name" value={searchName} onChange={(e) => setSearchName(e.target.value)} />
        <Input placeholder="Search by transaction amount" value={searchAmount} onChange={(e) => setSearchAmount(e.target.value)} />
        <Button onClick={handleSearch}>Search</Button>
      </Space>
      <CustomerTable
        transactions={filteredTransactions}
        customers={customers}
        handleCustomerClick={handleCustomerClick}
        getCustomerName={getCustomerName}
      />
      {selectedCustomer && (
        <CustomerChart chartData={chartData} />
      )}
    </div>
  );
};

export default App;



