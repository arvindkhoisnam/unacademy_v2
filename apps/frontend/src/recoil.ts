import { atom } from "recoil";

const userRole = atom({
  key: "userRole",
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

const toDisplay = atom<"video" | "image" | "board">({
  key: "toDisplay",
  default: "video",
});

const socket = atom<WebSocket | null>({
  key: "socket",
  default: null,
});
export {
  userRole,
  sessionTitle,
  videoToken,
  totalParticipants,
  imageUrls,
  toDisplay,
  socket,
};
