import { Outlet } from "react-router-dom";
import FileUploadForm from "../components/data/file-uploader";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import CreatePost from "../components/strategy/create-strategy-form";

function RootPage() {


  return (
    <>
      <div>
        <CreatePost />
        <FileUploadForm />
        <Outlet />
      </div >
    </>
  );
}

export default RootPage;
