// eslint-disable-next-line
import React, { useState, useEffect } from "react";
import queryString from "querystring";
import { PageHeader, Button, message, Space, Modal } from "antd";
import { getDetailsTransaction, getTransactions } from "../../APIs";
import { Table } from "react-bootstrap";

const TransactionsComponent = () => {
  const [pagination, setPagination] = useState({
    currentPage: 1,
    limitPage: 5,
    keywords: "",
  });
  const [transactions, setTransactions] = useState([]);
  const getTransaction = async () => {
    try {
      const keys = queryString.stringify(pagination);
      const result = await getTransactions(keys);
      if (result.status === 200) {
        return setTransactions(result.data.transactions.docs);
      }
    } catch (error) {
      if (error.response) {
        return message.error(error.response.data.message);
      } else {
        return message.error(error.message);
      }
    }
  };

  const [modalTransactionDetails, setModalTransactionDetails] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState();
  const getTransactionDetails = async (id) => {
    try {
      const result = await getDetailsTransaction(id);
      if (result.status === 200) {
        setTransactionDetails(result.data.transaction);
      }
    } catch (error) {
      if (error.response) {
        return message.error(error.response.data.message);
      } else {
        return message.error(error.message);
      }
    }
  };

  useEffect(() => {
    getTransaction();
  }, [pagination]);

  return (
    <>
      <PageHeader
        ghost={true}
        onBack={() => window.history.back()}
        title="All Transactions"
      >
        <Table>
          <thead>
            <tr>
              <th>PaymentID</th>
              <th>Full Name</th>
              <th>Email User</th>
              <th>Amount</th>
              <th>Currency</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((i) => {
              return (
                <>
                  <tr>
                    <td>
                      <p>{i.paymentId}</p>
                    </td>
                    <td>
                      <p>{i.user_id.full_name}</p>
                    </td>
                    <td>
                      <p>{i.user_id.email}</p>
                    </td>
                    <td>
                      <p>{i.amount}</p>
                    </td>
                    <td>
                      <p>{i.currency}</p>
                    </td>
                    <td>
                      <Space size="middle">
                        <Button
                          type="primary"
                          onClick={() => {
                            getTransactionDetails(i._id);
                            setModalTransactionDetails(true);
                          }}
                        >
                          View
                        </Button>
                      </Space>
                    </td>
                  </tr>
                </>
              );
            })}
          </tbody>
        </Table>
        {pagination.limitPage <= transactions.length ? (
          <Button
            onClick={() => {
              setPagination({
                ...pagination,
                limitPage: pagination.limitPage + 5,
              });
            }}
            style={{ float: "right" }}
          >
            More...
          </Button>
        ) : (
          ""
        )}
      </PageHeader>

      <Modal
        title="Details Transaction"
        centered={true}
        visible={modalTransactionDetails}
        onCancel={() => setModalTransactionDetails(false)}
        footer={null}
      >
        {transactionDetails ? (
          <>
            <p>
              PaymentID: <h6>{transactionDetails.paymentId}</h6>
            </p>
            <p>
              Full Name: <h6>{transactionDetails.user_id.full_name}</h6>
            </p>
            <p>
              Email User: <h6>{transactionDetails.user_id.email}</h6>
            </p>
            <p>
              Amount: <h6>{transactionDetails.amount}</h6>
            </p>
            <p>
              Currency: <h6>{transactionDetails.currency}</h6>
            </p>
            <p>
              Email Payer: <h6>{transactionDetails.email}</h6>
            </p>
            <p>
              Time: <h6>{transactionDetails.createdAt}</h6>
            </p>
          </>
        ) : (
          ""
        )}
      </Modal>
    </>
  );
};

export default TransactionsComponent;
