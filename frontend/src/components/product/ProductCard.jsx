import Card from "../ui/Card.jsx";
import "./ProductCard.css";

function ProductCard({ product }) {
  return (
    <Card className="product-card">
      <div className="product-image">
        {product.images?.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
          />
        ) : (
          <span>No image</span>
        )}
      </div>

      <div className="product-content">
        <h3>{product.name}</h3>

        {product.category && (
          <p className="product-category">
            {product.category.name || product.category}
          </p>
        )}

        <p className="product-description">
          {product.description || "No description available."}
        </p>

        <div className="product-footer">
          <strong>
            {Number(product.price).toFixed(2)} TND
          </strong>

          <span className={product.stock > 0 ? "in-stock" : "out-stock"}>
            {product.stock > 0 ? "In stock" : "Out of stock"}
          </span>
        </div>
      </div>
    </Card>
  );
}

export default ProductCard;
