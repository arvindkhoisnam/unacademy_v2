import CreateSess from "../components/CreateSess";
import AllClassAdmin from "../components/AllClassAdmin";

function Admin() {
  return (
    <div className="h-full w-full col-span-5 bg-neutral-900 rounded-xl p-10">
      <div>
        <h1 className="text-2xl text-neutral-400 font-light">
          Manage Sessions
        </h1>
        <div className="grid grid-cols-2 my-20 gap-6">
          <AllClassAdmin />
          <CreateSess />
        </div>
      </div>
    </div>
  );
}

export default Admin;
