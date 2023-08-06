import { CopyOutlined } from "@ant-design/icons";
import { Button, Typography, Tooltip } from "antd";
import React, { Fragment } from "react";
import ReactJson from "react-json-view";
import { ScrollView } from "react-native";

import { BlockType } from "./typings";

export function Details({
  selectedItem,
  onCopy,
}: {
  selectedItem: BlockType;
  onCopy: (...args: any) => void;
}) {
  return (
    <ScrollView>
      <Typography.Title level={4} type="secondary">
        {selectedItem?.operationType}
      </Typography.Title>
      <Typography.Title level={4}>{selectedItem?.name}</Typography.Title>
      <br />

      {selectedItem?.blocks?.map((block, index) => {
        const key = `block${index}`;
        if (block.blockType === "GQLString") {
          return (
            <Fragment key={key}>
              <Typography.Title key={key} level={4} type="secondary">
                {block?.blockLabel}
              </Typography.Title>
              <Typography.Text style={{ fontSize: 12 }}>
                <pre>{block?.blockValue?.trim()}</pre>
              </Typography.Text>
              <br />
            </Fragment>
          );
        } else if (block.blockType === "Object") {
          return (
            <Fragment key={key}>
              <Typography.Title level={4} type="secondary">
                {block?.blockLabel}
                <Tooltip title="copy">
                  <Button
                    onClick={() =>
                      onCopy(`${JSON.stringify(block?.blockValue)}`)
                    }
                    style={{ marginLeft: 10 }}
                    size="small"
                    type="default"
                    shape="default"
                    icon={<CopyOutlined />}
                  />
                </Tooltip>
              </Typography.Title>
              <ReactJson src={block?.blockValue} />
              <br />
            </Fragment>
          );
        } else {
          return null;
        }
      })}
    </ScrollView>
  );
}
