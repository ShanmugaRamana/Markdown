// app/api/contact/route.js
import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const collection = db.collection('contacts');

    // 1. Get data from request body
    const formData = await request.json();

    // Ensure email is provided for the check
    if (!formData.email) {
      return NextResponse.json({ message: 'Email is required.' }, { status: 400 });
    }

    // 2. Check for existing contact with 'not_replied' state
    const existingContact = await collection.findOne({
      email: formData.email,
      state: 'not_replied'
    });

    if (existingContact) {
      // 3. If found, return a conflict response
      return NextResponse.json(
        { message: 'Request already pending.' },
        { status: 409 } // 409 Conflict
      );
    }

    // 4. If not found (or state is different), proceed with insertion
    const documentToInsert = {
      ...formData,
      state: 'not_replied',
      submittedAt: new Date(),
    };

    const result = await collection.insertOne(documentToInsert);

    // 5. Send success response
    return NextResponse.json(
      { message: 'Submission successful!', insertedId: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error('API Error:', error);
    // 6. Send general error response
    return NextResponse.json(
      { message: 'Failed to submit data.', error: error.message },
      { status: 500 }
    );
  }
}