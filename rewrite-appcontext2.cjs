const fs = require('fs');

let content = fs.readFileSync('src/context/AppContext.tsx', 'utf-8');

// Replace addGig
content = content.replace(/const addGig = async \([\s\S]*?\) => {[\s\S]*?\/\/ Create payload\n[\s\S]*?};/g,
`const addGig = async (
    gigData: Omit<
      Gig,
      | "id"
      | "sellerId"
      | "sellerName"
      | "createdAt"
      | "views"
      | "inquiryCount"
      | "rating"
      | "ratingCount"
    >,
  ) => {
    if (!currentUser) return;
    
    try {
      const payload = {
        ...gigData,
        sellerId: currentUser.id,
        sellerName: currentUser.name,
      };

      if (!DATABASE_ID || DATABASE_ID === "melagent_db") {
         const newGig = { ...payload, id: \`g_\${Date.now()}\`, views: 0, inquiryCount: 0, rating: 5, ratingCount: 1, createdAt: new Date().toISOString() };
         setGigs((prev) => [newGig, ...prev]);
         return;
      }

      const doc = await databases.createDocument(
        DATABASE_ID,
        GIGS_COL,
        ID.unique(),
        {
          ...payload,
          views: 0, inquiryCount: 0, rating: 5, ratingCount: 1, createdAt: new Date().toISOString()
        }
      );
      setGigs((prev) => [doc as any, ...prev]);
    } catch (err) {
      console.error("Failed to transmit gig listing to Appwrite:", err);
    }
  };`);

// Delete Gig
content = content.replace(/const deleteGig = async \(gigId: string\) => {[\s\S]*?catch \(err\) {[\s\S]*?}[\s\S]*?};/g,
`const deleteGig = async (gigId: string) => {
    setGigs((prev) => prev.filter((g) => g.id !== gigId && (g as any).$id !== gigId));

    try {
      if (DATABASE_ID !== "melagent_db") {
        await databases.deleteDocument(DATABASE_ID, GIGS_COL, gigId);
      }
    } catch (err) {
      console.error("Error deleting gig in Appwrite:", err);
    }
  };`);
  
// Increment views
content = content.replace(/const incrementViews = async \(gigId: string\) => {[\s\S]*?catch \(err\) {[\s\S]*?}[\s\S]*?};/g,
`const incrementViews = async (gigId: string) => {
    const targetGig = gigs.find(g => g.id === gigId || (g as any).$id === gigId);
    if (!targetGig) return;
    const newViews = targetGig.views + 1;
    
    setGigs((prev) => prev.map((g) => (g.id === gigId || (g as any).$id === gigId ? { ...g, views: newViews } : g)));

    try {
      if (DATABASE_ID !== "melagent_db") {
        await databases.updateDocument(DATABASE_ID, GIGS_COL, gigId, { views: newViews });
      }
    } catch (err) {
      console.error("Error incrementing views Appwrite:", err);
    }
  };`);

fs.writeFileSync('src/context/AppContext.tsx', content);
console.log("Replaced gig calls");
