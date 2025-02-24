import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const selectedRegionState = atom({
    key: "selectedRegionState",
    default: "suwon",
    effects_UNSTABLE: [persistAtom],
});
