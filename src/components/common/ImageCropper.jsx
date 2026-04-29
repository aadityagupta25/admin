import React, { useState, useRef, useCallback } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Crop, X } from 'lucide-react';

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
    return centerCrop(
        makeAspectCrop({ unit: '%', width: 90 }, aspect, mediaWidth, mediaHeight),
        mediaWidth,
        mediaHeight
    );
}

async function getCroppedBlob(image, crop, fileName) {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(
        image,
        crop.x * scaleX, crop.y * scaleY,
        crop.width * scaleX, crop.height * scaleY,
        0, 0,
        canvas.width, canvas.height
    );
    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            resolve(new File([blob], fileName, { type: blob.type }));
        }, 'image/jpeg', 0.95);
    });
}

const ImageCropper = ({ aspect = 1, onCropped, children }) => {
    const [srcUrl, setSrcUrl] = useState(null);
    const [crop, setCrop] = useState();
    const [completedCrop, setCompletedCrop] = useState(null);
    const [open, setOpen] = useState(false);
    const [fileName, setFileName] = useState('image.jpg');
    const imgRef = useRef(null);
    const inputRef = useRef(null);

    const onSelectFile = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        // SVGs are vector — skip crop dialog, pass through directly
        if (file.type === 'image/svg+xml') {
            onCropped(file);
            e.target.value = '';
            return;
        }
        setFileName(file.name);
        const reader = new FileReader();
        reader.onload = () => {
            setSrcUrl(reader.result);
            setOpen(true);
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    };

    const onImageLoad = useCallback((e) => {
        const { width, height } = e.currentTarget;
        setCrop(centerAspectCrop(width, height, aspect));
    }, [aspect]);

    const handleConfirm = async () => {
        if (!completedCrop || !imgRef.current) return;
        const file = await getCroppedBlob(imgRef.current, completedCrop, fileName);
        onCropped(file);
        setOpen(false);
        setSrcUrl(null);
    };

    const handleCancel = () => {
        setOpen(false);
        setSrcUrl(null);
    };

    return (
        <>
            <div onClick={() => inputRef.current?.click()} className="cursor-pointer">
                {children}
            </div>
            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onSelectFile} />

            <Dialog open={open} onOpenChange={handleCancel}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Crop className="h-4 w-4" /> Crop Image
                        </DialogTitle>
                    </DialogHeader>
                    <div className="flex justify-center max-h-[400px] overflow-auto">
                        {srcUrl && (
                            <ReactCrop
                                crop={crop}
                                onChange={(_, pct) => setCrop(pct)}
                                onComplete={(c) => setCompletedCrop(c)}
                                aspect={aspect}
                            >
                                <img
                                    ref={imgRef}
                                    src={srcUrl}
                                    onLoad={onImageLoad}
                                    className="max-w-full"
                                    alt="crop preview"
                                />
                            </ReactCrop>
                        )}
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleCancel}>
                            <X className="mr-2 h-4 w-4" /> Cancel
                        </Button>
                        <Button type="button" onClick={handleConfirm} disabled={!completedCrop}>
                            <Crop className="mr-2 h-4 w-4" /> Apply Crop
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ImageCropper;
