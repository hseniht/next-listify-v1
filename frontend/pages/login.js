import { useState, useEffect } from "react";
import { useLogin } from "../hooks/useLogin";
import { useAuthContext } from "../hooks/useAuthContext";
import { useRouter } from "next/router";
import { PageWrapper } from "../components/ui/layout";
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

import styles from "../styles/layout.module.css";

const Login = () => {
  //form input states no longer needed as "AntD Form UI" handles it.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, isLoading } = useLogin();
  const { user } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/list");
    }
  }, [user]);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   await login(email, password);
  // };

  const onFinish = async (values) => {
    const { email, password } = values;
    await login(email, password);
    console.log("login success");
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Login failed:", errorInfo);
  };

  return (
    <PageWrapper
      id={"loginPage"}
      // className={"page__wrapper--login"}
      className={`${styles["page__wrapper--login"]}`}
    >
      <Card>
        <h3>Login</h3>
        <Form
          name="login"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          // style={{
          //   maxWidth: 600,
          // }}
          // initialValues={{
          //   remember: true,
          // }}
          onFinish={onFinish}
          // onFinish={onFinish}
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

          {/* <Form.Item
            name="remember"
            valuePropName="checked"
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Checkbox>Remember me</Checkbox>
          </Form.Item> */}

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            {/* Todo UI: Popup the error */}
            <Col>{error && <Text type="danger" style={{fontSize: "12px", }}>{error}</Text>}</Col>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </PageWrapper>
    //</Layout>
  );
};

export default Login;
