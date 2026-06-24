import React, { useState } from 'react';
import Modal from 'react-modal';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const GalleryContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  padding: 60px 20px;
  color: #fff;
  font-family: 'Inter', sans-serif;
`;

const GalleryHeader = styled.div`
  text-align: center;
  margin-bottom: 50px;
  
  h1 {
    font-size: 3rem;
    font-weight: 800;
    margin-bottom: 15px;
    background: linear-gradient(90deg, #60a5fa, #a78bfa, #f472b6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  p {
    color: #94a3b8;
    font-size: 1.1rem;
    max-width: 600px;
    margin: 0 auto;
  }
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
  max-width: 1200px;
  margin: 0 auto;
`;

const ImageCard = styled.div`
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  aspect-ratio: 4/3;
  
  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    background: linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.8));
    z-index: 1;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }

  &:hover img {
    transform: scale(1.08);
  }
  
  &:hover .hover-icon {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
`;

const HoverIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.5);
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  z-index: 2;
  opacity: 0;
  transition: all 0.3s ease;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  margin-top: 40px;
  color: #94a3b8;
  text-decoration: none;
  font-size: 1.1rem;
  transition: color 0.3s ease;
  
  &:hover {
    color: #fff;
  }
  
  i {
    margin-right: 8px;
  }
`;

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    padding: 0,
    border: 'none',
    background: 'transparent',
    maxWidth: '90vw',
    maxHeight: '90vh',
    overflow: 'hidden'
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    zIndex: 1000
  }
};

const ModalImage = styled.img`
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
`;

// Temporary hardcoded images for showcase
const tempImgs = [
  { image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', title: 'Modern Fleet' },
  { image: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', title: 'Highway Transport' },
  { image: 'https://images.unsplash.com/photo-1586528116311-ad8ed7c663c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', title: 'Warehouse Logistics' },
  { image: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', title: 'Global Shipping' },
  { image: 'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', title: 'Last-Mile Delivery' },
  { image: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', title: 'Container Yard' }
];

const Gallery = () => {

  const imgs = tempImgs;

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  const handleImageClick = (src) => {
    setSelectedImage(src);
    setModalIsOpen(true);
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
  };

  return (
    <GalleryContainer>
      <div className="container">
        <GalleryHeader>
          <h1>Our Gallery</h1>
          <p>Explore our state-of-the-art fleet and logistical operations driving the future of transportation.</p>
        </GalleryHeader>

        <ImageGrid>
          {imgs.map((image, idx) => (
            <ImageCard key={idx} onClick={() => handleImageClick(image.image)}>
              <StyledImage
                src={image.image}
                alt={image.title || 'Gallery image'}
              />
              <HoverIcon className="hover-icon">
                <i className="fas fa-search-plus"></i>
              </HoverIcon>
            </ImageCard>
          ))}
        </ImageGrid>

        <div style={{ textAlign: 'center' }}>
          <BackLink to={'/'}>
            <i className="fas fa-arrow-left"></i> Back to Home
          </BackLink>
        </div>

        <Modal
          isOpen={modalIsOpen}
          onRequestClose={handleCloseModal}
          style={customStyles}
          contentLabel="Image Modal"
          ariaHideApp={false}
        >
          <ModalImage src={selectedImage} alt="Selected full-size view" />
        </Modal>
      </div>
    </GalleryContainer>
  );
};

export default Gallery;
