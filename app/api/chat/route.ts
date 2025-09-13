import { db, rtdb } from "@/lib/firebaseAdmin";

export async function POST(req: Request) {
  // --- handle CORS preflight ---
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  const body = await req.json();
  const { query } = body;

  // -----------------------------
  // 1️⃣ Get all Firestore data
  // -----------------------------
  const collections = await db.listCollections();
  const allData: Record<string, any> = {};

  for (const col of collections) {
    const snapshot = await col.get();
    allData[col.id] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  // -----------------------------
  // 2️⃣ Get attendance data from RTDB
  // -----------------------------
  const attendanceSnapshot = await rtdb.ref("/attendance").once("value");
  const attendanceData = attendanceSnapshot.val();
  allData["attendance"] = attendanceData;

  // -----------------------------
  // 3️⃣ Prepare prompt for Gemini
  // -----------------------------
  const systemPrompt = `
You are an assistant with access to the following database:
${JSON.stringify(allData, null, 2)}

User question: ${query}

Please answer the question using the database above.
`;

  // -----------------------------
  // 4️⃣ Call Gemini API
  // -----------------------------
  const geminiResp = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GEMINI_KEY!,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: systemPrompt }] }],
      }),
    }
  );

  const data = await geminiResp.json();
  const answer = data.candidates?.[0]?.content?.parts?.[0]?.text || "No answer";

  return new Response(JSON.stringify({ answer }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",         // 👈 added here
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
