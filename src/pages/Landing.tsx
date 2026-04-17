import Hero from '../components/Hero';
import SamplesAltair from '../components/SamplesAltair';
import Features from '../components/Features';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import HowToStart from '../components/HowToStart';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

export default function Landing() {
  return (
    <div className="min-h-screen font-sans text-gray-900 bg-white">
      <Navbar />
      <main>
        <Hero />
        <SamplesAltair />
        <Features />
        <Testimonials />
        <FAQ />
        <HowToStart />
      </main>
      <Footer />
    </div>
  );
}
