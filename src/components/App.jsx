import { useState, useEffect } from 'react';
import { Searchbar } from './Searchbar/Searchbar';
import { fetchImages } from './api/fetchImages';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Button } from './Button/Button';
import { Loader } from './Loader/Loader';
import { Modal } from './Modal/Modal';
import React from 'react';

export const App = () => {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSearch, setCurrentSearch] = useState('');
  const [pageNr, setPageNr] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImg, setModalImg] = useState('');
  const [modalAlt, setModalAlt] = useState('');

const handleSubmit = async e => {
  e.preventDefault();
  setIsLoading(true);
  const inputForSearch = e.target.elements.inputForSearch;
  if (inputForSearch.value.trim() === '') {
    setIsLoading(false);
    return;
  }
  const response = await fetchImages(inputForSearch.value, 1);
  setImages(response);
  setIsLoading(false);
  setCurrentSearch(inputForSearch.value);
  setPageNr(2);
};

const handleClickMore = async () => {
  setIsLoading(true);
  setPageNr(prevPage => prevPage + 1);
  const response = await fetchImages(currentSearch, pageNr);
  setImages([...images, ...response]);
  setIsLoading(false);
  setPageNr(pageNr + 1);
};

  const handleImageClick = e => {
    setModalOpen(true);
    setModalAlt(e.target.alt);
    setModalImg(e.target.name);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setModalImg('');
    setModalAlt('');
  };

  useEffect(() => {
    const handleKeyDown = event => {
      if (event.code === 'Escape') {
        handleModalClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
  }, []);

 return (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: '1fr',
      gridGap: '16px',
      paddingBottom: '24px',
    }}
  >
    <Searchbar onSubmit={handleSubmit} />
    {isLoading ? <Loader /> : <ImageGallery onImageClick={handleImageClick} images={images} />}
   
    {images.length >= 12 && !isLoading && (
      <Button onClick={handleClickMore} />
    )}

    {modalOpen ? (
      <Modal src={modalImg} alt={modalAlt} handleClose={handleModalClose} />
    ) : null}
  </div>
);
};