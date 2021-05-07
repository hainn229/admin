/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import queryString from "querystring";
import { Player, BigPlayButton } from "video-react";
import "video-react/dist/video-react.css";
import { Link } from "react-router-dom";
import {
  getAllCategories,
  getCourses,
  getDetailsCourse,
  getCourseWithContents,
  putUpdateCourse,
  getDetailsContent
} from "../../APIs";
import {
  Tag,
  Space,
  message,
  PageHeader,
  Button,
  Input,
  Checkbox,
  Slider,
  InputNumber,
  Row,
  Col,
  Avatar,
  Modal,
  List,
  Popconfirm,
} from "antd";
import { BookOutlined, UserOutlined } from "@ant-design/icons";
import { Table } from "react-bootstrap";
const { Search } = Input;

const CoursesComponent = () => {
  const jwt = localStorage.getItem("token");
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
  const getCoursesWithPage = async () => {
    try {
      const keys = queryString.stringify(pagination);
      const results = await getCourses(keys);
      if (results.status === 200) {
        setListCourses(results.data.courses.docs);
      }
    } catch (error) {
      if (error.response) {
        return message.error(error.response.data.message);
      } else {
        return message.error(error.message);
      }
    }
  };

  const [categoriesData, setCategoriesData] = useState([]);
  const getCategories = async () => {
    try {
      const result = await getAllCategories();
      if (result.status === 200) {
        setCategoriesData(result.data.categories);
      }
    } catch (error) {
      if (error.response) {
        return message.error(error.response.data.message);
      } else {
        return message.error(error.message);
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
  const onBlock = async (id) => {
    try {
      const result = await putUpdateCourse(id, {
        status: false,
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
    getCategories();
  }, [pagination]);

  useEffect(() => {
    getCoursesWithPage();
  }, [pagination, actions]);
  return (
    <>
      <PageHeader
        ghost={true}
        onBack={() => window.history.back()}
        title="All Courses"
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
          <Row>
            <h6>Filter by Level:</h6>
          </Row>
          <Checkbox.Group
            style={{ width: "100%" }}
            onChange={(event) => {
              setPagination({
                ...pagination,
                level: event,
              });
            }}
          >
            <Row>
              <Col span={6}>
                <Checkbox value="All levels">All levels</Checkbox>
              </Col>
              <Col span={6}>
                <Checkbox value="Beginning level">Beginning</Checkbox>
              </Col>
              <Col span={6}>
                <Checkbox value="Intermediate level">Intermediate</Checkbox>
              </Col>
              <Col span={6}>
                <Checkbox value="Advanced level">Advanced</Checkbox>
              </Col>
            </Row>
          </Checkbox.Group>
          <Row>
            <h6>Filter by Status:</h6>
          </Row>
          <Checkbox.Group
            style={{ width: "100%" }}
            onChange={(event) => {
              setPagination({
                ...pagination,
                status: event,
              });
            }}
          >
            <Row>
              <Col span={6}>
                <Checkbox value={true}>Active</Checkbox>
              </Col>
              <Col span={6}>
                <Checkbox value={false}>Pending</Checkbox>
              </Col>
            </Row>
          </Checkbox.Group>
          <Row>
            <h6>Filter by Price:</h6>
          </Row>
          <Slider
            min={1}
            max={1000}
            onChange={(e) =>
              setPagination({
                ...pagination,
                inputValue: e,
              })
            }
            value={
              typeof pagination.inputValue === "number"
                ? pagination.inputValue
                : 0
            }
          />
          <InputNumber
            min={1}
            max={1000}
            style={{ margin: "0 16px" }}
            value={pagination.inputValue}
            onChange={(e) =>
              setPagination({
                ...pagination,
                inputValue: e,
              })
            }
          />

          <Row>
            <h6>Filter by Tutor:</h6>
          </Row>
          <Checkbox.Group
            style={{ width: "100%" }}
            onChange={(event) => {
              setPagination({
                ...pagination,
                level: event,
              });
            }}
          >
            <Row gutter>
              <Col span={6}>
                <Checkbox value="Ngọc Hải Nguyễn">Ngọc Hải Nguyễn</Checkbox>
              </Col>
              <Col span={6}>
                <Checkbox value="Ho My Ka">Ho My Ka</Checkbox>
              </Col>
              <Col span={6}>
                <Checkbox value="John Doe">John Doe</Checkbox>
              </Col>
              <Col span={6}>
                <Checkbox value="Nguyễn Ngọc Hải">Nguyễn Ngọc Hải</Checkbox>
              </Col>
            </Row>
          </Checkbox.Group>
          <br />
        </div>

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
                            <Popconfirm
                              title="Are you sure to block this course?"
                              onConfirm={() => onBlock(i._id)}
                              okText="Yes"
                              cancelText="No"
                            >
                              <Button type="primary" danger>
                                Block
                              </Button>
                            </Popconfirm>
                          ) : (
                            <Popconfirm
                              title="Are you sure to active this course?"
                              onConfirm={() => onActive(i._id)}
                              okText="Yes"
                              cancelText="No"
                            >
                              <Button type="primary">Active</Button>
                            </Popconfirm>
                          )}
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
    </>
  );
};
export default CoursesComponent;
