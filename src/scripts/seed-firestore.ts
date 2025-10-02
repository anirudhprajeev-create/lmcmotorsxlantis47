import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDocs, writeBatch } from 'firebase/firestore';
import { vehicles } from '../lib/vehicles';

// This is the Firebase configuration for your app
const firebaseConfig = {
  "projectId": "studio-6136093379-11c92",
  "appId": "1:796012307965:web:ac1c23e9519b1b0d6ca594",
  "apiKey": "AIzaSyD1TtPHsrgt6uVzXEB9cPF8YXTwTznVehY",
  "authDomain": "studio-6136093379-11c92.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "796012307965"
};


// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const db = getFirestore(app);

async function seedDatabase() {
  const vehiclesCollection = collection(db, 'vehicles');
  const existingVehicles = await getDocs(vehiclesCollection);

  if (!existingVehicles.empty) {
    console.log('Vehicles collection already contains data. Deleting existing data...');
    const batch = writeBatch(db);
    existingVehicles.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    console.log('Existing data deleted.');
  }


  console.log('Seeding database with initial vehicle data...');

  const promises = vehicles.map(async (vehicle) => {
    // Use the numeric `id` from your static data as the document ID
    const vehicleDocRef = doc(db, 'vehicles', vehicle.id.toString());
    await setDoc(vehicleDocRef, vehicle);
    console.log(`Added vehicle: ${vehicle.make} ${vehicle.model}`);
  });

  await Promise.all(promises);

  console.log('Database seeding completed successfully!');
  // Exit the script
  process.exit(0);
}

seedDatabase().catch((error) => {
  console.error('Error seeding database:', error);
  process.exit(1);
});
