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
}

export default new ProductsService();
