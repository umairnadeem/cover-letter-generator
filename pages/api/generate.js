import { Configuration, OpenAIApi } from "openai";
import ResumeParser from "resume-parser-extended";
import {fromBufferWithMime} from "textract";
import {sanitizeString} from "../../common/utils"

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const prompt = String(req.body.prompt) || '';
  const resume = String(req.body.resume) || '';
  if (prompt.trim().length === 0 || resume.length < 1) {
    res.status(400).json({
      error: {
        message: "Please enter a valid prompt and resume",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: await generatePrompt(prompt, resume),
      temperature: 0.6,
      max_tokens: 500,
      // presence_penalty: 1,
      // frequency_penalty: 1
    });
    console.log("Got result", JSON.stringify(completion.data, null, 2))
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(error);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

async function generatePrompt(prompt, resume) {
  const sanitizedPrompt = sanitizeString(prompt);
  return new Promise((resolve, reject) => {
    const [type, base64File] = resume.split(";base64,");
    const buffer = Buffer.from(base64File, "base64");
    fromBufferWithMime(type.split(":")[1], buffer, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(`Write a short cover letter for a ${sanitizedPrompt} role with the following resume: "${data}"`);
    });
  });
}
