import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { productColumn, userColumns } from "../../datatablesource";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";

const Datatable = () => {
  console.log(window.location.pathname);
  const [data, setData] = useState([]);
  const [products, setProducts] = useState([]);
  const [err, setErr] = useState([]);

  useEffect(() => {
    // const fetchData = async () => {
    //   let list = [];
    //   try {
    //     const querySnapshot = await getDocs(collection(db, "users"));
    //     querySnapshot.forEach((doc) => {
    //       list.push({ id: doc.id, ...doc.data() });
    //     });
    //     setData(list);
    //     console.log(list);
    //   } catch (err) {
    //     console.log(err);
    //   }
    // };
    // fetchData();

    // LISTEN (REALTIME)
    const unsub = onSnapshot(
      collection(db, "Users"),
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

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "Products"),
      (snapShot) => {
        let product = [];
        snapShot.docs.forEach((doc) => {
          product.push({ id: doc.id, ...doc.data() });
        });
        setProducts(product);
      },
      (error) => {
        setErr(error);
      }
    );

    return () => {
      unsub();
    };
  }, []);

  const handleDelete = async (id) => {
    try {
      if (window.location.pathname === "/users") {
        await deleteDoc(doc(db, "Users", id));
        setData(data.filter((item) => item.id !== id));
      } else if (window.location.pathname === "/products") {
        await deleteDoc(doc(db, "Products", id));
        setProducts(products.filter((item) => item.id !== id));
      }
    } catch (error) {
      setErr(error);
    }
  };

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
            <div
              className="deleteButton"
              onClick={() => handleDelete(params.row.id)}
            >
              Delete
            </div>
          </div>
        );
      },
    },
  ];
  return (
    <div className="datatable">
      {window.location.pathname === "/users" ? (
        <div className="datatableTitle">
          Add New User
          <Link to="/users/new" className="link">
            Add New
          </Link>
        </div>
      ) : (
        <div className="datatableTitle">
          Add New Product
          <Link to="/products/new" className="link">
            Add New
          </Link>
        </div>
      )}
      {window.location.pathname === "/users" ? (
        <DataGrid
          className="datagrid"
          rows={data}
          columns={userColumns.concat(actionColumn)}
          pageSize={9}
          rowsPerPageOptions={[9]}
          checkboxSelection
        />
      ) : (
        <DataGrid
          className="datagrid"
          rows={products}
          columns={productColumn.concat(actionColumn)}
          pageSize={9}
          rowsPerPageOptions={[9]}
          checkboxSelection
        />
      )}
    </div>
  );
};

export default Datatable;
