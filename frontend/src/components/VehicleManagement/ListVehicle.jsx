import logger from '../../utils/logger';
import React, { useRef } from 'react';
import ReactDOM from 'react-dom';
import NavBar from '../Shared/NavBar';
import { Link } from 'react-router-dom';
import { 
  useAllTrucks, 
  useDeleteTruck,
  useUpdateTruckAvailability 
} from '../../hooks/queries/useTruckQueries';
import { useAuthStore } from '../../store/useAuthStore';
import AppDataTable from '../Shared/AppDataTable';
import ConfirmDeleteModal from '../Shared/ConfirmDeleteModal';
import NotFound from '../NotFound';
import { instance } from '../../api/instance';
import TablePanelHeader from '../Shared/TablePanelHeader';
import AddVehicleModal from './AddVehicleModal';
import ViewVehicleModal from './ViewVehicleModal';
import './ListVehicle.css';

const StatusDropdown = ({ row, updateAvailability, handleAvailabilityChange }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [coords, setCoords] = React.useState({ top: 0, left: 0 });
  const dropdownRef = useRef(null);
  const menuRef = useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(event.target) &&
        (!menuRef.current || !menuRef.current.contains(event.target))
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentStatus = row.availability_status || 'available';
  const statusColors = {
    available: 'success',
    booked: 'primary',
    maintenance: 'warning'
  };
  const statusColor = statusColors[currentStatus];

  const handleSelect = (status) => {
    setIsOpen(false);
    handleAvailabilityChange(row.id, status);
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    if (!isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX
      });
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="dropdown" ref={dropdownRef}>
      <button
        className={`btn btn-sm border-0 fw-bold text-${statusColor} rounded-pill px-3 py-1 glass-btn-${statusColor}`}
        type="button"
        onClick={toggleDropdown}
        disabled={updateAvailability.isPending}
        style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}
      >
        {currentStatus.toUpperCase()} <i className="bi bi-chevron-down ms-1" style={{ fontSize: '10px' }}></i>
      </button>
      {isOpen && ReactDOM.createPortal(
        <ul ref={menuRef} className="dropdown-menu glass-dropdown-menu shadow-lg show" style={{ position: 'absolute', top: coords.top, left: coords.left, zIndex: 9999, display: 'block' }}>
          <li>
            <button 
              className={`dropdown-item glass-dropdown-item d-flex align-items-center fw-bold text-success ${currentStatus === 'available' ? 'active-item' : ''}`}
              onClick={(e) => { e.stopPropagation(); handleSelect('available'); }}
            >
              <i className="bi bi-check-circle me-2"></i>AVAILABLE
            </button>
          </li>
          <li>
            <button 
              className={`dropdown-item glass-dropdown-item d-flex align-items-center fw-bold text-primary ${currentStatus === 'booked' ? 'active-item' : ''}`}
              onClick={(e) => { e.stopPropagation(); handleSelect('booked'); }}
            >
              <i className="bi bi-bookmark-fill me-2"></i>BOOKED
            </button>
          </li>
          <li>
            <button 
              className={`dropdown-item glass-dropdown-item d-flex align-items-center fw-bold text-warning ${currentStatus === 'maintenance' ? 'active-item' : ''}`}
              onClick={(e) => { e.stopPropagation(); handleSelect('maintenance'); }}
            >
              <i className="bi bi-tools me-2"></i>MAINTENANCE
            </button>
          </li>
        </ul>,
        document.body
      )}
    </div>
  );
};

const ListTruck = () => {
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [sortBy, setSortBy] = React.useState('createdAt');
  const [sortOrder, setSortOrder] = React.useState('DESC');
  
  const [search, setSearch] = React.useState('');
  const [vehicleType, setVehicleType] = React.useState('');
  const [availabilityStatus, setAvailabilityStatus] = React.useState('');
  const [status, setStatus] = React.useState('');

  const filterParams = {};
  if (search) filterParams.search = search;
  if (vehicleType) filterParams.vehicle_type = vehicleType;
  if (availabilityStatus) filterParams.availability_status = availabilityStatus;
  if (status) filterParams.status = status;

  const { data: truckResponse } = useAllTrucks({ page, limit, sortBy, sortOrder, ...filterParams });
  const truckData = truckResponse?.data || [];
  const metaData = truckResponse?.meta || { total: 0 };

  const { mutate: deleteTruck, isPending: isDeleting } = useDeleteTruck();
  const updateAvailability = useUpdateTruckAvailability();
  const [vehicleToDelete, setVehicleToDelete] = React.useState(null);
  const [activeVehicleId, setActiveVehicleId] = React.useState(null);
  const [activeViewVehicleId, setActiveViewVehicleId] = React.useState(null);
  const [isExporting, setIsExporting] = React.useState(false);
  const modalRef = useRef(null);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const response = await instance.get('/vehicles?isExport=true', {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'vehicles_export.csv');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      logger.error('Failed to export vehicles CSV', error);
      alert('Failed to export CSV. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const openAddModal = () => {
    setActiveVehicleId(null); // Ensure we are in "Add" mode
    const el = document.getElementById('addVehicleModal');
    if (el && window.bootstrap) {
      const modal = window.bootstrap.Modal.getOrCreateInstance(el);
      modal.show();
    }
  };

  const openEditModal = (id) => {
    setActiveVehicleId(id); // Set ID to switch to "Edit" mode
    const el = document.getElementById('addVehicleModal'); // use same modal ID
    if (el && window.bootstrap) {
      const modal = window.bootstrap.Modal.getOrCreateInstance(el);
      modal.show();
    }
  };

  const openViewModal = (id) => {
    setActiveViewVehicleId(id);
    const el = document.getElementById('viewVehicleModal');
    if (el && window.bootstrap) {
      const modal = window.bootstrap.Modal.getOrCreateInstance(el);
      modal.show();
    }
  };

  const openDeleteModal = (vehicle) => {
    setVehicleToDelete(vehicle);
    const el = document.getElementById('confirmDeleteModal');
    if (el && window.bootstrap) {
      const modal = window.bootstrap.Modal.getOrCreateInstance(el);
      modal.show();
    }
  };

  const handleConfirmDelete = () => {
    if (vehicleToDelete) {
      deleteTruck(vehicleToDelete.id, {
        onSuccess: () => {
          const el = document.getElementById('confirmDeleteModal');
          if (el && window.bootstrap) {
            const modal = window.bootstrap.Modal.getInstance(el);
            modal?.hide();
          }
          setVehicleToDelete(null);
        }
      });
    }
  };

  const handleAvailabilityChange = (id, newStatus) => {
    updateAvailability.mutate({ id, availability_status: newStatus });
  };

  const userRole = JSON.parse(localStorage.getItem('currentUser')).designation;
  const { grantedPermissions } = useAuthStore();
  // logger.info('grantedPermissions', grantedPermissions);
  let array = grantedPermissions?.filter((item) => item.menu === 'Truck');
  let permissionAllowed = array?.map((e) => e.subMenu);
  const columns = [
    {
      name: 'Manufacturer',
      selector: (row) => row.manufacturer,
      sortable: true,
      sortField: 'manufacturer',
    },
    {
      name: 'Model',
      selector: (row) => row.model_name,
      sortable: true,
      sortField: 'model_name',
    },
    {
      name: 'Reg. Number',
      selector: (row) => row.registration_number,
      sortable: true,
      sortField: 'registration_number',
    },
    {
      name: 'Year',
      selector: (row) => row.manufacturing_year,
    },
    {
      name: 'Type',
      selector: (row) => row.vehicle_subtype || row.vehicle_type,
    },
    {
      name: 'Status',
      selector: (row) => (
        <span className={`badge bg-${row.status === 'ACTIVE' ? 'success' : row.status === 'BLOCKED' ? 'danger' : 'warning'}`}>
          {row.status}
        </span>
      ),
    },
    {
      name: 'Availability',
      selector: (row) => (
        <StatusDropdown 
          row={row} 
          updateAvailability={updateAvailability} 
          handleAvailabilityChange={handleAvailabilityChange} 
        />
      ),
    },
    {
      name: 'ACTION',
      selector: (row) => (
        <div className="d-flex gap-2">
          {userRole === 'Admin' || userRole === 'SUPERADMIN' || permissionAllowed?.includes('Edit') ? (
            <button
              className="btn btn-sm btn-outline-info border-0"
              onClick={() => openViewModal(row.id)}
              title="View Details"
            >
              <i className="bi bi-eye fs-5"></i>
            </button>
          ) : null}
          {userRole === 'Admin' || userRole === 'SUPERADMIN' || permissionAllowed?.includes('Delete') ? (
            <button
              className="btn btn-sm btn-outline-danger border-0"
              onClick={() => openDeleteModal(row)}
              title="Delete"
            >
              <i className="bi bi-trash fs-5"></i>
            </button>
          ) : null}
        </div>
      ),
    },
  ];

  const customNoData = (
    <NotFound 
      isComponent={true} 
      title="No Vehicles Found" 
      description="There are currently no vehicles available to display." 
      icon="bi-inbox" 
    />
  );

  return (
    <div className="dashboard-layout">
      <NavBar />
      <div className="dashboard-main">
        <div className="dashboard-header mb-4">
          <div>
            <h1 className="dashboard-title">Vehicles</h1>
            <p className="dashboard-subtitle">Manage all registered vehicles in the system.</p>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
          <TablePanelHeader 
            searchPlaceholder="Search vehicles..."
            searchTerm={search}
            onSearchChange={(e) => setSearch(e.target.value)}
            onExport={handleExport}
            exportText={isExporting ? 'Exporting...' : 'Export CSV'}
            showAddButton={userRole === 'Admin' || userRole === 'SUPERADMIN' || permissionAllowed?.includes('Add')}
            addButtonText="Add"
            onAddClick={openAddModal}
            filters={
              <>
                <select className="glass-select" value={vehicleType} onChange={(e) => setVehicleType(e.target.value)} style={{ padding: '8px 28px 8px 12px', minWidth: '130px' }}>
                  <option value="">Type: All</option>
                  <option value="two-wheeler">Two Wheeler</option>
                  <option value="four-wheeler">Four Wheeler</option>
                  <option value="heavy-vehicle">Heavy Vehicle</option>
                </select>
                <select className="glass-select" value={availabilityStatus} onChange={(e) => setAvailabilityStatus(e.target.value)} style={{ padding: '8px 28px 8px 12px', minWidth: '130px' }}>
                  <option value="">Availability: All</option>
                  <option value="available">Available</option>
                  <option value="booked">Booked</option>
                  <option value="maintenance">Maintenance</option>
                </select>
                <select className="glass-select" value={status} onChange={(e) => setStatus(e.target.value)} style={{ padding: '8px 28px 8px 12px', minWidth: '130px' }}>
                  <option value="">Status: All</option>
                  <option value="ACTIVE">Active</option>
                  <option value="BLOCKED">Blocked</option>
                </select>
                {(search || vehicleType || availabilityStatus || status) && (
                  <button 
                    className="btn btn-sm btn-outline-danger" 
                    onClick={() => {
                      setSearch('');
                      setVehicleType('');
                      setAvailabilityStatus('');
                      setStatus('');
                    }}
                    style={{ borderRadius: '8px', padding: '6px 12px' }}
                    title="Clear Filters"
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                )}
              </>
            }
          />
          <AppDataTable
            columns={columns}
            data={truckData}
            paginationServer
            paginationTotalRows={metaData.total}
            onChangePage={(newPage) => setPage(newPage)}
            onChangeRowsPerPage={(newPerPage, newPage) => {
              setLimit(newPerPage);
              setPage(newPage);
            }}
            sortServer
            onSort={(column, sortDirection) => {
              if (column.sortField) {
                setSortBy(column.sortField);
                setSortOrder(sortDirection.toUpperCase());
              }
            }}
            noDataComponent={customNoData}
          />
        </div>
      </div>
      {ReactDOM.createPortal(
        <ViewVehicleModal 
          vehicleId={activeViewVehicleId} 
          onClose={() => setActiveViewVehicleId(null)}
          onEdit={() => openEditModal(activeViewVehicleId)}
        />, 
        document.body
      )}
      {ReactDOM.createPortal(
        <AddVehicleModal 
          vehicleId={activeVehicleId} 
          onClose={() => setActiveVehicleId(null)} 
        />, 
        document.body
      )}
      {ReactDOM.createPortal(
        <ConfirmDeleteModal
          isPending={isDeleting}
          onConfirm={handleConfirmDelete}
          title="Delete Vehicle"
          message={vehicleToDelete ? `Are you sure you want to delete the vehicle ${vehicleToDelete.registration_number}? This action cannot be undone.` : ''}
        />, 
        document.body
      )}
    </div>
  );
};

export default ListTruck;
