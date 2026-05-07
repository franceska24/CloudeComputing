import { connectToDB, getCollection } from "@/lib/mongodb";
import bcrypt from "bcryptjs";

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

    return new Response(JSON.stringify({ success: true }), { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Eroare server" }), { status: 500 });
  }
}
