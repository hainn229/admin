/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import queryString from "querystring";
import { Player, BigPlayButton } from "video-react";
import "video-react/dist/video-react.css";
import { Link } from "react-router-dom";
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

const CoursesComponent = () => {
  const jwt = localStorage.getItem("token");
  const [form] = Form.useForm();
  const onReset = () => {
    form.resetFields();
  };
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
      const results = await axios.get(`http://localhost:4000/courses?${keys}`, {
        headers: {
          "Content-type": "application/json",
          Authorization: "Bearer " + jwt,
        },
      });
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

  const [urlPoster, setUrlPoster] = useState();
  const [uploadButton, setUploadButton] = useState(false);
  const onChange = async (file) => {
    if (file.fileList.length === 0) {
      setUploadButton(false);
    } else {
      setUploadButton(true);
      if (
        file.file.type === "image/jpeg" ||
        file.file.type === "image/png" ||
        file.file.type === "image/jpg"
      ) {
        file.file.status = "done";
        const formData = new FormData();
        formData.append("image", file);
        const result = await axios.post(
          `http://localhost:4000/upload/images`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setUrlPoster(result.data.url);
      } else {
        return message.error(`Invalid File Type !`);
      }
    }
  };

  const [isModalAddVisible, setIsModalAddVisible] = useState(false);
  const onFinishAdd = async (data) => {
    try {
      console.log(urlPoster);
      console.log(data);
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
          <Button
            key="1"
            type="primary"
            onClick={() => setIsModalAddVisible(true)}
          >
            Add New Course
          </Button>,
        ]}
      >
        <div style={{ backgroundColor: "white", padding: 20 }}>
          <Row>
            <h6>Filter by Title:</h6>
          </Row>
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
          />
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
                      <td>{i.tutor_id.full_name}</td>
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
                <p>Tutor: {courseInfo.tutor_id.full_name}</p>
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
      <Modal
        title="Add New Course"
        centered={true}
        width={600}
        visible={isModalAddVisible}
        onCancel={() => {
          setIsModalAddVisible(false);
        }}
        footer={null}
      >
        <Form
          {...formStyle}
          form={form}
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinishAdd}
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[
              {
                required: true,
                message: "Please input title",
              },
            ]}
          >
            <Input placeholder="What is the title of the course?" allowClear />
          </Form.Item>

          <Form.Item
            label="Category"
            name="cat_id"
            rules={[
              {
                required: true,
                message: "Please select category for course !",
              },
            ]}
          >
            <Select
              style={{ width: "100%" }}
              placeholder="What is the topic of the course?"
            >
              {categoriesData.map((category) => {
                return <Option key={category._id}>{category.cat_name}</Option>;
              })}
            </Select>
          </Form.Item>

          <Form.Item
            label="Tutor"
            name="tutor"
            rules={[
              {
                required: true,
                message: "Please input name of tutor",
              },
            ]}
          >
            <Input placeholder="What is the tutor name?" allowClear />
          </Form.Item>

          <Form.Item name="level" label="Level">
            <Select
              showSearch
              style={{ width: "100%" }}
              defaultValue="All levels"
            >
              <Option value="All levels">All levels</Option>
              <Option value="Beginning level">Beginning level</Option>
              <Option value="Intermediate level">Intermediate level</Option>
              <Option value="Advanced level">Advanced level</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="price"
            label="Price"
            rules={[
              {
                required: true,
                message: "Please input price for course !",
              },
            ]}
          >
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              placeholder="Enter price for  your course, minimum is 0"
            />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[
              {
                requireD: true,
                message: "Please input desciption for course !",
              },
            ]}
          >
            <TextArea
              placeholder="Detailed description: (eg requirements, what you'll learn, etc.)"
              rows={4}
              style={{ width: "100%" }}
              allowClear
            />
          </Form.Item>

          <Form.Item
            label="Poster"
            listType="picture-card"
            className="avatar-uploader"
            rules={[
              {
                required: true,
                message: "Please upload your avatar, maximum is 5MB !",
              },
            ]}
          >
            <Upload
              onChange={(file) => {
                onChange(file);
              }}
            >
              <Button disabled={uploadButton}>
                <UploadOutlined /> Click to upload
              </Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ marginLeft: 20, width: 100 }}
            >
              Submit
            </Button>
            <Button
              htmlType="button"
              style={{ marginLeft: 20, width: 100 }}
              onClick={onReset}
            >
              Reset
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default CoursesComponent;
