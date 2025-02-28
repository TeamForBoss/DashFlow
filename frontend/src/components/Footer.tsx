import githubImg from "../assets/images/icons/footer/githubImg.png";
import kakaoImg from "../assets/images/icons/footer/kakaoImg.png";
import pdfImg from "../assets/images/icons/footer/pdfImg.png";
import pdfFile from "../assets/pdf/SafetyTrafficLight.pdf";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footerWrap">
        <p>© {new Date().getFullYear()} Safety Traffic Lights Portfolio.</p>
        <div className="fooLeft">
          <a
            href="https://github.com/TeamForBoss/DashFlow"
            className="viewCode"
            target="_blank"
          >
            <img src={githubImg} className="foImg"></img>
          </a>{" "}
          |
          <a href={pdfFile} className="viewPdf" target="_blank">
            <img src={pdfImg} className="foImg"></img>
          </a>{" "}
          |
          <p>
            Contact : <img src={kakaoImg} className="foImg"></img>
          </p>
          <a href="https://open.kakao.com/o/sXZSHZZg" className="contactY" target="_blank">
            Yujin
          </a>{" "}
          |
          <a href="https://open.kakao.com/o/snoCRGfh" className="contactJ" target="_blank">
            Jeongim
          </a>{" "}
          |
          <a href="https://open.kakao.com/o/sbLUmxih" className="contactS" target="_blank">
            Sujin
          </a>{" "}
          |
          <a href="https://open.kakao.com/o/sdONyxih" className="contactA" target="_blank">
            Jinah
          </a>
        </div>
        <div className="fooRight"></div>
      </div>
    </footer>
  );
};

export default Footer;
