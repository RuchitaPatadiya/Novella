import HeroSection from '../../components/home/Herosection'
import ShopByCategory from '../../components/home/ShopByCategory'
import EditorialBreak from '../../components/home/EditorialBreak'
import FeaturedCollectionBanner from '../../components/home/FeaturedCollectionBanner'
import ShopTheLook from '../../components/home/ShopTheLook'
import BestSellers from '../../components/home/BestSellers'
import CustomerReviews from '../../components/home/CustomerReviews'
import ShopBySpace from '../../components/home/ShopBySpace'
import BrandStrip from '../../components/home/BrandStrip'

const Home = () => {
  return (
    <div className="bg-background">
      <HeroSection />
      <ShopByCategory />
      <EditorialBreak />
      <FeaturedCollectionBanner />
      <ShopTheLook />
      <BestSellers />
      <CustomerReviews />
      <ShopBySpace />
      <BrandStrip />
    </div>
  )
}

export default Home
