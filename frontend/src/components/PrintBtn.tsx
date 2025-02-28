import React, { useRef } from "react";
import html2canvas from "html2canvas";
import printImg from "../assets/images/svg/printImg.png";

interface PrintBtnProps {
  printRef: React.RefObject<HTMLDivElement | null>;
}

const PrintBtn: React.FC<PrintBtnProps> = ({ printRef }) => {
  const isPrinting = useRef(false); //

  const onClickPrint = async () => {
    if (!printRef.current || isPrinting.current) return;

    isPrinting.current = true;

    try {
      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        windowWidth: printRef.current.scrollWidth,
        windowHeight: printRef.current.scrollHeight,
      });

      const imgData = canvas.toDataURL("image/png");
      const printWindow = window.open("", "_blank", "width=1350,height=800");

      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Print</title>
              <style>
                body { text-align: center; margin-left: 0rem; padding-top: 5rem; }
                img { width: 60%; max-width: 100%; height: auto; }
              </style>
            </head>
            <body>
              <img id="printImage" src="${imgData}" style="width: 200rem; height:85%" />
            </body>
          </html>
        `);
        printWindow.document.close();

        const img = printWindow.document.getElementById(
          "printImage"
        ) as HTMLImageElement;
        img.onload = () => {
          printWindow.focus();
          printWindow.print();
          isPrinting.current = false;
        };
      }
    } catch (error) {
      console.error("Print error:", error);
      isPrinting.current = false;
    }
  };

  return (
    <button className="acAndcrPrintBtn" onClick={onClickPrint}>
      <img src={printImg} alt="Print" />
    </button>
  );
};

export default PrintBtn;
