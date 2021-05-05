import React, { useState } from "react";
import { PageHeader, Table, Button } from "antd";

const TransactionsComponent = () => {
  const jwt = localStorage.getItem("token");

  const [pagination, setPagination] = useState({
    currentPage: 1,
    limitPage: 5,
    keywords: "",
  });
  
  return (
    <PageHeader
      ghost={true}
      onBack={() => window.history.back()}
      title="All Transactions"
      extra={[
        <Button
          key="1"
          type="primary"
          // onClick={() => setIsModalAddVisible(true)}
        >
          Create Transaction
        </Button>,
      ]}
    >
      <Table />
    </PageHeader>
  );
};

export default TransactionsComponent;
