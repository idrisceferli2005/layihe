import React from "react";
import "./Search.scss";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../redux/features/productSlice";
import { useEffect } from "react";
import SearchProduct from "../searchproduct/SearchProduct";

const Search = () => {
  const { products } = useSelector((state) => state.products);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);
  return (
    <section className="search-section">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h2 className="search-title">Related Searched Products</h2>
            <p className="search-text">
              Who are in extremely love with eco friendly system.
            </p>
          </div>
          {products &&
            products.map((product) => (
              <SearchProduct key={product._id} product={product} />
            ))}
        </div>
      </div>
    </section>
  );
};

export default Search;
