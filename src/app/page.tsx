import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/layout/Hero";
import StoryIntro from "@/components/layout/StoryIntro";
import Highlights from "@/components/layout/Highlights";
import MenuBoards from "@/components/layout/MenuBoards";
import DecorOrnaments from "@/components/layout/DecorOrnaments";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-clip">
      <Navbar />
      <DecorOrnaments mode="home" />
      <Hero />
      <StoryIntro />
      <Highlights />
      <MenuBoards />
      <Footer />
    </main>
  );
}
