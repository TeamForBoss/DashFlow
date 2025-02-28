import {atom} from "recoil";

export const hostState = atom({
    key: "hostState",
    default: "http://localhost:5000" // => backend 호스트 
});