import { updateDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

class ProductsService {
  updateProduct = (id, updatedProduct) => {
    const productDoc = doc(db, "Products", id);
    return updateDoc(productDoc, updatedProduct);
  };

  getOneProduct = (id) => {
    const productDoc = doc(db, "Products", id);
    return getDoc(productDoc);
  };

  getOneOrder = (id) => {
    const orderDoc = doc(db, "Orders", id);
    return getDoc(orderDoc);
  };

  updateOrder = (id, updatedOrder) => {
    const orderDoc = doc(db, "Orders", id);
    return updateDoc(orderDoc, updatedOrder);
  };
}

export default new ProductsService();
