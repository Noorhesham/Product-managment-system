import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useEffect, useState } from "react";
interface ProductProps {
  name: string;
}
const Products = () => {
  const [products, setProducts] = useState<ProductProps[]>([]);
  const axios = useAxiosPrivate();
  const fetchProducts = async () => {
    const response = await axios.get("/products");
    console.log(response.data);
    setProducts(response.data);
  };
  useEffect(() => {
    fetchProducts();
    console.log(products);
  }, [axios]);
  return (
    <div>
      <h1>Products</h1>
      {products?.data?.docs.map((product) => (
        <div key={product.name}>{product.name}</div>
      ))}
      <button onClick={() => fetchProducts()}>get products</button>
    </div>
  );
};

export default Products;
