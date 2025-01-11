import AllClassesUser from "../components/AllClassesUser";

function AllClasses() {
  return (
    <div className="h-full w-full col-span-5 bg-zinc-950 rounded-xl p-10">
      <div>
        <h1 className="text-2xl text-neutral-400 font-light">Live Classes</h1>
        <AllClassesUser />
      </div>
    </div>
  );
}

export default AllClasses;
