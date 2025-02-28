import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

// 
export const selectedSectionState = atom({
    key: "selectedSectionState",
    default: "",
    effects_UNSTABLE: [persistAtom],
});

// ===============================
// [main에서 선택한 지역 저장]

// main => logo
// seoul => seoulLogo
// gyeonggi => gyeonggiLogo
// incheon => incheonLogo

// seoul: "서울시"
// gyeonggi: "경기도"
// incheon: "인천시"

// ===============================
