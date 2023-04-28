import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getDriverData } from './action';

const ViewDriver = () => {
  const dispatch = useDispatch();

  const { id } = useParams();
  console.log(id);

  useEffect(() => {
    dispatch(getDriverData(id));
  }, []);

  const { viewDriver } = useSelector((e) => e.driver);
  console.log('viewDriver', viewDriver);
  // debugger;

  return (
    <div class="container rounded bg-white mt-5 mb-5">
      <div class="row">
        <div class="col-md-3 border-right">
          <div class="d-flex flex-column align-items-center text-center p-3 py-5">
            <img
              class="rounded-circle mt-5"
              width="150px"
              src={`http://localhost:5000/${viewDriver.userPhoto}`}
            />
            <span class="font-weight-bold">{viewDriver.user.name}</span>
            <span class="text-black-50">{viewDriver.user.login.email}</span>
            <span> </span>
          </div>
        </div>
        <div class="col-md-5 border-right">
          <div class="p-3 py-5">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h4 class="text-right">driver Details</h4>
            </div>
            <div class="row mt-2">
              <div class="col-md-6">
                <label class="labels">License No</label>
                <input
                  type="text"
                  class="form-control"
                  value={viewDriver.licenseNo}
                />
              </div>
              <div class="col-md-6">
                <label class="labels">License Type</label>
                <input
                  type="text"
                  class="form-control"
                  value={viewDriver.licenseType}
                />
              </div>
            </div>
            <div class="row mt-3">
              <div class="col-md-12">
                <label class="labels">Mobile Number</label>
                <input
                  type="text"
                  class="form-control"
                  value={viewDriver.user.phoneNumber}
                />
              </div>
              <div class="col-md-12">
                <label class="labels">daily wage </label>
                <input
                  type="text"
                  class="form-control"
                  value={viewDriver.dailyWage}
                />
              </div>
              <div class="col-md-12">
                <label class="labels">Bata</label>
                <input
                  type="text"
                  class="form-control"
                  value={viewDriver.bata}
                />
              </div>
            </div>
            <Link className="btn btn-success" to={'/drivers'}>
              back
            </Link>
          </div>
        </div>
        <div class="col-md-4">
          <div class="p-3 py-5">
            <div class="d-flex justify-content-between align-items-center experience">
              <span class="border px-3 p-1 add-experience">
                <i class="fa fa-plus"></i>&nbsp;Experience
              </span>
            </div>
            <br />
            <div class="col-md-12">
              <label class="labels">Experience in Designing</label>
              <input
                type="text"
                class="form-control"
                placeholder="experience"
                value={viewDriver.status}
              />
            </div>{' '}
            <br />
            <div class="col-md-12">
              <label class="labels">Additional Details</label>
              <input
                type="text"
                class="form-control"
                placeholder="additional details"
                value=""
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDriver;
