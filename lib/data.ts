
import { db } from './firebase';
import { collection, getDocs, getDoc, doc, setDoc, deleteDoc, query, where, writeBatch, updateDoc, addDoc } from 'firebase/firestore';
import type { Vehicle, ImagePlaceholder } from './types';
import { unstable_noStore as noStore } from 'next/cache';

export async function fetchVehicles(filters?: { type?: string, price?: string }): Promise<Vehicle[]> {
    noStore();
    try {
        const vehiclesCollection = collection(db, 'vehicles');
        let q = query(vehiclesCollection);

        if (filters?.type && filters.type !== 'all') {
            q = query(q, where('type', '==', filters.type));
        }

        const querySnapshot = await getDocs(q);
        let vehicles = await Promise.all(querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: parseInt(doc.id),
                make: data.make,
                model: data.model,
                year: data.year,
                price: data.price,
                mileage: data.mileage,
                description: data.description,
                type: data.type,
                images: data.images,
                specifications: data.specifications
            };
        }));

        if (filters?.price && filters.price !== 'all') {
            const [min, max] = filters.price.split('-').map(Number);
            vehicles = vehicles.filter(v => {
                if (max) {
                    return v.price >= min && v.price <= max;
                }
                return v.price >= min;
            });
        }
        
        return vehicles;
    } catch (error) {
        console.error("Error fetching vehicles:", error);
        return [];
    }
}

export async function fetchVehicleById(id: string): Promise<Vehicle | null> {
    noStore();
    try {
        const vehicleDocRef = doc(db, 'vehicles', id);
        const vehicleDoc = await getDoc(vehicleDocRef);

        if (vehicleDoc.exists()) {
            const data = vehicleDoc.data();
            return {
                id: parseInt(vehicleDoc.id),
                make: data.make,
                model: data.model,
                year: data.year,
                price: data.price,
                mileage: data.mileage,
                description: data.description,
                type: data.type,
                images: data.images,
                specifications: data.specifications
            };
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching vehicle by ID:", error);
        return null;
    }
}

export async function fetchAllVehicleIds() {
    noStore();
    try {
        const vehiclesCollection = collection(db, 'vehicles');
        const vehicleSnapshot = await getDocs(vehiclesCollection);
        return vehicleSnapshot.docs.map(doc => ({ id: doc.id }));
    } catch (error) {
        console.error("Error fetching vehicle IDs:", error);
        return [];
    }
}

export async function fetchFeaturedVehicles(limit = 4) {
    noStore();
    try {
        const vehicles = await fetchVehicles();
        // For now, we'll just take the first few as "featured"
        return vehicles.slice(0, limit);
    } catch (error) {
        console.error("Error fetching featured vehicles:", error);
        return [];
    }
}

export async function createVehicle(vehicleData: Omit<Vehicle, 'id'>): Promise<Vehicle> {
    // Firestore can auto-generate an ID, but our data structure relies on a numeric ID from the doc name
    // A simple way to manage this is to find the highest existing ID and increment it.
    // This is not robust for high-concurrency environments but is acceptable for this use case.
    const vehicles = await fetchVehicles();
    const maxId = vehicles.reduce((max, v) => v.id > max ? v.id : max, 0);
    const newId = maxId + 1;
    
    const newVehicle = { ...vehicleData, id: newId };
    
    const vehicleDocRef = doc(db, 'vehicles', newId.toString());
    await setDoc(vehicleDocRef, vehicleData);
    
    return newVehicle;
}

export async function updateVehicle(id: string, vehicleData: Partial<Vehicle>): Promise<Vehicle> {
    const vehicleDocRef = doc(db, 'vehicles', id);
    const vehicleDoc = await getDoc(vehicleDocRef);
    if (!vehicleDoc.exists()) {
        throw new Error(`Vehicle with ID ${id} not found.`);
    }

    await updateDoc(vehicleDocRef, vehicleData);
    
    const updatedDoc = await getDoc(vehicleDocRef);
    const data = updatedDoc.data();
    return {
        id: parseInt(id),
        ...data
    } as Vehicle;
}

export async function deleteVehicle(id: string): Promise<void> {
    const vehicleDocRef = doc(db, 'vehicles', id);
    const vehicleDoc = await getDoc(vehicleDocRef);
     if (!vehicleDoc.exists()) {
        throw new Error(`Vehicle with ID ${id} not found.`);
    }
    await deleteDoc(vehicleDocRef);
}
