/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import axios from "axios";
import queryString from "querystring";
import { Link } from "react-router-dom";
import { Table } from "react-bootstrap";
import {
  Tag,
  Space,
  message,
  PageHeader,
  Button,
  Modal,
  Input,
  Form,
  Row,
  InputNumber,
  Select,
  Col,
  Avatar,
  Popconfirm,
} from "antd";
import { LockOutlined, UnlockOutlined, UserOutlined } from "@ant-design/icons";
const { Option } = Select;

const formStyle = {
  labelCol: { span: 9, style: { textAlign: "left" } },
  wrapperCol: {
    span: 16,
    style: { marginLeft: 20, marginTop: 10, width: "100%" },
  },
};
const UsersComponent = () => {
  const jwt = localStorage.getItem("token");
  const [form] = Form.useForm();
  const onReset = () => {
    form.resetFields();
  };
  const [pagination, setPagination] = useState({
    currentPage: 1,
    limitPage: 5,
    keywords: "",
  });
  const [listUsers, setListUsers] = useState([]);
  const getUsers = async () => {
    try {
      const keys = queryString.stringify(pagination);
      const results = await axios.get(`http://localhost:4000/users?${keys}`, {
        headers: {
          "Content-type": "application/json",
          Authorization: "Bearer " + jwt,
        },
      });
      setListUsers(results.data.users.docs);
    } catch (error) {
      return message.error(error.message);
    }
  };

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [action, setActions] = useState(false);

  const onFinishAdd = async (dataInput) => {
    try {
      const result = await axios.post(
        `http://localhost:4000/auth/register`,
        {
          full_name: dataInput.full_name,
          email: dataInput.email,
          password: dataInput.password,
          amount: dataInput.amount,
          role: dataInput.role,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + jwt,
          },
        }
      );
      if (result.status === 200) {
        setIsModalVisible(false);
        setActions(!action);
      }
      return message.success(`${result.data.message}`);
    } catch (error) {
      if (error.response) {
        return message.error(`${error.response.data.message}`);
      } else {
        return message.error(`${error.message}`);
      }
    }
  };

  const onLock = async (userId) => {
    try {
      const result = await axios.put(
        `http://localhost:4000/auth/${userId}`,
        {
          status: false,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + jwt,
          },
        }
      );
      if (result.status === 200) {
        setActions(!action);
        return message.success(`User have been locked!`);
      }
    } catch (error) {
      if (error.response) {
        return message.error(`${error.response.data.message}`);
      } else {
        return message.error(`${error.message}`);
      }
    }
  };

  const onUnlock = async (userId) => {
    try {
      const result = await axios.put(
        `http://localhost:4000/auth/${userId}`,
        {
          status: true,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + jwt,
          },
        }
      );
      if (result.status === 200) {
        setActions(!action);
        return message.success(`Unlock user have been success!`);
      }
    } catch (error) {
      if (error.response) {
        return message.error(`${error.response.data.message}`);
      } else {
        return message.error(`${error.message}`);
      }
    }
  };

  const [modalInfoVisible, setModalInfoVisible] = useState(false);
  const [userInfo, setUserInfo] = useState();

  const getUserInfo = async (userId) => {
    try {
      const result = await axios.get(`http://localhost:4000/auth/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwt,
        },
      });
      setUserInfo(result.data.info);
    } catch (error) {
      if (error.response) {
        return message.error(`${error.response.data.message}`);
      } else {
        return message.error(`${error.message}`);
      }
    }
  };

  const onConfirmDelete = async (userId) => {
    try {
      const result = await axios.delete(
        `http://localhost:4000/auth/${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + jwt,
          },
        }
      );
      if (result.status === 200) {
        setActions(!action);
        return message.success(result.data.message);
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
    getUsers();
  }, [pagination, action]);
  return (
    <div className="site-page-header-ghost-wrapper">
      <PageHeader
        ghost={true}
        onBack={() => window.history.back()}
        title="List Users"
        extra={[
          <Button
            key="1"
            type="primary"
            onClick={() => setIsModalVisible(true)}
          >
            Add New User
          </Button>,
        ]}
      >
        <Table>
          <thead>
            <tr>
              <th>Full name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Amount (USD)</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {listUsers.map((i) => {
              return (
                <>
                  <tr>
                    <td>
                      <Link
                        onClick={() => {
                          getUserInfo(i._id);
                          setModalInfoVisible(true);
                        }}
                      >
                        {i.full_name}
                      </Link>
                    </td>
                    <td>{i.email}</td>
                    <td>
                      {i.role === "ADMIN" ? (
                        <Tag
                          color="red"
                          style={{ width: 70, textAlign: "center" }}
                        >
                          {i.role}
                        </Tag>
                      ) : (
                        <Tag
                          color="green"
                          style={{ width: 70, textAlign: "center" }}
                        >
                          {i.role}
                        </Tag>
                      )}
                    </td>
                    <td>{i.amount}</td>
                    <td>
                      {i.status === false ? (
                        <Tag
                          color="red"
                          style={{ width: 70, textAlign: "center" }}
                        >
                          Locked
                        </Tag>
                      ) : (
                        <Tag
                          color="green"
                          style={{ width: 70, textAlign: "center" }}
                        >
                          Active
                        </Tag>
                      )}
                    </td>
                    <td>
                      <Space size="middle">
                        {i.status === true ? (
                          <Button
                            type="primary"
                            style={{ width: 100 }}
                            icon={<LockOutlined />}
                            danger
                            onClick={() => onLock(i._id)}
                          >
                            Lock
                          </Button>
                        ) : (
                          <Button
                            type="primary"
                            style={{ width: 100 }}
                            icon={<UnlockOutlined />}
                            onClick={() => onUnlock(i._id)}
                          >
                            Unlock
                          </Button>
                        )}
                        <Popconfirm
                          title="Are you sure to delete this user?"
                          onConfirm={() => onConfirmDelete(i._id)}
                          // onCancel={cancel}
                          okText="Yes"
                          cancelText="No"
                        >
                          <Button type="link" danger>
                            Delete
                          </Button>
                        </Popconfirm>
                      </Space>
                    </td>
                  </tr>
                </>
              );
            })}
          </tbody>
        </Table>
        {pagination.limitPage <= listUsers.length ? (
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
      title="Add New User"
        centered={true}
        width={600}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Row
          justify="center"
          align="middle"
          style={{ marginTop: 60, marginBottom: 60 }}
        >
          <Form
            {...formStyle}
            form={form}
            name="control-hooks"
            initialValues={{ remember: true }}
            onFinish={onFinishAdd}
          >
            <Form.Item
              label="Full Name"
              name="full_name"
              rules={[
                {
                  required: true,
                  message: "Please input your full name",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  type: "email",
                  required: true,
                  message: "Please input your email address!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                {
                  mix: 6,
                  required: true,
                  message:
                    "Please input your password, minimum is 6 characters!",
                },
              ]}
              hasFeedback
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="re_password"
              label="Confirm Password"
              dependencies={["password"]}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Please confirm your password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "The two passwords that you entered do not match!"
                      )
                    );
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="amout"
              label="Amount"
              rules={[
                {
                  required: true,
                  message: "Please enter amount!",
                },
              ]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="role" label="Role">
              <Select style={{ width: "100%" }} defaultValue="USER">
                <Option value="USER">USER</Option>
                <Option value="ADMIN">ADMIN</Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ marginLeft: 20 }}
              >
                Submit
              </Button>
              <Button
                htmlType="button"
                style={{ marginLeft: 20 }}
                onClick={onReset}
              >
                Reset
              </Button>
            </Form.Item>
          </Form>
        </Row>
      </Modal>
      <Modal
        title="User Information"
        centered={true}
        width={600}
        visible={modalInfoVisible}
        onCancel={() => setModalInfoVisible(false)}
        footer={null}
      >
        {userInfo ? (
          <>
            <Row justify="center" align="top">
              <Col flex={1}>
                {userInfo.avatarUrl ? (
                  <Avatar shape="square" size={200} src={userInfo.avatarUrl} />
                ) : (
                  <Avatar shape="square" size={200} icon={<UserOutlined />} />
                )}
              </Col>
              <Col flex={2}>
                <h4>{userInfo.full_name}</h4>
                <p>
                  Email address: <h6>{userInfo.email}</h6>
                </p>
                <p>
                  Amount (USD): <h6>${userInfo.amount}</h6>
                </p>
                <p>
                  Role:{" "}
                  <h6>
                    {userInfo.role === "ADMIN" ? (
                      <Tag color="red">ADMIN</Tag>
                    ) : (
                      <Tag color="green">USER</Tag>
                    )}
                  </h6>
                </p>
              </Col>
            </Row>
            <br />
            <Row justify="center" align="top">
              <Col flex={1}>
                <p>
                  Gender:{" "}
                  <h6>
                    {userInfo.gender === null ? "Not set" : userInfo.gender}
                  </h6>
                </p>
                <p>
                  Date of Birth:{" "}
                  <h6>
                    {userInfo.date_of_birth === null
                      ? "Not set"
                      : userInfo.date_of_birth}
                  </h6>
                </p>
              </Col>
              <Col flex={1}>
                <p>
                  GoogleId:{" "}
                  <h6>
                    {userInfo.googleId === null ? "Not set" : userInfo.googleId}
                  </h6>
                </p>
                <p>
                  Status:{" "}
                  <h6>
                    {userInfo.status === false ? (
                      <Tag color="red">Blocking</Tag>
                    ) : (
                      <Tag color="green">Active</Tag>
                    )}
                  </h6>
                </p>
              </Col>
            </Row>
          </>
        ) : (
          ""
        )}
      </Modal>
    </div>
  );
};
export default UsersComponent;
