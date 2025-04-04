import { Routes } from "./routes/Routes"
import { createBrowserRouter, RouterProvider } from "react-router-dom"

export default function App(){
  const router = createBrowserRouter([
    ...Routes
  ])
return (
  <>
  <RouterProvider router={router}>

  </RouterProvider>   
  </>
)
}
