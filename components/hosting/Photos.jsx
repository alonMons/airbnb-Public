import Image from "next/image";
import React, { useCallback, useContext, useState } from "react";
import { useDropzone } from "react-dropzone";
import { TrashIcon } from "@heroicons/react/outline";
import { TypeContext } from "../../pages/become-a-host/[type]";

const Photos = () => {
  const { photo2, setPhoto2 } = useContext(TypeContext);
  const { photo3, setPhoto3 } = useContext(TypeContext);
  const { photo4, setPhoto4 } = useContext(TypeContext);
  const { photo5, setPhoto5 } = useContext(TypeContext);
  const [photoNum, setPhotoNum] = useState(2);

  const onDrop2 = useCallback((acceptedFiles) => {
    setPhoto2(
      acceptedFiles.map((file) => {
        if (
          file.type === "image/png" ||
          file.type === "image/jpeg" ||
          file.type === "image/webp"
        ) {
          if (file.size < 2000)
            return alert(
              "The file is too small. Please upload a photo that exceeds 2KB."
            );
          if (file.size > 10485760)
            return alert(
              "The file is too large. Please upload a photo that subceeds 10MB."
            );
          return Object.assign(file, {
            preview: URL.createObjectURL(file),
          });
        } else
          alert(
            "The images you upload must be JPEG or PNG files. Please check your file type and try again."
          );
      })[0]
    );
  }, []);

  const onDrop3 = useCallback((acceptedFiles) => {
    setPhoto3(
      acceptedFiles.map((file) => {
        if (
          file.type === "image/png" ||
          file.type === "image/jpeg" ||
          file.type === "image/webp"
        ) {
          if (file.size < 2000)
            return alert(
              "The file is too small. Please upload a photo that exceeds 2KB."
            );
          if (file.size > 10485760)
            return alert(
              "The file is too large. Please upload a photo that subceeds 10MB."
            );
          return Object.assign(file, {
            preview: URL.createObjectURL(file),
          });
        } else
          alert(
            "The images you upload must be JPEG or PNG files. Please check your file type and try again."
          );
      })[0]
    );
  }, []);

  const onDrop4 = useCallback((acceptedFiles) => {
    setPhoto4(
      acceptedFiles.map((file) => {
        if (
          file.type === "image/png" ||
          file.type === "image/jpeg" ||
          file.type === "image/webp"
        ) {
          if (file.size < 2000)
            return alert(
              "The file is too small. Please upload a photo that exceeds 2KB."
            );
          if (file.size > 10485760)
            return alert(
              "The file is too large. Please upload a photo that subceeds 10MB."
            );
          return Object.assign(file, {
            preview: URL.createObjectURL(file),
          });
        } else
          alert(
            "The images you upload must be JPEG or PNG files. Please check your file type and try again."
          );
      })[0]
    );
  }, []);

  const onDrop5 = useCallback((acceptedFiles) => {
    setPhoto5(
      acceptedFiles.map((file) => {
        if (
          file.type === "image/png" ||
          file.type === "image/jpeg" ||
          file.type === "image/webp"
        ) {
          if (file.size < 2000)
            return alert(
              "The file is too small. Please upload a photo that exceeds 2KB."
            );
          if (file.size > 10485760)
            return alert(
              "The file is too large. Please upload a photo that subceeds 10MB."
            );
          return Object.assign(file, {
            preview: URL.createObjectURL(file),
          });
        } else
          alert(
            "The images you upload must be JPEG or PNG files. Please check your file type and try again."
          );
      })[0]
    );
  }, []);

  const {
    getRootProps: getRootProps2,
    getInputProps: getInputProps2,
    isDragActive: isDragActive2,
  } = useDropzone({
    onDrop: onDrop2,
  });
  const {
    getRootProps: getRootProps3,
    getInputProps: getInputProps3,
    isDragActive: isDragActive3,
  } = useDropzone({
    onDrop: onDrop3,
  });
  const {
    getRootProps: getRootProps4,
    getInputProps: getInputProps4,
    isDragActive: isDragActive4,
  } = useDropzone({
    onDrop: onDrop4,
  });
  const {
    getRootProps: getRootProps5,
    getInputProps: getInputProps5,
    isDragActive: isDragActive5,
  } = useDropzone({
    onDrop: onDrop5,
  });

  return (
    <div>
      <h2 className="width-full text-center py-3 font-[400] text-xl">
        Photo number {photoNum}
      </h2>
      {photoNum == 2 && (
        <div
          className={`md:absolute md:top-[53%] md:left-1/2 m-10 mx-auto w-[80%] h-[34rem] overflow-y-visible md:translate-x-[-50%] md:translate-y-[-50%] ${
            photo2 ? "md:w-[75%]" : "md:w-[55%]"
          }`}
        >
          {photo2 ? (
            <div>
              <h1 className="text-2xl text-slate-900 font-[400] pb-3">
                Youre good to go!
              </h1>
              <div>
                <div
                  onClick={() => setPhoto2(null)}
                  className="p-2 z-50 rounded-full bg-white shadow-xl w-min absolute top-[6.5%] right-[6.5%] cursor-pointer"
                >
                  <TrashIcon className="h-6" />
                </div>
                <img
                  src={photo2.preview ? photo2.preview : photo2}
                  className="opacity-60"
                  style={{ width: "100%", height: "400px", objectFit: "cover" }}
                  alt=""
                />
              </div>
            </div>
          ) : (
            <div
              className="border-dotted cursor-pointer border-[1.5px] grid gap-2 justify-center border-gray-500 px-5 py-40 mx-auto"
              {...getRootProps2()}
            >
              <input {...getInputProps2()} />
              <div className="relative h-12">
                <Image
                  src={require("../../images/image-gallery.png")}
                  layout="fill"
                  objectFit="contain"
                />
              </div>
              <p className="text-2xl font-[400] text-slate-900 text-center">
                {isDragActive2 ? "Drop to upload" : "Drag your photo here"}
              </p>
              <p className="text-gray-600 font-[350] text-center">
                {!isDragActive2 && "The photo should be at high resolution"}
              </p>
            </div>
          )}
        </div>
      )}

      {photoNum == 3 && (
        <div
          className={`md:absolute md:top-[53%] md:left-1/2 m-10 mx-auto w-[80%] h-[34rem] overflow-y-visible md:translate-x-[-50%] md:translate-y-[-50%] ${
            photo3 ? "md:w-[75%]" : "md:w-[55%]"
          }`}
        >
          {photo3 ? (
            <div>
              <h1 className="text-2xl text-slate-900 font-[400] pb-3">
                Youre good to go!
              </h1>
              <div>
                <div
                  onClick={() => setPhoto3(null)}
                  className="p-2 z-50 rounded-full bg-white shadow-xl w-min absolute top-[6.5%] right-[6.5%] cursor-pointer"
                >
                  <TrashIcon className="h-6" />
                </div>
                <img
                  src={photo3.preview ? photo3.preview : photo3}
                  className="opacity-60"
                  style={{ width: "100%", height: "400px", objectFit: "cover" }}
                  alt=""
                />
              </div>
            </div>
          ) : (
            <div
              className="border-dotted cursor-pointer border-[1.5px] grid gap-2 justify-center border-gray-500 px-5 py-40 mx-auto"
              {...getRootProps3()}
            >
              <input {...getInputProps3()} />
              <div className="relative h-12">
                <Image
                  src={require("../../images/image-gallery.png")}
                  layout="fill"
                  objectFit="contain"
                />
              </div>
              <p className="text-2xl font-[400] text-slate-900 text-center">
                {isDragActive3 ? "Drop to upload" : "Drag your photo here"}
              </p>
              <p className="text-gray-600 font-[350] text-center">
                {!isDragActive3 && "The photo should be at high resolution"}
              </p>
            </div>
          )}
        </div>
      )}

      {photoNum == 4 && (
        <div
          className={`md:absolute md:top-[53%] md:left-1/2 m-10 mx-auto w-[80%] h-[34rem] overflow-y-visible md:translate-x-[-50%] md:translate-y-[-50%] ${
            photo4 ? "md:w-[75%]" : "md:w-[55%]"
          }`}
        >
          {photo4 ? (
            <div>
              <h1 className="text-2xl text-slate-900 font-[400] pb-3">
                Youre good to go!
              </h1>
              <div>
                <div
                  onClick={() => setPhoto4(null)}
                  className="p-2 z-50 rounded-full bg-white shadow-xl w-min absolute top-[6.5%] right-[6.5%] cursor-pointer"
                >
                  <TrashIcon className="h-6" />
                </div>
                <img
                  src={photo4.preview ? photo4.preview : photo4}
                  className="opacity-60"
                  style={{ width: "100%", height: "400px", objectFit: "cover" }}
                  alt=""
                />
              </div>
            </div>
          ) : (
            <div
              className="border-dotted cursor-pointer border-[1.5px] grid gap-2 justify-center border-gray-500 px-5 py-40 mx-auto"
              {...getRootProps4()}
            >
              <input {...getInputProps4()} />
              <div className="relative h-12">
                <Image
                  src={require("../../images/image-gallery.png")}
                  layout="fill"
                  objectFit="contain"
                />
              </div>
              <p className="text-2xl font-[400] text-slate-900 text-center">
                {isDragActive4 ? "Drop to upload" : "Drag your photo here"}
              </p>
              <p className="text-gray-600 font-[350] text-center">
                {!isDragActive4 && "The photo should be at high resolution"}
              </p>
            </div>
          )}
        </div>
      )}

      {photoNum == 5 && (
        <div
          className={`md:absolute md:top-[53%] md:left-1/2 m-10 mx-auto w-[80%] h-[34rem] overflow-y-visible md:translate-x-[-50%] md:translate-y-[-50%] ${
            photo5 ? "md:w-[75%]" : "md:w-[55%]"
          }`}
        >
          {photo5 ? (
            <div>
              <h1 className="text-2xl text-slate-900 font-[400] pb-3">
                Youre good to go!
              </h1>
              <div>
                <div
                  onClick={() => setPhoto5(null)}
                  className="p-2 z-50 rounded-full bg-white shadow-xl w-min absolute top-[6.5%] right-[6.5%] cursor-pointer"
                >
                  <TrashIcon className="h-6" />
                </div>
                <img
                  src={photo5.preview ? photo5.preview : photo5}
                  className="opacity-60"
                  style={{ width: "100%", height: "400px", objectFit: "cover" }}
                  alt=""
                />
              </div>
            </div>
          ) : (
            <div
              className="border-dotted cursor-pointer border-[1.5px] grid gap-2 justify-center border-gray-500 px-5 py-40 mx-auto"
              {...getRootProps5()}
            >
              <input {...getInputProps5()} />
              <div className="relative h-12">
                <Image
                  src={require("../../images/image-gallery.png")}
                  layout="fill"
                  objectFit="contain"
                />
              </div>
              <p className="text-2xl font-[400] text-slate-900 text-center">
                {isDragActive5 ? "Drop to upload" : "Drag your photo here"}
              </p>
              <p className="text-gray-600 font-[350] text-center">
                {!isDragActive5 && "The photo should be at high resolution"}
              </p>
            </div>
          )}
        </div>
      )}

      <div
        onClick={() => {
          if (photoNum > 2) setPhotoNum(photoNum - 1);
        }}
        className="absolute left-[3.2rem] bottom-[8rem] font-[400] p-2 bg-neutral-100 rounded-lg px-3 hover:scale-[1.075] transition-all cursor-pointer"
      >
        back
      </div>
      <div
        onClick={() => {
          if (photoNum < 5)
            if (
              (photo2 && photoNum == 2) ||
              (photo3 && photoNum == 3) ||
              (photo4 && photoNum == 4) ||
              (photo5 && photoNum == 5)
            )
              setPhotoNum(photoNum + 1);
        }}
        className="absolute right-[3.2rem] bottom-[8rem] font-[400] p-2 bg-neutral-100 rounded-lg px-3 hover:scale-[1.075] transition-all cursor-pointer"
      >
        next
      </div>
    </div>
  );
};

export default Photos;
