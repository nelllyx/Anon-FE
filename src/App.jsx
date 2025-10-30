import { Routes } from "./routes/Routes"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { WebSocketProvider } from "./contexts/WebSocketContext"
import WebSocketStatus from "./components/debug/WebSocketStatus"

export default function App(){
  const router = createBrowserRouter([
    ...Routes
  ])
  return (
    <WebSocketProvider>
      <RouterProvider router={router}>
      </RouterProvider>
      <WebSocketStatus />
    </WebSocketProvider>
  )
}
