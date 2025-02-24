import React from "react";
import logo from "../assets/images/logo/main_logo.png"; // 로고 이미지 경로 설정 (적절히 변경)

// Props 타입 지정
interface HeaderProps {
    page: "home" | "accident" | "crime" | "weather" | "select";
}

// 중간 텍스트 및 색상 설정
const textConfig: Record<HeaderProps["page"], { text: string; color: string }> = {
    home: { text: "", color: "" },
    accident: { text: "사고 발생 현황", color: "header-text-accident" },
    crime: { text: "범죄 발생 현황", color: "header-text-crime" },
    weather: { text: "날씨 정보", color: "header-text-weather" },
    select: { text: "카테고리 선택", color: "header-text-select" },
};

// 버튼 설정
const buttonConfig: Record<HeaderProps["page"], string[]> = {
    accident: ["날씨", "범죄"],
    crime: ["날씨", "사고"],
    weather: ["사고", "범죄"],
    select: [],
    home: [],
};

const Header: React.FC<HeaderProps> = ({ page }) => {
    return (
        <header className={`header-container ${page === "home" ? "header-home" : ""}`}>
            <div className="header-logo">
                <img src={logo} alt="안전신호등 로고" className="header-logo-img" />
            </div>
            {page !== "home" && (
                <>
                    <span className={`header-subtitle ${textConfig[page].color}`}>
                        {textConfig[page].text}
                    </span>
                    <div className="header-buttons">
                        {buttonConfig[page].map((btn, index) => (
                            <button key={index} className="header-btn">
                                {btn}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </header>
    );
};

export default Header;
