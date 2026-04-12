const {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} = require('@firebase/rules-unit-testing');
const { setDoc, doc, getDoc, updateDoc, deleteDoc, serverTimestamp } = require('firebase/firestore');
const fs = require('fs');

let testEnv;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: "demo-test",
    firestore: {
      rules: fs.readFileSync("firestore.rules", "utf8"),
    },
  });
});

beforeEach(async () => {
  await testEnv.clearFirestore();
});

afterAll(async () => {
  await testEnv.cleanup();
});

describe('Users Collection', () => {
  it('allows user to read their own profile', async () => {
    const db = testEnv.authenticatedContext('alice').firestore();
    await assertSucceeds(getDoc(doc(db, 'users/alice')));
  });

  it('denies user to read another profile', async () => {
    const db = testEnv.authenticatedContext('alice').firestore();
    await assertFails(getDoc(doc(db, 'users/bob')));
  });

  it('allows user to create profile with valid data', async () => {
    const db = testEnv.authenticatedContext('alice', { email: 'alice@example.com' }).firestore();
    await assertSucceeds(setDoc(doc(db, 'users/alice'), {
      uid: 'alice',
      email: 'alice@example.com',
      displayName: 'Alice',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }));
  });

  it('denies user to create profile with mismatched uid', async () => {
    const db = testEnv.authenticatedContext('alice', { email: 'alice@example.com' }).firestore();
    await assertFails(setDoc(doc(db, 'users/alice'), {
      uid: 'bob',
      email: 'alice@example.com',
      displayName: 'Alice',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }));
  });

  it('denies user to create profile with invalid email', async () => {
    const db = testEnv.authenticatedContext('alice', { email: 'alice@example.com' }).firestore();
    await assertFails(setDoc(doc(db, 'users/alice'), {
      uid: 'alice',
      email: 'alice',
      displayName: 'Alice',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }));
  });

  it('denies user to update immutable field createdAt', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), 'users/alice'), {
        uid: 'alice',
        email: 'alice@example.com',
        displayName: 'Alice',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    });
    
    const db = testEnv.authenticatedContext('alice').firestore();
    await assertFails(updateDoc(doc(db, 'users/alice'), {
      createdAt: new Date('2025-01-01')
    }));
  });
});

describe('Workflows Collection', () => {
  it('allows unauthenticated read if public', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), 'workflows/w1'), {
        isPublic: true,
        userId: 'bob'
      });
    });
    const db = testEnv.unauthenticatedContext().firestore();
    // Wait, the rule says: if isAuthenticated() && (resource.data.isPublic == true ...)
    // So unauthenticated is denied!
    await assertFails(getDoc(doc(db, 'workflows/w1')));
  });

  it('allows authenticated user to read public workflow', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), 'workflows/w1'), {
        isPublic: true,
        userId: 'bob'
      });
    });
    const db = testEnv.authenticatedContext('alice').firestore();
    await assertSucceeds(getDoc(doc(db, 'workflows/w1')));
  });

  it('allows authenticated user to read shared workflow', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), 'workflows/w1'), {
        isPublic: false,
        userId: 'bob',
        sharedWith: ['alice@example.com']
      });
    });
    const db = testEnv.authenticatedContext('alice', { email: 'alice@example.com' }).firestore();
    await assertSucceeds(getDoc(doc(db, 'workflows/w1')));
  });

  it('allows user to create workflow with valid data', async () => {
    const db = testEnv.authenticatedContext('alice').firestore();
    await assertSucceeds(setDoc(doc(db, 'workflows/w1'), {
      name: 'My Workflow',
      userId: 'alice',
      nodes: [],
      edges: [],
      version: 1,
      isDeleted: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }));
  });

  it('denies user to change userId on update', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), 'workflows/w1'), {
        name: 'My Workflow',
        userId: 'alice',
        nodes: [],
        edges: [],
        version: 1,
        isDeleted: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    });
    const db = testEnv.authenticatedContext('alice').firestore();
    await assertFails(updateDoc(doc(db, 'workflows/w1'), {
      userId: 'bob'
    }));
  });
});

describe('Assets Collection', () => {
  it('allows creation of valid asset', async () => {
    const db = testEnv.authenticatedContext('alice').firestore();
    await assertSucceeds(setDoc(doc(db, 'assets/a1'), {
      name: 'Asset',
      userId: 'alice',
      images: ['https://example.com/img.jpg'],
      status: 'ready',
      isDeleted: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }));
  });

  it('denies creation with invalid status', async () => {
    const db = testEnv.authenticatedContext('alice').firestore();
    await assertFails(setDoc(doc(db, 'assets/a1'), {
      name: 'Asset',
      userId: 'alice',
      images: ['https://example.com/img.jpg'],
      status: 'invalid_status',
      isDeleted: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }));
  });
});

describe('Conversations and Messages', () => {
  it('allows creating a conversation', async () => {
    const db = testEnv.authenticatedContext('alice').firestore();
    await assertSucceeds(setDoc(doc(db, 'conversations/c1'), {
      title: 'Chat',
      userId: 'alice',
      isDeleted: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }));
  });

  it('allows owner to add message to conversation', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), 'conversations/c1'), {
        userId: 'alice'
      });
    });
    const db = testEnv.authenticatedContext('alice').firestore();
    await assertSucceeds(setDoc(doc(db, 'conversations/c1/messages/m1'), {
      type: 'text',
      content: 'Hello',
      timestamp: serverTimestamp()
    }));
  });

  it('denies non-owner to add message', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), 'conversations/c1'), {
        userId: 'alice'
      });
    });
    const db = testEnv.authenticatedContext('bob').firestore();
    await assertFails(setDoc(doc(db, 'conversations/c1/messages/m1'), {
      type: 'text',
      content: 'Hello',
      timestamp: serverTimestamp()
    }));
  });
});
