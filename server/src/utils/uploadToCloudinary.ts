import { cloudinary } from "../lib/cloudinary.js";

type FileUploadProps = {
    fileBuffer: Buffer;
    folderName: string;
}

export async function uploadToCloudinary({ fileBuffer, folderName }: FileUploadProps): Promise<string> {
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

                resolve(result.secure_url);

            }
        );

        stream.end(fileBuffer);
    });

}