import React from "react";
import OrderList from "../list/OrdersList";

const Orders = ({ title }) => {
  return (
    <div>
      <OrderList />
      <h1>{title}</h1>
    </div>
  );
};

export default Orders;
