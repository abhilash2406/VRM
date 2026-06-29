import React from 'react';
import { Link } from 'react-router-dom';

const TablePanelHeader = ({
  searchPlaceholder = 'Search...',
  searchTerm = '',
  onSearchChange,
  onExport,
  exportText = 'Export CSV',
  showAddButton = false,
  addButtonText = 'Add',
  addButtonLink,
  onAddClick,
  addModalTarget, // e.g. '#addUserModal'
  filters // optional ReactNode for dropdowns/filters
}) => {
  return (
    <div className="panel-header">
      <div className="d-flex align-items-center gap-2" style={{ flexWrap: 'nowrap', overflowX: 'auto' }}>
        <input 
          type="text" 
          className="form-control panel-search" 
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={onSearchChange}
          style={{ minWidth: '150px', width: '200px' }}
        />
        {filters && <div className="d-flex gap-2">{filters}</div>}
      </div>
      <div className="d-flex gap-2">
        {onExport && (
          <button className="btn btn-outline-info expandable-btn" onClick={onExport} style={{ fontWeight: 'bold' }}>
            <i className="bi-download"></i> <span>{exportText}</span>
          </button>
        )}
        
        {showAddButton && (
          <>
            {addButtonLink ? (
              <Link to={addButtonLink} style={{ textDecoration: 'none' }}>
                <button className="btn btn-info expandable-btn" style={{ background: 'linear-gradient(90deg, #00D4FF, #0066FF)', border: 'none', color: '#fff', fontWeight: 'bold' }}>
                  <i className="bi-plus-lg"></i> <span>{addButtonText}</span>
                </button>
              </Link>
            ) : (
              <button 
                className="btn btn-info expandable-btn" 
                style={{ background: 'linear-gradient(90deg, #00D4FF, #0066FF)', border: 'none', color: '#fff', fontWeight: 'bold' }}
                onClick={onAddClick}
                data-bs-toggle={addModalTarget ? "modal" : undefined}
                data-bs-target={addModalTarget}
              >
                <i className="bi-plus-lg"></i> <span>{addButtonText}</span>
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TablePanelHeader;
