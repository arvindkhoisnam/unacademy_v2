import { atom } from "recoil";

const userRole = atom({
  key: "userRole",
  default: "",
});

const currUser = atom({
  key: "currUser",
  default: "",
});
const sessionTitle = atom({
  key: "sessionTitle",
  default: "",
});

const videoToken = atom({
  key: "videoToken",
  default: "",
});

const totalParticipants = atom({
  key: "totalParticipants",
  default: 0,
});

const imageUrls = atom<string[]>({
  key: "imageUrls",
  default: [],
});

const imageCurrPage = atom({
  key: "imageCurrPage",
  default: 0,
});

const toDisplay = atom<"video" | "image" | "board">({
  key: "toDisplay",
  default: "video",
});

const socket = atom<WebSocket | null>({
  key: "socket",
  default: null,
});

const whiteBoardState = atom({
  key: "whiteBoardState",
  default: [],
});
export {
  userRole,
  sessionTitle,
  videoToken,
  totalParticipants,
  imageUrls,
  toDisplay,
  socket,
  currUser,
  imageCurrPage,
  whiteBoardState,
};
