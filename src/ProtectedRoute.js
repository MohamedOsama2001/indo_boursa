import { Navigate, Outlet } from 'react-router-dom';
const ProtectedRoute = ({ allowedRoles }) => {
  const user=JSON.parse(localStorage.getItem('user'))
  if(!user){
    return <Navigate to="/"/>;
  }
  const userRole = user?.rule // استرجاع دور المستخدم من localStorage

  // إذا كان الدور متطابقًا، اعرض المكونات الداخلية
  return allowedRoles.includes(userRole) ? <Outlet /> : <Navigate to="/unauthorized" />;
};


export default ProtectedRoute;