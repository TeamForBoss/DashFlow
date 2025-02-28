import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

// 지역값 저장
export const selectedRegionState = atom({
    key: "selectedRegionState",
    default: "",
    effects_UNSTABLE: [persistAtom], 
});
