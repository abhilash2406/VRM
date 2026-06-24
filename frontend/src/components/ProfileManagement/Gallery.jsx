import logger from '../../utils/logger';
//gallery

import React, { useEffect, useState } from 'react';
import NavBar from '../Shared/NavBar';
import Modal from 'react-modal';
import { Link, useNavigate } from 'react-router-dom';
import { useGallery, useUploadToGallery, useDeleteFromGallery } from '../../hooks/queries/useGalleryQueries';
import { useMsgStore } from '../../store/useMsgStore';
import { useAuthStore } from '../../store/useAuthStore';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

const Gallery = () => {
  const navigate = useNavigate();
  const { data: imgs = [] } = useGallery();
  const { mutate: uploadToGallery } = useUploadToGallery();
  const { mutate: dltFromGallery } = useDeleteFromGallery();
  const setSuccessMessage = useMsgStore((state) => state.setSuccessMessage);
  
  logger.info(imgs);
  const userRole = JSON.parse(localStorage.getItem('currentUser')).designation;


  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  // logger.info('files', files);
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!selectedFile) {
      setSuccessMessage('please select image');
    } else {
      const formData = new FormData();
      formData.append('image', selectedFile);
      setSelectedFile('');
      document.getElementById('img').value = null;

      uploadToGallery(formData, { onSuccess: () => navigate('/gallery') });
    }
  };
  // useEffect(() => {
  //   dispatch(retrieveImgs());
  // }, []);
  const handleImageClick = (event) => {
    setSelectedImage(event.target.src);
    setModalIsOpen(true);
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
  };
  const { grantedPermissions } = useAuthStore();
  let array = grantedPermissions?.filter((item) => item.menu === 'Gallery');
  let permissionAllowed = array?.map((e) => e.subMenu);

  return (
    <div className="container-fluid">
      <div className="row">
        <NavBar />
        <div className="col-sm p-3 min-vh-100">
          <div className="container">
            <h1 className="fw-light text-center text-lg-start mt-4 mb-0">
              {' '}
              Gallery
            </h1>

            <hr className="mt-2 mb-5" />
            <div className="mb-3">
              {userRole === 'Admin' || permissionAllowed?.includes('Delete') ? (
                <form onSubmit={handleSubmit}>
                  <h3>React Multiple File Upload</h3>

                  <div className="form-group">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileSelect}
                      id="img"
                      name="img"
                      className="form-control w-50"
                    />
                  </div>
                  <div className="form-group">
                    <button className="btn btn-primary" type="submit">
                      Upload
                    </button>
                  </div>
                </form>
              ) : null}
            </div>

            <div className="row text-center text-lg-start">
              {imgs.map((image) => (
                <div className="col-lg-3 col-md-4 col-6">
                  <img
                    className="img-fluid img-thumbnail"
                    src={`${process.env.REACT_APP_BACKEND_URL}/${image.image}`}
                    alt=""
                    onClick={handleImageClick}
                  />
                  {userRole === 'Admin' || permissionAllowed?.includes('Delete') ? (
                    <button
                      className="btn btn-warning"
                      onClick={() => {
                        dltFromGallery(image.id);
                      }}
                      style={{ margin: '2% 4% 0% 0%' }}
                    >
                      delete
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
            <Modal
              isOpen={modalIsOpen}
              onRequestClose={handleCloseModal}
              style={customStyles}
            >
              <img
                src={selectedImage}
                alt="Selected slide"
                style={{ width: '500px' }}
              />
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
