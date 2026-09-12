import "server-only"

import type { Answers, Category } from "@/lib/types"
import { CATEGORY_META } from "@/lib/types"

export const STORY_MODEL = "gpt-5.6-luna"
export const VISION_IMAGE_MODEL = "gpt-image-2.5-flare"
export const VISION_PROMPT_MODEL = STORY_MODEL

const OPENAI_API = "https://api.openai.com/v1"

function getOpenAIKey() {
  const key = process.env.OPENAI_API_KEY?.trim()
  if (!key) {
    throw new Error(
      "The AI engines need fuel — add OPENAI_API_KEY to .env.local, then restart the hangar."
    )
  }
  return key
}

async function openaiFetch<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${OPENAI_API}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getOpenAIKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })

  const payload = (await response.json()) as T & {
    error?: { message?: string; code?: string }
  }

  if (!response.ok) {
    const message = payload.error?.message ?? "OpenAI request failed."
    if (message.toLowerCase().includes("organization verification")) {
      throw new Error(
        "Image engines are gated until OpenAI org verification is done in the API dashboard."
      )
    }
    if (response.status === 401) {
      throw new Error("That OpenAI key was refused. Check OPENAI_API_KEY.")
    }
    throw new Error(message)
  }

  return payload
}

type ResponsesPayload = {
  output_text?: string
  output?: Array<{
    type?: string
    content?: Array<{ type?: string; text?: string }>
  }>
}

function extractOutputText(payload: ResponsesPayload) {
  if (payload.output_text?.trim()) return payload.output_text.trim()
  const chunks: string[] = []
  for (const item of payload.output ?? []) {
    for (const part of item.content ?? []) {
      if (part.text) chunks.push(part.text)
    }
  }
  const text = chunks.join("\n").trim()
  if (!text) throw new Error("The model came back silent. Try again.")
  return text
}

function parseJsonObject<T>(text: string): T {
  const trimmed = text.trim()
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/)
  const raw = fenced?.[1]?.trim() ?? trimmed
  return JSON.parse(raw) as T
}

function briefForPilot(name: string, answers: Answers, category: Category) {
  const meta = CATEGORY_META[category]
  return [
    `Name: ${name}`,
    `Callsign: ${meta.label} — ${meta.blurb}`,
    `Hope: ${answers.hope || "unnamed, but present"}`,
    `Stuck: ${answers.stuck || "a chapter that will not turn"}`,
    `Becoming: ${answers.becoming || "someone who recognizes themselves"}`,
    `Nature place: ${answers.naturePlace || "open sky"}`,
    `Season word: ${answers.seasonWord || "becoming"}`,
  ].join("\n")
}

export async function generateStoryWithLuna(
  name: string,
  answers: Answers,
  category: Category
): Promise<{ title: string; body: string; model: string }> {
  const payload = await openaiFetch<ResponsesPayload>("/responses", {
    model: STORY_MODEL,
    reasoning: { effort: "low" },
    input: [
      {
        role: "system",
        content:
          "You write short literary life stories for Fable. Voice: intimate, specific, hopeful without syrup. No therapy-speak, no corporate pep, no em dashes. Use the person's words as raw material, not as a checklist. 5–8 short paragraphs. End without a sign-off.",
      },
      {
        role: "user",
        content: `Write this pilot's chapter.\n\n${briefForPilot(name, answers, category)}`,
      },
    ],
    text: {
      format: {
        type: "json_schema",
        name: "fable_story",
        strict: true,
        schema: {
          type: "object",
          properties: {
            title: {
              type: "string",
              description: "A short, punchy title. No quotes.",
            },
            body: {
              type: "string",
              description: "The full story, paragraphs separated by blank lines.",
            },
          },
          required: ["title", "body"],
          additionalProperties: false,
        },
      },
    },
  })

  const parsed = parseJsonObject<{ title: string; body: string }>(
    extractOutputText(payload)
  )
  const title = parsed.title?.trim()
  const body = parsed.body?.trim()
  if (!title || !body) {
    throw new Error("The story came back incomplete. Try another pass.")
  }
  return { title, body, model: STORY_MODEL }
}

export async function writeVisionPromptWithLuna(
  name: string,
  answers: Answers,
  category: Category
): Promise<{ title: string; body: string; prompt: string }> {
  const payload = await openaiFetch<ResponsesPayload>("/responses", {
    model: VISION_PROMPT_MODEL,
    reasoning: { effort: "low" },
    input: [
      {
        role: "system",
        content:
          "You write image prompts for Fable vision boards. Output a cinematic, maximalist editorial still — Apple campaign restraint mashed with Nike hero energy. Nature-forward. The person is the hero of the frame. No readable text, logos, watermarks, or UI. No gore. Photoreal, filmic, specific light and wardrobe.",
      },
      {
        role: "user",
        content: `Write the campaign still for this pilot.\n\n${briefForPilot(name, answers, category)}`,
      },
    ],
    text: {
      format: {
        type: "json_schema",
        name: "fable_vision",
        strict: true,
        schema: {
          type: "object",
          properties: {
            title: { type: "string" },
            body: {
              type: "string",
              description: "Two sentences the pilot can read under the poster.",
            },
            prompt: {
              type: "string",
              description: "A detailed image-generation prompt, one block, no quotes wrapping it.",
            },
          },
          required: ["title", "body", "prompt"],
          additionalProperties: false,
        },
      },
    },
  })

  const parsed = parseJsonObject<{ title: string; body: string; prompt: string }>(
    extractOutputText(payload)
  )
  if (!parsed.title?.trim() || !parsed.prompt?.trim()) {
    throw new Error("The poster brief came back incomplete. Try again.")
  }
  return {
    title: parsed.title.trim(),
    body: parsed.body.trim() || `A hero still for ${name}'s ${answers.seasonWord || "season"}.`,
    prompt: parsed.prompt.trim(),
  }
}

type ImageGeneratePayload = {
  data?: Array<{ b64_json?: string; url?: string }>
}

export async function generateVisionImageWithFlare(prompt: string): Promise<{
  bytes: Buffer
  contentType: "image/webp"
  model: string
}> {
  const payload = await openaiFetch<ImageGeneratePayload>("/images/generations", {
    model: VISION_IMAGE_MODEL,
    prompt,
    size: "1536x1024",
    quality: "medium",
    output_format: "webp",
  })

  const b64 = payload.data?.[0]?.b64_json
  if (!b64) {
    throw new Error("Flare printed a blank frame. Try the poster again.")
  }

  return {
    bytes: Buffer.from(b64, "base64"),
    contentType: "image/webp",
    model: VISION_IMAGE_MODEL,
  }
}
