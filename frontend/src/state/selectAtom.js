import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const selectedSectionState = atom({
    key: "selectedSectionState",
    default: "seoul",
    effects_UNSTABLE: [persistAtom],
});

// ===============================

// main => logo
// seoul => seoulLogo
// gyeonggi => gyeonggiLogo
// incheon => incheonLogo


// seoul: "서울시"
// gyeonggi: "경기도"
// incheon: "인천시" 

// ===============================
