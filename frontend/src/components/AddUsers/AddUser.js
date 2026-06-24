import React, { useEffect } from 'react';
import { addUser, fetchDesignations } from './action';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import NavBar from '../Main/NavBar';
import { Link, useNavigate } from 'react-router-dom';
import DataTable, { createTheme } from 'react-data-table-component';
import NotFound from '../NotFound';

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const AddUser = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchDesignations());
    // Note: Once the backend endpoint is ready, dispatch fetchUsers() here
  }, [dispatch]);

  const { designations } = useSelector((state) => state.user);
  
  // Dummy data array since we are focusing on frontend layout.
  // Once backend is ready, replace this with the actual users list from Redux state.
  const usersList = []; 

  const {
    handleSubmit,
    handleChange,
    handleBlur,
    touched,
    values,
    errors,
    resetForm,
  } = useFormik({
    validationSchema: Yup.object().shape({
      name: Yup.string().min(3).max(20).required('Name is required'),
      phoneNumber: Yup.string()
        .matches(phoneRegExp, 'Phone number is not valid')
        .required('Phone is required'),
      email: Yup.string()
        .email('Invalid email format')
        .required('Email is required'),
      designation: Yup.string().required('Designation is required'),
    }),
    enableReinitialize: true,
    initialValues: {
      name: '',
      phoneNumber: '',
      email: '',
      designation: '',
    },
    onSubmit: (values, { resetForm }) => {
      dispatch(addUser(values, () => {
        resetForm({ values: '' });
        // Close modal after submission
        const modal = document.getElementById('addUserModal');
        // @ts-ignore
        if (window.bootstrap) {
          const modalInstance = window.bootstrap.Modal.getInstance(modal);
          if (modalInstance) {
            modalInstance.hide();
          }
        }
        navigate('/admin');
      }));
    },
  });

  const options = designations?.filter(
    (item) => item.designation !== 'Admin' && item.designation !== 'Driver'
  );

  const dOptions = options
    ?.map((item, index) => (
      <option key={index} value={item.id}>
        {item.designation}
      </option>
    ))
    .filter((item) => item.designation !== 'Admin');

  createTheme(
    'solarized',
    {
      text: { primary: '#f8fafc', secondary: '#94a3b8' },
      background: { default: 'transparent' },
      context: { background: '#cb4b16', text: '#FFFFFF' },
      divider: { default: 'rgba(255, 255, 255, 0.1)' },
      action: { button: 'rgba(255,255,255,.54)', hover: 'rgba(255,255,255,.08)', disabled: 'rgba(255,255,255,.12)' },
    },
    'dark'
  );

  const columns = [
    { name: 'Name', selector: (row) => row.name || 'N/A' },
    { name: 'Email', selector: (row) => row.email || 'N/A' },
    { name: 'Phone', selector: (row) => row.phoneNumber || 'N/A' },
    { name: 'Designation', selector: (row) => row.designation?.designation || 'N/A' },
  ];

  const customNoData = (
    <NotFound 
      isComponent={true} 
      title="No Users Found" 
      description="There are currently no users available to display." 
      icon="bi-people" 
    />
  );

  return (
    <div className="dashboard-layout">
      <NavBar />
      <div className="dashboard-main">
        <div className="dashboard-header mb-4">
          <div>
            <h1 className="dashboard-title">Users Management</h1>
            <p className="dashboard-subtitle">Manage all registered users in the system.</p>
          </div>
          <button 
            className="btn btn-info px-4 py-2" 
            style={{ background: 'linear-gradient(90deg, #00D4FF, #0066FF)', border: 'none', color: '#fff', fontWeight: 'bold' }}
            data-bs-toggle="modal" 
            data-bs-target="#addUserModal"
          >
            <i className="bi-plus-lg me-2"></i> Add User
          </button>
        </div>

        <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
          <DataTable
            columns={columns}
            data={usersList}
            pagination
            theme="solarized"
            noDataComponent={customNoData}
          />
        </div>

        {/* Add User Modal */}
        <div className="modal fade" id="addUserModal" tabIndex="-1" aria-labelledby="addUserModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}>
              <div className="modal-header border-bottom-0 pb-0">
                <h5 className="modal-title text-light fw-bold" id="addUserModalLabel">Add New User</h5>
                <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label text-light small text-uppercase fw-bold">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control bg-dark text-light border-secondary"
                      placeholder="Enter full name"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.name}
                    />
                    {errors.name && touched.name ? (
                      <div className="text-danger small mt-1">{errors.name}</div>
                    ) : null}
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label text-light small text-uppercase fw-bold">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control bg-dark text-light border-secondary"
                      placeholder="Enter email address"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                    />
                    {errors.email && touched.email ? (
                      <div className="text-danger small mt-1">{errors.email}</div>
                    ) : null}
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-light small text-uppercase fw-bold">Phone Number</label>
                    <input
                      type="text"
                      name="phoneNumber"
                      className="form-control bg-dark text-light border-secondary"
                      placeholder="Enter phone number"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.phoneNumber}
                    />
                    {errors.phoneNumber && touched.phoneNumber ? (
                      <div className="text-danger small mt-1">{errors.phoneNumber}</div>
                    ) : null}
                  </div>

                  <div className="mb-4">
                    <label className="form-label text-light small text-uppercase fw-bold">Designation</label>
                    <select
                      name="designation"
                      className="form-select bg-dark text-light border-secondary"
                      value={values.designation}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option value="">Select a designation</option>
                      {dOptions}
                    </select>
                    {errors.designation && touched.designation ? (
                      <div className="text-danger small mt-1">{errors.designation}</div>
                    ) : null}
                  </div>

                  <div className="d-grid gap-2">
                    <button type="submit" className="btn btn-info py-3" style={{ background: 'linear-gradient(90deg, #00D4FF, #0066FF)', border: 'none', color: '#fff', fontWeight: 'bold', borderRadius: '12px' }}>
                      Create User
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AddUser;
