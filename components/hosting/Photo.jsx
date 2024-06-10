import Image from "next/image";
import React, { useCallback, useContext, useState } from "react";
import { useDropzone } from "react-dropzone";
import { TrashIcon } from "@heroicons/react/outline";
import { TypeContext } from "../../pages/become-a-host/[type]";

function Photo() {
  const { photo1, setPhoto1 } = useContext(TypeContext);

  const onDrop1 = useCallback((acceptedFiles) => {
    setPhoto1(
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
    getRootProps: getRootProps1,
    getInputProps: getInputProps1,
    isDragActive: isDragActive1,
  } = useDropzone({
    onDrop: onDrop1,
  });

  return (
    <div
      className={`md:absolute md:top-1/2 md:left-1/2 m-10 mx-auto w-[80%] h-[34rem] overflow-y-visible md:translate-x-[-50%] md:translate-y-[-50%] ${
        photo1 ? "md:w-[75%]" : "md:w-[55%]"
      }`}
    >
      {photo1 ? (
        <div>
          <h1 className="text-2xl text-slate-900 font-[400] pb-3">
            Youre good to go!
          </h1>
          <div>
            <div
              onClick={() => setPhoto1(null)}
              className="p-2 z-50 rounded-full bg-white shadow-xl w-min absolute top-[6.5%] right-[6.5%] cursor-pointer"
            >
              <TrashIcon className="h-6" />
            </div>
            <img
              src={photo1.preview ? photo1.preview : photo1}
              className="opacity-60"
              style={{ width: "100%", height: "400px", objectFit: "cover" }}
              alt=""
            />
          </div>
        </div>
      ) : (
        <div
          className="border-dotted cursor-pointer border-[1.5px] grid gap-2 justify-center border-gray-500 px-5 py-40 mx-auto"
          {...getRootProps1()}
        >
          <input {...getInputProps1()} />
          <div className="relative h-12">
            <Image
              src={require("../../images/image-gallery.png")}
              layout="fill"
              objectFit="contain"
            />
          </div>
          <p className="text-2xl font-[400] text-slate-900 text-center">
            {isDragActive1 ? "Drop to upload" : "Drag your photo here"}
          </p>
          <p className="text-gray-600 text-center font-[350]">
            {!isDragActive1 && "The photo should be at high resolution"}
          </p>
        </div>
      )}
    </div>
  );
}

export default Photo;
