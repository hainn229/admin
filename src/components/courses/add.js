/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import "video-react/dist/video-react.css";
import { getAllCategories, postAddCourse, uploadImage } from "../../APIs";
import {
  message,
  PageHeader,
  Button,
  Input,
  InputNumber,
  Form,
  Select,
  Upload,
} from "antd";
const { Option } = Select;
const { TextArea } = Input;

const formStyle = {
  labelCol: { span: 4, style: { textAlign: "left" } },
  wrapperCol: {
    span: 20,
    style: { marginLeft: 20, marginTop: 10, width: "100%" },
  },
};

export const AddCourseComponent = () => {
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

  const [categoriesData, setCategoriesData] = useState([]);
  const getAllCategory = async () => {
    try {
      const result = await getAllCategories();
      if (result.status === 200) {
        setCategoriesData(result.data.categories);
      }
    } catch (error) {
      if (error.response) {
        return message.error(`${error.response.data.message}`);
      } else {
        return message.error(`${error.message}`);
      }
    }
  };

  const [urlPoster, setUrlPoster] = useState();
  const onChangePoster = async (file) => {
    try {
      const formData = new FormData();
      formData.append("image", file);
      const result = await uploadImage(formData);
      if (result.status === 200) {
        setUrlPoster(result.data.url);
      }
    } catch (error) {
      if (error.response) {
        return message.error(error.response.data.message);
      }
    }
  };

  const onFinishAdd = async (data) => {
    if (urlPoster === undefined) {
      return message.warning(`Could not find poster!`);
    } else {
      try {
        const result = await postAddCourse({
          course_title: data.title,
          cat_id: data.cat_id,
          level: data.level,
          price: data.price,
          description: data.description,
          tutor: data.tutor,
          status: false,
          poster: urlPoster,
        })
        if (result.status === 200) {
          message.success(result.data.message);
          return window.history.go(`/courses`);
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
    getAllCategory();
  }, [pagination]);
  return (
      <PageHeader
        ghost={true}
        onBack={() => window.history.back()}
        title="Add New Course"
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
            rules={[
              {
                required: true,
                message: "Please upload your poster, maximum is 5MB !",
              },
            ]}
          >
            <Input
              type="file"
              onChange={(e) => {
                onChangePoster(e.target.files[0]);
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
      </PageHeader>
  );
};
