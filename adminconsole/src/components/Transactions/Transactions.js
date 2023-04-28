import React, { useEffect } from 'react';
import NavBar from '../Main/NavBar';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllTransactions } from './action';

const Transactions = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllTransactions());
  }, []);

  const { transactions } = useSelector((e) => e.transc);
  console.log(transactions);
  const tableData = transactions.map((trans, index) => {
    return (
      <tr>
        
        <td>{trans.driver.user.name}</td>
        <td>{trans.amount}</td>
        <td>{trans.type}</td>
        
      </tr>
    );
  });
  return (
    <div className="container-fluid">
      <div className="row">
        <NavBar />
        <div className="col-sm p-3 min-vh-100">
        <table class="table table-dark mt-5">
              <thead>
                <tr>
                  
                  <th scope="col">Name</th>
                  <th scope="col">amount paid</th>
                  <th scope="col">payment type</th>
                 
                </tr>
              </thead>
              <tbody>{tableData}</tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
