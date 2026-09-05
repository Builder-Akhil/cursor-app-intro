import type { Answers, Category } from "./types"
import { CATEGORY_META, unsplashUrl } from "./types"

export function suggestCategory(answers: Answers): Category {
  const blob = Object.values(answers).join(" ").toLowerCase()
  if (/heal|gentle|rest|soft|peace|care|heart/.test(blob)) return "healer"
  if (/build|create|start|plan|work|grow|make/.test(blob)) return "builder"
  if (/wander|travel|path|explore|free|road|mist/.test(blob)) return "wanderer"
  return "seeker"
}

export function generateStory(
  name: string,
  answers: Answers,
  category: Category
): { title: string; body: string } {
  const cat = CATEGORY_META[category].label
  const title = `${name}'s ${answers.seasonWord || "season"}`

  const openers: Record<Category, string> = {
    seeker: `There is a horizon line inside ${name} that never quite sits still.`,
    builder: `${name} has always known how to stack small days into something that stands.`,
    healer: `Some people mend the world by first listening to their own quiet. ${name} is one of them.`,
    wanderer: `${name} walks like weather — not lost, just willing to be moved.`,
  }

  const body = `${openers[category]}

You said you hope for ${answers.hope || "something kinder than what you have been carrying"}. That hope is not a vague wish; it is a compass. Even when the fog rolls in, it keeps pointing forward.

Right now you feel stuck around ${answers.stuck || "a chapter that will not turn"}. That stuckness does not mean the story failed. It means you are standing at the page where the plot asks for courage. In the cockpit of your own life, this is the moment the instruments tell you to trust the climb.

You want to become ${answers.becoming || "someone who recognizes themselves in the mirror of their choices"}. That person is not waiting in some far future. They are already practicing in the way you answer honestly, the way you still show up.

When you need to breathe, you return to ${answers.naturePlace || "a quiet place under open sky"}. Nature does not rush you. It reminds you that seasons have jobs — and this season’s word is ${answers.seasonWord || "becoming"}.

As a ${cat}, your gift is clear: you do not need the whole map. You need the next true step, taken with soft eyes and a steady hand.

Walk away with this: your life is not a problem to solve. It is a story in progress — and you are both the author and the hero learning how the light works.

— Fable`
  return { title, body }
}

export function generateVisionPrompt(
  name: string,
  answers: Answers,
  category: Category
): { title: string; body: string; prompt: string; imageUrl: string } {
  const meta = CATEGORY_META[category]
  const imageUrl = unsplashUrl(meta.imageId, 1400)

  const prompt = `Cinematic portrait of ${name} as the hero of their own life story, standing in ${answers.naturePlace || "a misty mountain landscape at golden hour"}. Soft pastel blue sky, gentle natural light, hopeful expression. Visual motifs: ${answers.hope || "hope"}, growth after ${answers.stuck || "a hard season"}, becoming ${answers.becoming || "their truest self"}. Season mood: ${answers.seasonWord || "quiet courage"}. Style: photorealistic, serene, nature-forward, vision-board aesthetic, no text, shallow depth of field.`

  const body = `Here is your hero visual for this chapter — a stand-in image while Fable’s real image engine is still on the runway. Use the ChatGPT / image prompt below to generate your own hero portrait anywhere you like.`

  return {
    title: `${name} as hero — ${meta.label}`,
    body,
    prompt,
    imageUrl,
  }
}

export const QUOTES = [
  "You don’t need the whole sky map — just the next clear heading.",
  "Hope is a practice, not a weather report.",
  "The person you’re becoming is already practicing in small choices.",
  "Soft landings still count as arriving.",
  "Your story is allowed to take the scenic route.",
]
