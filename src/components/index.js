/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import axios from "axios";
import queryString from "querystring";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Player, BigPlayButton } from "video-react";
import {
  getAllCategories,
  getAllComments,
  getAllCourses,
  getAllOrders,
  getAllTransactions,
  getAllUsers,
  getCoursesPending,
  getCourseWithContents,
  getDetailsCourse,
  getDetailsContent,
  putUpdateCourse,
} from "../APIs";

import { Table } from "react-bootstrap";
import {
  Statistic,
  Row,
  Col,
  message,
  Button,
  Space,
  Tag,
  Popconfirm,
  Modal,
  Avatar,
  List,
} from "antd";
import {
  MessageOutlined,
  UserOutlined,
  UnorderedListOutlined,
  ShoppingOutlined,
  BookOutlined,
  PayCircleOutlined,
} from "@ant-design/icons";

const DashboardComponent = () => {
  const user = useSelector((state) => {
    return state.signInReducer.data;
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    limitPage: 5,
    keywords: "",
    category: "",
    level: "",
    tutor_id: "",
  });

  const [totalCourses, setTotalCourses] = useState();
  const [totalCategories, setTotalCategories] = useState();
  const [totalUsers, setTotalUsers] = useState();
  const [totalComments, setTotalComments] = useState();
  const [totalOrders, setTotalOrders] = useState();
  const [totalTransactions, setTotalTransactions] = useState();
  const getTotalCourses = async () => {
    if (user.email) {
      try {
        const result = await getAllCourses();
        if (result.status === 200) {
          setTotalCourses(result.data.courses.length);
        }
      } catch (error) {
        if (error.response) {
          return message.error(error.response.data.message);
        } else {
          return message.error(error.message);
        }
      }
    }
  };

  const getTotalCategories = async () => {
    if (user.email) {
      try {
        const result = await getAllCategories();
        if (result.status === 200) {
          setTotalCategories(result.data.categories.length);
        }
      } catch (error) {
        if (error.response) {
          return message.error(error.response.data.message);
        } else {
          return message.error(error.message);
        }
      }
    }
  };
  const getTotalUsers = async () => {
    if (user.email) {
      try {
        const result = await getAllUsers();
        if (result.status === 200) {
          setTotalUsers(result.data.users.length);
        }
      } catch (error) {
        if (error.response) {
          return message.error(error.response.data.message);
        } else {
          return message.error(error.message);
        }
      }
    }
  };
  const getTotalComments = async () => {
    if (user.email) {
      try {
        const result = await getAllComments();
        if (result.status === 200) {
          setTotalComments(result.data.comments.length);
        }
      } catch (error) {
        if (error.response) {
          return message.error(error.response.data.message);
        } else {
          return message.error(error.message);
        }
      }
    }
  };

  const getTotalTransactions = async () => {
    if (user.email) {
      try {
        const result = await getAllTransactions();
        if (result.status === 200) {
          setTotalTransactions(result.data.transactions.totalItems);
        }
      } catch (error) {
        if (error.response) {
          return message.error(error.response.data.message);
        } else {
          return message.error(error.message);
        }
      }
    }
  };

  const getTotalOrders = async () => {
    if (user.email) {
      try {
        const result = await getAllOrders();
        if (result.status === 200) {
          setTotalOrders(result.data.totalItems);
        }
      } catch (error) {
        if (error.response) {
          return message.error(error.response.data.message);
        } else {
          return message.error(error.message);
        }
      }
    }
  };

  useEffect(() => {
    getTotalCourses();
    getTotalCategories();
    getTotalUsers();
    getTotalComments();
    getTotalTransactions();
    getTotalOrders();
  }, [user]);

  const [listCoursesPending, setListCoursesPending] = useState([]);
  const getPendingCourses = async () => {
    if (user.email) {
      try {
        const keys = queryString.stringify(pagination);
        const results = await getCoursesPending(keys);
        if (results.status === 200) {
          setListCoursesPending(results.data.courses.docs);
        }
      } catch (error) {
        if (error.response) {
          return message.error(error.response.data.message);
        } else {
          return message.error(error.message);
        }
      }
    }
  };

  const [modalInfoVisible, setModalInfoVisible] = useState(false);
  const [courseInfo, setCourseInfo] = useState();
  const [contentOfCourse, setContentOfCourse] = useState();
  const getCourseInfo = async (id) => {
    try {
      const result1 = await getDetailsCourse(id);
      if (result1.status === 200) {
        setCourseInfo(result1.data.course);
      }
      const result2 = await getCourseWithContents(id);
      if (result2.status === 200) {
        setContentOfCourse(result2.data.contents);
      }
    } catch (error) {
      if (error.response) {
        return message.error(error.response.data.message);
      } else {
        return message.error(error.message);
      }
    }
  };

  const [modalContentDetails, setModalContentDetails] = useState(false);
  const [contentDetails, setContentDetails] = useState();
  const getContentInfo = async (id) => {
    try {
      const result = await getDetailsContent(id);
      if (result.status === 200) {
        setContentDetails(result.data.content);
      }
    } catch (error) {
      if (error.response) {
        return message.error(error.response.data.message);
      } else {
        return message.error(error.message);
      }
    }
  };

  const [actions, setActions] = useState(false);
  const onActive = async (id) => {
    try {
      const result = await putUpdateCourse(id, {
        status: true,
      });
      if (result.status === 200) {
        setActions(!actions);
        return message.success(result.data.message);
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
    getPendingCourses();
  }, [pagination, user._id, actions]);
  return (
    <>
      <Row gutter={16}>
        <Col span={8}>
          <Statistic
            title="Courses"
            value={totalCourses}
            prefix={<BookOutlined />}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="Categories"
            value={totalCategories}
            prefix={<UnorderedListOutlined />}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="Users"
            value={totalUsers}
            prefix={<UserOutlined />}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="Comments"
            value={totalComments}
            prefix={<MessageOutlined />}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="Orders"
            value={totalOrders}
            prefix={<ShoppingOutlined />}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="Transactions"
            value={totalTransactions}
            prefix={<PayCircleOutlined />}
          />
        </Col>
      </Row>
      <br />
      <h2>List Courses Pending</h2>
      <div style={{ backgroundColor: "white" }}>
        <Table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Category Name</th>
              <th>Tutor</th>
              <th>Level</th>
              <th>Status</th>
              <th>Price ($)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {listCoursesPending.map((i) => {
              return (
                <>
                  <tr>
                    <td>
                      <Link
                        onClick={() => {
                          getCourseInfo(i._id);
                          setModalInfoVisible(true);
                        }}
                      >
                        {i.course_title}
                      </Link>
                    </td>
                    <td>{i.cat_id.cat_name}</td>
                    <td>{i.tutor_id ? i.tutor_id.full_name : i.tutor}</td>
                    <td>{i.level}</td>
                    <td>
                      {i.status === true ? (
                        <Tag color="green">Active</Tag>
                      ) : (
                        <Tag color="red">Pending</Tag>
                      )}
                    </td>
                    <td>{i.price}</td>
                    <td>
                      <Space size="middle">
                        <Popconfirm
                          title="Are you sure to active this course?"
                          onConfirm={() => onActive(i._id)}
                          okText="Yes"
                          cancelText="No"
                        >
                          <Button type="primary">Active</Button>
                        </Popconfirm>
                      </Space>
                    </td>
                  </tr>
                </>
              );
            })}
          </tbody>
        </Table>
        {pagination.limitPage <= listCoursesPending.length ? (
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
      </div>
      <Modal
        title="Course Information"
        centered={true}
        width={600}
        visible={modalInfoVisible}
        onCancel={() => setModalInfoVisible(false)}
        footer={null}
      >
        {courseInfo ? (
          <>
            <Row justify="center" align="top">
              <Col flex="210px">
                {courseInfo.poster ? (
                  <Avatar shape="square" size={200} src={courseInfo.poster} />
                ) : (
                  <Avatar shape="square" size={200} icon={<UserOutlined />} />
                )}
              </Col>
              <Col flex="auto">
                <h6>{courseInfo.course_title}</h6>
                <p>{courseInfo.cat_id.cat_name}</p>
                <p>
                  Status:{" "}
                  {courseInfo.status === false ? (
                    <Tag color="red">Pending</Tag>
                  ) : (
                    <Tag color="green">Active</Tag>
                  )}
                </p>
                <p>Price (USD): ${courseInfo.price}</p>
                <p>Level: {courseInfo.level}</p>
                <p>Subscribers: {courseInfo.num_of_subscribers}</p>
                <p>
                  Tutor:{" "}
                  {courseInfo.tutor_id
                    ? courseInfo.tutor_id.full_name
                    : courseInfo.tutor}
                </p>
              </Col>
            </Row>
            <hr />
            <Row>
              <Col>
                <h5>Description</h5>
                <p>{courseInfo.description}</p>
              </Col>
            </Row>
            <hr />
            <h5>List Contents</h5>
            <List
              itemLayout="horizontal"
              dataSource={contentOfCourse}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        onClick={() => {
                          getContentInfo(item._id);
                          setModalContentDetails(true);
                        }}
                        shape="square"
                        size={50}
                        icon={<BookOutlined />}
                      />
                    }
                    title={
                      <Link
                        onClick={() => {
                          getContentInfo(item._id);
                          setModalContentDetails(true);
                        }}
                      >
                        {item.title}
                      </Link>
                    }
                    description={item.description}
                  />
                </List.Item>
              )}
            />
          </>
        ) : (
          ""
        )}
      </Modal>
      <Modal
        title="Content Details"
        centered={true}
        width={600}
        visible={modalContentDetails}
        onCancel={() => {
          setModalContentDetails(false);
        }}
        footer={null}
      >
        {contentDetails ? (
          <>
            <p>
              Title: <h4>{contentDetails.title}</h4>
            </p>
            <p>
              Description: <h6>{contentDetails.description}</h6>
            </p>
            <p>Lecture</p>
            <Player playsInline src={contentDetails.url}>
              <BigPlayButton position="center" />
            </Player>
          </>
        ) : (
          ""
        )}
      </Modal>
    </>
  );
};

export default DashboardComponent;
