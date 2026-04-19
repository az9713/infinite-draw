import { Outlet } from 'react-router-dom'

export default function App() {
  return (
    <div className="flex h-full w-full flex-col bg-zinc-950 text-zinc-100">
      <Outlet />
    </div>
  )
}
