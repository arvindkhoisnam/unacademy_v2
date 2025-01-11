import { currUser, email } from "@/recoil";
import { useRecoilValue } from "recoil";

function Profile() {
  const User = useRecoilValue(currUser);
  const Email = useRecoilValue(email);
  return (
    <div className="h-full w-full col-span-6 lg:col-span-5 bg-zinc-950 rounded-xl p-10">
      <h1 className="text-neutral-400 text-2xl">Profile</h1>
      <div className="h-1/2 border border-zinc-800 rounded-lg p-6">
        <div className="text-zinc-200 flex flex-col gap-3 mb-3">
          <span className="text-sm font-thin text-zinc-200">
            username: {User}
          </span>
          <span className="text-sm font-thin text-zinc-200">
            email: {Email}
          </span>
        </div>
        <div className="flex gap-3">
          <button className="bg-blue-200 px-2 py-1 rounded text-zinc-900 text-sm font-thin">
            Change password
          </button>
          <button className="bg-blue-200 px-2 py-1 rounded text-zinc-900 text-sm font-thin">
            Change username
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
