import { Outlet } from "react-router-dom";
import FileUploadForm from "../components/data/file-uploader";

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
