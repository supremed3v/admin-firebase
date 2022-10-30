import React from "react";
import Modal from "react-modal";
export const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: 400,
  },
  form: {
    display: "flex",
    flexWrap: "wrap",
    gap: 30,
    justifyContent: "center",
    alignItems: "center",
    width: "50%",
  },

  formInput: {
    width: "100%",
  },
  input: {
    width: "100%",
    padding: 5,
    border: "none",
    borderBottom: "1px solid black",
  },
  button: {
    width: 150,
    padding: 10,
    border: "none",
    backgroundColor: "teal",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: 10,
  },
  closeButton: {
    width: 75,
    padding: 5,
    border: "none",
    backgroundColor: "red",
    opacity: 0.5,
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: 5,
    position: "absolute",
    left: 300,
    top: 60,

    borderRadius: 100,
  },
};
Modal.setAppElement("#root");

const ModalData = (id) => {
  const [modalIsOpen, setIsOpen] = React.useState(false);

  function openModal() {
    if (id) {
      setIsOpen(true);
    }
  }

  function afterOpenModal() {}

  function closeModal() {
    setIsOpen(false);
  }
  return (
    <div>
      <button onClick={openModal}>Open Modal</button>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <h2>Hello</h2>
        <button onClick={closeModal}>close</button>
        <div>I am a modal</div>
        <form>
          <input />
          <button>tab navigation</button>
          <button>stays</button>
          <button>inside</button>
          <button>the modal</button>
        </form>
      </Modal>
    </div>
  );
};

export default ModalData;
