import React from 'react'
import Header from '../components/Header'
import Hero from '../components/Hero'
import HowItWorks from '../components/HowItWorks'
import BestDeals from '../components/BestDeals'
import ProductInfo from '../components/ProductInfo'
import NewArrivalsGrid from '../components/NewArrivalsGrid'
import WhySheAndShine from '../components/WhySheAndShine'
import Footer from '../components/Footer'
function HomePage() {
  return (
    <div>
    <div>
        <Hero/>
        <HowItWorks/>
        <BestDeals/>
        <ProductInfo/>
        <WhySheAndShine/>
        <NewArrivalsGrid/>
       
       </div>
    </div>

  )
}

export default HomePage
