import { useEffect, useState } from "react";
import api from "../../services/api.js";
import ProductCard from "../../components/product/ProductCard.jsx";
import Loading from "../../components/feedback/Loading.jsx";
import ErrorState from "../../components/feedback/ErrorState.jsx";
import "./Products.css";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/products");
      const data = response.data;

      setProducts(
        Array.isArray(data)
          ? data
          : data.products || data.data || []
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to load products."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <section className="container page">
      <header className="page-header">
        <h1>Products</h1>
        <p>
          Explore our products and find something that fits your needs.
        </p>
      </header>

      {loading && (
        <Loading message="Loading products..." />
      )}

      {!loading && error && (
        <ErrorState
          message={error}
          onRetry={fetchProducts}
        />
      )}

      {!loading && !error && products.length === 0 && (
        <div className="empty-state">
          <h3>No products available</h3>
          <p>
            There are currently no products available.
          </p>
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default Products;
