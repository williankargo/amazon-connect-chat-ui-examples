import React, { useEffect, useRef } from 'react';
// @ts-ignore
import StaticServer from 'react-native-static-server';
import getAssets from '../utils/staticAssetPath';

interface LocalStaticServerProps {
  onURLInitialized: (url: string) => void;
  port?: number;
  onServerStopped?: () => void;
}

const LocalStaticServer: React.FC<LocalStaticServerProps> = ({
  onURLInitialized,
  port = 8080,
  onServerStopped = () => {},
}) => {
  const server = useRef<StaticServer>(null);
  useEffect(() => {
    return () => {
      if (server && server.current && server.current.isRunning()) {
        server.current.stop();
        server.current = null;
        onServerStopped();
      }
    };
  }, [onServerStopped]);
  useEffect(() => {
    if (server.current == null) {
      getAssets().then((assetPath: string) => {
        server.current = new StaticServer(port, assetPath);
        server.current
          .start()
          .then((serverUrl: string) => {
            onURLInitialized(serverUrl);
          })
          .catch((error: any) => {
            console.log(error);
          });
      });
    }
  }, [port, onURLInitialized]);
  return null;
};

export default LocalStaticServer;
