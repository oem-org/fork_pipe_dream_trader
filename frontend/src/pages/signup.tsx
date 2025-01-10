
import CreateUserForm from "../components/auth/create-user-form";

//done!

export default function SignupPage() {
  return (
    <div className="flex items-center justify-center min-h-screen custom-bg-color">
      <div className="max-w-md w-full">
        <h1 className="h1 mb-4 custom-text-light font-roboto">Pipe Dream Trading</h1>
        <CreateUserForm />
      </div>
    </div>
  );
}
