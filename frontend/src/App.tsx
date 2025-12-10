import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import AddProductPage from './pages/AddProductPage';
import EditProductPage from './pages/EditProductPage';
import CacheStatsPage from './pages/CacheStatsPage';

function App() {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/product/:id" element={<ProductDetailPage />} />
                    <Route path="/add" element={<AddProductPage />} />
                    <Route path="/edit/:id" element={<EditProductPage />} />
                    <Route path="/stats" element={<CacheStatsPage />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}

export default App;