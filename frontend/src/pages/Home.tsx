import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate(); // useNavigate 훅 사용

  return (
    <div style={styles.container}>
      <button
        onClick={() => navigate("/accident-status")}
        style={styles.button}
      >
      진아's Accident_DashBoard
      </button>
      <button
        onClick={() => navigate("/crime-report")}
        style={styles.button}
      >
      정임's Crime_DashBoard
      </button>
      <button
        onClick={() => navigate("/weather-info")}
        style={styles.button}
      >
      유진's Weather_DashBoard
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: "flex", // 버튼들을 가로 정렬
    justifyContent: "center", // 가운데 정렬
    alignItems: "center", // 세로 중앙 정렬
    gap: "20px", // 버튼 간 간격 추가
    height: "50vh",
  },
  button: {
    padding: "12px 24px",
    fontSize: "18px",
    backgroundColor: "#6a5acd", // 보라색 포인트 컬러
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "0.3s",
  },
};

export default Home;
