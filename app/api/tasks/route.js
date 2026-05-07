import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { sendEmail } from "@/lib/sendEmail";


export async function GET() {
  const session = await getServerSession();
  const tasks = await getCollection("tasks");

  const all = await tasks.find({ userEmail: session.user.email }).toArray();
  return NextResponse.json(all);
}


export async function POST(request) {
  const session = await getServerSession();
  const body = await request.json();
  const tasks = await getCollection("tasks");

  const newTask = {
    ...body,
    userEmail: session.user.email,
    createdAt: new Date(),
  };

  const { insertedId } = await tasks.insertOne(newTask);

  
  await sendEmail({
    to: session.user.email,
    subject: "Task nou adăugat",
    text: `Ai adăugat taskul: ${body.title}`,
  });

  return NextResponse.json({ _id: insertedId, ...newTask }, { status: 201 });
}


export async function DELETE(request) {
  const { id } = await request.json();
  const { ObjectId } = await import("mongodb");
  const tasks = await getCollection("tasks");

  await tasks.deleteOne({ _id: new ObjectId(id) });
  return NextResponse.json({ success: true });
}


export async function PUT(request) {
  const { id, completed } = await request.json();
  const { ObjectId } = await import("mongodb");
  const tasks = await getCollection("tasks");

  const result = await tasks.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { completed } },
    { returnDocument: "after" }
  );

  return NextResponse.json(result.value);
}
