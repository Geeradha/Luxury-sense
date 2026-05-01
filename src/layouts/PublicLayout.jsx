import { Outlet } from 'react-router-dom';
import LuxuryNavbar from '../components/LuxuryNavbar';

export default function PublicLayout() {
  return (
    <div className="public-layout">
      <LuxuryNavbar />
      <Outlet />
    </div>
  );
}