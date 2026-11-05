import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AppLayout, type NavGroup } from '@/layouts/AppLayout';
import { PageLoader } from '@/components/ui';
import { isManager, useAuthStore } from '@/store/useAuthStore';
import { useEmployeeLearning, useMyNotifications } from '@/hooks/useAnalytics';

import Login from '@/pages/auth/Login';

import EmployeeDashboard from '@/pages/employee/Dashboard';
import MyCourses from '@/pages/employee/MyCourses';
import Catalog from '@/pages/employee/Catalog';
import CourseDetail from '@/pages/employee/CourseDetail';
import CoursePlayer from '@/pages/employee/CoursePlayer';
import AssessmentPage from '@/pages/employee/Assessment';
import EmployeePaths from '@/pages/employee/Paths';
import EmployeePathDetail from '@/pages/employee/PathDetail';
import Certificates from '@/pages/employee/Certificates';
import EmployeeNotifications from '@/pages/employee/Notifications';
import Profile from '@/pages/employee/Profile';

// O ambiente administrativo é carregado sob demanda: evita que o colaborador
// baixe a biblioteca de gráficos e as telas de gestão que nunca irá acessar.
const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard'));
const Departments = lazy(() => import('@/pages/admin/Departments'));
const DepartmentDetail = lazy(() => import('@/pages/admin/DepartmentDetail'));
const Employees = lazy(() => import('@/pages/admin/Employees'));
const EmployeeDetail = lazy(() => import('@/pages/admin/EmployeeDetail'));
const AdminCourses = lazy(() => import('@/pages/admin/Courses'));
const CourseEditor = lazy(() => import('@/pages/admin/CourseEditor'));
const AdminPaths = lazy(() => import('@/pages/admin/Paths'));
const AdminPathDetail = lazy(() => import('@/pages/admin/PathDetail'));
const Reports = lazy(() => import('@/pages/admin/Reports'));
const AdminNotifications = lazy(() => import('@/pages/admin/Notifications'));
const SettingsPage = lazy(() => import('@/pages/admin/Settings'));

function RequireAuth({ children }: { children: JSX.Element }) {
  const user = useAuthStore((s) => s.user);
  const location = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  return children;
}

function RequireManager({ children }: { children: JSX.Element }) {
  const user = useAuthStore((s) => s.user);
  if (!user) return <Navigate to="/login" replace />;
  if (!isManager(user)) return <Navigate to="/app" replace />;
  return children;
}

function EmployeeShell() {
  const user = useAuthStore((s) => s.user);
  const { unread } = useMyNotifications(user?.id, false);
  const learning = useEmployeeLearning(user?.id);

  const groups: NavGroup[] = [
    {
      title: 'Aprendizagem',
      items: [
        { to: '/app', label: 'Início', icon: 'Home', end: true },
        {
          to: '/app/meus-treinamentos',
          label: 'Meus treinamentos',
          icon: 'BookOpen',
          badge: learning.late || undefined,
        },
        { to: '/app/catalogo', label: 'Catálogo', icon: 'LibraryBig' },
        { to: '/app/trilhas', label: 'Trilhas', icon: 'Route' },
      ],
    },
    {
      title: 'Minha jornada',
      items: [
        { to: '/app/certificados', label: 'Certificados', icon: 'Award' },
        {
          to: '/app/notificacoes',
          label: 'Notificações',
          icon: 'Bell',
          badge: unread || undefined,
        },
        { to: '/app/perfil', label: 'Meu perfil', icon: 'UserCircle' },
      ],
    },
  ];

  return <AppLayout groups={groups} variant="employee" />;
}

function AdminShell() {
  const user = useAuthStore((s) => s.user);
  const { unread } = useMyNotifications(user?.id, true);

  const groups: NavGroup[] = [
    {
      title: 'Gestão',
      items: [
        { to: '/admin', label: 'Visão geral', icon: 'LayoutDashboard', end: true },
        { to: '/admin/departamentos', label: 'Departamentos', icon: 'Building2' },
        { to: '/admin/colaboradores', label: 'Colaboradores', icon: 'Users' },
      ],
    },
    {
      title: 'Conteúdo',
      items: [
        { to: '/admin/treinamentos', label: 'Treinamentos', icon: 'GraduationCap' },
        { to: '/admin/trilhas', label: 'Trilhas de aprendizagem', icon: 'Route' },
      ],
    },
    {
      title: 'Análise',
      items: [
        { to: '/admin/relatorios', label: 'Relatórios', icon: 'BarChart3' },
        {
          to: '/admin/notificacoes',
          label: 'Notificações',
          icon: 'Bell',
          badge: unread || undefined,
        },
        { to: '/admin/configuracoes', label: 'Configurações', icon: 'Settings' },
      ],
    },
  ];

  return <AppLayout groups={groups} variant="admin" />;
}

/** Envolve as rotas carregadas sob demanda com um estado de carregamento. */
function Lazy({ children }: { children: JSX.Element }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

export default function App() {
  const user = useAuthStore((s) => s.user);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/app"
        element={
          <RequireAuth>
            <EmployeeShell />
          </RequireAuth>
        }
      >
        <Route index element={<EmployeeDashboard />} />
        <Route path="meus-treinamentos" element={<MyCourses />} />
        <Route path="catalogo" element={<Catalog />} />
        <Route path="catalogo/:courseId" element={<CourseDetail />} />
        <Route path="treinamento/:courseId/player" element={<CoursePlayer />} />
        <Route path="treinamento/:courseId/avaliacao" element={<AssessmentPage />} />
        <Route path="trilhas" element={<EmployeePaths />} />
        <Route path="trilhas/:pathId" element={<EmployeePathDetail />} />
        <Route path="certificados" element={<Certificates />} />
        <Route path="notificacoes" element={<EmployeeNotifications />} />
        <Route path="perfil" element={<Profile />} />
      </Route>

      <Route
        path="/admin"
        element={
          <RequireManager>
            <AdminShell />
          </RequireManager>
        }
      >
        <Route index element={<Lazy><AdminDashboard /></Lazy>} />
        <Route path="departamentos" element={<Lazy><Departments /></Lazy>} />
        <Route
          path="departamentos/:departmentId"
          element={<Lazy><DepartmentDetail /></Lazy>}
        />
        <Route path="colaboradores" element={<Lazy><Employees /></Lazy>} />
        <Route
          path="colaboradores/:employeeId"
          element={<Lazy><EmployeeDetail /></Lazy>}
        />
        <Route path="treinamentos" element={<Lazy><AdminCourses /></Lazy>} />
        <Route path="treinamentos/novo" element={<Lazy><CourseEditor /></Lazy>} />
        <Route path="treinamentos/:courseId" element={<Lazy><CourseEditor /></Lazy>} />
        <Route path="trilhas" element={<Lazy><AdminPaths /></Lazy>} />
        <Route path="trilhas/:pathId" element={<Lazy><AdminPathDetail /></Lazy>} />
        <Route path="relatorios" element={<Lazy><Reports /></Lazy>} />
        <Route path="notificacoes" element={<Lazy><AdminNotifications /></Lazy>} />
        <Route path="configuracoes" element={<Lazy><SettingsPage /></Lazy>} />
      </Route>

      <Route
        path="*"
        element={
          <Navigate
            to={user ? (isManager(user) ? '/admin' : '/app') : '/login'}
            replace
          />
        }
      />
    </Routes>
  );
}
