import CreateSess from "../components/CreateSess";
import AllClassAdmin from "../components/AllClassAdmin";

function Admin() {
  return (
    <div className="h-full w-full col-span-5 bg-zinc-950 rounded-xl p-6">
      <h1 className="text-2xl text-neutral-400 font-light">Manage Sessions</h1>
      <div className="p-3 flex justify-end">
        <CreateSess />
      </div>
      <AllClassAdmin />
    </div>
  );
}

export default Admin;
