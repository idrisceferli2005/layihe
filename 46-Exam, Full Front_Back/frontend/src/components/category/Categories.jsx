import React from "react";
import "./Categories.scss";
import c1Image from "../../assets/images/c1.jpg";
import c2Image from "../../assets/images/c2.jpg";
import c3Image from "../../assets/images/c3.jpg";
import c4Image from "../../assets/images/c4.jpg";

const Categories = () => {
  return (
    <section className="category_section">
      <div className="container">
        <div className="row">
          <div className="category-header">
            <h2 className="category-title">Shop for Different Categories</h2>
            <p className="category-text">
              Who are in extremely love with eco friendly system.
            </p>
          </div>
          <div className="categories">
            <div className="row">
              <div className="col-9">
                <div className="row">
                  <div className="col-6 mb-3">
                    <div className="image ">
                      <img src={c1Image} alt="" />
                    </div>
                  </div>
                  <div className="col-6 mb-3">
                    <div className="image">
                      <img src={c2Image} alt="" />
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="image">
                      <img src={c3Image} alt="" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-3">
                <div className="image">
                  <img src={c4Image} alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Categories;
