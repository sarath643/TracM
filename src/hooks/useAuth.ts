import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '@/firebase/config';
import { doc, getDoc } from 'firebase/firestore';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isProfileComplete, setIsProfileComplete] = useState<boolean>(false); // Profile completeness

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch user document from Firestore
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setIsProfileComplete(userData.isProfileComplete || false);
        } else {
          setIsProfileComplete(false); // No Firestore data means profile is incomplete
        }

        setUser(user);
      } else {
        setUser(null);
        setIsProfileComplete(false);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { user, loading, isProfileComplete };
};
