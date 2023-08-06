import { Layout } from "antd";
import {
  connectPluginFromDevToolsAsync,
  DevToolsPluginClient,
} from "expo/devtools";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import { Details } from "./src/Details";
import { Header } from "./src/Header";
import { List, TabsEnum } from "./src/List";
import { BlockType, Data, Events } from "./src/typings";
import {
  createCacheBlock,
  createMutationBlocks,
  createQueryBlocks,
} from "./src/utils";

const InitialData = {
  id: "x",
  lastUpdateAt: new Date(),
  queries: [],
  mutations: [],
  cache: [],
};

let timer: NodeJS.Timeout;

function debounce(func: (...args: any) => any, timeout = 7000): void {
  clearTimeout(timer);
  timer = setTimeout(() => {
    func.apply(this);
  }, timeout);
}

export default function App() {
  const [devToolsClient, setDevToolsClient] =
    useState<DevToolsPluginClient | null>(null);
  const [data, setData] = useState<Data>(InitialData);
  const [selectedItem, setSelectedItem] = useState<BlockType>({});
  const [activeTab, setActiveTab] = useState(TabsEnum.cache.key);

  useEffect(() => {
    (async () => {
      const client = await connectPluginFromDevToolsAsync();
      setDevToolsClient(client);

      client.addMessageListener("GQL:response", (newData: any) => {
        const finalData = {
          ...newData,
          mutations: createMutationBlocks(newData?.mutations).reverse(),
          queries: createQueryBlocks(newData?.queries).reverse(),
          cache: createCacheBlock(newData?.cache),
        };

        setData(finalData);
        devToolsClient.sendMessage("GQL:ack", {});
        resyncData();
      });
      client.sendMessage("GQL:request", {});
    })();
    return () => {
      devToolsClient?.close();
      setDevToolsClient(null);
    };
  }, []);

  const resyncData = () => {
    debounce(() => {
      devToolsClient.sendMessage("GQL:request", {});
    });
  };

  const resetSync = () => {
    clearTimeout(timer);
  };

  function handleClear() {
    setData(InitialData);
    setSelectedItem({});
  }

  function handleCopyText(text: string) {
    // TODO
  }

  function handleRefresh() {
    devToolsClient.sendMessage("GQL:request", {});
  }

  function handleSelectedItem(block: BlockType) {
    setSelectedItem(block);
  }

  function handleTabChange(nextTab: string) {
    setActiveTab(nextTab);
    setSelectedItem({});
  }

  return (
    <View style={styles.container}>
      <Layout>
        <Layout hasSider>
          <Layout.Sider width="40%" style={styles.sider}>
            <View style={styles.sider}>
              <Header onRefresh={handleRefresh} onClear={handleClear} />
              <List
                data={data}
                activeTab={activeTab}
                selectedItem={selectedItem}
                onItemSelect={handleSelectedItem}
                onTabChange={handleTabChange}
              />
            </View>
          </Layout.Sider>
          <Layout.Content style={styles.content}>
            <Details selectedItem={selectedItem} onCopy={handleCopyText} />
          </Layout.Content>
        </Layout>
      </Layout>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 16,
  },
  sider: {
    backgroundColor: "#fff",
    padding: 8,
  },
  content: {
    padding: 8,
  },
});
