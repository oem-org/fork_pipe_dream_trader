import { RightArrowIcon } from '@/app/components/shared/icons/right-arrow';
import TopNav from './components/shared/navigation/top-nav';
import Link from "next/link";
import Image from "next/image";
export default function Page() {
  return (
    <main className="flex min-h-screen">
      <TopNav></TopNav>
      <div>

        <Link
          href="/login"
          className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
        >
          <span>Log in</span>
          <RightArrowIcon className="w-20 md:w-10" />
        </Link>
        <Image
          src="/pepe2.jpg"
          width={1000}
          height={760}
          className="hidden md:block"
          alt="Screenshots of the dashboard project showing desktop version"
        />

      </div>
    </main>
  );
}
