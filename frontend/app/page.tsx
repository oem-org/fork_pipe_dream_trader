import { RightArrowIcon } from "@/app/components/shared/icons/right-arrow";
import Link from "next/link";
// import Image from "next/image";
import { TopNav } from "@/app/components/shared/navigation/top-nav/top-nav";
export default function Page() {
  return (
    <main className="flex flex-col min-h-screen">
      <TopNav />
      <div>
        <Link
          href="/login"
          className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
        >
          <span>Log in</span>
          <RightArrowIcon className="w-20 md:w-10" />
        </Link>
        {/* <Image
          src="/pepe2.jpg"
          width={1000}
          height={760}
          className="hidden md:block"
          alt="Screenshots of the dashboard project showing desktop version"
        /> */}
        <p>TEST</p>
        <p>TEST</p>
        <p>TEST</p>
        <p>TEST</p>
        <p>TEST</p>
        <p>TEST</p>
        <p>TEST</p>
      </div>
    </main>
  );
}
