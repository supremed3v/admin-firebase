import "./list.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import OrderTable from "../../components/datatable/OrderTable";

const OrderList = () => {
  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <OrderTable />
      </div>
    </div>
  );
};

export default OrderList;
