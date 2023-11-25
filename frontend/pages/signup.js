import { useState, useEffect } from "react";
import { useSignup } from "../hooks/useSignUp";
import { useAuthContext } from "../hooks/useAuthContext";
import { useRouter } from "next/router";
import { PageWrapper } from "../components/ui/layout";
import styles from "../styles/layout.module.css";
import {
  Button,
  Card,
  Checkbox,
  Col,
  Flex,
  Row,
  Layout,
  Form,
  Input,
  Typography,
} from "antd";
const { Text } = Typography;

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signup, error, isLoading } = useSignup();
  const { user } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/list");
    }
  }, [user]);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   await signup(email, password);
  // };

  const onFinish = async (values) => {
    const { email, password } = values;
    await signup(email, password);
    console.log("signup processed");
  };
  const onFinishFailed = (errorInfo) => {
    console.log("signup failed:", errorInfo);
  };

  return (
    <PageWrapper
      id={"loginPage"}
      className={`${styles["page__wrapper--login"]}`}
    >
      <Card>
        <h3>Create Your Account</h3>
        <Form
          name="signup"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Email"
            name="email"
            initialValue={""}
            rules={[
              {
                type: "email",
                required: true,
                // message: "Please input your username!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            initialValue={""}
            rules={[
              {
                required: true,
                // message: "Please input your password!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            {/* Todo UI: Popup the error */}
            <Col>
              {error && (
                <Text type="danger" style={{ fontSize: "12px" }}>
                  {error}
                </Text>
              )}
            </Col>
            <Button type="primary" htmlType="submit">
              Sign Up
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </PageWrapper>
  );
};

export default Signup;
