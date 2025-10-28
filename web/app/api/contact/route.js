// app/api/contact/route.js
import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer'; // 1. Import Nodemailer

// 2. Configure Nodemailer Transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  debug: true, // Enable debug output
  logger: true // Log to console
});

export async function POST(request) {
  let dbClient;
  try {
    // --- Database Operations ---
    dbClient = await clientPromise;
    const db = dbClient.db(process.env.MONGODB_DB);
    const collection = db.collection('contacts');

    const formData = await request.json();

    if (!formData.email) {
      return NextResponse.json({ message: 'Email is required.' }, { status: 400 });
    }

    const existingContact = await collection.findOne({
      email: formData.email,
      state: 'not_replied'
    });

    if (existingContact) {
      return NextResponse.json(
        { message: 'Request already pending.' },
        { status: 409 }
      );
    }

    const documentToInsert = {
      ...formData,
      state: 'not_replied',
      submittedAt: new Date(),
    };

    const dbResult = await collection.insertOne(documentToInsert);

    // --- Email Sending ---
    // Check if SMTP is configured and DB insert was successful
    if (process.env.SMTP_HOST && dbResult.insertedId) {
      const mailOptions = {
        from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`, // Sender address
        to: formData.email, // List of receivers
        subject: "We've Received Your Request - Markdown", // Subject line
        html: `
          <html><body>
            <h1>Hi ${formData.firstName || 'there'},</h1>
            <p>Thank you for contacting Markdown sales!</p>
            <p>We have received your request and will get back to you soon via phone (${formData.phone || 'N/A'}) or email (${formData.email}).</p>
            <p>Best regards,<br/>The Markdown Team</p>
          </body></html>
        `, // HTML body
      };

      try {
        // 3. Send mail with defined transport object
        await transporter.sendMail(mailOptions);
        console.log('Confirmation email sent successfully via SMTP to:', formData.email);
      } catch (emailError) {
        console.error('Nodemailer Error:', emailError);
        // Log email error but don't fail the whole request
      }
    } else if (!process.env.SMTP_HOST) {
        console.warn("SMTP host not configured. Skipping email sending.");
    }

    // --- Send Final Response ---
    return NextResponse.json(
      { message: 'Submission successful!', insertedId: dbResult.insertedId },
      { status: 201 }
    );

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { message: 'Failed to submit data.', error: error.message },
      { status: 500 }
    );
  }
}