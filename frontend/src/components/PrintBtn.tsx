import React from "react";
import html2canvas from "html2canvas";

interface PrintBtnProps {
  printRef: React.RefObject<HTMLDivElement>; // ✅ 부모에서 받아온 printRef
}

const PrintBtn: React.FC<PrintBtnProps> = ({ printRef }) => {
  const onClickPrint = async () => {
    if (!printRef.current) return; // ✅ printRef가 null인지 확인

    try {
      const canvas = await html2canvas(printRef.current, {
        scale: 2, // ✅ 캡처 해상도 높이기
        useCORS: true, // ✅ 외부 이미지 캡처 허용
        logging: false, // ✅ 콘솔 로그 안 뜨게
      });

      const imgData = canvas.toDataURL("image/png");
      const printWindow = window.open("", "_blank", "width=1350,height=800");

      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Print</title>
              <style>
                body { text-align: center; margin: 0; padding: 0; }
                img { width: 100%; max-width: 100%; height: auto; }
              </style>
            </head>
            <body>
            </body>
          </html>
        `);
        printWindow.document.close();

        const img = new Image();
        img.src = imgData;
        img.style.width = "100%";
        img.onload = () => {
          printWindow.document.body.appendChild(img);
          printWindow.focus();
          printWindow.print();
        };
      }
    } catch (error) {
      console.error("Print error:", error);
    }
  };

  return (
    <button className="acPrintBtn" onClick={onClickPrint}>
      인쇄
    </button>
  );
};

export default PrintBtn;
