import React from 'react';

const ConfirmDeleteModal = ({ title, message, onConfirm, isPending, modalId = "confirmDeleteModal" }) => {
  return (
    <>
      <div
        className="modal fade"
        id={modalId}
        tabIndex="-1"
        aria-labelledby={`${modalId}Label`}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content cdm-modal-content shadow-lg border-0">
            <div className="modal-header cdm-modal-header border-0 d-flex justify-content-center pt-4 pb-2">
              <div className="cdm-icon-container">
                <i className="bi bi-exclamation-triangle-fill text-danger fs-1"></i>
              </div>
            </div>
            
            <div className="modal-body cdm-modal-body text-center px-4 pt-1 pb-4">
              <h4 className="cdm-title mb-3">{title || 'Confirm Deletion'}</h4>
              <p className="cdm-message mb-0">
                {message || 'Are you sure you want to delete this item? This action cannot be undone.'}
              </p>
            </div>

            <div className="modal-footer cdm-modal-footer border-0 d-flex justify-content-center gap-3 pb-4">
              <button
                type="button"
                className="btn cdm-btn-cancel flex-grow-1 m-0"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn cdm-btn-delete flex-grow-1 m-0"
                disabled={isPending}
                onClick={onConfirm}
              >
                {isPending ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Deleting…
                  </>
                ) : (
                  'Yes, Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .cdm-modal-content {
          background: #0f1729;
          border-radius: 20px !important;
          overflow: hidden;
          position: relative;
        }
        .cdm-modal-content::before {
          content: "";
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 4px;
          background: linear-gradient(90deg, #f87171, #ef4444);
        }
        .cdm-modal-header {
          background: transparent;
        }
        .cdm-icon-container {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(239, 68, 68, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 10px;
        }
        .cdm-title {
          color: #f8fafc;
          font-weight: 700;
        }
        .cdm-message {
          color: #e2e8f0;
          font-size: 0.95rem;
          line-height: 1.5;
        }
        .cdm-modal-footer {
          background: transparent;
        }
        .cdm-btn-cancel {
          background: rgba(255, 255, 255, 0.05);
          color: #f8fafc;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          padding: 10px 0;
          font-weight: 500;
          transition: all 0.2s;
        }
        .cdm-btn-cancel:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
        }
        .cdm-btn-delete {
          background: #ef4444;
          color: #fff;
          border: none;
          border-radius: 10px;
          padding: 10px 0;
          font-weight: 600;
          transition: all 0.2s;
        }
        .cdm-btn-delete:hover:not(:disabled) {
          background: #dc2626;
          transform: translateY(-1px);
        }
        .cdm-btn-delete:disabled {
          background: #f87171;
          opacity: 0.7;
        }
        
        /* Light mode support */
        body.light-mode .cdm-modal-content {
          background: #ffffff;
        }
        body.light-mode .cdm-title {
          color: #1e293b;
        }
        body.light-mode .cdm-btn-cancel {
          background: #f1f5f9;
          color: #475569;
          border-color: transparent;
        }
        body.light-mode .cdm-btn-cancel:hover {
          background: #e2e8f0;
          color: #0f172a;
        }
      `}</style>
    </>
  );
};

export default ConfirmDeleteModal;
