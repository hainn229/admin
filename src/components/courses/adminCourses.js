/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import queryString from "querystring";
import { Player, BigPlayButton } from "video-react";
import "video-react/dist/video-react.css";
import { Link, Redirect } from "react-router-dom";
import {
  Tag,
  Space,
  message,
  PageHeader,
  Button,
  Input,
  Checkbox,
  Layout,
  Menu,
  Slider,
  InputNumber,
  Row,
  Col,
  Avatar,
  Modal,
  List,
  Form,
  Select,
  Upload,
  Divider,
} from "antd";
import {
  BookOutlined,
  UserOutlined,
  UploadOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Table } from "react-bootstrap";
const { Search, TextArea } = Input;
const { Option } = Select;

const formStyle = {
  labelCol: { span: 4, style: { textAlign: "left" } },
  wrapperCol: {
    span: 20,
    style: { marginLeft: 20, marginTop: 10, width: "100%" },
  },
};

const AdminCoursesComponent = () => {
  const jwt = localStorage.getItem("token");
  // const [form] = Form.useForm();
  // const onReset = () => {
  //   form.resetFields();
  // };
  const [pagination, setPagination] = useState({
    currentPage: 1,
    limitPage: 10,
    keywords: "",
    category: "",
    level: [],
    tutor_id: "",
    inputValue: 1,
  });
  const [listCourses, setListCourses] = useState([]);
  const getCourses = async () => {
    try {
      const keys = queryString.stringify(pagination);
      const results = await axios.get(
        `http://localhost:4000/courses/admin?${keys}`,
        {
          headers: {
            "Content-type": "application/json",
            Authorization: "Bearer " + jwt,
          },
        }
      );
      setListCourses(results.data.courses.docs);
    } catch (error) {
      if (error.response) {
        return message.error(`${error.response.data.message}`);
      } else {
        return message.error(`${error.message}`);
      }
    }
  };

  const [categoriesData, setCategoriesData] = useState([]);
  const getCategories = async () => {
    try {
      const result = await axios.get(`http://localhost:4000/categories/all`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwt,
        },
      });
      setCategoriesData(result.data.categories);
    } catch (error) {
      if (error.response) {
        return message.error(`${error.response.data.message}`);
      } else {
        return message.error(`${error.message}`);
      }
    }
  };

  const [modalInfoVisible, setModalInfoVisible] = useState(false);
  const [courseInfo, setCourseInfo] = useState();
  const [contentOfCourse, setContentOfCourse] = useState();
  const getCourseInfo = async (id) => {
    try {
      const result1 = await axios.get(`http://localhost:4000/courses/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwt,
        },
      });
      setCourseInfo(result1.data.course);
      const result2 = await axios.get(`http://localhost:4000/contents/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwt,
        },
      });
      setContentOfCourse(result2.data.contents);
    } catch (error) {
      if (error.response) {
        return message.error(`${error.response.data.message}`);
      } else {
        return message.error(`${error.message}`);
      }
    }
  };

  const [modalContentDetails, setModalContentDetails] = useState(false);
  const [contentDetails, setContentDetails] = useState();
  const getContentInfo = async (id) => {
    try {
      const result = await axios.get(
        `http://localhost:4000/contents/details/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + jwt,
          },
        }
      );
      setContentDetails(result.data.content);
    } catch (error) {
      if (error.response) {
        return message.error(`${error.response.data.message}`);
      } else {
        return message.error(`${error.message}`);
      }
    }
  };

  useEffect(() => {
    getCourses();
    getCategories();
  }, [pagination]);
  return (
    <div className="site-page-header-ghost-wrapper">
      <PageHeader
        ghost={true}
        onBack={() => window.history.back()}
        title="List Courses"
        extra={[
          <Search
            placeholder="Search course..."
            allowClear
            size="large"
            value={pagination.keywords}
            onChange={(event) => {
              setPagination({
                ...pagination,
                keywords: event.target.value,
              });
            }}
          />,
        ]}
      >
        <div style={{ backgroundColor: "white", padding: 20 }}>
          <Table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category Name</th>
                <th>Tutor</th>
                <th>Level</th>
                <th>Status</th>
                <th>Price ($)</th>
                <th>Subscribers</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {listCourses.map((i) => {
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
                      <td>{i.num_of_subscribers}</td>
                      <td>
                        <Space size="middle">
                          {i.status === true ? (
                            <Button type="primary" danger>
                              Block
                            </Button>
                          ) : (
                            <Button type="primary" onClick={() => {}}>
                              Active
                            </Button>
                          )}
                          <Button onClick={() => {}}>Add Contents</Button>
                        </Space>
                      </td>
                    </tr>
                  </>
                );
              })}
            </tbody>
          </Table>
          {pagination.limitPage <= listCourses.length ? (
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
      </PageHeader>
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
    </div>
  );
};
export default AdminCoursesComponent;
