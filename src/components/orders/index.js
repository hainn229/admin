import React, { useState, useEffect } from "react";
import queryString from "querystring";
import { Table } from "react-bootstrap";
import { getDetailsOrder, getOrdersSuccess } from "../../APIs";
import { PageHeader, Button, message, Space, Modal } from "antd";

const OrdersComponent = () => {
  const [pagination, setPagination] = useState({
    currentPage: 1,
    limitPage: 5,
    keywords: "",
  });

  const [orders, setOrders] = useState([]);
  const getOrders = async () => {
    try {
      const keys = queryString.stringify(pagination);
      const result = await getOrdersSuccess(keys);
      if (result.status === 200) {
        return setOrders(result.data.docs);
      }
    } catch (error) {
      if (error.response) {
        return message.error(`${error.response.data.message}`);
      } else {
        return message.error(`${error.message}`);
      }
    }
  };

  const [modalOrderDetails, setModalOrderDetails] = useState(false);
  const [orderDetails, setOrderDetails] = useState();
  const getOrderDetails = async (id) => {
    try {
      const result = await getDetailsOrder(id);
      if (result.status === 200) {
        setOrderDetails(result.data.order);
      }
    } catch (error) {
      if (error.response) {
        return message.error(`${error.response.data.message}`);
      } else {
        return message.error(`${error.message}`);
      }
    }
  };

  useEffect(() => {
    getOrders();
  }, [pagination]);
  return (
    <>
      <PageHeader
        ghost={true}
        onBack={() => window.history.back()}
        title="All Orders"
      >
        <Table>
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email User</th>
              <th>Course Title</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((i) => {
              return (
                <>
                  <tr>
                    <td>
                      <p>{i.user_id.full_name}</p>
                    </td>
                    <td>
                      <p>{i.user_id.email}</p>
                    </td>
                    <td>
                      <p>{i.course_id.course_title}</p>
                    </td>
                    <td>
                      <p>{i.course_id.price}</p>
                    </td>
                    <td>
                      <Space size="middle">
                        <Button
                          type="primary"
                          onClick={() => {
                            getOrderDetails(i._id);
                            setModalOrderDetails(true);
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
        {pagination.limitPage <= orders.length ? (
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
        title="Details Order"
        centered={true}
        visible={modalOrderDetails}
        onCancel={() => setModalOrderDetails(false)}
        footer={null}
      >
        {orderDetails ? (
          <>
            <p>
              Full Name: <h6>{orderDetails.user_id.full_name}</h6>
            </p>
            <p>
              Email User: <h6>{orderDetails.user_id.email}</h6>
            </p>
            <p>
              Course Title: <h6>{orderDetails.course_id.course_title}</h6>
            </p>
            <p>
              Price: <h6>{orderDetails.course_id.price}</h6>
            </p>
            <p>
              Time: <h6>{orderDetails.createdAt}</h6>
            </p>
          </>
        ) : (
          ""
        )}
      </Modal>
    </>
  );
};

export default OrdersComponent;
