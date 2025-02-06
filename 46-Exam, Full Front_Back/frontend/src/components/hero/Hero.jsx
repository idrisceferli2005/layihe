import React from "react";
import heroImg from "../../assets/images/header-img.png.webp";
import "./Hero.scss";
const Hero = () => {
  return (
    <section className="hero-section">
      <div className="hero">
        <div className="row">
          <div className="col-6">
            <div className="image">
              <img src={heroImg} alt="" />
            </div>
          </div>
          <div className="col-6">
            <div className="content">
              <p>Flat 75%Off</p>
              <h1>
                It’s Happening <br />
                this Season!
              </h1>
              <button>purchase Now</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
