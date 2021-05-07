/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import queryString from "querystring";
import { Player, BigPlayButton } from "video-react";
import "video-react/dist/video-react.css";
import { Link } from "react-router-dom";
import {
  Tag,
  message,
  PageHeader,
  Button,
  Input,
  Row,
  Col,
  Avatar,
  Modal,
  List,
  Form,
} from "antd";
import { BookOutlined, UserOutlined } from "@ant-design/icons";
import { Table } from "react-bootstrap";
import {
  getCoursesAdmin,
  getCourseWithContents,
  getDetailsCourse,
  getDetailsContent,
  uploadVideo,
  postAddContent,
} from "../../APIs";
const { Search } = Input;

const AdminCoursesComponent = () => {
  const [form1] = Form.useForm();
  const onReset = () => {
    form1.resetFields();
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
      const results = await getCoursesAdmin(keys);
      if (results.status === 200) {
        setListCourses(results.data.courses.docs);
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

  const [isModalAddVisible, setIsModalAddVisible] = useState(false);
  const [courseId, setCourseId] = useState();
  const [urlVideos, setUrlVideos] = useState();
  const onChangeVideo = async (file) => {
    try {
      const formData = new FormData();
      formData.append("video", file);
      const result = await uploadVideo(formData);
      if (result.status === 200) {
        setUrlVideos(result.data.url);
      }
    } catch (error) {
      if (error.response) {
        return message.error(error.response.data.message);
      } else {
        return message.error(error.message);
      }
    }
  };

  const onFinishAddContent = async (data) => {
    if (urlVideos === undefined || courseId === undefined) {
      return message.error(`Url video or Course Reference not found !`);
    } else {
      try {
        const result = await postAddContent({
          title: data.title,
          description: data.description,
          url: urlVideos,
          course_id: courseId,
        });
        if (result.status === 200) {
          setIsModalAddVisible(false);
          return message.success(result.data.message);
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
    getCourses();
  }, [pagination]);
  return (
    <>
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
                        <Button
                          onClick={() => {
                            setIsModalAddVisible(true);
                            setCourseId(i._id);
                          }}
                        >
                          Add Content
                        </Button>
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
      <Modal
        title="Add Content"
        centered={true}
        width={600}
        visible={isModalAddVisible}
        onCancel={() => {
          setIsModalAddVisible(false);
        }}
        footer={null}
      >
        <Form
          form={form1}
          name="dynamic_form_nest_item"
          onFinish={onFinishAddContent}
          autoComplete="off"
        >
          <Form.Item
            label="Title"
            name={"title"}
            rules={[
              {
                required: true,
                message: "Missing title",
              },
            ]}
          >
            <Input placeholder="Title of lecture" />
          </Form.Item>
          <Form.Item
            label="Description"
            name={"description"}
            rules={[
              {
                required: true,
                message: "Missing description",
              },
            ]}
          >
            <Input placeholder="Description for lecture" />
          </Form.Item>
          <Form.Item
            label="Video"
            name={"video"}
            rules={[
              {
                required: true,
                message: "Missing video",
              },
            ]}
          >
            <Input
              type="file"
              onChange={(e) => {
                onChangeVideo(e.target.files[0]);
              }}
              allowClear
            />
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
    </>
  );
};
export default AdminCoursesComponent;
