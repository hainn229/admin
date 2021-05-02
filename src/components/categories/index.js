/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import queryString from "querystring";
import { Table } from "react-bootstrap";
import {
  Tag,
  Space,
  message,
  PageHeader,
  Button,
  Modal,
  Input,
  Select,
  Form,
  Popconfirm,
} from "antd";

const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const CategoriesComponent = () => {
  const jwt = localStorage.getItem("token");

  const [pagination, setPagination] = useState({
    currentPage: 1,
    limitPage: 5,
    keywords: "",
  });
  const [listCategories, setListCategories] = useState([]);
  const getCategories = async () => {
    try {
      const keys = queryString.stringify(pagination);
      const results = await axios.get(
        `http://localhost:4000/categories?${keys}`,
        {
          headers: {
            "Content-type": "application/json",
            Authorization: "Bearer " + jwt,
          },
        }
      );
      setListCategories(results.data.categories.docs);
    } catch (error) {
      if (error.response) {
        return message.error(`${error.response.data.message}`);
      } else {
        return message.error(`${error.message}`);
      }
    }
  };
  const [form] = Form.useForm();
  const onReset = () => {
    form.resetFields();
  };
  const [action, setActions] = useState(false);
  const [isModalAddVisible, setIsModalAddVisible] = useState(false);
  const onFinishAdd = async (data) => {
    try {
      const result = await axios.post(
        `http://localhost:4000/categories/add`,
        {
          cat_name: data.cat_name,
        },
        {
          headers: {
            "Content-type": "application/json",
            Authorization: "Bearer " + jwt,
          },
        }
      );
      if (result.status === 200) {
        setIsModalAddVisible(false);
        setActions(!action);
        return message.success(`Add New Category Successfully !`);
      }
    } catch (error) {
      if (error.response) {
        return message.error(`${error.response.data.message}`);
      } else {
        return message.error(`${error.message}`);
      }
    }
  };

  const [isModalEditVisible, setIsModalEditVisible] = useState(false);
  const [categoryEdit, setCategoryEdit] = useState();
  const getCategoryEdit = async (id) => {
    try {
      const result = await axios.get(`http://localhost:4000/categories/${id}`, {
        headers: {
          "Content-type": "application/json",
          Authorization: "Bearer " + jwt,
        },
      });
      setCategoryEdit(result.data.category);
    } catch (error) {
      if (error.response) {
        return message.error(`${error.response.data.message}`);
      } else {
        return message.error(`${error.message}`);
      }
    }
  };

  const onConfirmDelete = async (id) => {
    try {
      const result = await axios.delete(
        `http://localhost:4000/categories/${id}`,
        {
          headers: {
            "Content-type": "application/json",
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
    getCategories();
  }, [pagination, action]);
  return (
    <div className="site-page-header-ghost-wrapper">
      <PageHeader
        ghost={true}
        onBack={() => window.history.back()}
        title="List Categories"
        extra={[
          <Button
            key="1"
            type="primary"
            onClick={() => setIsModalAddVisible(true)}
          >
            Add New Category
          </Button>,
        ]}
      >
        <Table>
          <thead>
            <tr>
              <th>Category Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {listCategories.map((i) => {
              return (
                <>
                  <tr>
                    <td>
                      <p>{i.cat_name}</p>
                    </td>
                    <td>
                      <Space size="middle">
                        <Button
                          type="primary"
                          onClick={() => {
                            getCategoryEdit(i._id);
                            setIsModalEditVisible(true);
                          }}
                        >
                          Edit
                        </Button>
                        <Popconfirm
                          title="Are you sure to delete this category?"
                          onConfirm={() => onConfirmDelete(i._id)}
                          // onCancel={(}
                          okText="Yes"
                          cancelText="No"
                        >
                          <Button type="primary" danger>
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
        {pagination.limitPage <= listCategories.length ? (
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
        title="Add New Category"
        centered={true}
        width={600}
        visible={isModalAddVisible}
        onCancel={() => setIsModalAddVisible(false)}
        footer={null}
      >
        <Form form={form} name="control-hooks" onFinish={onFinishAdd}>
          <Form.Item
            name="cat_name"
            label="Category Name"
            rules={[
              { required: true, message: "Please input a name for category" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ marginRight: 20 }}
            >
              Submit
            </Button>
            <Button htmlType="button" onClick={onReset}>
              Reset
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Edit Category"
        centered={true}
        width={600}
        visible={isModalEditVisible}
        onCancel={() => setIsModalEditVisible(false)}
        footer={null}
      >
        {categoryEdit ? (
          <>
            <p>
              Current category name: <h5>{categoryEdit.cat_name}</h5>
            </p>
            <br />
            <Form
              form={form}
              name="control-hooks"
              onFinish={async (data) => {
                try {
                  const result = await axios.put(
                    `http://localhost:4000/categories/${categoryEdit._id}`,
                    {
                      cat_name: data.cat_name,
                    },
                    {
                      headers: {
                        "content-type": "application/json",
                        Authorization: "Bearer " + jwt,
                      },
                    }
                  );
                  if (result.status === 200) {
                    setIsModalEditVisible(false);
                    setActions(!action);
                    return message.success(`Update category success !`);
                  }
                } catch (error) {
                  if (error.response) {
                    return message.error(`${error.response.data.message}`);
                  } else {
                    return message.error(`${error.message}`);
                  }
                }
              }}
            >
              <Form.Item
                name="cat_name"
                label="New Name"
                rules={[
                  {
                    required: true,
                    message: "Please input a name for category",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ marginRight: 20 }}
                >
                  Submit
                </Button>
                <Button htmlType="button" onClick={onReset}>
                  Reset
                </Button>
              </Form.Item>
            </Form>
          </>
        ) : (
          ""
        )}
      </Modal>
    </div>
  );
};
export default CategoriesComponent;
