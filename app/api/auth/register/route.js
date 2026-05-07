import { connectToDB, getCollection } from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/lib/sendEmail"; // <-- adăugat

export async function POST(req) {
  try {
    const { username, email, password } = await req.json();

    await connectToDB();
    const users = await getCollection("records");

    // verificăm dacă există deja user
    const existing = await users.findOne({ email });
    if (existing) {
      return new Response(JSON.stringify({ error: "Email deja folosit" }), { status: 400 });
    }

    // criptăm parola
    const hashedPassword = await bcrypt.hash(password, 10);

    // inserăm userul
    await users.insertOne({
      username,
      email,
      password: hashedPassword,
    });

    // trimitem emailul de bun venit
    await sendEmail(
      email,
      "Bun venit în Task Manager!",
      `<h2>Bine ai venit, ${username}!</h2>
       <p>Contul tău a fost creat cu succes.</p>`
    );

    return new Response(JSON.stringify({ success: true }), { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Eroare server" }), { status: 500 });
  }
}
