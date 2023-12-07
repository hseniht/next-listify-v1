import Link from "next/link";
import styles from "../styles/layout.module.css";
import { ArrowRightOutlined } from "@ant-design/icons";
import { Button, Space, Layout, Typography } from "antd";
const { Title, Paragraph, Text } = Typography;
import { PageWrapper } from "../components/ui/layout";

const descriptionText = `
  Transform your ideas into organized notes with Listify! Whether you're
  jotting down thoughts, creating to-do lists, or brainstorming, Listify
  is your ultimate tool for capturing and managing your thoughts. Say
  goodbye to scattered notes and hello to a streamlined note-taking
  experience. Start using Listify today and bring order to your
  creativity!
`;

export default function Home() {
  return (
    <PageWrapper
      id={"homePage"}
      className={`${styles["page__wrapper--hero"]} ${styles["wh-100"]}`}
    >
      <Typography direction="vertical" size="middle">
        <Title>{"Welcome to Listify!"}</Title>
        <Title level={3}>{"Get Ready to Organize and Capture Ideas"}</Title>
        <Paragraph>{descriptionText}</Paragraph>
        <br />
        <div className="menu-item">
          <Link href={"list"}>
            <Space>
              <span>{"Start Taking Notes"}</span>
              <Button
                type="primary"
                shape="circle"
                icon={<ArrowRightOutlined />}
              />
            </Space>
          </Link>
        </div>
      </Typography>
    </PageWrapper>
  );
}
