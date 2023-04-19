//gallery

import React, { useState } from 'react';
import NavBar from './NavBar';
import Modal from 'react-modal';
import { Link } from 'react-router-dom';

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
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  const handleImageClick = (event) => {
    setSelectedImage(event.target.src);
    setModalIsOpen(true);
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
  };

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

            <div className="row text-center text-lg-start">
              <div className="col-lg-3 col-md-4 col-6">
                <img
                  className="img-fluid img-thumbnail"
                  src="https://source.unsplash.com/pWkk7iiCoDM/400x300"
                  alt=""
                  onClick={handleImageClick}
                />
              </div>
              <div className="col-lg-3 col-md-4 col-6">
                <img
                  className="img-fluid img-thumbnail"
                  src="https://source.unsplash.com/aob0ukAYfuI/400x300"
                  alt=""
                  onClick={handleImageClick}
                />
              </div>
              <div className="col-lg-3 col-md-4 col-6">
                <img
                  className="img-fluid img-thumbnail"
                  src="https://source.unsplash.com/EUfxH-pze7s/400x300"
                  alt=""
                  onClick={handleImageClick}
                />
              </div>
              <div className="col-lg-3 col-md-4 col-6">
                <img
                  className="img-fluid img-thumbnail"
                  src="https://source.unsplash.com/M185_qYH8vg/400x300"
                  alt=""
                  onClick={handleImageClick}
                />
              </div>
              <div className="col-lg-3 col-md-4 col-6">
                <img
                  className="img-fluid img-thumbnail"
                  src="https://source.unsplash.com/sesveuG_rNo/400x300"
                  alt=""
                  onClick={handleImageClick}
                />
              </div>
              <div className="col-lg-3 col-md-4 col-6">
                <img
                  className="img-fluid img-thumbnail"
                  src="https://source.unsplash.com/AvhMzHwiE_0/400x300"
                  alt=""
                  onClick={handleImageClick}
                />
              </div>
              <div className="col-lg-3 col-md-4 col-6">
                <img
                  className="img-fluid img-thumbnail"
                  src="https://source.unsplash.com/2gYsZUmockw/400x300"
                  alt=""
                  onClick={handleImageClick}
                />
              </div>
              <div className="col-lg-3 col-md-4 col-6">
                <img
                  className="img-fluid img-thumbnail"
                  src="https://source.unsplash.com/EMSDtjVHdQ8/400x300"
                  alt=""
                  onClick={handleImageClick}
                />
              </div>
              <div className="col-lg-3 col-md-4 col-6">
                <img
                  className="img-fluid img-thumbnail"
                  src="https://source.unsplash.com/8mUEy0ABdNE/400x300"
                  alt=""
                  onClick={handleImageClick}
                />
              </div>
              <div className="col-lg-3 col-md-4 col-6">
                <a href="#" className="d-block mb-4 h-100">
                  <img
                    className="img-fluid img-thumbnail"
                    src="https://images.unsplash.com/28/see-through.JPG?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"
                    alt=""
                    onClick={handleImageClick}
                  />
                </a>
              </div>
              <div className="col-lg-3 col-md-4 col-6">
                <img
                  className="img-fluid img-thumbnail"
                  src="https://source.unsplash.com/aJeH0KcFkuc/400x300"
                  alt=""
                  onClick={handleImageClick}
                />
              </div>
              <div className="col-lg-3 col-md-4 col-6">
                <img
                  className="img-fluid img-thumbnail"
                  src="https://source.unsplash.com/p2TQ-3Bh3Oo/400x300"
                  alt=""
                  onClick={handleImageClick}
                />
              </div>
            </div>
            <Modal
              isOpen={modalIsOpen}
              onRequestClose={handleCloseModal}
              style={customStyles}
            >
              <img src={selectedImage} alt="Selected slide" />
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
