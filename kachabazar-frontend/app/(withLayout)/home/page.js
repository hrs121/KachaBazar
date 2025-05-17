// pages/index.js
import CategoriesSection from '@/Components/Categories';
import Header from '@/Components/Header';
import Hero from '@/Components/Hero';
import FeaturedProducts from '@/Components/FeaturedProducts';
import BannerSection from '@/Components/Banner';

const HomePage = () => {
  return (
    <div>
      <Header />
      <Hero />
      <CategoriesSection />
      <FeaturedProducts />
      <BannerSection  />
    </div>
  );
};

export default HomePage;
