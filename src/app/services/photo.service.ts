import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Storage } from '@capacitor/storage';
import { Platform } from '@ionic/angular';

@Injectable({
	providedIn: 'root'
})
export class PhotoService {

	public photos: UserPhoto[] = [];
	private PHOTO_STORAGE = 'photos';
	private platform: Platform;

	constructor(platform: Platform) {
		this.platform = platform;
	}

	public async addNewToGallery() {
		// Take a Photo
		const capturedPhoto = await Camera.getPhoto({
			resultType: CameraResultType.Uri,
			source: CameraSource.Camera,
			quality: 100
		});

		const savedImageFile = await this.savePicture(capturedPhoto);
		this.photos.unshift(savedImageFile);

		Storage.set({
			key: this.PHOTO_STORAGE,
			value: JSON.stringify(this.photos)
		});
	}

	public async loadSaved() {
		const photoList = await Storage.get({ key: this.PHOTO_STORAGE });
		this.photos = JSON.parse(photoList.value) || [];

		if(!this.platform.is('hybrid')){
			for (const photo of this.photos) {
				const readFile = await Filesystem.readFile({
					path: photo.filepath,
					directory: Directory.Data
				});

				photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
			}
		}
	}

	private async savePicture(photo: Photo) {
		// Convert photo to base64
		const base64Data = await this.readAsBase64(photo);

		// Write file
		const fileName = new Date().getTime() + '.jpeg';
		const savedFile = await Filesystem.writeFile({
			path: fileName,
			data: base64Data,
			directory: Directory.Data
		});

		// Use webPath to display image
		if(this.platform.is('hybrid')){
			return {
				filepath: savedFile.uri,
				webviewPath: Capacitor.convertFileSrc(savedFile.uri)
			};
		}
		else {
			return {
				filepath: fileName,
				webviewPath: photo.webPath
			};
		}
	}

	public async deletePicture(photo: UserPhoto, position: number) {
		this.photos.splice(position, 1);

		Storage.set({
			key: this.PHOTO_STORAGE,
			value: JSON.stringify(this.photos)
		});

		const filename = photo.filepath.substr(photo.filepath.lastIndexOf('/') + 1);
		await Filesystem.deleteFile({
			path: filename,
			directory: Directory.Data
		});
	}

	private async readAsBase64(photo: Photo) {
		// Fetch photo, read as blob, then Convert
		if (this.platform.is('hybrid')){
			const file = await Filesystem.readFile({
				path: photo.path
			});
			return file.data;
		}
		else {
			const response = await fetch(photo.webPath);
			const blob = await response.blob();

			return await this.convertBlobToBase64(blob) as string;
		}
	}

	private convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onerror = reject;
		reader.onload = () => {
			resolve(reader.result);
		};
		reader.readAsDataURL(blob);
	});
}

export interface UserPhoto {
	filepath: string;
	webviewPath: string;
}
