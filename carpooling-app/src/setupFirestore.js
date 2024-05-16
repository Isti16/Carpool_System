import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, updateDoc, Timestamp, addDoc } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBOYNCwrYvu4qYwcKi_PM8L_0cHvdKqVmc",
  authDomain: "carpool-system-421322.firebaseapp.com",
  projectId: "carpool-system-421322",
  storageBucket: "carpool-system-421322.appspot.com",
  messagingSenderId: "450727304950",
  appId: "1:450727304950:web:6ae1b32db67897e16556d7",
  measurementId: "G-KLFQTLD2C1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function updateDepTime() {
  const ridesCollection = collection(db, "rides");
  const snapshot = await getDocs(ridesCollection);

  snapshot.forEach(async (docSnap) => {
    const data = docSnap.data();
    if (typeof data.depTime === "string") {
      // Convert the depTime string to a Timestamp
      const depTimeTimestamp = Timestamp.fromDate(new Date(data.depTime));
      // Update the document with the new Timestamp
      await updateDoc(doc(db, "rides", docSnap.id), { depTime: depTimeTimestamp });
    }
  });
}

async function addSampleData() {
  await addDoc(collection(db, "rides"), {
    availableSeats: 3,
    contact: "driver@example.com",
    depTime: Timestamp.fromDate(new Date("2024-05-16T20:20:20Z")),
    destination: "City B",
    driverID: "driver123",
    driverName: "John Doe",
    intermediate: "City A, City C",
    origin: "City A",
    remainingSeats: 3,
    rideID: "1",
    price: 1000
  });
}

// Run the updateDepTime function to convert existing depTime fields to Timestamps
updateDepTime().then(() => {
  console.log("depTime fields updated to Timestamps");

  // Add sample data
  addSampleData().then(() => {
    console.log("Sample data added");
  });
});
