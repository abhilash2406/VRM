import React from 'react';
import { useTruckDetails } from '../../hooks/queries/useTruckQueries';

const MODAL_ID = 'viewVehicleModal';

const ViewVehicleModal = ({ vehicleId, onClose, onEdit }) => {
  const { data: vehicle, isLoading } = useTruckDetails(vehicleId);

  const handleEditClick = () => {
    if (onEdit) onEdit();
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
      >
        <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content vvm-modal-content">
            <div className="modal-header vvm-modal-header">
              <div>
                <h5 className="modal-title vvm-modal-title" id={`${MODAL_ID}Label`}>
                  <i className="bi bi-eye me-2"></i>Vehicle Details
                </h5>
                <p className="vvm-modal-subtitle mb-0">
                  {vehicle?.registration_number ? `Viewing ${vehicle.registration_number}` : 'Loading...'}
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

            <div className="modal-body vvm-modal-body position-relative">
              {isLoading ? (
                <div className="d-flex justify-content-center align-items-center py-5">
                  <div className="spinner-border text-info" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : vehicle ? (
                <div className="container-fluid px-0">
                  <div className="row mb-4">
                    <div className="col-12">
                      <div className="vvm-section-title">
                        <i className="bi bi-info-circle me-2"></i>Basic Information
                      </div>
                      <div className="vvm-card">
                        <div className="row">
                          <div className="col-md-3">{renderField('Registration No.', vehicle.registration_number)}</div>
                          <div className="col-md-3">{renderField('Manufacturer', vehicle.manufacturer)}</div>
                          <div className="col-md-3">{renderField('Model Name', vehicle.model_name)}</div>
                          <div className="col-md-3">{renderField('Year', vehicle.manufacturing_year)}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row mb-4">
                    <div className="col-12">
                      <div className="vvm-section-title">
                        <i className="bi bi-tags me-2"></i>Classification & Status
                      </div>
                      <div className="vvm-card">
                        <div className="row">
                          <div className="col-md-3">{renderField('Vehicle Type', vehicle.vehicle_type)}</div>
                          <div className="col-md-3">{renderField('Subtype', vehicle.vehicle_subtype)}</div>
                          <div className="col-md-3">{renderField('Capacity', vehicle.seating_capacity ? `${vehicle.seating_capacity} Seats` : 'N/A')}</div>
                          <div className="col-md-3">{renderField('Availability', vehicle.status, true)}</div>
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
                          <div className="col-md-4">{renderField('Insurance Expiry', formatDate(vehicle.insurance_expiry))}</div>
                          <div className="col-md-4">{renderField('Last Service', formatDate(vehicle.last_service_date))}</div>
                          <div className="col-md-4">{renderField('Next Service', formatDate(vehicle.next_service_date))}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {(vehicle.vehicle_photo || vehicle.rc_photo) && (
                    <div className="row mb-2">
                      <div className="col-12">
                        <div className="vvm-section-title">
                          <i className="bi bi-images me-2"></i>Documentation Photos
                        </div>
                        <div className="row g-3">
                          {vehicle.vehicle_photo && (
                            <div className="col-md-6">
                              <div className="vvm-photo-card">
                                <div className="vvm-photo-label">Vehicle Photo</div>
                                <div className="vvm-img-container">
                                  <img 
                                    src={encodeURI(vehicle.vehicle_photo_url || vehicle.vehicle_photo)} 
                                    alt="Vehicle" 
                                    className="img-fluid rounded"
                                    onError={(e) => { 
                                      e.target.onerror = null; 
                                      e.target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22400%22%20height%3D%22250%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22400%22%20height%3D%22250%22%20fill%3D%22%231e293b%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22%2394a3b8%22%20font-family%3D%22sans-serif%22%20font-size%3D%2216%22%3EImage%20Not%20Found%3C%2Ftext%3E%3C%2Fsvg%3E';
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                          {vehicle.rc_photo && (
                            <div className="col-md-6">
                              <div className="vvm-photo-card">
                                <div className="vvm-photo-label">RC Document</div>
                                <div className="vvm-img-container">
                                  <img 
                                    src={encodeURI(vehicle.rc_photo_url || vehicle.rc_photo)} 
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
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-5 text-muted">Vehicle not found.</div>
              )}
            </div>

            <div className="modal-footer vvm-modal-footer d-flex justify-content-between">
              <button
                type="button"
                className="btn vvm-btn-cancel"
                data-bs-dismiss="modal"
                onClick={handleClose}
              >
                Close
              </button>
              <button
                type="button"
                className="btn vvm-btn-edit"
                onClick={handleEditClick}
                disabled={isLoading || !vehicle}
              >
                <i className="bi bi-pencil-square me-2"></i>Edit Vehicle
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .vvm-modal-content {
          background: #0f1729;
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
          background: rgba(15, 23, 42, 0.4);
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
          background: rgba(15, 23, 42, 0.6);
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
          color: #0f172a;
        }
        body.light-mode .vvm-modal-header {
          background: linear-gradient(135deg, rgba(0,212,255,0.08), rgba(0,102,255,0.05));
        }
        body.light-mode .vvm-modal-title { color: #0f172a; }
        body.light-mode .vvm-modal-subtitle { color: #0066ff; }
        body.light-mode .vvm-card {
          background: #f8fafc;
          border-color: rgba(0,0,0,0.05);
        }
        body.light-mode .vvm-label { color: #64748b; }
        body.light-mode .vvm-value { color: #0f172a; }
        body.light-mode .vvm-section-title { color: #475569; }
        body.light-mode .vvm-photo-card {
          background: #f1f5f9;
          border-color: rgba(0,0,0,0.1);
        }
        body.light-mode .vvm-photo-label { color: #1e293b; }
        body.light-mode .vvm-modal-footer { background: rgba(0,0,0,0.02); }
        body.light-mode .vvm-btn-cancel { background: rgba(0,0,0,0.04); border-color: rgba(0,0,0,0.1); color: #64748b; }
        body.light-mode .vvm-btn-cancel:hover { background: rgba(0,0,0,0.08); color: #0f172a; }
      `}</style>
    </>
  );
};

export default ViewVehicleModal;
