
const Footer = () => {
  return (
    <footer className="footer">
          <div className="footerWrap">
              <p>© {new Date().getFullYear()} Safety Warning Light. ForBoss. </p>
              <div className="fooLeft">
                <a href="#" className="viewCode">code</a> |
                <a href="#" className="viewPdf">pdf</a> |
                  <p>Contact :</p>
                <a href="#" className="contactY">Yujin</a> |
                <a href="#" className="contactJ">Jeongim</a> |
                <a href="#" className="contactS">Sujin</a> |
                <a href="#" className="contactA">Jinah</a>
              </div>
              <div className="fooRight">
                  <p>All rights reserved.</p>
              </div>
        </div>
    </footer>
  )
}

export default Footer
