import logger from '../../../utils/logger';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Map,
  GoogleApiWrapper,
  Polyline,
  Marker,
  DirectionsService,
} from 'google-maps-react';
import { useAddRoute, useRouteDetails } from '../../../hooks/queries/useRouteQueries';

import { Link, useNavigate,useParams } from 'react-router-dom';

const AddRoutes = (props) => {
  const navigate = useNavigate();
  const { id } = useParams();
  logger.info(id);

  const { data: routeDetails } = useRouteDetails(id);
  const { mutate: addRoute } = useAddRoute();
  const [formValues, setFormValues] = useState({
    from: '',
    to: '',
    country: '',
    state: '',
    locations: [{ id: 1, location: '', latitude: 0, longitude: 0 }],
  });
  const mapStyles = {
    width: '50%',
    height: '62%',
    marginLeft: '26%',
  };
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    // If we wanted to set form values from routeDetails, we would do it here
  }, [routeDetails]);

  logger.info('routeData', routeDetails);

  const handleTitleChange = async (e) => {
    const { value } = e.target;

    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${value}&key=AIzaSyBUPUokCkp3c29HyW3ltTOHaWy1eq58Qqc`
      );

      const addressComponents = response.data.results[0].address_components;
      const countryObj = addressComponents.find((component) =>
        component.types.includes('country')
      );
      const stateObj = addressComponents.find((component) =>
        component.types.includes('administrative_area_level_1')
      );
      const country = countryObj ? countryObj.long_name : '';
      const state = stateObj ? stateObj.long_name : '';
      setFormValues({ ...formValues, from: value, country, state });
    } catch (error) {
      logger.error(error);
    }
  };

  // const [directions, setDirections] = useState({});
  // logger.info(directions)

  // const directionsCallback = (response, status) => {
  //   if (status === 'OK') {
  //     setDirections({
  //       directions: response,
  //     });
  //   } else {
  //     logger.info('Directions request failed due to ' + status);
  //   }
  // };

  const handleToChange = async (e) => {
    const { value } = e.target;
    logger.info('valueto', value);
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${value}&key=AIzaSyD1n-Lml-bCOkTnNZs3uZNqq5IEyo7VQRY`
      );

      setFormValues({ ...formValues, to: value });
    } catch (error) {
      logger.error(error);
    }
  };

  const handleLocationChange = async (index, e) => {
    const { value } = e.target;
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${value}&key=AIzaSyD1n-Lml-bCOkTnNZs3uZNqq5IEyo7VQRY`
      );
      const location = response.data.results[0].geometry.location;
      const formattedAddress = response.data.results[0].formatted_address;

      const updatedLocations = formValues.locations.map((loc) => {
        if (loc.id === index) {
          return {
            ...loc,
            location: formattedAddress,
            latitude: location.lat,
            longitude: location.lng,
          };
        } else {
          return loc;
        }
      });
      setMarkers(
        formValues.locations.map((location) => {
          return {
            lat: location.latitude,
            lng: location.longitude,
            text: location.location,
          };
        })
      );
      setFormValues({
        ...formValues,
        locations: updatedLocations,
      });
    } catch (error) {
      logger.error(error);
    }
  };

  const handleAddLocation = () => {
    const newId = formValues.locations.length + 1;
    setFormValues({
      ...formValues,
      locations: [
        ...formValues.locations,
        { id: newId, location: '', latitude: 0, longitude: 0 },
      ],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    logger.info(formValues);
    addRoute(formValues, { onSuccess: () => navigate('/routes') });
    // setFormValues({
    //   from: '',
    //   to: '',
    //   country: '',
    //   state: '',
    //   locations: [{ id: 1, location: '', latitude: 0, longitude: 0 }],
    // })
  };

  const handleRemoveLocation = (id) => {
    logger.info('Before remove', formValues.locations);
    const updatedLocations = formValues.locations.filter(
      (loc) => loc.id !== id
    );
    logger.info('After remove', updatedLocations);
    setFormValues({ ...formValues, locations: updatedLocations });
  };
  let waypoints = [];
  formValues.locations.map(
    (data) =>
      (waypoints = [...waypoints, { lat: data.latitude, lng: data.longitude }])
  );

  logger.info('waypoints', waypoints);
  // // const { route } = useSelector((e) => e.lib);
  // useEffect(() => {
  //   return () => {
  //     dispatch({ type: 'RESET_ROUTE' });
  //   };
  // }, [dispatch]);

  return (
    <div className="mx-4">
      <h1>Add Routes</h1>
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group mb-4 w-75">
          <label>From</label>
          <input
            type="text"
            className="form-control"
            // value={formValues.title}
            onChange={handleTitleChange}
            required
          />
        </div>
        <div className="form-group mb-4 w-75">
          <label>To</label>
          <input
            type="text"
            className="form-control"
            // value={formValues.title}
            onChange={handleToChange}
            required
          />
        </div>
        <div className="form-group mb-4 w-75">
          <label>Country</label>

          <input
            type="text"
            className="form-control"
            value={formValues.country}
            disabled
            required
          />
        </div>
        <div className="form-group mb-4 w-75">
          <label>State/Province</label>
          <input
            type="text"
            className="form-control"
            value={formValues.state}
            disabled
            required
          />
        </div>
        <div className="form-group mb-4 w-75">
          {formValues.locations.map((location, index) => (
            <div key={location.id} className="LOCATION">
              <div
                className="LOCATION_HEADER"
                style={{ display: 'flex', flexDirection: 'row' }}
              >
                <label>Location {index + 1}</label>
                {formValues.locations.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveLocation(location.id)}
                    className=" btn btn-info mx-2"
                  >
                    Remove
                  </button>
                )}
              </div>
              <input
                type="text"
                className="form-control"
                // value={location.location}
                onChange={(e) => handleLocationChange(location.id, e)}
                required
              />
            </div>
          ))}
          <button
            type="button"
            className="btn btn-dark mt-3"
            onClick={handleAddLocation}
          >
            Add Location
          </button>
        </div>
        <button type="submit" className="btn btn-warning">
          Submit
        </button>
        <Link to={'/routes'} className="btn btn-danger">
          back
        </Link>

        <div style={{ height: '400px', width: '100%' }}>
          <Map
            google={props.google}
            zoom={4}
            style={mapStyles}
            initialCenter={{
              lat: 8.5241,
              lng: 76.9366,
            }}
            // center={{ LocationLat, LocationLng }}
            streetView={true}
          >
            {waypoints.map((waypoint, index) => (
              <Marker
                key={index}
                position={{ lat: waypoint.lat, lng: waypoint.lng }}
                name={`Marker ${index + 1}`}
                stopover={true}
              />
            ))}

            <Polyline
              path={waypoints.map((waypoint) => ({
                lat: waypoint.lat,
                lng: waypoint.lng,
              }))}
              options={{
                strokeColor: '#0000FF',
                strokeOpacity: 0.8,
                strokeWeight: 2,
              }}
            />
          </Map>
        </div>
      </form>
    </div>
  );
};

export default GoogleApiWrapper({
  apiKey: 'AIzaSyBUPUokCkp3c29HyW3ltTOHaWy1eq58Qqc',
})(AddRoutes);
