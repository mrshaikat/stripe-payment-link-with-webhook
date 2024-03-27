import { useEffect, useState } from "react";
import Card from "../components/Card/Card";

const Subscription = () => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    getProducts();
  }, []);
  const handleMakeRequest = async (productId) => {
    const requestData = {
      username: "shaikat",
      email: "mrshaikat123.cse@gmail.com",
      productId: productId,
    };
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    };
    try {
      const response = await fetch(
        `http://localhost:4000/api/make-request`,
        options
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      console.log("POST request successful!");
    } catch (error) {
      console.error("There was a problem with the POST request:", error);
    }
  };
  const getProducts = async () => {
    const products = await fetch("http://localhost:4000/api/product");
    if (!products.ok) {
      throw new Error("Network response was not ok");
    }
    const jsonData = await products.json();
    setProducts(jsonData?.result);
  };
  console.log(products?.result);
  return (
    <div className="main-div">
      <div className="card-holder">
        {products.length &&
          products.map((item, index) => {
            return (
              <Card
              key={index}
                header={item.title}
                content={item.description}
                onSelect={() => handleMakeRequest(item._id)}
              />
            );
          })}
      </div>
    </div>
  );
};

export default Subscription;
