import React, { useState } from "react";
import "./Admin.scss";
import Table from "react-bootstrap/Table";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import {
  addProduct,
  deleteProduct,
  searchProduct,
  sortProductHigest,
  sortProductLowest,
} from "../../redux/features/ProductSlice";
import { productSchema } from "../../schema/ProductCreateSchema";

const Admin = () => {
  const { products } = useSelector((state) => state.products);
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);

  const {
    values,
    handleChange,
    handleSubmit,
    setFieldValue,
    errors,
    resetForm,
  } = useFormik({
    initialValues: {
      image: null,
      title: "",
      category: "",
      price: "",
    },
    onSubmit: (values) => {
      const formData = new FormData();

      formData.append("image", values.image);
      formData.append("title", values.title);
      formData.append("category", values.category);
      formData.append("price", values.price);
      
      dispatch(addProduct(formData));
      resetForm();
      setOpen(false);
    },
    validationSchema: productSchema,
  });

  return (
    <div className="container">
      {open && (
        <form
          encType="multipart/form-data"
          action=""
          className="form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <h3>Create Product</h3>
          <div className="form-group">
            <label htmlFor="image">Image</label>
            <div className="text-danger">{errors.image}</div>
            <input
              type="file"
              id="image"
              className="form-control"
              onChange={(e) => setFieldValue("image", e.currentTarget.files[0])}
            />
          </div>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <div className="text-danger">{errors.title}</div>
            <input
              type="text"
              id="title"
              className="form-control"
              onChange={handleChange}
              value={values.title}
            />
          </div>
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <div className="text-danger">{errors.category}</div>
            <input
              type="text"
              id="category"
              className="form-control"
              onChange={handleChange}
              value={values.category}
            />
          </div>
          <div className="form-group">
            <label htmlFor="price">Price</label>
            <div className="text-danger">{errors.price}</div>
            <input
              type="text"
              id="price"
              className="form-control"
              onChange={handleChange}
              value={values.price}
            />
          </div>

          <button className="btn btn-primary">Add</button>
        </form>
      )}
      <h2 className="text-center my-3">Admin Panel</h2>
      <div className=" mb-2 d-flex justify-content-between">
        <button className="btn btn-success" onClick={() => setOpen(!open)}>
          Create
        </button>
        <input
          type="text"
          onChange={(e) => dispatch(searchProduct(e.target.value))}
        />
        <div className="d-flex gap-2">
          <button
            className="btn btn-primary"
            onClick={() => dispatch(sortProductLowest())}
          >
            Low
          </button>
          <button
            className="btn btn-primary"
            onClick={() => dispatch(sortProductHigest())}
          >
            High
          </button>
        </div>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Category</th>
            <th>Price</th>
            <th>Setting</th>
          </tr>
        </thead>
        <tbody>
          {products &&
            products.map((item) => (
              <tr key={item._id}>
                <td>
                  <img
                    style={{ width: "100px", height: "100px" }}
                    src={`http://localhost:5000/${item.image}`}
                    alt=""
                  />
                </td>
                <td>{item.title}</td>
                <td>{item.category}</td>
                <td>{item.price}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => dispatch(deleteProduct(item._id))}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Admin;
