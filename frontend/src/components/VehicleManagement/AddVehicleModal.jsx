import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { postData } from '../../services';
import { useAddTruck, useUpdateTruck, useTruckDetails } from '../../hooks/queries/useTruckQueries';
import { useMsgStore } from '../../store/useMsgStore';

const VEHICLE_TYPES = ['two-wheeler', 'four-wheeler', 'heavy-vehicle'];

const SUBTYPE_MAP = {
  'two-wheeler': ['motorcycle', 'scooter'],
  'four-wheeler': ['sedan', 'suv', 'mpv', 'hatchback'],
  'heavy-vehicle': ['truck', 'mini-bus', 'full-bus', 'tempo'],
};

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: currentYear - 1899 }, (_, i) => currentYear - i);

const validationSchema = Yup.object({
  registration_number: Yup.string().required('Registration number is required'),
  manufacturer: Yup.string().required('Manufacturer is required'),
  model_name: Yup.string().required('Model name is required'),
  manufacturing_year: Yup.number()
    .typeError('Year must be a number')
    .integer('Year must be a whole number')
    .min(1900, 'Year must be 1900 or later')
    .max(currentYear + 1, `Year cannot exceed ${currentYear + 1}`)
    .required('Manufacturing year is required'),
  vehicle_type: Yup.string()
    .oneOf(VEHICLE_TYPES, 'Select a valid vehicle type')
    .required('Vehicle type is required'),
  vehicle_subtype: Yup.string().nullable(),
  seating_capacity: Yup.number()
    .typeError('Seating capacity must be a number')
    .integer()
    .min(1, 'At least 1 seat required')
    .nullable(),
  availability_status: Yup.string()
    .oneOf(['available', 'booked', 'maintenance'])
    .nullable(),
  insurance_expiry: Yup.date().nullable(),
  last_service_date: Yup.date().nullable(),
  next_service_date: Yup.date().nullable(),
  vehicle_photo: Yup.string().nullable(),
  rc_photo: Yup.string().nullable(),
});

const MODAL_ID = 'addVehicleModal';

const AddVehicleModal = ({ vehicleId = null, onSuccess, onClose }) => {
  const isEditMode = Boolean(vehicleId);
  const { data: vehicleData, isLoading: isLoadingDetails } = useTruckDetails(vehicleId);
  
  const { mutate: addTruck, isPending: isAdding } = useAddTruck();
  const { mutate: updateTruck, isPending: isUpdating } = useUpdateTruck();
  const setErrorMessage = useMsgStore((state) => state.setErrorMessage);
  const isPending = isAdding || isUpdating;

  // Track uploading state for individual files
  const [uploading, setUploading] = React.useState({ vehicle_photo: false, rc_photo: false });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      registration_number: isEditMode && vehicleData ? vehicleData.registration_number : '',
      manufacturer: isEditMode && vehicleData ? vehicleData.manufacturer : '',
      model_name: isEditMode && vehicleData ? vehicleData.model_name : '',
      manufacturing_year: isEditMode && vehicleData ? vehicleData.manufacturing_year : currentYear,
      vehicle_type: isEditMode && vehicleData ? vehicleData.vehicle_type : '',
      vehicle_subtype: isEditMode && vehicleData ? (vehicleData.vehicle_subtype || '') : '',
      seating_capacity: isEditMode && vehicleData ? (vehicleData.seating_capacity || '') : '',
      availability_status: isEditMode && vehicleData ? (vehicleData.availability_status || 'available') : 'available',
      insurance_expiry: isEditMode && vehicleData?.insurance_expiry ? vehicleData.insurance_expiry.split('T')[0] : '',
      last_service_date: isEditMode && vehicleData?.last_service_date ? vehicleData.last_service_date.split('T')[0] : '',
      next_service_date: isEditMode && vehicleData?.next_service_date ? vehicleData.next_service_date.split('T')[0] : '',
      vehicle_photo: isEditMode && vehicleData ? (vehicleData.vehicle_photo || '') : '',
      rc_photo: isEditMode && vehicleData ? (vehicleData.rc_photo || '') : '',
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      const payload = {
        registration_number: values.registration_number,
        manufacturer: values.manufacturer,
        model_name: values.model_name,
        manufacturing_year: Number(values.manufacturing_year),
        vehicle_type: values.vehicle_type,
      };
      if (values.vehicle_subtype) payload.vehicle_subtype = values.vehicle_subtype;
      if (values.seating_capacity) payload.seating_capacity = Number(values.seating_capacity);
      if (values.availability_status) payload.availability_status = values.availability_status;
      if (values.insurance_expiry) payload.insurance_expiry = values.insurance_expiry;
      if (values.last_service_date) payload.last_service_date = values.last_service_date;
      if (values.next_service_date) payload.next_service_date = values.next_service_date;
      if (values.vehicle_photo) payload.vehicle_photo = values.vehicle_photo;
      if (values.rc_photo) payload.rc_photo = values.rc_photo;

      const handleSuccess = () => {
        resetForm();
        const modal = window.bootstrap?.Modal?.getInstance(
          document.getElementById(MODAL_ID)
        );
        modal?.hide();
        onSuccess?.();
        onClose?.();
      };

      if (isEditMode) {
        updateTruck({ id: vehicleId, props: payload }, { onSuccess: handleSuccess });
      } else {
        addTruck(payload, { onSuccess: handleSuccess });
      }
    },
  });

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, resetForm, setFieldValue } = formik;

  useEffect(() => {
    if (isEditMode && vehicleData && values.vehicle_type === vehicleData.vehicle_type) {
      return;
    }
    setFieldValue('vehicle_subtype', '');
  }, [values.vehicle_type, vehicleData, isEditMode]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClose = () => {
    resetForm();
    onClose?.();
  };

  const handleFileUpload = async (event, fieldName) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(prev => ({ ...prev, [fieldName]: true }));
    try {
      const formData = new FormData();
      formData.append('image', file); // Backend FileUpload API expects 'image' key
      const { data } = await postData('/file-upload', formData);
      if (data.success && data.data && data.data.path) {
        setFieldValue(fieldName, data.data.path);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'File upload failed');
    } finally {
      setUploading(prev => ({ ...prev, [fieldName]: false }));
    }
  };

  const availableSubtypes = SUBTYPE_MAP[values.vehicle_type] || [];

  const field = (name) => ({
    name,
    id: `avm-${name}`,
    value: values[name],
    onChange: handleChange,
    onBlur: handleBlur,
  });

  const errorMsg = (name) =>
    errors[name] && touched[name] ? (
      <div className="avm-error">{errors[name]}</div>
    ) : null;

  return (
    <>
      <div
        className="modal fade"
        id={MODAL_ID}
        tabIndex="-1"
        aria-labelledby={`${MODAL_ID}Label`}
        aria-hidden="true"
        data-bs-backdrop={isEditMode ? 'static' : true}
      >
        <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content avm-modal-content">
            <div className="modal-header avm-modal-header">
              <div>
                <h5 className="modal-title avm-modal-title" id={`${MODAL_ID}Label`}>
                  <i className={`bi ${isEditMode ? 'bi-pencil-square' : 'bi-truck'} me-2`}></i>
                  {isEditMode ? 'Edit Vehicle' : 'Add New Vehicle'}
                </h5>
                <p className="avm-modal-subtitle mb-0">
                  {isEditMode ? 'Update the registration details' : 'Fill in the details to register a new vehicle'}
                </p>
              </div>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={handleClose}
              />
            </div>

            <div className="modal-body avm-modal-body position-relative">
              {isEditMode && isLoadingDetails && (
                <div className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-75" style={{ zIndex: 10 }}>
                  <div className="spinner-border text-info" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}
              <form id="addVehicleForm" onSubmit={handleSubmit} noValidate>
                <div className="avm-section-label">Basic Information</div>
                <div className="row g-3">
                  <div className="col-md-3">
                    <label htmlFor="avm-registration_number" className="avm-label">
                      Registration Number <span className="avm-required">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control avm-input ${errors.registration_number && touched.registration_number ? 'is-invalid' : ''}`}
                      placeholder="e.g. KL-01-AB-1234"
                      {...field('registration_number')}
                    />
                    {errorMsg('registration_number')}
                  </div>

                  <div className="col-md-3">
                    <label htmlFor="avm-manufacturing_year" className="avm-label">
                      Manufacturing Year <span className="avm-required">*</span>
                    </label>
                    <select
                      className={`form-select avm-input ${errors.manufacturing_year && touched.manufacturing_year ? 'is-invalid' : ''}`}
                      {...field('manufacturing_year')}
                    >
                      {YEARS.map((yr) => (
                        <option key={yr} value={yr}>{yr}</option>
                      ))}
                    </select>
                    {errorMsg('manufacturing_year')}
                  </div>

                  <div className="col-md-3">
                    <label htmlFor="avm-manufacturer" className="avm-label">
                      Manufacturer <span className="avm-required">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control avm-input ${errors.manufacturer && touched.manufacturer ? 'is-invalid' : ''}`}
                      placeholder="e.g. Hyundai, Tata, Honda"
                      {...field('manufacturer')}
                    />
                    {errorMsg('manufacturer')}
                  </div>

                  <div className="col-md-3">
                    <label htmlFor="avm-model_name" className="avm-label">
                      Model Name <span className="avm-required">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control avm-input ${errors.model_name && touched.model_name ? 'is-invalid' : ''}`}
                      placeholder="e.g. Creta, Nexon, Activa"
                      {...field('model_name')}
                    />
                    {errorMsg('model_name')}
                  </div>
                </div>

                <div className="avm-section-label mt-4">Vehicle Classification</div>
                <div className="row g-3">
                  <div className="col-md-3">
                    <label htmlFor="avm-vehicle_type" className="avm-label">
                      Vehicle Type <span className="avm-required">*</span>
                    </label>
                    <select
                      className={`form-select avm-input ${errors.vehicle_type && touched.vehicle_type ? 'is-invalid' : ''}`}
                      {...field('vehicle_type')}
                    >
                      <option value="">Select vehicle type</option>
                      {VEHICLE_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                    {errorMsg('vehicle_type')}
                  </div>

                  <div className="col-md-3">
                    <label htmlFor="avm-vehicle_subtype" className="avm-label">Vehicle Subtype</label>
                    <select
                      className="form-select avm-input"
                      {...field('vehicle_subtype')}
                      disabled={!values.vehicle_type}
                    >
                      <option value="">Select subtype (optional)</option>
                      {availableSubtypes.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-3">
                    <label htmlFor="avm-seating_capacity" className="avm-label">Seating Capacity</label>
                    <input
                      type="number"
                      className={`form-control avm-input ${errors.seating_capacity && touched.seating_capacity ? 'is-invalid' : ''}`}
                      placeholder="e.g. 5"
                      min="1"
                      {...field('seating_capacity')}
                    />
                    {errorMsg('seating_capacity')}
                  </div>

                  <div className="col-md-3">
                    <label htmlFor="avm-availability_status" className="avm-label">Availability Status</label>
                    <select className="form-select avm-input" {...field('availability_status')}>
                      <option value="available">Available</option>
                      <option value="booked">Booked</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                  </div>
                </div>

                <div className="avm-section-label mt-4">Service & Insurance</div>
                <div className="row g-3">
                  <div className="col-md-4">
                    <label htmlFor="avm-insurance_expiry" className="avm-label">Insurance Expiry</label>
                    <input type="date" className="form-control avm-input" {...field('insurance_expiry')} />
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="avm-last_service_date" className="avm-label">Last Service Date</label>
                    <input type="date" className="form-control avm-input" {...field('last_service_date')} />
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="avm-next_service_date" className="avm-label">Next Service Date</label>
                    <input type="date" className="form-control avm-input" {...field('next_service_date')} />
                  </div>
                </div>

                <div className="avm-section-label mt-4">Documentation</div>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="avm-vehicle_photo" className="avm-label">Vehicle Photo</label>
                    <div className="d-flex align-items-center gap-2">
                      <input 
                        type="file" 
                        className="form-control avm-input" 
                        id="avm-vehicle_photo"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'vehicle_photo')}
                        disabled={uploading.vehicle_photo}
                      />
                      {uploading.vehicle_photo && <span className="spinner-border spinner-border-sm text-info"></span>}
                    </div>
                    {values.vehicle_photo && (
                      <div className="mt-2">
                        <span className="badge bg-success bg-opacity-25 text-success border border-success">
                          <i className="bi bi-check-circle me-1"></i>Uploaded
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="avm-rc_photo" className="avm-label">RC Photo (Registration Certificate)</label>
                    <div className="d-flex align-items-center gap-2">
                      <input 
                        type="file" 
                        className="form-control avm-input" 
                        id="avm-rc_photo"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'rc_photo')}
                        disabled={uploading.rc_photo}
                      />
                      {uploading.rc_photo && <span className="spinner-border spinner-border-sm text-info"></span>}
                    </div>
                    {values.rc_photo && (
                      <div className="mt-2">
                        <span className="badge bg-success bg-opacity-25 text-success border border-success">
                          <i className="bi bi-check-circle me-1"></i>Uploaded
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </div>

            <div className="modal-footer avm-modal-footer">
              <button
                type="button"
                className="btn avm-btn-cancel"
                data-bs-dismiss="modal"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                form="addVehicleForm"
                className="btn avm-btn-submit"
                disabled={isPending || (isEditMode && isLoadingDetails)}
              >
                {isPending ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    {isEditMode ? 'Saving…' : 'Adding…'}
                  </>
                ) : (
                  <>
                    <i className={`bi ${isEditMode ? 'bi-save' : 'bi-plus-lg'} me-2`}></i>
                    {isEditMode ? 'Save Changes' : 'Add Vehicle'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .avm-modal-content {
          background: #0f1729;
          border: 1px solid rgba(0, 212, 255, 0.2);
          border-radius: 16px;
          color: #f8fafc;
        }
        .avm-modal-header {
          background: linear-gradient(135deg, rgba(0,212,255,0.12), rgba(0,102,255,0.08));
          border-bottom: 1px solid rgba(255,255,255,0.08);
          padding: 20px 24px;
          border-radius: 16px 16px 0 0;
        }
        .avm-modal-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: #f8fafc;
          margin: 0;
        }
        .avm-modal-subtitle {
          font-size: 0.8rem;
          color: #94a3b8;
          margin-top: 2px;
        }
        .avm-modal-body { background: transparent; padding: 24px; }
        .avm-section-label {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #00d4ff;
          margin-bottom: 12px;
          padding-bottom: 6px;
          border-bottom: 1px solid rgba(0,212,255,0.15);
        }
        .avm-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: #cbd5e1;
          margin-bottom: 5px;
          display: block;
        }
        .avm-required { color: #f87171; }
        .avm-input {
          background: rgba(15,23,42,0.7) !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
          color: #f8fafc !important;
          border-radius: 8px !important;
          padding: 9px 12px !important;
          font-size: 0.88rem;
          transition: border-color 0.2s, box-shadow 0.2s;
          color-scheme: dark;
        }
        .avm-input:focus {
          border-color: rgba(0,212,255,0.5) !important;
          box-shadow: 0 0 0 3px rgba(0,212,255,0.12) !important;
          outline: none !important;
        }
        .avm-input option { background: #0f1729; color: #f8fafc; }
        .avm-input::placeholder { color: #475569 !important; }
        .avm-input:disabled { opacity: 0.4; cursor: not-allowed; }
        
        /* Custom File Upload Button */
        .avm-input[type="file"] {
          padding: 5px 12px !important;
        }
        .avm-input[type="file"]::file-selector-button {
          background: rgba(255, 255, 255, 0.1);
          color: #f8fafc;
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 6px;
          padding: 6px 12px;
          margin-right: 12px;
          cursor: pointer;
          font-weight: 500;
          font-size: 0.82rem;
          transition: all 0.2s ease;
        }
        .avm-input[type="file"]::file-selector-button:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .avm-error { font-size: 0.75rem; color: #f87171; margin-top: 4px; }
        .avm-modal-footer {
          background: rgba(255,255,255,0.02);
          border-top: 1px solid rgba(255,255,255,0.08);
          padding: 16px 24px;
          gap: 10px;
        }
        .avm-btn-cancel {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          color: #94a3b8;
          border-radius: 8px;
          padding: 8px 20px;
          font-weight: 500;
          transition: background 0.2s;
        }
        .avm-btn-cancel:hover { background: rgba(255,255,255,0.1); color: #f8fafc; }
        .avm-btn-submit {
          background: linear-gradient(90deg, #00D4FF, #0066FF);
          border: none;
          color: #fff;
          border-radius: 8px;
          padding: 8px 24px;
          font-weight: 700;
          transition: opacity 0.2s, transform 0.1s;
        }
        .avm-btn-submit:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
        .avm-btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }

        body.light-mode .avm-modal-content {
          background: #ffffff;
          border-color: rgba(0,102,255,0.15);
          color: #0f172a;
        }
        body.light-mode .avm-modal-header {
          background: linear-gradient(135deg, rgba(0,212,255,0.08), rgba(0,102,255,0.05));
        }
        body.light-mode .avm-modal-title { color: #0f172a; }
        body.light-mode .avm-label { color: #475569; }
        body.light-mode .avm-input {
          background: rgba(248,250,252,0.9) !important;
          border-color: rgba(0,0,0,0.12) !important;
          color: #0f172a !important;
          color-scheme: light;
        }
        body.light-mode .avm-input option { background: #fff; color: #0f172a; }
        
        body.light-mode .avm-input[type="file"]::file-selector-button {
          background: #f1f5f9;
          color: #1e293b;
          border-color: rgba(0,0,0,0.1);
        }
        body.light-mode .avm-input[type="file"]::file-selector-button:hover {
          background: #e2e8f0;
        }

        body.light-mode .avm-modal-footer { background: rgba(0,0,0,0.02); }
        body.light-mode .avm-btn-cancel { background: rgba(0,0,0,0.04); border-color: rgba(0,0,0,0.1); color: #64748b; }
        body.light-mode .avm-btn-cancel:hover { background: rgba(0,0,0,0.08); color: #0f172a; }
        body.light-mode .avm-section-label { color: #0066ff; border-color: rgba(0,102,255,0.15); }
      `}</style>
    </>
  );
};

export default AddVehicleModal;
