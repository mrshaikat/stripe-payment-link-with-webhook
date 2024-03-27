import React, { useEffect, useState } from 'react'
import RequestTable from '../components/user-request/RequestTable'

export default function AllRequest() {
    const [reqWithPro, setReqWithPro] = useState([]);
    const [reload, setReload] = useState(false);
    const handleSentLink = async (id) =>{
      console.log("Request ID: " + id);
      const options = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        // body: JSON.stringify(requestData),
      };
      try {
        const response = await fetch(
          `http://localhost:4000/api/approve-request/${id}`,
          options
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        setReload(true);
        console.log("POST request successful!");
      } catch (error) {
        console.error("There was a problem with the POST request:", error);
      }
    }


    useEffect(() => {
        const handleGetReqWithProducts = async () => {
            const products = await fetch("http://localhost:4000/api/get-all-request");
            if (!products.ok) {
              throw new Error("Network response was not ok");
            }
            const jsonData = await products.json();
            setReqWithPro(jsonData?.result);
          };

          handleGetReqWithProducts();
    }, [reload])
    
  return (
   <RequestTable reqWithProducts={reqWithPro} handleSentLink={handleSentLink}/>
  )
}
