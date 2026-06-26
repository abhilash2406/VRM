import logger from '../utils/logger';
import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useAuthStore } from '../store/useAuthStore';
import { useMsgStore } from '../store/useMsgStore';
import { useLoginPermissions } from '../hooks/queries/usePermissionQueries';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../style/index.css';
import io from 'socket.io-client';
import AppRoutes from './AppRoutes';

const toastConfig = {
  position: 'top-right',
  autoClose: 1000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'dark',
};

const socket = io.connect(process.env.REACT_APP_BACKEND_URL);

const App = () => {
  const role = useAuthStore((state) => state.role);
  const setLogin = useAuthStore((state) => state.setLogin);
  const successMsg = useMsgStore((state) => state.successMsg);
  const errorMsg = useMsgStore((state) => state.errorMsg);
  const resetSuccessMessage = useMsgStore((state) => state.resetSuccessMessage);
  const resetErrorMessage = useMsgStore((state) => state.resetErrorMessage);

  const loginPermissionsMutation = useLoginPermissions();

  useEffect(() => {
    socket.on('GetPermissions', (data) => {
      logger.info('socketData', data);
      setLogin(role, data.data);
    });
    return () => socket.off('GetPermissions');
  }, [socket, role, setLogin]);

  useEffect(() => {
    loginPermissionsMutation.mutate();
  }, []);

  useEffect(() => {
    if (successMsg) {
      toast.success(successMsg, toastConfig);
      resetSuccessMessage();
    } else if (errorMsg) {
      toast.error(errorMsg, toastConfig);
      resetErrorMessage();
    }
  }, [successMsg, errorMsg, resetSuccessMessage, resetErrorMessage]);

  return (
    <div>
      <ToastContainer />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </div>
  );
};

export default App;
