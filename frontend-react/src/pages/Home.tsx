import Navbar from '@/components/Navbar'
import SearchBar from '@/components/SearchBar'
import Products from '@/components/Products'

const Home = () => {
  return (
    <div className='bg-black'>
        <Navbar/>
        <SearchBar/>
        <Products/>
    </div>
  )
}

export default Home