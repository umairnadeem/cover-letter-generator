import OpenAI from "openai";
import ResumeParser from "resume-parser-extended";
import { fromBufferWithMime } from "textract";
import { sanitizeString } from "../../common/utils";

const configuration = {
  apiKey: process.env.OPENAI_API_KEY,
};

const openai = new OpenAI(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }

  const role = String(req.body.role || "");
  const description = String(req.body.description || "");
  const resume = String(req.body.resume || "");
  if (role.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid role",
      },
    });
    return;
  }
  if (description.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid description",
      },
    });
    return;
  }
  if (resume.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid resume",
      },
    });
    return;
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: await generatePrompt(role, description, resume),
        },
      ],
      // temperature: 0.6,
      // max_tokens: 500,
      // presence_penalty: 1,
      // frequency_penalty: 1
    });
    console.log("Got result", JSON.stringify(completion, null, 2));
    res.status(200).json({ result: completion.choices[0].message.content });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(error);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
}

async function generatePrompt(role, description, resume) {
  const sanitizedRole = sanitizeString(role);
  const sanitizedDescription = sanitizeString(description);

  return new Promise((resolve, reject) => {
    const [type, base64File] = resume.split(";base64,");
    const buffer = Buffer.from(base64File, "base64");
    fromBufferWithMime(type.split(":")[1], buffer, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(
        `Write a short cover letter for a ${sanitizedRole} role with the following resume: "${data}".
        Tailor it to the following job description: "${sanitizedDescription}"`
      );
      // resolve(`Convert the resume into JSON: ${data}`);
    });
  });
}
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};
