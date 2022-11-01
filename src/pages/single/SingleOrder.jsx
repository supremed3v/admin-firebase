import "./single.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import List from "../../components/table/Table";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { customStyles } from "../../components/ModalData";
import "bootstrap/dist/css/bootstrap.min.css";
import DropdownButton from "react-bootstrap/DropdownButton";

import Dropdown from "react-bootstrap/Dropdown";

import ProductServices from "../../services/firebaseHooks";

import Modal from "react-modal";

const SingleOrder = () => {
  const { orderId } = useParams();
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [user, setUser] = useState([]);

  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal(id) {
    if (id) {
      setIsOpen(true);
    }
  }

  const afterOpenModal = async () => {
    try {
      const docSnap = await ProductServices.getOneOrder(orderId);
      console.log(docSnap.data());
      setStatus(docSnap.data().status);
    } catch (error) {
      console.log(error);
    }
  };

  function closeModal() {
    setIsOpen(false);
  }

  const editDoc = (id) => {
    openModal(id);
  };

  const handleSelect = (e) => {
    console.log(e);
    setStatus(e);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newOrder = {
      status,
    };
    if (orderId) {
      try {
        await ProductServices.updateOrder(orderId, newOrder);
        console.log("Success");
      } catch (error) {
        console.log(error);
      }
    }
    sendEmail();
    closeModal();
  };

  useEffect(() => {
    setLoading(true);
    const getData = async () => {
      try {
        const docRef = doc(db, "Orders", orderId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          console.log("No such document!");
        }
      } catch (err) {
        console.log(err);
      }
    };
    getData();
    setTimeout(() => {
      setLoading(false);
    }, 4000);
  }, [orderId]);
  useEffect(() => {
    const getUser = async () => {
      try {
        const docRef = doc(db, "Users", orderId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUser(docSnap.data());
        } else {
          console.log("No such document!");
        }
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [orderId]);
  setTimeout(() => {
    console.log(user);
  }, 4000);

  const sendEmail = async () => {
    fetch(
      "https://us-central1-shoppingapp-b5fb9.cloudfunctions.net/mailApi/status",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          subject: "Order Status",
          message: `Your order status has been updated to ${status}, please check your order status`,
        }),
      }
    );
  };

  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        {!loading ? (
          <div className="top">
            <div className="left">
              <div
                onClick={() => editDoc(orderId)}
                className="editButton"
                style={{ fontSize: 18 }}
              >
                Edit Order Status
              </div>
              <h1 className="title">Information</h1>
              <div className="item">
                <div className="details">
                  <h1 className="itemTitle">{userData?.name}</h1>
                  <div className="detailItem">
                    <span className="itemKey">Address:</span>
                    <span className="itemValue">{userData?.address}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">State:</span>
                    <span className="itemValue">{userData?.state}</span>
                  </div>

                  <div className="detailItem">
                    <span className="itemKey">Amount:</span>
                    <span className="itemValue">{userData?.total}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Zip:</span>
                    <span className="itemValue">{userData?.zip}</span>
                  </div>
                  <h1 className="itemTitle" style={{ color: "black" }}>
                    Order Status:
                    {userData?.status.charAt(0).toUpperCase() +
                      userData?.status.slice(1)}
                  </h1>
                </div>
              </div>
            </div>
            <div className="right">
              <h1 className="itemTitle">Images:</h1>
              {userData !== null ? (
                userData &&
                userData.items[0].images.map((image) => (
                  <img key={image} src={image} alt="" className="itemImg" />
                ))
              ) : (
                <div className="noImages">No Images</div>
              )}
              <div>
                <h1 className="itemTitle">Items:</h1>
                {userData.items.map((item) => (
                  <div key={item.id} className="item">
                    <div className="details">
                      <h1 className="itemTitle">{item.title}</h1>
                      <div className="detailItem">
                        <span className="itemKey">Price:</span>
                        <span className="itemValue">{item.price}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="loading">Loading...</div>
        )}
        <div className="bottom">
          <h1 className="title">Last Transactions</h1>
          <List />
        </div>
        <Modal
          isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          overlayClassName="Overlay"
          contentLabel="Example Modal"
        >
          <h2>Update Order Status</h2>
          <button onClick={closeModal} style={customStyles.closeButton}>
            Close
          </button>
          <form style={customStyles.form} onSubmit={handleSubmit}>
            <div style={customStyles.formInput}>
              <label
                htmlFor="title"
                style={{
                  display: "block",
                  fontWeight: "bold",
                  fontSize: 14,
                  marginTop: 10,
                  marginBottom: 5,
                }}
              >
                Change Status
              </label>
              <DropdownButton
                alignRight
                title="Dropdown right"
                onSelect={handleSelect}
              >
                <Dropdown.Item eventKey="pending">Pending</Dropdown.Item>

                <Dropdown.Item eventKey="accepted">Accepted</Dropdown.Item>

                <Dropdown.Item eventKey="delivered">Delivered</Dropdown.Item>

                <Dropdown.Item eventKey="cancelled">Cancelled</Dropdown.Item>
              </DropdownButton>
            </div>
            <button style={customStyles.button} type="submit">
              Update
            </button>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default SingleOrder;
