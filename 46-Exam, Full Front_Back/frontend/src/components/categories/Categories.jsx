import React from "react";
import "./Categories.scss";
import Title from "../title/Title";
import c1 from "../../assets/images/c1.jpg.webp";
import c2 from "../../assets/images/c2.jpg.webp";
import c3 from "../../assets/images/c3.jpg.webp";
import c4 from "../../assets/images/c4.jpg.webp";


const Categories = () => {
  return (
    <section className="categories-section">
      <div className="container">
        <Title>
          <h2>Shop for Different Categories</h2>
          <p>Who are in extremely love with eco friendly system.</p>
        </Title>
        <div className="row">
          <div className="col-9">
            <div className="row">
              <div className="col-6 mb-3">
                <div className="image">
                  <img src={c1} alt="" />
                </div>
              </div>
              <div className="col-6 mb-3">
                <div className="image">
                  <img src={c2} alt="" />
                </div>
              </div>
              <div className="col-12">
                <div className="image">
                  <img src={c3} alt="" />
                </div>
              </div>
            </div>
          </div>
          <div className="col-3">
            <div className="image">
              <img src={c4} alt="" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Categories;
