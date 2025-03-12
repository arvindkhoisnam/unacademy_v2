import { currUser, email, navbarHeight, userRole } from "@/recoil";
import { useRecoilValue } from "recoil";
import { CiUser } from "react-icons/ci";
import { useEffect, useState } from "react";

function Profile() {
  const User = useRecoilValue(currUser);
  const Email = useRecoilValue(email);
  const Role = useRecoilValue(userRole);
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
      className={`w-full col-span-6 xl:col-span-5 bg-zinc-950 rounded-xl p-10 flex flex-col md:flex-row justify-center items-start md:items-center md:block relative overflow-y-auto scrollbar-thin scrollbar-track-zinc-950 scrollbar-thumb-zinc-500`}
    >
      <h1 className="text-neutral-400 text-2xl mb-10">Profile</h1>
      <div className="w-full flex flex-col items-start px-5 py-10 lg:flex-row bg-zinc-900 rounded-xl gap-10 relative">
        <div className="size-20 rounded-full bg-zinc-500 flex items-center justify-center">
          <CiUser fontSize={40} color="black" />
        </div>
        <div className="flex flex-col gap-3">
          <p className="text-lg font-extralight text-blue-300">{User}</p>
          <div className="flex flex-col lg:flex-row gap-10 md:gap-20">
            <div className="font-extralight min-w-fit">
              <p className="text-zinc-500 text-base lg:text-lg">Role</p>
              <p className="text-zinc-300 text-xs lg:text-sm">{Role}</p>
            </div>
            <div className="font-extralight min-w-fit">
              <p className="text-zinc-500 text-base lg:text-lg">
                Email Address
              </p>
              <p className="text-zinc-300 text-xs lg:text-sm">{Email}</p>
            </div>
            <div className="font-extralight min-w-fit">
              <p className="text-zinc-500 text-base lg:text-lg">Phone Number</p>
              <p className="text-zinc-300 text-xs lg:text-sm">+91 9876543210</p>
            </div>
            <div className="font-extralight min-w-fit">
              <p className="text-zinc-500 text-base lg:text-lg">Password</p>
              <p className="text-zinc-300 text-xs lg:text-sm">******</p>
            </div>
          </div>
        </div>
        <div className="flex justify-center w-full lg:w-fit lg:absolute lg:top-5 right-5">
          <button className="bg-blue-200 text-zinc-900 text-sm font-extralight rounded px-4 py-1">
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
