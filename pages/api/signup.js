import { hash } from "bcryptjs";
import { v4 } from "uuid";
import { DATABASE_URL } from "..";

const signup = async function (request, response) {
  const newUser = request.body;

  const userId = v4();
  const encryptedPassword = await hash(newUser.password, 12);

  try {
    const usernamesResponse = await fetch(`${DATABASE_URL}/usernames.json`);
    const emailsResponse = await fetch(`${DATABASE_URL}/emails.json`);

    const usernames = await usernamesResponse.json();
    const emails = await emailsResponse.json();

    const usernamesArray = Object.values(usernames);
    const emailsArray = Object.values(emails);

    if (
      usernamesArray.some(
        (usernameObject) => usernameObject.userName === newUser.userName
      )
    )
      throw new Error("user name is already taken");

    if (emailsArray.some((emailObject) => emailObject.email === newUser.email))
      throw new Error("email is already taken");

    const response1 = await fetch(
      `${DATABASE_URL}/users/authenticationCredentials.json`,
      {
        method: "POST",
        body: JSON.stringify({
          userId,
          ...request.body,
          password: encryptedPassword,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const response2 = await fetch(`${DATABASE_URL}/usernames.json`, {
      method: "POST",
      body: JSON.stringify({
        userName: newUser.userName,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const response3 = await fetch(`${DATABASE_URL}/emails.json`, {
      method: "POST",
      body: JSON.stringify({
        email: newUser.email,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response1.ok || !response2.ok || !response3.ok)
      throw new Error("Something Went Wrong.. ");
    else
      response
        .status(200)
        .json({ message: "signed up successfully ", error: false });
  } catch (error) {
    response.status(200).json({
      message: "sign up was not successfull because " + error.message,
      error: true,
    });
  }
};

export default signup;
