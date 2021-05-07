/* eslint-disable no-unused-vars */
import React from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../hooks/useAuth";
import { postSignIn } from "../APIs";
import { Form, Input, Button, Layout, message, Image, Row } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
const { Content, Footer } = Layout;

const LoginComponent = () => {
  useAuth();
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("token");
  const onFinish = async (dataSignIn) => {
    try {
      const result = await postSignIn(dataSignIn);
      if (result.data) {
        if (result.data.user.role === "USER") {
          return message.error(
            "Unauthorized , please sign in with an administrator account!"
          );
        } else if (result.data.user.status === false) {
          return message.error("Your account has been locked!");
        } else {
          message.success(`Login Success!`);
          localStorage.setItem("token", result.data.token);
          dispatch({ type: "LOGIN_DATA", payload: result.data.user });
          setTimeout(() => {
            return (window.location.href = "/");
          }, 2000);
        }
      }
    } catch (error) {
      if (error.response) {
        return message.error(error.response.data.message);
      } else {
        return message.error(error.message);
      }
    }
  };

  const onFinishFailed = () => {
    return message.error("Login Failed !");
  };

  return (
    <Layout>
      <Content style={{ padding: "0 50px" }}>
        <Row justify="center" align="top">
          <Image
            width="100%"
            src={`https://www.talentlms.com/old/wp-content/uploads/2018/08/how-personalization-elearning-works.jpg`}
            preview={false}
          />
        </Row>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item>
            <h1 style={{ marginTop: 10, textAlign: "center" }}>
              Adminstrator - Sign In
            </h1>
          </Form.Item>
          <Row justify="center" align="top">
            <Form.Item
              name="email"
              hasFeedback
              rules={[
                {
                  type: "email",
                  required: true,
                  message: "Please input your email address!",
                },
              ]}
            >
              <Input
                style={{ width: 300 }}
                prefix={<MailOutlined className="site-form-item-icon" />}
                placeholder="Email"
              />
            </Form.Item>
          </Row>
          <Row justify="center" align="top">
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your Password!" },
              ]}
            >
              <Input.Password
                style={{ width: 300 }}
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="Password"
              />
            </Form.Item>
          </Row>
          <Row justify="center" align="top">
            <Form.Item>
              <Button
                style={{ width: 300 }}
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                Log in
              </Button>
            </Form.Item>
          </Row>
        </Form>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Adminstrators - Elearning ©2021 Created by hainn
        <br />
        Ver: 1.0.0
      </Footer>
    </Layout>
  );
};
export default LoginComponent;
