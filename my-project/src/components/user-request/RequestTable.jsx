import React from "react";

const RequestTable = ({ reqWithProducts, handleSentLink }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Username</th>
          <th>Email</th>
          <th>Products Title</th>
          <th>Request Approve</th>
          <th>Payment</th>
          <th>Send Link</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {reqWithProducts.map((reqPro) => (
          <tr key={reqPro._id}>
            <td>{reqPro.username}</td>
            <td>{reqPro.email}</td>
            <td>{reqPro?.product?.title}</td>
            <td>
              {reqPro.is_request_approved === true ? "Success" : "Pending"}
            </td>
            <td>{reqPro.payment_status === true ? "Success" : "Pending"}</td>
            <td>{reqPro.is_link_sent === true ? "Yes" : "No"}</td>
            <td>
              <button
                onClick={() => {
                  handleSentLink(reqPro._id);
                }}
                style={{ padding: "5px 7px", backgroundColor: "blueviolet" }}
              >
                Send Payment Link
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RequestTable;
