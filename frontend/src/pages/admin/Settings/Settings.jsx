import React, { useState } from "react";
import './Settings.css';

const Settings = () => {
    const [platformFee, setPlatformFee] = useState('5.00');
    const [serviceFee, setServiceFee] = useState('2.50');
    const [editingField, setEditingField] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = (field) => {
        setIsSaving(true);
        // Simulate save — replace with API call when backend is ready
        setTimeout(() => {
            setIsSaving(false);
            setEditingField(null);
        }, 600);
    };

    const handleCancel = () => {
        setEditingField(null);
    };

    return (
        <>
            <div className="dashboard-header mb-4">
                <div>
                    <h1 className="dashboard-title">Settings</h1>
                    <p className="dashboard-subtitle">Configure platform-wide fees and service charges.</p>
                </div>
            </div>

            {/* Fee Configuration Cards */}
            <div className="settings-grid">
                {/* Platform Fee Card */}
                <div className="settings-card">
                    <div className="settings-card-accent platform-accent"></div>
                    <div className="settings-card-body">
                        <div className="settings-card-header">
                            <div className="settings-icon-wrap platform-icon-bg">
                                <i className="bi bi-layers"></i>
                            </div>
                            <div className="settings-card-meta">
                                <h3 className="settings-card-title">Platform Fee</h3>
                                <p className="settings-card-desc">
                                    Fee charged for using the platform per trip
                                </p>
                            </div>
                        </div>

                        <div className="settings-card-content">
                            {editingField === 'platformFee' ? (
                                <div className="settings-edit-group">
                                    <div className="settings-input-wrap">
                                        <span className="settings-input-prefix">%</span>
                                        <input
                                            type="number"
                                            className="settings-input"
                                            value={platformFee}
                                            onChange={(e) => setPlatformFee(e.target.value)}
                                            min="0"
                                            max="100"
                                            step="0.01"
                                            autoFocus
                                        />
                                    </div>
                                    <div className="settings-edit-actions">
                                        <button
                                            className="settings-btn settings-btn-save"
                                            onClick={() => handleSave('platformFee')}
                                            disabled={isSaving}
                                        >
                                            {isSaving ? (
                                                <><span className="spinner-border spinner-border-sm"></span></>
                                            ) : (
                                                <><i className="bi bi-check-lg"></i> Save</>
                                            )}
                                        </button>
                                        <button
                                            className="settings-btn settings-btn-cancel"
                                            onClick={handleCancel}
                                            disabled={isSaving}
                                        >
                                            <i className="bi bi-x-lg"></i> Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="settings-value-display" onClick={() => setEditingField('platformFee')}>
                                    <span className="settings-value">{platformFee}%</span>
                                    <button className="settings-edit-btn" title="Edit Platform Fee">
                                        <i className="bi bi-pencil-square"></i>
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="settings-card-footer">
                            <i className="bi bi-info-circle"></i>
                            <span>Applied to each trip transaction automatically</span>
                        </div>
                    </div>
                </div>

                {/* Service Fee Card */}
                <div className="settings-card">
                    <div className="settings-card-accent service-accent"></div>
                    <div className="settings-card-body">
                        <div className="settings-card-header">
                            <div className="settings-icon-wrap service-icon-bg">
                                <i className="bi bi-gear-wide-connected"></i>
                            </div>
                            <div className="settings-card-meta">
                                <h3 className="settings-card-title">Service Fee</h3>
                                <p className="settings-card-desc">
                                    Additional charge for service facilitation
                                </p>
                            </div>
                        </div>

                        <div className="settings-card-content">
                            {editingField === 'serviceFee' ? (
                                <div className="settings-edit-group">
                                    <div className="settings-input-wrap">
                                        <span className="settings-input-prefix">%</span>
                                        <input
                                            type="number"
                                            className="settings-input"
                                            value={serviceFee}
                                            onChange={(e) => setServiceFee(e.target.value)}
                                            min="0"
                                            max="100"
                                            step="0.01"
                                            autoFocus
                                        />
                                    </div>
                                    <div className="settings-edit-actions">
                                        <button
                                            className="settings-btn settings-btn-save"
                                            onClick={() => handleSave('serviceFee')}
                                            disabled={isSaving}
                                        >
                                            {isSaving ? (
                                                <><span className="spinner-border spinner-border-sm"></span></>
                                            ) : (
                                                <><i className="bi bi-check-lg"></i> Save</>
                                            )}
                                        </button>
                                        <button
                                            className="settings-btn settings-btn-cancel"
                                            onClick={handleCancel}
                                            disabled={isSaving}
                                        >
                                            <i className="bi bi-x-lg"></i> Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="settings-value-display" onClick={() => setEditingField('serviceFee')}>
                                    <span className="settings-value">{serviceFee}%</span>
                                    <button className="settings-edit-btn" title="Edit Service Fee">
                                        <i className="bi bi-pencil-square"></i>
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="settings-card-footer">
                            <i className="bi bi-info-circle"></i>
                            <span>Charged on top of the base trip cost</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Fee Summary Table */}
            <div className="glass-panel">
                <h2 className="panel-title">
                    <span>Fee Overview</span>
                    <span className="panel-title-badge">Current</span>
                </h2>
                <div className="settings-table-wrap">
                    <table className="settings-table">
                        <thead>
                            <tr>
                                <th>Fee Type</th>
                                <th>Rate</th>
                                <th>Applied To</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <div className="settings-table-cell-main">
                                        <div className="settings-table-dot platform-dot"></div>
                                        Platform Fee
                                    </div>
                                </td>
                                <td><span className="settings-table-rate">{platformFee}%</span></td>
                                <td><span className="settings-table-tag">Per Trip</span></td>
                                <td><span className="settings-status-badge active">Active</span></td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="settings-table-cell-main">
                                        <div className="settings-table-dot service-dot"></div>
                                        Service Fee
                                    </div>
                                </td>
                                <td><span className="settings-table-rate">{serviceFee}%</span></td>
                                <td><span className="settings-table-tag">Per Trip</span></td>
                                <td><span className="settings-status-badge active">Active</span></td>
                            </tr>
                            <tr className="settings-table-total-row">
                                <td><strong>Total Fees</strong></td>
                                <td>
                                    <span className="settings-table-rate total">
                                        {(parseFloat(platformFee || 0) + parseFloat(serviceFee || 0)).toFixed(2)}%
                                    </span>
                                </td>
                                <td><span className="settings-table-tag">Combined</span></td>
                                <td><span className="settings-status-badge active">Active</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default Settings;