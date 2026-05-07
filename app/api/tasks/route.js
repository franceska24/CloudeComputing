import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';

// GET – ia toate task-urile
export async function GET() {
  const tasks = await getCollection('tasks');
  const all = await tasks.find({}).toArray();
  return NextResponse.json(all);
}

// POST – adaugă un task nou
export async function POST(request) {
  const body = await request.json();
  const tasks = await getCollection('tasks');
  const { insertedId } = await tasks.insertOne(body);
  return NextResponse.json({ _id: insertedId, ...body }, { status: 201 });
}

// DELETE – șterge un task
export async function DELETE(request) {
  const { id } = await request.json();
  const { ObjectId } = await import('mongodb');
  const tasks = await getCollection('tasks');
  await tasks.deleteOne({ _id: new ObjectId(id) });
  return NextResponse.json({ success: true });
}

// PUT – actualizează un task (ex: completed true/false)
export async function PUT(request) {
  const { id, completed } = await request.json();
  const { ObjectId } = await import('mongodb');
  const tasks = await getCollection('tasks');

  const result = await tasks.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { completed } },
    { returnDocument: 'after' }
  );

  // AICI era problema — trebuie returnat DOAR result.value
  return NextResponse.json(result.value);
}
