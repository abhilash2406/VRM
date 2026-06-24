import logger from '../../utils/logger';
import React,{useEffect,useState} from 'react'
import NavBar from '../Shared/NavBar';
import { Link } from 'react-router-dom';
import { useDesignations } from '../../hooks/queries/useAuthQueries';
import { useAllPermissions, useRolePermissions, useGivePermission } from '../../hooks/queries/usePermissionQueries';



const Permissions = () => {
  const { data: designations } = useDesignations();
  const { data: permissions } = useAllPermissions();
  const [role, setRole] = useState('');
  const { data: roleData } = useRolePermissions(role);
  const { mutateAsync: givePermission } = useGivePermission();

  const uniqueMenus = new Set(permissions?.map((item) => item.menu));
  const menus = Array.from(uniqueMenus);

  useEffect(() => {
    setGranted(roleData);
  }, [roleData]);
  const handleUserCheckbox = (e) => {
    setRole(e);
  };
  const [grantPer, setGranted] = useState([]);


  const handleCheckboxChange = (e, submenu) => {
    const { value, checked } = e.target;
    if (submenu) {
      if (checked) {
        setGranted([
          ...grantPer,
          { designationId: role, permissionId: value },
        ]);
      } else {
        setGranted(grantPer?.filter((item) => item.permissionId !== value));
      }
    } else {
      const { value, checked } = e.target;
      if (checked) {
        permissions.filter((item) => {
          if (item.id === value) {
            setGranted([
              ...grantPer,
              { designationId: role, permissionId: item.id },
            ]);
          }
        });
      } else {
        permissions.filter((item) => {
          if (item.id === value) {
            setGranted(grantPer?.filter((id) => id.permissionId !== item.id));
          }
        });
      }
    }
  };

  const updatePermission = () => {
    let uniqueArray = grantPer?.filter(
      (item, index, self) =>
        index ===
        self.findIndex(
          (i) =>
            i.permissionId === item.permissionId &&
            i.designationId === item.designationId
        )
    );
    givePermission({ id: role, updateData: uniqueArray });
  };
  const designationItem = designations?.map((item, index) => {
    return (
      <option key={index} value={item.id}>
        {item.designation}
      </option>
    );
  });

  const allPermissions = (menu) => {
    let permi = permissions?.filter((item) => item.menu === menu);
    let permissionIds = permi?.map((item) => item.id);
    // logger.info('grantPer', grantPer);
    let a = grantPer?.filter((item) =>
      permissionIds.includes(item.permissionId)
    );
    return permissionIds.length === a.length ? true : false;
  };
  const singlePermissions = (data) => {
    // logger.info(data);
    let subMenuId = grantPer?.map((item) => item.permissionId);
    // logger.info(subMenuId);
    return subMenuId.includes(data.id) ? true : false;
  };


  return (
      <div className="container-fluid">
    <div className="row">
      <NavBar />
      <div className="col-sm p-3 min-vh-100">
      <div className="dropdown d-flex w-50  justify-content-between">
          <select
            className="btn btn-danger dropdown-toggle border"
            type="button"
            id="dropdownMenuButton"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
            value={role}
            onChange={(e) => handleUserCheckbox(e.target.value)}
          >
            <option aria-labelledby="dropdownMenuButton" value="">
              Choose designation
            </option>
            {designationItem}
          </select>
          <button
            className="btn btn-info btn-sm"
            onClick={() => updatePermission()}
          >
            Update
          </button>
        </div>
        {role ? (
          <div className="accordion mt-3" id="accordionExample">
            {menus.map((item, index) => {
              return (
                <div className="accordion-item" key={index}>
                  <h2 className="accordion-header" id="headingOne">
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#${item}`}
                      aria-expanded="false"
                      aria-controls="collapseOne"
                    >
                      {item}
                    </button>
                  </h2>
                  <div
                    id={item}
                    className="accordion-collapse collapse "
                    aria-labelledby="headingOne"
                    data-bs-parent="#accordionExample"
                  >
                    <div className="row">
                      <div className="col-12 d-flex">
                        <input
                          onChange={(e) => handleCheckboxChange(e)}
                          type="checkbox"
                          value={item}
                          checked={allPermissions(item)}
                        ></input>
                        <div className="ml-2">All Permissions</div>
                      </div>
                    </div>
                    <div className="accordion-body">
                      <div className="row">
                        {permissions.map((data, index) =>
                          data.menu === item ? (
                            <div key={index} className="d-flex col-4 ">
                              <input
                                checked={singlePermissions(data)}
                                onChange={(e) => handleCheckboxChange(e, true)}
                                type="checkbox"
                                value={data.id}
                              ></input>
                              <div className="ml-2">{data.subMenu}</div>
                            </div>
                          ) : null
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}

      </div>
    </div>
  </div>
  )
}

export default Permissions