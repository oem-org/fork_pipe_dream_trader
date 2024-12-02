import { Outlet } from "react-router-dom";
import FileUploadForm from "../components/data/file-uploader";
import getIndicatorsQuery from "../lib/queries/getIndicatorsQuery";

import CreatePost from "../components/strategy/create-strategy-form";



function RootPage() {
  const { data } = getIndicatorsQuery()

  return (
    <>
      <div>
        {data && Array.isArray(data) && data.map((indicator) => (
          <div key={indicator.id} >
            {indicator.kind}
          </div>
        ))}

        <CreatePost />
        <FileUploadForm />
        <Outlet />
      </div >
    </>
  );
}

export default RootPage;
