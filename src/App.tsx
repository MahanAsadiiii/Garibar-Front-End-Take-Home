import { Typography } from "antd";
import CargoOrderList from "./components/CargoOrderList";
import "./App.css";

function App() {
  return (
    <main className="app">
      <Typography.Title level={1}>Cargo Orders</Typography.Title>
      <CargoOrderList />
    </main>
  );
}

export default App;
