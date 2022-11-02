import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { orderColumn } from "../../datatablesource";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";

const OrderTable = () => {
  const [data, setData] = useState([]);
  const [orders, setOrders] = useState([]);
  const [err, setErr] = useState([]);

  useEffect(() => {
    // LISTEN (REALTIME)
    const unsub = onSnapshot(
      collection(db, "Orders"),
      (snapShot) => {
        let list = [];
        snapShot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setData(list);
      },
      (error) => {
        setErr(error);
      }
    );
    return () => {
      unsub();
    };
  }, []);
  console.log(data);

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link
              to={window.location.pathname + "/" + params.row.id}
              style={{ textDecoration: "none" }}
            >
              <div className="viewButton">View</div>
            </Link>
          </div>
        );
      },
    },
  ];
  return (
    <div>
      {data.length > 0 && (
        <div className="datatable">
          <DataGrid
            className="datagrid"
            rows={data.map((item) => {
              return { ...item.data.items, id: item.id };
            })}
            columns={orderColumn.concat(actionColumn)}
            pageSize={9}
            rowsPerPageOptions={[9]}
            checkboxSelection
          />
        </div>
      )}
    </div>
  );
};

export default OrderTable;
