import React, { useState, useRef, useEffect } from 'react';
import { useTruckDetails, useUpdateTruckStatus, useUpdateTruckAvailability } from '../../../hooks/queries/useTruckQueries';
import { useAuthStore } from '../../../store/useAuthStore';

const MODAL_ID = 'viewVehicleModal';

const ViewVehicleModal = ({ vehicleId, onClose }) => {
  const { data: vehicle, isLoading, isFetching } = useTruckDetails(vehicleId);
  const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateTruckStatus();
  const { mutate: updateAvailability, isPending: isUpdatingAvailability } = useUpdateTruckAvailability();

  const { user } = useAuthStore();
  const userRole = user?.role;
  const permissionAllowed = user?.permissionAllowed;
  const canEdit = userRole === 'Admin' || userRole === 'SUPERADMIN' || permissionAllowed?.includes('Edit');

  const [openDropdown, setOpenDropdown] = useState(null); // 'status' or 'availability'

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.vvm-dropdown-container')) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStatusChange = (val) => {
    if (!canEdit) return;
    updateStatus({ id: vehicle.id, status: val });
    setOpenDropdown(null);
  };

  const handleAvailabilityChange = (val) => {
    if (!canEdit) return;
    updateAvailability({ id: vehicle.id, availability_status: val });
    setOpenDropdown(null);
  };

  const handleClose = () => {
    onClose?.();
  };

  const renderField = (label, value, isBadge = false) => (
    <div className="mb-3">
      <div className="vvm-label">{label}</div>
      {isBadge ? (
        <span className={`badge bg-${value === 'ACTIVE' || value === 'available' ? 'success' : value === 'BLOCKED' || value === 'maintenance' ? 'danger' : 'warning'} bg-opacity-25 border border-${value === 'ACTIVE' || value === 'available' ? 'success' : value === 'BLOCKED' || value === 'maintenance' ? 'danger' : 'warning'} text-${value === 'ACTIVE' || value === 'available' ? 'success' : value === 'BLOCKED' || value === 'maintenance' ? 'danger' : 'warning'} px-3 py-2 mt-1 rounded-pill`}>
          {value || 'N/A'}
        </span>
      ) : (
        <div className="vvm-value">{value || 'N/A'}</div>
      )}
    </div>
  );

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <>
      <div
        className="modal fade"
        id={MODAL_ID}
        tabIndex="-1"
        aria-labelledby={`${MODAL_ID}Label`}
        aria-hidden="true"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
      >
        <div className="modal-dialog modal-xl vvm-modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content vvm-modal-content border-0">
            <div className="modal-body vvm-modal-body p-0 m-0">
              {isLoading || isFetching ? (
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '500px' }}>
                  <div className="spinner-border text-info" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : vehicle ? (
                <div className="row m-0 vvm-split-layout">
                  {/* Left Column - Fixed Image */}
                  <div className="col-lg-5 p-0 position-relative vvm-left-col">
                    <img 
                      src={vehicle.vehicle_photo_url || '/logo.png'} 
                      onError={(e) => { e.target.onerror = null; e.target.src = '/logo.png'; }}
                      alt="Vehicle" 
                      className="vvm-fixed-image"
                    />
                  </div>
                  
                  {/* Right Column - Details */}
                  <div className="col-lg-7 p-4 p-md-5 vvm-right-col">
                    
                    <div className="d-flex justify-content-between align-items-start mb-4 pb-3 border-bottom border-secondary border-opacity-25">
                      <div>
                        <h2 className="fw-bold text-white mb-1" style={{ fontSize: '2rem' }}>{vehicle.manufacturer} {vehicle.model_name}</h2>
                        <h5 className="text-info font-monospace mb-0">{vehicle.registration_number}</h5>
                      </div>
                      <button
                        type="button"
                        className="btn border-0 vvm-close-btn d-flex justify-content-center align-items-center text-white flex-shrink-0"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                        onClick={handleClose}
                      >
                        <i className="bi bi-x-lg"></i>
                      </button>
                    </div>

                    {/* Status Toggles (Custom Dropdown) */}
                    <div className="row mb-4">
                      <div className="col-md-6 mb-3 mb-md-0 position-relative">
                        <div className="vvm-label">Lifecycle Status</div>
                        <div className="mt-2 position-relative vvm-dropdown-container">
                          <button
                            type="button"
                            className={`btn btn-sm rounded-pill px-4 vvm-custom-dropdown-btn ${vehicle.status === 'ACTIVE' ? 'vvm-select-success' : 'vvm-select-danger'} ${isUpdatingStatus ? 'opacity-75' : ''}`}
                            onClick={(e) => { e.stopPropagation(); setOpenDropdown(openDropdown === 'status' ? null : 'status'); }}
                            disabled={isUpdatingStatus}
                          >
                            {vehicle.status || 'N/A'} <i className="bi bi-chevron-down ms-2" style={{fontSize: '0.75rem'}}></i>
                          </button>
                          {openDropdown === 'status' && (
                            <div className="vvm-custom-dropdown-menu">
                              <div className="vvm-custom-dropdown-item text-success" onClick={() => handleStatusChange('ACTIVE')}>ACTIVE</div>
                              <div className="vvm-custom-dropdown-item text-danger" onClick={() => handleStatusChange('BLOCKED')}>BLOCKED</div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-md-6 position-relative">
                        <div className="vvm-label">Availability Status</div>
                        <div className="mt-2 position-relative vvm-dropdown-container">
                          <button
                            type="button"
                            className={`btn btn-sm rounded-pill px-3 vvm-custom-dropdown-btn ${vehicle.availability_status === 'available' ? 'vvm-select-success' : vehicle.availability_status === 'maintenance' ? 'vvm-select-danger' : 'vvm-select-warning'} ${isUpdatingAvailability ? 'opacity-75' : ''}`}
                            onClick={(e) => { e.stopPropagation(); setOpenDropdown(openDropdown === 'availability' ? null : 'availability'); }}
                            disabled={isUpdatingAvailability}
                          >
                            {(vehicle.availability_status || 'N/A').toUpperCase()} <i className="bi bi-chevron-down ms-2" style={{fontSize: '0.75rem'}}></i>
                          </button>
                          {openDropdown === 'availability' && (
                            <div className="vvm-custom-dropdown-menu">
                              <div className="vvm-custom-dropdown-item text-success" onClick={() => handleAvailabilityChange('available')}>AVAILABLE</div>
                              <div className="vvm-custom-dropdown-item text-warning" onClick={() => handleAvailabilityChange('booked')}>BOOKED</div>
                              <div className="vvm-custom-dropdown-item text-danger" onClick={() => handleAvailabilityChange('maintenance')}>MAINTENANCE</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="row mb-4">
                      <div className="col-12">
                        <div className="vvm-section-title">
                          <i className="bi bi-info-circle me-2"></i>Basic Information
                        </div>
                        <div className="vvm-card">
                          <div className="row">
                            <div className="col-md-6">{renderField('Registration No.', vehicle.registration_number)}</div>
                            <div className="col-md-6">{renderField('Year', vehicle.manufacturing_year)}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="row mb-4">
                      <div className="col-12">
                        <div className="vvm-section-title">
                          <i className="bi bi-tags me-2"></i>Classification
                        </div>
                        <div className="vvm-card">
                          <div className="row">
                            <div className="col-md-4">{renderField('Vehicle Type', vehicle.vehicle_type)}</div>
                            <div className="col-md-4">{renderField('Subtype', vehicle.vehicle_subtype)}</div>
                            <div className="col-md-4">{renderField('Capacity', vehicle.seating_capacity ? `${vehicle.seating_capacity} Seats` : 'N/A')}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="row mb-4">
                      <div className="col-12">
                        <div className="vvm-section-title">
                          <i className="bi bi-tools me-2"></i>Service & Insurance
                        </div>
                        <div className="vvm-card">
                          <div className="row">
                            <div className="col-md-6">{renderField('Insurance Expiry', formatDate(vehicle.insurance_expiry))}</div>
                            <div className="col-md-6">{renderField('Next Service', formatDate(vehicle.next_service_date))}</div>
                            <div className="col-md-6 mt-3">{renderField('Last Service', formatDate(vehicle.last_service_date))}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {vehicle.rc_photo && (
                      <div className="row mb-2">
                        <div className="col-12">
                          <div className="vvm-section-title">
                            <i className="bi bi-images me-2"></i>RC Document
                          </div>
                          <div className="vvm-card p-3">
                            <div className="vvm-img-container">
                              <img 
                                src={vehicle.rc_photo_url || vehicle.rc_photo} 
                                alt="RC Document" 
                                className="img-fluid rounded"
                                onError={(e) => { 
                                  e.target.onerror = null; 
                                  e.target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22400%22%20height%3D%22250%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22400%22%20height%3D%22250%22%20fill%3D%22%231e293b%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22%2394a3b8%22%20font-family%3D%22sans-serif%22%20font-size%3D%2216%22%3EImage%20Not%20Found%3C%2Ftext%3E%3C%2Fsvg%3E';
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-5 text-muted" style={{ minHeight: '500px' }}>Vehicle not found.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .vvm-modal-content {
          background: #071229;
          border: 1px solid rgba(0, 212, 255, 0.2);
          border-radius: 16px;
          color: #f8fafc;
        }
        .vvm-modal-header {
          background: linear-gradient(135deg, rgba(0,212,255,0.12), rgba(0,102,255,0.08));
          border-bottom: 1px solid rgba(255,255,255,0.08);
          padding: 20px 24px;
          border-radius: 16px 16px 0 0;
        }
        .vvm-modal-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: #f8fafc;
          margin: 0;
        }
        .vvm-modal-subtitle {
          font-size: 0.85rem;
          color: #00d4ff;
          margin-top: 4px;
        }
        .vvm-modal-body {
          background: transparent; 
          padding: 24px;
        }
        .vvm-section-title {
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #94a3b8;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
        }
        .vvm-card {
          background: rgba(5, 10, 51, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 20px;
        }
        .vvm-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 4px;
        }
        .vvm-value {
          font-size: 1rem;
          font-weight: 500;
          color: #f8fafc;
        }
        .vvm-photo-card {
          background: rgba(5, 10, 51, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 12px;
          height: 100%;
        }
        .vvm-photo-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: #cbd5e1;
          margin-bottom: 12px;
          text-align: center;
        }
        .vvm-img-container {
          width: 100%;
          border-radius: 8px;
          overflow: hidden;
          background: rgba(0,0,0,0.2);
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 150px;
        }
        .vvm-img-container img {
          max-height: 250px;
          object-fit: contain;
        }
        .vvm-modal-footer {
          background: rgba(255,255,255,0.02);
          border-top: 1px solid rgba(255,255,255,0.08);
          padding: 16px 24px;
        }
        .vvm-btn-cancel {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          color: #94a3b8;
          border-radius: 8px;
          padding: 8px 24px;
          font-weight: 500;
          transition: background 0.2s;
        }
        .vvm-btn-cancel:hover { background: rgba(255,255,255,0.1); color: #f8fafc; }
        .vvm-btn-edit {
          background: linear-gradient(90deg, #00D4FF, #0066FF);
          border: none;
          color: #fff;
          border-radius: 8px;
          padding: 8px 24px;
          font-weight: 700;
          transition: opacity 0.2s, transform 0.1s;
        }
        .vvm-btn-edit:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
        .vvm-btn-edit:disabled { opacity: 0.6; cursor: not-allowed; }

        /* Light mode support */
        body.light-mode .vvm-modal-content {
          background: #ffffff;
          border-color: rgba(0,102,255,0.15);
          color: #050a33;
        }
        body.light-mode .vvm-modal-header {
          background: linear-gradient(135deg, rgba(0,212,255,0.08), rgba(0,102,255,0.05));
        }
        body.light-mode .vvm-modal-title { color: #050a33; }
        body.light-mode .vvm-modal-subtitle { color: #0066ff; }
        body.light-mode .vvm-card {
          background: #f8fafc;
          border-color: rgba(0,0,0,0.05);
        }
        body.light-mode .vvm-label { color: #64748b; }
        body.light-mode .vvm-value { color: #050a33; }
        body.light-mode .vvm-section-title { color: #475569; }
        body.light-mode .vvm-photo-card {
          background: #f1f5f9;
          border-color: rgba(0,0,0,0.1);
        }
        body.light-mode .vvm-photo-label { color: #071229; }
        body.light-mode .vvm-modal-footer { background: rgba(0,0,0,0.02); }
        body.light-mode .vvm-btn-cancel { background: rgba(0,0,0,0.04); border-color: rgba(0,0,0,0.1); color: #64748b; }
        body.light-mode .vvm-btn-cancel:hover { background: rgba(0,0,0,0.08); color: #050a33; }
        
        .vvm-split-layout {
          min-height: 600px;
        }
        .vvm-left-col {
          background-color: #050a1f;
          overflow: hidden;
          display: flex;
          align-items: stretch;
        }
        .vvm-right-col {
          background-color: #071229;
          max-height: 85vh;
          overflow-y: auto;
        }
        .vvm-fixed-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          position: absolute;
          top: 0;
          left: 0;
          opacity: 0.8;
        }
        .vvm-hero-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 60px 32px 32px;
          background: linear-gradient(to top, rgba(5, 10, 31, 1) 0%, rgba(5, 10, 31, 0.7) 50%, transparent 100%);
          z-index: 10;
        }
        .vvm-hero-title {
          font-size: 2.2rem;
          font-weight: 800;
          color: #fff;
          margin: 0;
          line-height: 1.1;
        }
        .vvm-hero-subtitle {
          font-size: 1.1rem;
          font-family: monospace;
          color: #00d4ff;
          margin-top: 8px;
          font-weight: 700;
          letter-spacing: 1px;
        }
        body.light-mode .vvm-left-col { background-color: #e2e8f0; }
        body.light-mode .vvm-right-col { background-color: #ffffff; }
        body.light-mode .vvm-hero-overlay {
          background: linear-gradient(to top, rgba(226, 232, 240, 1) 0%, rgba(226, 232, 240, 0.7) 50%, transparent 100%);
        }
        body.light-mode .vvm-hero-title { color: #050a33; }
        body.light-mode .vvm-select option {
          background-color: #fff;
          color: #050a33;
        }

        .vvm-custom-dropdown-btn {
          font-weight: 600;
          font-size: 0.85rem;
          letter-spacing: 0.5px;
          border: 1px solid transparent;
          display: inline-flex;
          align-items: center;
        }
        .vvm-custom-dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          margin-top: 8px;
          background: #0b132b;
          border: 1px solid rgba(0, 212, 255, 0.2);
          border-radius: 8px;
          padding: 8px 0;
          min-width: 150px;
          z-index: 1060;
          box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        }
        .vvm-custom-dropdown-item {
          padding: 8px 16px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.85rem;
          transition: background 0.2s;
        }
        .vvm-custom-dropdown-item:hover {
          background: rgba(255,255,255,0.05);
        }
        .vvm-select-success {
          color: #22c55e !important;
          border-color: rgba(34, 197, 94, 0.5) !important;
          background-color: rgba(34, 197, 94, 0.1) !important;
        }
        .vvm-select-danger {
          color: #ef4444 !important;
          border-color: rgba(239, 68, 68, 0.5) !important;
          background-color: rgba(239, 68, 68, 0.1) !important;
        }
        .vvm-select-warning {
          color: #f59e0b !important;
          border-color: rgba(245, 158, 11, 0.5) !important;
          background-color: rgba(245, 158, 11, 0.1) !important;
        }

        .vvm-modal-dialog {
          max-width: 1200px;
        }

        .vvm-close-btn {
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          width: 44px;
          height: 44px;
          backdrop-filter: blur(4px);
          transition: all 0.2s;
        }
        .vvm-close-btn:hover {
          background-color: rgba(239, 68, 68, 0.8);
        }
      `}</style>
    </>
  );
};

export default ViewVehicleModal;
