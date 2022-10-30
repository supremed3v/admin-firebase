import "./single.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import List from "../../components/table/Table";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import Modal from "react-modal";
import { customStyles } from "../../components/ModalData";

import ProductServices from "../../services/firebaseHooks";

const SingleProduct = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(1);
  const { productId } = useParams();
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);

  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal(id) {
    if (id) {
      setIsOpen(true);
    }
  }

  const afterOpenModal = async () => {
    try {
      const docSnap = await ProductServices.getOneProduct(productId);
      console.log(docSnap.data());
      setTitle(docSnap.data().title);
      setPrice(docSnap.data().price);
      setDescription(docSnap.data().description);
      setStock(docSnap.data().stock);
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

  const handleSubmit = async (e) => {
    const newBook = {
      title,
      description,
      stock,
      price,
    };
    e.preventDefault();
    if (productId) {
      try {
        await ProductServices.updateProduct(productId, newBook);
        console.log("Success");
      } catch (error) {
        console.log(error);
      }
    }
    setTitle("");
    setDescription("");
    setPrice(0);
    setStock(1);
  };

  useEffect(() => {
    setLoading(true);
    const getData = async () => {
      try {
        const docRef = doc(db, "Products", productId);
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
    setLoading(false);
  }, [productId]);

  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        {loading ? (
          <div className="loading">
            <div className="loadingSpinner"></div>
          </div>
        ) : (
          <div className="top">
            <div className="left">
              <div onClick={() => editDoc(productId)} className="editButton">
                Edit
              </div>
              <h1 className="title">Information</h1>
              <div className="item">
                <div className="details">
                  <h1 className="itemTitle">{userData?.title}</h1>
                  <div className="detailItem">
                    <span className="itemKey">Price:</span>
                    <span className="itemValue">{userData?.price}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Stock:</span>
                    <span className="itemValue">{userData?.stock}</span>
                  </div>

                  <div className="detailItem">
                    <span className="itemKey">Description:</span>
                    <span className="itemValue">{userData?.description}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="right">
              <h1 className="itemTitle">Images:</h1>
              {userData.images ? (
                userData &&
                userData?.images.map((image) => (
                  <img key={image} src={image} alt="" className="itemImg" />
                ))
              ) : (
                <div className="noImages">No Images</div>
              )}
            </div>
          </div>
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
          <h2>Update Product</h2>
          <button onClick={closeModal} style={customStyles.closeButton}>
            Close
          </button>
          <form style={customStyles.form} onSubmit={handleSubmit}>
            <div style={customStyles.formInput}>
              <label htmlFor="title">Title</label>
              <input
                style={customStyles.input}
                type="text"
                id="title"
                placeholder=""
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <label htmlFor="price">Price</label>
              <input
                style={customStyles.input}
                type="text"
                id="price"
                placeholder="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <label htmlFor="stock">Stock</label>
              <input
                style={customStyles.input}
                type="text"
                id="stock"
                placeholder="stock"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
              <label htmlFor="description">Description</label>
              <input
                style={customStyles.input}
                type="text"
                id="description"
                placeholder="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <button style={customStyles.button} type="submit">
                Update
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default SingleProduct;
