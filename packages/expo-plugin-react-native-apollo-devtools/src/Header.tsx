import { RocketOutlined, GithubOutlined } from "@ant-design/icons";
import { Typography, Button, Row, Col, Space } from "antd";
import React from "react";

// import { getFlipperLib } from "flipper-plugin";

export function Header({
  onRefresh,
  onClear,
}: {
  onRefresh: () => void;
  onClear: () => void;
}) {
  return (
    <Row align="bottom">
      <Col span={16}>
        <Typography.Title level={3}>
          <RocketOutlined />
          &nbsp;React Native Apollo Devtool
        </Typography.Title>
      </Col>
      <Col span={8} style={{ marginBottom: "0.5em" }}>
        <Space size="small" wrap>
          <Button type="default" size="small" onClick={onRefresh}>
            Refresh
          </Button>
          <Button type="default" size="small" onClick={onClear}>
            Clear
          </Button>
          <Button
            icon={<GithubOutlined />}
            onClick={() => {
              window.open(
                "https://github.com/razorpay/react-native-apollo-devtools",
                "_blank"
              );
            }}
            type="link"
          >
            Github
          </Button>
        </Space>
      </Col>
    </Row>
  );
}
