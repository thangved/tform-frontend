import { storage } from "@/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const upload = async (file) => {
	const uploadRef = ref(storage, `uploads/${Date.now()}`);

	await uploadBytes(uploadRef, file);

	return await getDownloadURL(uploadRef);
};

export default upload;
