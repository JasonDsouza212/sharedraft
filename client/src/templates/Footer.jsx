import React from "react";

const Footer = () => {
  const date = new Date();
  const year = date.getFullYear();
  return (
    <div className="bg-gray-900 text-white">
      <br />
      <p>
        <span className="uppercase">Copyright &copy; DraftShare {year}</span>
        &nbsp;&nbsp; | &nbsp;&nbsp;
        <span>
          Maintained by&nbsp;
          <a href="https://github.com/JasonDsouza212" className="uppercase">
            <b>Jason Dsouza</b>
          </a>
        </span>
      </p>
      <br />
    </div>
  );
};

export default Footer;
