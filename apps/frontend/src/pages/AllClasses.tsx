import AllClassesUser from "../components/AllClassesUser";

function AllClasses() {
  return (
    <div className="h-full w-full col-span-5 bg-neutral-900 rounded-xl p-10">
      <div>
        <h1 className="text-3xl text-neutral-400 font-light">Live Classes</h1>
        <AllClassesUser />
      </div>
    </div>
  );
}

export default AllClasses;
