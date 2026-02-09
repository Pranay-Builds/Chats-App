import { cloudinary } from "../lib/cloudinary.js";

type FileUploadProps = {
    fileBuffer: Buffer;
    folderName: string;
}


type UploadResult = {
  url: string;
  publicId: string;
};


export async function uploadToCloudinary({ fileBuffer, folderName }: FileUploadProps): Promise<UploadResult> {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({
            folder: folderName
        },
            (error, result) => {
                if (error) reject(error);


                if (!result?.secure_url) {
                    reject(new Error("Upload failed"));
                    return;
                }

                resolve({
                    url: result.secure_url,
                    publicId: result.public_id
                });
            }
        );

        stream.end(fileBuffer);
    });

}