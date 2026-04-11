import ConnectUser from '@/components/home/ConnectUser';
import DownloadRepid from '@/components/home/DownloadRepid';
import FAQ from '@/components/home/FAQ';
import GetInTouch from '@/components/home/GetInTouch';
import Hero from '@/components/home/Hero';
import HowItWork from '@/components/home/HowItWork';


export default function Home() {

  return (
    <main className="flex flex-col min-h-screen w-full overflow-hidden">
      <Hero />
      <HowItWork />
      <DownloadRepid />
      <FAQ />
      <ConnectUser />
      <GetInTouch />
    </main>
  );
}



