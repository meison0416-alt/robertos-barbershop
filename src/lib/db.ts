import { 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  updateDoc, 
  setDoc,
  query, 
  where, 
  orderBy 
} from "firebase/firestore";
import { db, isFirebaseConfigured, handleFirestoreError, OperationType, storage } from "./firebase";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { Haircut, Booking, Review, Barber } from "../types";

// INITIAL PREMIUM STYLES WITH A BLACK & GOLD LUXURY THEME
export const INITIAL_HAIRCUTS: Haircut[] = [
  {
    id: "sovereign-fade",
    name: "The Sovereign Skin Fade",
    description: "Our signature high-contrast fade. Features an expertly blended skin taper fading into a luxurious pompadour top. Paired with a precision foil shave and gold-standard line-up.",
    category: "men",
    imageUrl: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=800",
    price: 45,
    duration: 45,
    details: "Your service begins with an essential lavender oil hot-towel facial wrap, followed by structured clipper adjustments starting from open-guard down to a pure triple-zero foil shave. The top is masterfully point-cut to add dynamic volume. Sealed with our dry-matte clay.",
    likes: 247
  },
  {
    id: "aureum-scissor",
    name: "Aureum Executive Scissor Cut",
    description: "Highly polished, classic scissor-cut tailored to flow with your natural head shape. Clean low-taper neck blend, tidy side-burns, and full beard conditioning.",
    category: "men",
    imageUrl: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&q=80&w=800",
    price: 60,
    duration: 60,
    details: "A classic full-head shear haircut. Ideal for gentlemen wishing to keep subtle length. Includes a customized crown styling, neck shaving with botanical lather, and a complete pre-style blowout with hold-serum.",
    likes: 185
  },
  {
    id: "textured-undercut",
    name: "The Royal Textured Undercut",
    description: "A bold modern style featuring high disconnected sides and a rich textured top with intense styling versatility.",
    category: "men",
    imageUrl: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=800",
    price: 50,
    duration: 50,
    details: "High disconnected undercut styling. Back and sides are closely blended to a number 1 guard. The top undergoes razor texturizing to create deep separation and movement. Great for thick hair.",
    likes: 312
  },
  {
    id: "balayage-bob",
    name: "Sovereign Balayage Bob",
    description: "A sharp, chin-length texturized bob featuring lightweight tapered ends. Perfect for highlighting structural cheekbones and long necks.",
    category: "women",
    imageUrl: "https://images.unsplash.com/photo-1595959183075-c1d09e57dad4?auto=format&fit=crop&q=80&w=800",
    price: 85,
    duration: 75,
    details: "A comprehensive design cut utilizing dry texturizing shears. Built to maintain volume without looking heavy. Includes an organic tea-tree cleansing rinse, scalp massage, and a signature flat-iron wave detailing.",
    likes: 420
  },
  {
    id: "pixie-undercut",
    name: "Imperial Pixie Undercut",
    description: "A super-chic, daring short haircut featuring soft textured crops on top and a clean, faded nape. Highlights dynamic facial symmetry.",
    category: "women",
    imageUrl: "https://images.unsplash.com/photo-1605497746445-97d1b0a9ebd2?auto=format&fit=crop&q=80&w=800",
    price: 70,
    duration: 60,
    details: "A customized razor cut that yields soft, touchable piecey bangs. The back is delicately tapered using clipper-over-comb adjustments. Completed with hair mist and dry wax styling.",
    likes: 298
  },
  {
    id: "silk-wavy-layers",
    name: "Siren Silk Layered Waves",
    description: "Cascading modern long layers paired with side-swept fringe styling. Tailored weight extraction optimizes magnificent flow and natural wave bounce.",
    category: "women",
    imageUrl: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=800",
    price: 110,
    duration: 90,
    details: "Full hair service including our ultimate hydration treatment, detailed deep point-cutting to remove split weight, round brush thermal blowout styling, and light setting mist of our premium gold hair elixir.",
    likes: 539
  },
  {
    id: "smart-sidepart",
    name: "Little Champ Smart Side-Part",
    description: "A neat, handsome side-part styled with soft clippers. Perfect for school photo days, weddings, or clean active wear.",
    category: "children",
    imageUrl: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&q=80&w=800",
    price: 30,
    duration: 30,
    details: "A gentle haircut focusing on child comfort. Sides are neatly tapered down to a conservative 3-guard with soft shear work on top. Includes a gentle water rinse and styling using kid-friendly, hypoallergenic pomade.",
    likes: 124
  },
  {
    id: "kid-textured-fringe",
    name: "Active Kid Textured Fringe",
    description: "A low-maintenance yet highly stylish messy crop. Easy to wash, air-dry, and keep out of the eyes during soccer practice.",
    category: "children",
    imageUrl: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&q=80&w=800",
    price: 30,
    duration: 30,
    details: "Crafted specifically to accommodate high activity levels. Features a short crop fringe with blended scissor styling on sides. No heavy styling required – perfect for wash-and-go routines.",
    likes: 142
  },
  {
    id: "mini-diva-braids",
    name: "Mini Princess Soft Styling",
    description: "Splendid shoulder-length styling with soft layers, gentle detangling wash, and protective framing styles.",
    category: "children",
    imageUrl: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=800",
    price: 35,
    duration: 40,
    details: "Includes ultra-gentle detangling, lightweight leave-in conditioning mist, customized shear trimming to eliminate dry ends, and a premium styling braid accent adorned with golden elastic cuffs.",
    likes: 176
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: "rev1",
    customerName: "Marcus Vance",
    rating: 5,
    comment: "The sovereign skin fade is literally the best haircut I've received in years. The hot towel wrap with lavender oil was an absolute masterclass in service. Black and gold aesthetic is premium!",
    haircutId: "sovereign-fade",
    createdAt: "2026-05-20T14:32:00Z"
  },
  {
    id: "rev2",
    customerName: "Clara Reynolds",
    rating: 5,
    comment: "I got the Golden Balayage Bob. The texturing is phenomenal and fits my face layout beautifully. Highly recommend this team!",
    haircutId: "balayage-bob",
    createdAt: "2026-05-24T09:15:00Z"
  },
  {
    id: "rev3",
    customerName: "Liam's Mom",
    rating: 5,
    comment: "Excellent experience with the Little Champ cutout! Extremely patient with my 6 year old boy, and he looks incredibly handsome.",
    haircutId: "smart-sidepart",
    createdAt: "2026-05-25T11:40:00Z"
  }
];

export const INITIAL_BARBERS: Barber[] = [
  {
    id: "gabriel",
    name: "Gabriel 'Aureum' Cruz",
    role: "Master Stylist & Founder",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
    bio: "With over 15 years in luxury hair design, Gabriel blends traditional Italian barber shears with modern texturing mechanics.",
    specialty: "Sovereign Blends & Balayage Styling"
  },
  {
    id: "marcos",
    name: "Marcos King",
    role: "Senior Barber Specialist",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300",
    bio: "Marcos resides on the razor's edge. He specializes in hyper-precision line-ups, structural crops, and beard sculpting.",
    specialty: "High-Contrast skin fades & Beards"
  },
  {
    id: "elena",
    name: "Elena Rostova",
    role: "Junior Styling Coordinator",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300",
    bio: "Patient, detailed, and highly energetic, Elena is the queen of children's styles and custom textured blow-dries.",
    specialty: "Youth Cuts & Soft Waves"
  }
];

// --- DATABASE FETCHERS & OPERATORS WITH SYNC AGENTS ---

// Initialize Haircuts in Firestore if empty
async function ensureHaircutsExist() {
  if (!isFirebaseConfigured || !db) return;
  try {
    const querySnapshot = await getDocs(collection(db, "haircuts"));
    if (querySnapshot.empty) {
      console.log("Firestore haircuts database is empty. Seeding initial catalog...");
      for (const cut of INITIAL_HAIRCUTS) {
        await setDoc(doc(db, "haircuts", cut.id), cut);
      }
    }
  } catch (error) {
    console.error("Error checking or seeding haircuts: ", error);
  }
}

async function getStorageHaircutsForCategory(category: string): Promise<Haircut[]> {
  if (!isFirebaseConfigured || !storage) return [];
  try {
    const folderRef = ref(storage, category);
    const listResult = await listAll(folderRef);
    const items: Haircut[] = [];
    
    for (const itemRef of listResult.items) {
      try {
        const url = await getDownloadURL(itemRef);
        // Use a generic name to avoid displaying file names on the app
        const cleanName = "Exclusive Style";
        
        items.push({
          id: `storage-${category}-${itemRef.name}`,
          name: cleanName,
          description: `Custom style uploaded to our ${category} collection.`,
          category: category as any,
          imageUrl: url,
          price: 45, // default
          duration: 45,
          details: `This is a custom haircut design uploaded directly to the ${category} storage gallery.`,
          likes: 0
        });
      } catch (err) {
        console.error(`Error loading image ${itemRef.name}:`, err);
      }
    }
    return items;
  } catch (error) {
    console.error(`Error listing folder ${category}:`, error);
    return [];
  }
}

// 1. Get Haircuts (Reads Firestore if online, otherwise local, and merges Firebase Storage files)
export async function getHaircuts(): Promise<Haircut[]> {
  let firestoreCuts: Haircut[] = [];
  if (isFirebaseConfigured && db) {
    const path = "haircuts";
    try {
      await ensureHaircutsExist();
      const collRef = collection(db, path);
      const querySnapshot = await getDocs(collRef);
      querySnapshot.forEach((docSnap) => {
        firestoreCuts.push({ id: docSnap.id, ...docSnap.data() } as Haircut);
      });
    } catch (error) {
      console.warn("Failed to fetch haircuts from Firestore:", error);
    }
  } else {
    // Local storage fallback
    const stored = localStorage.getItem("aureum_haircuts");
    if (stored) {
      firestoreCuts = JSON.parse(stored);
    } else {
      firestoreCuts = [...INITIAL_HAIRCUTS];
    }
  }

  // If Firebase and Storage are configured, fetch storage files and combine
  if (isFirebaseConfigured && storage) {
    try {
      const [menStorage, womenStorage, childrenStorage] = await Promise.all([
        getStorageHaircutsForCategory("men"),
        getStorageHaircutsForCategory("women"),
        getStorageHaircutsForCategory("children")
      ]);
      
      const combined = [...firestoreCuts, ...menStorage, ...womenStorage, ...childrenStorage];
      return combined.length > 0 ? combined : INITIAL_HAIRCUTS;
    } catch (e) {
      console.error("Error fetching storage haircuts:", e);
    }
  }

  return firestoreCuts.length > 0 ? firestoreCuts : INITIAL_HAIRCUTS;
}

// Increment likes (Client feature)
export async function likeHaircut(haircutId: string): Promise<void> {
  const cuts = await getHaircuts();
  const updated = cuts.map(c => c.id === haircutId ? { ...c, likes: c.likes + 1 } : c);
  
  if (isFirebaseConfigured && db) {
    const path = `haircuts/${haircutId}`;
    try {
      const cutRef = doc(db, "haircuts", haircutId);
      const target = cuts.find(c => c.id === haircutId);
      if (target) {
        await updateDoc(cutRef, { likes: target.likes + 1 });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  } else {
    localStorage.setItem("aureum_haircuts", JSON.stringify(updated));
  }
}

// 2. Bookings
export async function getBookings(): Promise<Booking[]> {
  if (isFirebaseConfigured && db) {
    const path = "bookings";
    try {
      const collRef = collection(db, path);
      const querySnapshot = await getDocs(collRef);
      const bookings: Booking[] = [];
      querySnapshot.forEach((docSnap) => {
        bookings.push({ id: docSnap.id, ...docSnap.data() } as Booking);
      });
      return bookings;
    } catch (error) {
      return handleFirestoreError(error, OperationType.GET, path);
    }
  } else {
    const stored = localStorage.getItem("aureum_bookings");
    return stored ? JSON.parse(stored) : [];
  }
}

export async function addBooking(inputs: Omit<Booking, "id" | "status" | "createdAt">): Promise<Booking> {
  const newBooking: Booking = {
    ...inputs,
    id: "book_" + Math.random().toString(36).substr(2, 9),
    status: "pending",
    createdAt: new Date().toISOString()
  };

  if (isFirebaseConfigured && db) {
    const path = "bookings";
    try {
      // Must set explicit Doc with custom security ID to fit standard validators
      await setDoc(doc(db, "bookings", newBooking.id), newBooking);
      return newBooking;
    } catch (error) {
      return handleFirestoreError(error, OperationType.WRITE, path);
    }
  } else {
    const current = await getBookings();
    const updated = [newBooking, ...current];
    localStorage.setItem("aureum_bookings", JSON.stringify(updated));
    return newBooking;
  }
}

export async function cancelBooking(bookingId: string): Promise<void> {
  if (isFirebaseConfigured && db) {
    const path = `bookings/${bookingId}`;
    try {
      const docRef = doc(db, "bookings", bookingId);
      await updateDoc(docRef, { status: "cancelled" });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  } else {
    const current = await getBookings();
    const updated = current.map(b => b.id === bookingId ? { ...b, status: "cancelled" as const } : b);
    localStorage.setItem("aureum_bookings", JSON.stringify(updated));
  }
}

// 3. Reviews
export async function getReviews(haircutId?: string): Promise<Review[]> {
  if (isFirebaseConfigured && db) {
    const path = "reviews";
    try {
      const collRef = collection(db, path);
      const querySnapshot = await getDocs(collRef);
      const reviews: Review[] = [];
      querySnapshot.forEach((docSnap) => {
        const item = { id: docSnap.id, ...docSnap.data() } as Review;
        if (!haircutId || item.haircutId === haircutId) {
          reviews.push(item);
        }
      });
      return reviews.length > 0 ? reviews : INITIAL_REVIEWS.filter(r => !haircutId || r.haircutId === haircutId);
    } catch (error) {
      return handleFirestoreError(error, OperationType.GET, path);
    }
  } else {
    const stored = localStorage.getItem("aureum_reviews");
    const list: Review[] = stored ? JSON.parse(stored) : INITIAL_REVIEWS;
    if (!stored) {
      localStorage.setItem("aureum_reviews", JSON.stringify(INITIAL_REVIEWS));
    }
    return haircutId ? list.filter(r => r.haircutId === haircutId) : list;
  }
}

export async function addReview(inputs: Omit<Review, "id" | "createdAt">): Promise<Review> {
  const newReview: Review = {
    ...inputs,
    id: "rev_" + Math.random().toString(36).substr(2, 9),
    createdAt: new Date().toISOString()
  };

  if (isFirebaseConfigured && db) {
    const path = "reviews";
    try {
      await setDoc(doc(db, "reviews", newReview.id), newReview);
      return newReview;
    } catch (error) {
      return handleFirestoreError(error, OperationType.WRITE, path);
    }
  } else {
    const current = await getReviews();
    const updated = [newReview, ...current];
    localStorage.setItem("aureum_reviews", JSON.stringify(updated));
    return newReview;
  }
}
