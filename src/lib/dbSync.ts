import { db, isFirebaseSupported, handleFirestoreError, OperationType } from '../firebase';
import { collection, doc, onSnapshot, setDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { Product, SocialPost, DailyTask, DonationStats, UserProfile, ImpactCampaign } from '../types';
import { STORE_PRODUCTS, REWARDS_PRODUCTS, INITIAL_POSTS, INITIAL_TASKS, HERO_CAMPAIGNS } from '../data/products';

// Helper to handle local storage fallback
const getLocal = <T>(key: string, backup: T): T => {
  const data = localStorage.getItem(key);
  if (!data) return backup;
  try {
    return JSON.parse(data) as T;
  } catch {
    return backup;
  }
};

const setLocal = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

// --- Profile Sync ---
export function syncUserProfile(
  userId: string, 
  initialProfile: UserProfile, 
  onUpdate: (profile: UserProfile) => void
) {
  if (isFirebaseSupported && db) {
    const docRef = doc(db, 'users', userId);
    return onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        onUpdate(snapshot.data() as UserProfile);
      } else {
        // Document doesn't exist, create it with initial profile
        setDoc(docRef, initialProfile)
          .then(() => onUpdate(initialProfile))
          .catch((err) => handleFirestoreError(err, OperationType.WRITE, `users/${userId}`));
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `users/${userId}`);
    });
  } else {
    // LocalStorage Fallback
    const localProfile = getLocal(`profile_${userId}`, initialProfile);
    onUpdate(localProfile);
    return () => {};
  }
}

export function saveUserProfile(userId: string, profile: UserProfile) {
  if (isFirebaseSupported && db) {
    const docRef = doc(db, 'users', userId);
    setDoc(docRef, profile).catch((err) => 
      handleFirestoreError(err, OperationType.WRITE, `users/${userId}`)
    );
  } else {
    setLocal(`profile_${userId}`, profile);
  }
}

// --- Store Products Sync ---
export function syncProducts(onUpdate: (storeProds: Product[], rewardsProds: Product[]) => void) {
  if (isFirebaseSupported && db) {
    const collRef = collection(db, 'products');
    return onSnapshot(collRef, (snapshot) => {
      const allProducts: Product[] = [];
      snapshot.forEach((doc) => {
        allProducts.push({ ...doc.data(), id: doc.id } as Product);
      });

      if (allProducts.length === 0) {
        // Hydrate empty database with standard initial catalog items
        const initialCombined = [...STORE_PRODUCTS, ...REWARDS_PRODUCTS];
        initialCombined.forEach((prod) => {
          setDoc(doc(db!, 'products', prod.id), prod).catch((err) =>
            handleFirestoreError(err, OperationType.WRITE, `products/${prod.id}`)
          );
        });
        onUpdate(STORE_PRODUCTS, REWARDS_PRODUCTS);
      } else {
        const store = allProducts.filter(p => !p.isRewardOnly);
        const rewards = allProducts.filter(p => p.isRewardOnly || p.pointsPrice !== undefined);
        onUpdate(store, rewards);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'products');
    });
  } else {
    const localStore = getLocal('products_store', STORE_PRODUCTS);
    const localRewards = getLocal('products_rewards', REWARDS_PRODUCTS);
    onUpdate(localStore, localRewards);
    return () => {};
  }
}

export function saveProduct(product: Product) {
  if (isFirebaseSupported && db) {
    const docRef = doc(db, 'products', product.id);
    setDoc(docRef, product).catch((err) => 
      handleFirestoreError(err, OperationType.WRITE, `products/${product.id}`)
    );
  } else {
    const isReward = product.isRewardOnly || product.pointsPrice !== undefined;
    const key = isReward ? 'products_rewards' : 'products_store';
    const current = getLocal<Product[]>(key, isReward ? REWARDS_PRODUCTS : STORE_PRODUCTS);
    const updated = current.some(p => p.id === product.id)
      ? current.map(p => p.id === product.id ? product : p)
      : [...current, product];
    setLocal(key, updated);
  }
}

export function deleteProduct(productId: string) {
  if (isFirebaseSupported && db) {
    const docRef = doc(db, 'products', productId);
    deleteDoc(docRef).catch((err) => 
      handleFirestoreError(err, OperationType.DELETE, `products/${productId}`)
    );
  } else {
    const currentStore = getLocal<Product[]>('products_store', STORE_PRODUCTS);
    const currentRewards = getLocal<Product[]>('products_rewards', REWARDS_PRODUCTS);
    setLocal('products_store', currentStore.filter(p => p.id !== productId));
    setLocal('products_rewards', currentRewards.filter(p => p.id !== productId));
  }
}

// --- Social Posts Sync ---
export function syncPosts(onUpdate: (posts: SocialPost[]) => void) {
  if (isFirebaseSupported && db) {
    const collRef = collection(db, 'posts');
    const q = query(collRef, orderBy('id', 'desc')); // Keep posts descending chronologically
    return onSnapshot(q, (snapshot) => {
      const postsList: SocialPost[] = [];
      snapshot.forEach((doc) => {
        postsList.push({ ...doc.data(), id: doc.id } as SocialPost);
      });

      if (postsList.length === 0) {
        INITIAL_POSTS.forEach((post) => {
          setDoc(doc(db!, 'posts', post.id), post).catch((err) =>
            handleFirestoreError(err, OperationType.WRITE, `posts/${post.id}`)
          );
        });
        onUpdate(INITIAL_POSTS);
      } else {
        onUpdate(postsList);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'posts');
    });
  } else {
    const localPosts = getLocal('social_posts', INITIAL_POSTS);
    onUpdate(localPosts);
    return () => {};
  }
}

export function savePost(post: SocialPost) {
  if (isFirebaseSupported && db) {
    const docRef = doc(db, 'posts', post.id);
    setDoc(docRef, post).catch((err) => 
      handleFirestoreError(err, OperationType.WRITE, `posts/${post.id}`)
    );
  } else {
    const current = getLocal<SocialPost[]>('social_posts', INITIAL_POSTS);
    const updated = current.some(p => p.id === post.id)
      ? current.map(p => p.id === post.id ? post : p)
      : [post, ...current];
    setLocal('social_posts', updated);
  }
}

export function deletePost(postId: string) {
  if (isFirebaseSupported && db) {
    const docRef = doc(db, 'posts', postId);
    deleteDoc(docRef).catch((err) => 
      handleFirestoreError(err, OperationType.DELETE, `posts/${postId}`)
    );
  } else {
    const current = getLocal<SocialPost[]>('social_posts', INITIAL_POSTS);
    setLocal('social_posts', current.filter(p => p.id !== postId));
  }
}

// --- Impact Campaigns Sync ---
export function syncCampaigns(onUpdate: (campaigns: ImpactCampaign[]) => void) {
  if (isFirebaseSupported && db) {
    const collRef = collection(db, 'campaigns');
    return onSnapshot(collRef, (snapshot) => {
      const list: ImpactCampaign[] = [];
      snapshot.forEach((doc) => {
        list.push({ ...doc.data(), id: doc.id } as ImpactCampaign);
      });

      if (list.length === 0) {
        HERO_CAMPAIGNS.forEach((camp) => {
          setDoc(doc(db!, 'campaigns', camp.id), camp).catch((err) =>
            handleFirestoreError(err, OperationType.WRITE, `campaigns/${camp.id}`)
          );
        });
        onUpdate(HERO_CAMPAIGNS);
      } else {
        onUpdate(list);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'campaigns');
    });
  } else {
    const localCamps = getLocal('impact_campaigns', HERO_CAMPAIGNS);
    onUpdate(localCamps);
    return () => {};
  }
}

export function saveCampaign(campaign: ImpactCampaign) {
  if (isFirebaseSupported && db) {
    const docRef = doc(db, 'campaigns', campaign.id);
    setDoc(docRef, campaign).catch((err) => 
      handleFirestoreError(err, OperationType.WRITE, `campaigns/${campaign.id}`)
    );
  } else {
    const current = getLocal<ImpactCampaign[]>('impact_campaigns', HERO_CAMPAIGNS);
    const updated = current.some(c => c.id === campaign.id)
      ? current.map(c => c.id === campaign.id ? campaign : c)
      : [...current, campaign];
    setLocal('impact_campaigns', updated);
  }
}

export function deleteCampaign(campaignId: string) {
  if (isFirebaseSupported && db) {
    const docRef = doc(db, 'campaigns', campaignId);
    deleteDoc(docRef).catch((err) => 
      handleFirestoreError(err, OperationType.DELETE, `campaigns/${campaignId}`)
    );
  } else {
    const current = getLocal<ImpactCampaign[]>('impact_campaigns', HERO_CAMPAIGNS);
    setLocal('impact_campaigns', current.filter(c => c.id !== campaignId));
  }
}

// --- Tasks Checklist Sync ---
export function syncTasks(onUpdate: (tasks: DailyTask[]) => void) {
  if (isFirebaseSupported && db) {
    const collRef = collection(db, 'tasks');
    return onSnapshot(collRef, (snapshot) => {
      const list: DailyTask[] = [];
      snapshot.forEach((doc) => {
        list.push({ ...doc.data(), id: doc.id } as DailyTask);
      });

      if (list.length === 0) {
        INITIAL_TASKS.forEach((task) => {
          setDoc(doc(db!, 'tasks', task.id), task).catch((err) =>
            handleFirestoreError(err, OperationType.WRITE, `tasks/${task.id}`)
          );
        });
        onUpdate(INITIAL_TASKS);
      } else {
        onUpdate(list);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'tasks');
    });
  } else {
    const localTasks = getLocal('daily_tasks', INITIAL_TASKS);
    onUpdate(localTasks);
    return () => {};
  }
}

export function saveTask(task: DailyTask) {
  if (isFirebaseSupported && db) {
    const docRef = doc(db, 'tasks', task.id);
    setDoc(docRef, task).catch((err) => 
      handleFirestoreError(err, OperationType.WRITE, `tasks/${task.id}`)
    );
  } else {
    const current = getLocal<DailyTask[]>('daily_tasks', INITIAL_TASKS);
    const updated = current.map(t => t.id === task.id ? task : t);
    setLocal('daily_tasks', updated);
  }
}

// --- Donation Stats Sync ---
export function syncDonationStats(onUpdate: (stats: DonationStats) => void) {
  const defaultStats: DonationStats = {
    totalDonated: 14821,
    familiesSupported: 3705,
    activeCampaigns: 3,
    pointsDistributed: 12560
  };

  if (isFirebaseSupported && db) {
    const docRef = doc(db, 'stats', 'donations');
    return onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        onUpdate(snapshot.data() as DonationStats);
      } else {
        setDoc(docRef, defaultStats)
          .then(() => onUpdate(defaultStats))
          .catch((err) => handleFirestoreError(err, OperationType.WRITE, 'stats/donations'));
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'stats/donations');
    });
  } else {
    const localStats = getLocal('donation_stats', defaultStats);
    onUpdate(localStats);
    return () => {};
  }
}

export function saveDonationStats(stats: DonationStats) {
  if (isFirebaseSupported && db) {
    const docRef = doc(db, 'stats', 'donations');
    setDoc(docRef, stats).catch((err) => 
      handleFirestoreError(err, OperationType.WRITE, 'stats/donations')
    );
  } else {
    setLocal('donation_stats', stats);
  }
}
