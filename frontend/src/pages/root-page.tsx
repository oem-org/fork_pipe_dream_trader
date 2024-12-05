import { Outlet } from "react-router-dom";
import FileUploadForm from "../components/data/file-uploader";
import getIndicatorsQuery from "../lib/queries/getIndicatorsQuery";

//import CreatePost from "../components/strategy/create-strategy-form";



function RootPage() {

  return (
    <>
      <div>

        <FileUploadForm />
        <Outlet />
      </div >
    </>
  );
}

export default RootPage;
