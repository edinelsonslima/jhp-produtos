import { Navigate, Outlet } from 'react-router-dom'

interface IAuthenticated {
  logged: boolean
}

export function Authenticated({ logged }: IAuthenticated) {
  return logged ? <Outlet /> : <Navigate to='/login' replace />
}
