import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useEffect, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, storage } from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";

const New = ({ inputs, title }) => {
  const [loader, setLoader] = useState(false);
  const [file, setFile] = useState([]);
  const [cat, setCat] = useState("");

  const [data, setData] = useState({
    title: "",
    description: "",
    stock: 0,
    price: 0,
  });
  const [urls, setUrls] = useState([]);
  const [preview, setPreview] = useState([]);
  const [per, setPerc] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    for (let i = 0; i < e.target.files.length; i++) {
      const newImage = e.target.files[i];
      newImage["id"] = Math.random();
      setFile((prevState) => [...prevState, newImage]);
      setPreview([...preview, URL.createObjectURL(newImage)]);
      for (let i = 0; i < preview.length; i++) {
        URL.revokeObjectURL(preview[i]);
      }
    }
  };

  const categories = [
    "Laptop",
    "Footwear",
    "Bottom",
    "Tops",
    "Attire",
    "Camera",
    "SmartPhones",
  ];

  useEffect(() => {
    const handleUpload = () => {
      try {
        let result = Promise.all(
          file.map((el) => {
            return new Promise((resolve, reject) => {
              const storageRef = ref(storage, `images/${el.name + Date.now()}`);
              const uploadTask = uploadBytesResumable(storageRef, el);
              uploadTask.on(
                "state_changed",
                (snapshot) => {
                  var progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                  setPerc(progress);
                },
                reject,
                () => {
                  getDownloadURL(uploadTask.snapshot.ref).then(function (
                    downloadURL
                  ) {
                    setUrls((prevState) => [...prevState, downloadURL]);
                    resolve(downloadURL);
                  });
                }
              );
            });
          })
        );
        result.then((res) => {
          console.log(res);
          setUrls(res);
        });
      } catch (error) {
        console.log(error);
      }
    };

    file && handleUpload();
  }, [file]);

  const handleInput = (e) => {
    const id = e.target.id;
    const value = e.target.value;

    setData({ ...data, [id]: value, images: urls });
  };
  const handleAdd = async (e) => {
    setLoader(true);
    e.preventDefault();
    await addDoc(collection(db, "Products"), {
      ...data,
      category: cat,
      timeStamp: serverTimestamp(),
      reviews: [
        {
          userId: "",
          name: "",
          rating: 0,
          comment: "",
          createdAt: new Date().toISOString(),
        },
      ],
      numOfReviews: 0,
    });
    setLoader(false);
    navigate(-1);
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="bottom">
          <div className="left">
            {file.length !== 0 ? (
              file.map((el) => (
                <img
                  src={
                    file
                      ? URL.createObjectURL(el)
                      : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                  }
                  alt=""
                />
              ))
            ) : (
              <>
                <img
                  src="https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                  alt=""
                />
                <h3>Add multiple images</h3>
              </>
            )}
          </div>
          <div className="right">
            {loader ? (
              <div className="loader">
                <h1>Uploading...</h1>
              </div>
            ) : (
              <form onSubmit={handleAdd}>
                <div className="formInput">
                  <label htmlFor="file">
                    <DriveFolderUploadOutlinedIcon />
                    Select Images
                  </label>
                  <input
                    type="file"
                    id="file"
                    multiple
                    onChange={handleChange}
                  />
                </div>

                {inputs.map((input) => (
                  <div className="formInput" key={input.id}>
                    <label>{input.label}</label>
                    <input
                      id={input.id}
                      type={input.type}
                      placeholder={input.placeholder}
                      onChange={handleInput}
                    />
                  </div>
                ))}
                {window.location.pathname === "/products/new" && (
                  <div className="formInput">
                    <label>Category</label>
                    <select
                      id="category"
                      onChange={(e) => setCat(e.target.value)}
                    >
                      <option value="">Select Category</option>
                      {categories.map((category, index) => (
                        <option value={category} key={index} id={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <button disabled={urls.length === 0 && per < 100} type="submit">
                  Send
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default New;
