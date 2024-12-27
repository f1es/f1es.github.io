import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import Decoration from "./components/decoration.jsx";
import DecorationForm from "./components/DecorationForm.jsx";
import axios from "axios";

function App() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [decorations, setDecorations] = useState([]);
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });

  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState("");
  const [initialValues, setInitialValues] = useState({});

  const [url, setUrl] = useState("http://localhost:5000");

  useEffect(() => {
    fetchDecorations();
  }, []);

  const fetchDecoration = async (decorationId) => {
    const response = await axios.get(`${url}/api/decorations/${decorationId}`);

    return response.data;
  };

  const fetchDecorations = () => {
    axios
      .get(`${url}/api/decorations`, {
        headers: {
          "ngrok-skip-browser-warning": "1",
        },
      })
      .then((response) => {
        setDecorations(response.data);
      });
  };

  const deleteDecoration = (decorationId) => {
    axios.delete(`${url}/api/decorations/${decorationId}`).then((response) => {
      fetchDecorations();
    });
  };

  const createDecoration = (author, message, type, x, y) => {
    axios
      .post(`${url}/api/decorations`, {
        author: author,
        message: message,
        type: type,
        x: x,
        y: y,
      })
      .then((response) => {
        fetchDecorations();
      });
  };

  const updateDecoration = (decorationId, author, message, type, x, y) => {
    axios
      .put(`${url}/api/decorations/${decorationId}`, {
        author: author,
        message: message,
        type: type,
        x: x,
        y: y,
      })
      .then((response) => {
        fetchDecorations();
      });
  };

  const handleMouseClick = (event) => {
    if (isModalVisible) return;

    setCoordinates({ x: event.clientX - 50, y: event.clientY - 50 });

    setIsEdit(false);
    setInitialValues({});

    showModal();
  };

  const handleDecorationUpdate = (decorationId) => {
    if (isModalVisible) return;

    setIsEdit(true);
    setEditId(decorationId);

    const decorationToEdit = decorations.find(
      (decoration) => decoration.id == decorationId
    );
    setInitialValues(decorationToEdit);

    showModal();
  };

  const handleSubmit = async (values) => {
    if (isEdit) {
      const decoration = await fetchDecoration(editId);

      updateDecoration(
        editId,
        values.author,
        values.message,
        values.type,
        decoration.x,
        decoration.y
      );
    } else {
      createDecoration(
        values.author,
        values.message,
        values.type,
        coordinates.x,
        coordinates.y
      );
    }

    setIsModalVisible(false);
  };

  const showModal = () => {
    if (isModalVisible) return;
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setInitialValues({});
  };

  return (
    <div
      onClick={handleMouseClick}
      style={{
        height: "90vh",
        width: "95vw",
        position: "relative",
        display: "grid",
        flexWrap: "wrap",
        justifyContent: "space-between",
      }}
    >
      {decorations.map((component) => (
        <Decoration
          decorationId={component.id}
          key={component.id}
          x={component.x}
          y={component.y}
          author={component.author}
          message={component.message}
          type={component.type}
          handleDelete={deleteDecoration}
          handleUpdate={handleDecorationUpdate}
        />
      ))}
      <Modal
        title="Write your message"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <DecorationForm
          handleSubmit={handleSubmit}
          initialValues={initialValues}
          isEdit={isEdit}
        />
      </Modal>
    </div>
  );
}

export default App;
