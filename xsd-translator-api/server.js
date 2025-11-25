import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/transform-with-xsd", async (req, res) => {
  try {
    const { inputXml, inputXsd } = req.body;

    if (!inputXml || !inputXsd) {
      return res.status(400).json({ error: "XML and XSD required" });
    }

    const prompt = `
You are an XML transformation engine.

Task:
1. Read the input XML.
2. Read the XSD (target structure).
3. Transform the XML so that it strictly follows the tag names and hierarchy defined in the XSD.
4. Preserve the XML values from the input XML.
5. Output ONLY the transformed XML.

INPUT XML:
${inputXml}

TARGET XSD:
${inputXsd}

Now generate the final transformed XML:
`;

    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: prompt,
    });

    const output = response.output_text;

    res.json({ transformedXml: output });
  } catch (error) {
    console.error("XSD Transform Error:", error);
    res.status(500).json({ error: "Transformation failed" });
  }
});

app.post("/transform-using-oas", async (req, res) => {
  try {
    const { inputXml, oasSpec } = req.body;

    if (!inputXml || !oasSpec) {
      return res.status(400).json({ error: "XML and OAS spec required" });
    }

    const prompt = `
You are an XML transformer using an OpenAPI (OAS) spec.

Task:
1. Read the input XML.
2. Read the OAS spec and locate the schema inside components.schemas (the XML structure definitions).
3. Transform the input XML so that its structure matches the XML definition in the OAS spec.
4. Use the XML tag names defined in the OAS schema.
5. Preserve the values from the input XML.
6. Output ONLY the transformed XML.

INPUT XML:
${inputXml}

OAS SPEC:
${oasSpec}

Generate the transformed XML now:
`;

    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: prompt,
    });

    const output = response.output_text;

    res.json({ transformedXml: output });
  } catch (error) {
    console.error("OAS Transform Error:", error);
    res.status(500).json({ error: "OAS Transformation failed" });
  }
});

app.listen(5000, () => {
  console.log("Server running on Port 5000");
});
