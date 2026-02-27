import { Navigate, Outlet } from 'react-router-dom'

interface IUnauthenticated {
  logged: boolean
}

export function Unauthenticated({ logged }: IUnauthenticated) {
  return !logged ? <Outlet /> : <Navigate to='/' replace />
}
