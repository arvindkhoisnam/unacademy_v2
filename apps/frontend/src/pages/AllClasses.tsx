import { useRecoilValue } from "recoil";
import AllClassesUser from "../components/AllClassesUser";
import { navbarHeight } from "@/recoil";
import { useEffect, useState } from "react";

function AllClasses() {
  const NavbarHeight = useRecoilValue(navbarHeight);
  const [deviceHeight, setDeviceHeight] = useState<number | null>(null);
  useEffect(() => {
    setDeviceHeight(window.innerHeight);
  }, []);
  return (
    <div
      style={{
        height: `calc(100vh - ${NavbarHeight}px - 16px - 16px)`,
        overflowY: `${deviceHeight! < 800 ? "scroll" : "auto"}`,
      }}
      className={`w-full col-span-5 bg-zinc-950 rounded-xl py-10 relative overflow-y-auto scrollbar-thin scrollbar-track-zinc-950 scrollbar-thumb-zinc-500`}
    >
      <div>
        <h1 className="text-sm md:text-2xl text-neutral-400 font-light ml-10">
          Live Classes
        </h1>
        <AllClassesUser />
      </div>
    </div>
  );
}

export default AllClasses;
