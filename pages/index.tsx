import React, { useEffect } from "react";

export default function Home() {
  const nWindow = global.window as any;
  useEffect(() => {
    const handleYTHotFromServer = (event, dataFromServer) => {
      console.log(dataFromServer)
    };   
    nWindow.electron.ytHotFromServer.on(handleYTHotFromServer);
    nWindow.electron.ytHotFromClient.send()
    return () => {
      nWindow.electron.ytHotFromServer.off();
      nWindow.electron.ytHotFromClient.off();
    };
  }, []);
  return (
    <div>
      <h2>還沒想到要加什麼~~~</h2>
    </div>
  );
}
