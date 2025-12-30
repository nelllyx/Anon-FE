import { Routes } from "./routes/Routes"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { WebSocketProvider } from "./contexts/WebSocketContext"

export default function App(){
  const router = createBrowserRouter([
    ...Routes
  ])
  return (
    <WebSocketProvider>
      <RouterProvider router={router} />
    </WebSocketProvider>
  )
}
