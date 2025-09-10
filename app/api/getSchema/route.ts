import { db } from "@/lib/firebaseAdmin";

/**
 * Recursively fetch collections and subcollections
 */
async function getCollectionSchema(collectionRef) {
  const schema = {};
  const snapshot = await collectionRef.limit(10).get(); // limit to 10 docs to avoid huge reads

  for (const doc of snapshot.docs) {
    schema[doc.id] = Object.keys(doc.data());

    // List subcollections
    const subcollections = await doc.ref.listCollections();
    if (subcollections.length > 0) {
      schema[doc.id + "_subcollections"] = {};
      for (const subCol of subcollections) {
        schema[doc.id + "_subcollections"][subCol.id] = await getCollectionSchema(subCol);
      }
    }
  }

  return schema;
}

export async function GET(req) {
  try {
    const rootCollections = await db.listCollections();
    const fullSchema = {};

    for (const col of rootCollections) {
      fullSchema[col.id] = await getCollectionSchema(col);
    }

    return new Response(JSON.stringify(fullSchema, null, 2), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
