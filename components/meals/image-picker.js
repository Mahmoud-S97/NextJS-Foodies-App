'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import classes from './image-picker.module.css'

const ImagePicker = ({ label, name }) => {

    const imageInput = useRef();
    const [pickedImage, setPickedImage] = useState();

    const handlePickClick = () => {
        imageInput.current.click();
    }

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (!file) {
            setPickedImage(null);
            return;
        }

        const fileReader = new FileReader();

        fileReader.readAsDataURL(file);

        fileReader.onload = () => {
            setPickedImage(fileReader.result);
        }
    }

    return (
        <div className={classes.picker}>
            <label htmlFor={name}>{label}</label>
            <div className={classes.controls}>
                <div className={classes.preview}>
                    {!pickedImage && <p>No image picked yet.</p>}
                    {pickedImage && <Image src={pickedImage} fill alt='The image selected by the user.' />}
                </div>
                <input
                    ref={imageInput}
                    className={classes.input}
                    type='file'
                    name={name}
                    id={name}
                    accept='image/png, image/jpeg'
                    onChange={handleImageChange}
                    required
                />
                <button className={classes.button} type='button' onClick={handlePickClick}>
                    Pick an image
                </button>
            </div>
        </div>
    )
}

export default ImagePicker;