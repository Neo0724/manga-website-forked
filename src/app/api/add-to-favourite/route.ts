"use server";

import { PushOperator } from "mongodb";
import { ObjectId } from "mongodb";
import { client } from "../mongodbClient";
import { revalidateTag } from "next/cache";

export async function PUT(req: Request) {
  try {
    // Extract userId and mangaId from request body
    const data = await req.json();
    const { userId, mangaId, tag } = data;

    // Revalidate the cached favourite
    revalidateTag(tag);

    // Wait for connection
    await client.connect();

    // Select 'users' database
    const db = client.db("MangaWebsite").collection("users");

    // Convert the current userId to the userId type that mongodb supports
    const o_userId = new ObjectId(userId);

    // Query to get the user with the current userId
    const user = await db.findOne({ _id: o_userId });

    // User does not exists
    if (!user) {
      return Response.json(
        { status: "Error", message: "User does not exists" },
        { status: 404 }
      );
    } else {
      // Update the current user favourited manga's array
      await db.updateOne(
        { _id: o_userId },
        {
          $push: { favourites: mangaId } as PushOperator<Document>,
        }
      );

      // Return success message
      return Response.json({
        status: "Success",
        message: "Successfully added to favourite",
      });
    }
  } catch (error) {
    console.log(error);
    return Response.json(
      { status: "Fail", message: "Internal server error" },
      { status: 500 }
    );
  } finally {
    // Close the client
    await client.close();
  }
}
