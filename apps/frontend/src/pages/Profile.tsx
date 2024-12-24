import { RxHamburgerMenu } from "react-icons/rx";
function Profile() {
  return (
    <div className="h-full w-full col-span-6 lg:col-span-5 bg-neutral-900 rounded-xl p-10">
      <div className="flex justify-end lg:hidden">
        <RxHamburgerMenu className="text-3xl text-violet-500 cursor-pointer" />
      </div>
      <h1 className="text-neutral-400 text-2xl">Profile</h1>
    </div>
  );
}

export default Profile;
