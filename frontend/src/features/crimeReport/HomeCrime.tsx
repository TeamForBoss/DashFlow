import sunny from '../../assets/images/icons/weather/sun.png';

const HomeCrime = () => {
    return (
    <div className="averageWrap">
        <div className="waveContainer waveCrime">
        <div className="wave wave1"></div>
        <div className="wave wave2"></div>
        <div className="wave wave3"></div>
        </div>
        <div className="item homeCrimeItem">
        <div className="title">경기도 사고</div>
        <div className="contents">
            <div className="content">
            <img src={sunny} alt="맑음" />
            <div className="info">
                <span className="value">10℃</span>
                <span className="text">맑음</span>
            </div>
            </div>
            <div className="content">
            <img src={sunny} alt="습도" />
            <div className="info">
                <span className="value">50%</span>
                <span className="text">습도</span>
            </div>
            </div>
        </div>
        </div>
    </div>
    )
}

export default HomeCrime;