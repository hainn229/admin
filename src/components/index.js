/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import axios from "axios";
import queryString from "querystring";
import { useDifspatch, useSelector } from "react-redux";

import { Table } from "react-bootstrap";
import { Statistic, Row, Col, message, Button, Space, Tag } from "antd";
import {
  LikeOutlined,
  UserOutlined,
  UnorderedListOutlined,
  ShoppingOutlined,
  BookOutlined,
} from "@ant-design/icons";

const DashboardComponent = () => {
  const jwt = localStorage.getItem("token");
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
  const [listCoursesPending, setListCoursesPending] = useState([]);
  const getCoursesPending = async () => {
    if (user.email) {
      try {
        const keys = queryString.stringify(pagination);
        const results = await axios.get(
          `http://localhost:4000/courses/pending?${keys}`,
          {
            headers: {
              "Content-type": "application/json",
              Authorization: "Bearer " + jwt,
            },
          }
        );
        setListCoursesPending(results.data.courses.docs);
      } catch (error) {
        return message.error(error.message);
      }
    }
  };
  useEffect(() => {
    getCoursesPending();
  }, [pagination, user._id]);
  return (
    <div className="space-align-block">
      <Row gutter={16}>
        <Col span={8}>
          <Statistic title="Courses" value={25} prefix={<BookOutlined />} />
        </Col>
        <Col span={8}>
          <Statistic
            title="Categories"
            value={10}
            prefix={<UnorderedListOutlined />}
          />
        </Col>
        <Col span={8}>
          <Statistic title="Users" value={13} prefix={<UserOutlined />} />
        </Col>
        <Col span={8}>
          <Statistic title="Comments" value={93} prefix={<LikeOutlined />} />
        </Col>
        <Col span={8}>
          <Statistic
            title="Transactions"
            value={3}
            prefix={<ShoppingOutlined />}
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
                    <td>{i.course_title}</td>
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
                    <td>
                      <Space size="middle">
                        <Button type="primary" onClick={() => {}}>
                          Active
                        </Button>
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
    </div>
  );
};

export default DashboardComponent;
