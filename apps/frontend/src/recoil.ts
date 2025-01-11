import { atom } from "recoil";

const userRole = atom({
  key: "userRole",
  default: "",
});

const currUser = atom({
  key: "currUser",
  default: "",
});

const email = atom({
  key: "email",
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

type boardState = {
  adminHeight: number;
  adminWidth: number;
  currPage: number | null;
  imgUrl: string | null;
  x: number;
  y: number;
  event: string;
  stroke: string;
};
const whiteBoardState = atom<boardState[]>({
  key: "whiteBoardState",
  default: [],
});

export {
  userRole,
  email,
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
