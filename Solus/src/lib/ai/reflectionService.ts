/**
 * Reflection AI Service
 *
 * Provides AI-powered functionality for the Reflection Journal feature.
 * Uses Gemini models to analyze decisions, extract learnings, and provide insights.
 */

import { generateText, generateObject } from "ai";
import { geminiPro } from "./provider";
import { z } from "zod";
import { LearningType, ReflectionOutcome } from "@/db/types/Reflection";
import { DecisionCategory } from "@/db/types/BaseDecision";
import { QuickDecision } from "@/db/types/QuickDecision";
import { DeepDecision } from "@/db/types/DeepDecision";

/**
 * Generate reflection prompts based on a decision
 * Creates contextual questions to help users reflect on a past decision
 */
export async function generateReflectionPrompts(
  decision: QuickDecision | DeepDecision
) {
  try {
    const promptsSchema = z.object({
      prompts: z
        .array(z.string())
        .min(3)
        .max(5)
        .describe(
          "Thoughtful questions that will help the user reflect on their decision"
        ),
    });

    let decisionContext = `Decision title: ${decision.title}
        Category: ${decision.category}
        Description: ${decision.description || "Not provided"}
        `;

    if (decision.type === "quick") {
      decisionContext += "Type: Quick Decision\n";
      if (decision.options && decision.options.length > 0) {
        decisionContext += "Options considered:\n";
        decision.options.forEach((option, index) => {
          decisionContext += `${index + 1}. ${option.text}${
            option.selected ? " (Selected)" : ""
          }\n`;
        });
      }
      if (decision.recommendation) {
        decisionContext += `\nRecommendation: ${decision.recommendation}\n`;
      }
    } else {
      decisionContext += "Type: Deep Decision\n";
      // Add deep decision specific context if needed
    }

    const result = await generateObject({
      model: geminiPro,
      schema: promptsSchema,
      prompt: `Create ${
        decision.type === "quick" ? "3" : "5"
      } thoughtful reflection prompts for a user who has made the following decision:

        ${decisionContext}

        Generate questions that will help them critically evaluate their decision process, outcomes, and learnings.
        The prompts should be conversational, personal, and thought-provoking.
        For quick decisions, focus on immediate outcomes and gut reactions.
        Avoid generic questions - tailor them to this specific decision.
        `,
    });

    return result.object.prompts;
  } catch (error) {
    console.error("Error generating reflection prompts:", error);
    throw new Error("Failed to generate reflection prompts. Please try again.");
  }
}

/**
 * Extract learnings from reflection text
 * Analyzes user's reflection to identify key learnings and insights
 */
export async function extractLearnings(
  reflectionText: string,
  decisionCategory: DecisionCategory
) {
  try {
    const learningsSchema = z.object({
      outcome: z
        .nativeEnum(ReflectionOutcome)
        .describe("The user's satisfaction with the decision outcome"),
      wouldRepeat: z
        .boolean()
        .describe("Whether the user would make the same decision again"),
      learnings: z
        .array(
          z.object({
            type: z
              .nativeEnum(LearningType)
              .describe("The type of learning derived from this reflection"),
            description: z
              .string()
              .describe("A concise description of the learning"),
          })
        )
        .min(1)
        .max(3)
        .describe("Key learnings from the reflection"),
      improvementNotes: z
        .string()
        .optional()
        .describe("Notes on how the user might improve future decisions"),
    });

    const result = await generateObject({
      model: geminiPro,
      schema: learningsSchema,
      prompt: `Analyze this reflection on a ${decisionCategory} decision and extract learnings:

        "${reflectionText}"

        Determine the person's satisfaction level, whether they would repeat the decision, and extract 1-3 key learnings.
        Each learning should be categorized as an insight, preference, pattern, or improvement.
        Also extract any notes about how they might improve similar decisions in the future.
        Be faithful to what's actually in the text - don't invent details that aren't there.`,
    });

    return result;
  } catch (error) {
    console.error("Error extracting learnings:", error);
    throw new Error(
      "Failed to extract learnings from your reflection. Please try again with more details."
    );
  }
}

/**
 * Generate AI insights based on reflection
 * Creates additional perspectives or insights based on the user's reflection
 */
export async function generateAIInsights(
  reflectionText: string,
  decisionTitle: string,
  decisionCategory: DecisionCategory
) {
  try {
    const { text } = await generateText({
      model: geminiPro,
      prompt: `As a decision coach, read this reflection on a ${decisionCategory} decision titled "${decisionTitle}" and provide 2-3 insightful observations that might help the person learn from this experience:

        "${reflectionText}"

        Your insights should be conversational, supportive, and focus on patterns, blind spots, or perspectives they might not have considered.
        Each insight should be 1-2 sentences, written in second person ("you").
        Don't repeat what they already know - add value by bringing new perspectives.`,
    });

    // Split the response into individual insights
    const insights = text
      .split(/\d+\.\s+/) // Split by numbered list items
      .filter(Boolean) // Remove empty strings
      .map((insight) => insight.trim())
      .filter((insight) => insight.length > 0);

    return insights.length > 0 ? insights : [text];
  } catch (error) {
    console.error("Error generating AI insights:", error);
    throw new Error("Failed to generate AI insights. Please try again.");
  }
}

/**
 * Process speech input for reflection
 * Takes voice input and processes it for the reflection flow
 */
export async function processSpeechReflection(
  speechText: string,
  decisionCategory: DecisionCategory,
  decisionTitle: string
) {
  try {
    // Extract structured reflection data from speech
    const reflectionData = await extractLearnings(speechText, decisionCategory);

    // Generate AI insights based on the reflection
    const aiInsights = await generateAIInsights(
      speechText,
      decisionTitle,
      decisionCategory
    );

    return {
      ...reflectionData,
      aiInsights,
    };
  } catch (error) {
    console.error("Error processing speech reflection:", error);
    throw new Error(
      "Failed to process your reflection. Please try again with more details."
    );
  }
}
