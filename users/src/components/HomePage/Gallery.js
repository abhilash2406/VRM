import React, { useState,useEffect } from 'react';
import Modal from 'react-modal';
import { Link } from 'react-router-dom';
import { retrieveImgs } from '../../action';
import { useDispatch, useSelector } from 'react-redux';

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
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(retrieveImgs());
  }, []);
  const { imgs } = useSelector((e) => e.auth);
  console.log(imgs);

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
    <div class="container">
      <h1 class="fw-light text-center text-lg-start mt-4 mb-0"> Gallery</h1>

      <hr class="mt-2 mb-5" />

      <div class="row text-center text-lg-start">
        {imgs.map((image) => (
          <div className="col-lg-3 col-md-4 col-6">
            <img
              className="img-fluid img-thumbnail"
              src={`http://localhost:5000/${image.image}`}
              alt=""
              onClick={handleImageClick}
            />
          </div>
        ))}
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={handleCloseModal}
        style={customStyles}
      >
        <img src={selectedImage} alt="Selected slide" />
      </Modal>
      <Link className="btn btn-info" to={'/'}>
        back
      </Link>
    </div>
  );
};

export default Gallery;
