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
          background: rgba(7, 18, 41, 0.85);
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          border: 1px solid rgba(239, 68, 68, 0.2) !important;
          border-radius: 24px !important;
          overflow: hidden;
          position: relative;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 40px rgba(239, 68, 68, 0.15);
        }
        
        .cdm-modal-header {
          background: transparent;
        }
        
        .cdm-icon-container {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(239, 68, 68, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 10px;
          box-shadow: 0 0 30px rgba(239, 68, 68, 0.3);
          animation: pulse-danger 2s infinite;
        }
        
        @keyframes pulse-danger {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
          70% { box-shadow: 0 0 0 15px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
        
        .cdm-title {
          background: linear-gradient(135deg, #fca5a5, #ef4444);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 800;
          font-size: 1.8rem;
          letter-spacing: 0.5px;
        }
        
        .cdm-message {
          color: #cbd5e1;
          font-size: 1.05rem;
          line-height: 1.6;
          font-weight: 400;
        }
        
        .cdm-modal-footer {
          background: transparent;
        }
        
        .cdm-btn-cancel {
          background: rgba(255, 255, 255, 0.05);
          color: #f8fafc;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 12px 0;
          font-weight: 600;
          font-size: 1rem;
          letter-spacing: 0.5px;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        
        .cdm-btn-cancel:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        }
        
        .cdm-btn-delete {
          background: linear-gradient(135deg, #ef4444, #b91c1c);
          color: #fff;
          border: 1px solid rgba(239, 68, 68, 0.5);
          border-radius: 12px;
          padding: 12px 0;
          font-weight: 600;
          font-size: 1rem;
          letter-spacing: 0.5px;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 8px 15px rgba(239, 68, 68, 0.2);
        }
        
        .cdm-btn-delete:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 15px 25px rgba(239, 68, 68, 0.4);
          background: linear-gradient(135deg, #f87171, #dc2626);
        }
        
        .cdm-btn-delete:disabled {
          background: #f87171;
          opacity: 0.7;
          box-shadow: none;
          transform: none;
        }
        
        /* Light mode support */
        body.light-mode .cdm-modal-content {
          background: rgba(255, 255, 255, 0.9);
          border-color: rgba(239, 68, 68, 0.3) !important;
          box-shadow: 0 25px 50px -12px rgba(239, 68, 68, 0.15);
        }
        body.light-mode .cdm-message {
          color: #475569;
        }
        body.light-mode .cdm-btn-cancel {
          background: #f1f5f9;
          color: #475569;
          border-color: #e2e8f0;
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
